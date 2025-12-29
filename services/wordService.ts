
import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  HeadingLevel, 
  Table, 
  TableRow, 
  TableCell,
  WidthType,
  AlignmentType
} from 'https://cdn.skypack.dev/docx';
import { PageData, DocBlock } from "../types";

export async function createWordDoc(allPages: PageData[]): Promise<Blob> {
  const children: any[] = [];

  allPages.forEach(page => {
    page.blocks.forEach(block => {
      switch (block.type) {
        case 'heading':
          const headingLevel = block.level === 1 ? HeadingLevel.HEADING_1 : (block.level === 2 ? HeadingLevel.HEADING_2 : HeadingLevel.HEADING_3);
          children.push(new Paragraph({
            text: block.content as string,
            heading: headingLevel,
            spacing: { before: 400, after: 200 }
          }));
          break;

        case 'paragraph':
          children.push(new Paragraph({
            children: [new TextRun(block.content as string)],
            spacing: { after: 200 }
          }));
          break;

        case 'list':
          // Simplified list handling: split by newlines
          const items = (block.content as string).split('\n');
          items.forEach(item => {
            const cleanItem = item.replace(/^[-*•]\s+/, '');
            if (cleanItem.trim()) {
              children.push(new Paragraph({
                text: cleanItem,
                bullet: { level: 0 },
                spacing: { after: 120 }
              }));
            }
          });
          break;

        case 'table':
          // Gemini returns MD tables, we'd need a complex parser to make real docx tables.
          // For now, we'll insert them as structured text or a placeholder.
          // Improved: Simple markdown table row splitter
          const rows = (block.content as string).split('\n').filter(r => r.includes('|') && !r.includes('---'));
          if (rows.length > 0) {
            const tableRows = rows.map(row => {
              const cells = row.split('|').filter(c => c.trim() !== '' || row.indexOf('|') === 0).map(c => c.trim());
              return new TableRow({
                children: cells.map(cell => new TableCell({
                  children: [new Paragraph(cell)],
                  width: { size: 100 / cells.length, type: WidthType.PERCENTAGE }
                }))
              });
            });
            children.push(new Table({
              rows: tableRows,
              width: { size: 100, type: WidthType.PERCENTAGE }
            }));
            children.push(new Paragraph({ text: "", spacing: { after: 200 } }));
          }
          break;
      }
    });
  });

  const doc = new Document({
    sections: [{
      properties: {},
      children: children
    }]
  });

  return await Packer.toBlob(doc);
}
