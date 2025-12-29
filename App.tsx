
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { AppTab, PPCTEntry, ScheduleRow, EquipmentRow, EquipmentConfigEntry, DAYS_OF_WEEK, TimetableEntry, TeacherAssignment, SchoolTimetableEntry } from './types';
import PPCTManager from './components/PPCTManager';
import ScheduleEditor from './components/ScheduleEditor';
import EquipmentEditor from './components/EquipmentEditor';
import EquipmentManager from './components/EquipmentManager';
import TimetableManager from './components/TimetableManager';
import SchoolTimetableManager from './components/SchoolTimetableManager';
import SettingsManager from './components/SettingsManager';
import { Layout, CalendarDays, FileText, Microscope, Settings2, CalendarCheck, School, Settings, Lock, User, Key, LogOut, ShieldCheck } from 'lucide-react';

const STORAGE_KEYS = {
  AUTH_STATE: 'TS_AUTH_STATE_V2',
  ACTIVE_TAB: 'TS_ACTIVE_TAB_V2',
  PPCT: 'TS_PPCT_DATA_V2',
  SCHEDULE: 'TS_SCHEDULE_DATA_V2',
  EQUIPMENT: 'TS_EQUIPMENT_DATA_V2',
  EQUIPMENT_CONFIG: 'TS_EQUIPMENT_CONFIG_V2',
  SUBJECTS: 'TS_SUBJECTS_V2',
  CLASSES: 'TS_CLASSES_V2',
  CURRENT_WEEK: 'TS_CURRENT_WEEK_V2',
  WEEK_START_DATE: 'TS_WEEK_START_DATE_V2',
  TEACHER_NAME: 'TS_TEACHER_NAME_V2',
  TIMETABLE_DATA: 'TS_TIMETABLE_DATA_V2',
  TIMETABLE_FILE: 'TS_TIMETABLE_FILE_V2',
  ASSIGNMENTS: 'TS_SCHOOL_ASSIGNMENTS_V2',
  SCHOOL_TKB: 'TS_SCHOOL_TKB_RESULT_V2'
};

const formatSubjectName = (subject: string, className: string) => {
  if (!subject) return '';
  const gradeMatch = className.match(/\d+/);
  const grade = gradeMatch ? gradeMatch[0] : '';
  if (!grade) return subject;
  if (subject.includes(grade)) return subject;
  const baseSubjects = ['Chào Cờ', 'SHL', 'HĐTN', 'Trải nghiệm'];
  if (baseSubjects.some(b => subject.toLowerCase().includes(b.toLowerCase()))) {
    return subject;
  }
  return `${subject} ${grade}`.trim();
};

const App: React.FC = () => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.AUTH_STATE) === 'true';
  });

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState<AppTab>(() => {
    return (localStorage.getItem(STORAGE_KEYS.ACTIVE_TAB) as AppTab) || AppTab.SCHOOL_TIMETABLE;
  });

  const [ppctData, setPpctData] = useState<PPCTEntry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PPCT);
    return saved ? JSON.parse(saved) : [];
  });

  const [scheduleData, setScheduleData] = useState<ScheduleRow[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SCHEDULE);
    return saved ? JSON.parse(saved) : [];
  });

  const [equipmentData, setEquipmentData] = useState<EquipmentRow[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EQUIPMENT);
    return saved ? JSON.parse(saved) : [];
  });

  const [equipmentConfigData, setEquipmentConfigData] = useState<EquipmentConfigEntry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EQUIPMENT_CONFIG);
    return saved ? JSON.parse(saved) : [];
  });

  const [timetableData, setTimetableData] = useState<TimetableEntry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TIMETABLE_DATA);
    return saved ? JSON.parse(saved) : [];
  });
  
  const [timetableFileName, setTimetableFileName] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.TIMETABLE_FILE) || '';
  });

  const [teacherName, setTeacherName] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.TEACHER_NAME) || '';
  });

  const [subjects, setSubjects] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
    return saved ? JSON.parse(saved) : ['Toán', 'Ngữ Văn', 'Tiếng Anh', 'KHTN', 'Lịch Sử & ĐL', 'GDCD', 'Tin Học', 'Công Nghệ', 'Thể Dục', 'Chào Cờ', 'SHL'];
  });

  const [classes, setClasses] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CLASSES);
    return saved ? JSON.parse(saved) : ['6A1', '6A2', '7A1', '7A2', '8A1', '8A2', '9A1', '9A2'];
  });

  const [currentWeek, setCurrentWeek] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_WEEK);
    return saved ? parseInt(saved, 10) : 1;
  });

  const [weekStartDate, setWeekStartDate] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WEEK_START_DATE);
    return saved ? saved : new Date().toISOString().split('T')[0];
  });

  const [assignments, setAssignments] = useState<TeacherAssignment[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS);
    return saved ? JSON.parse(saved) : [];
  });

  const [schoolTkbResult, setSchoolTkbResult] = useState<SchoolTimetableEntry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SCHOOL_TKB);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem(STORAGE_KEYS.AUTH_STATE, 'true');
      localStorage.setItem(STORAGE_KEYS.ACTIVE_TAB, activeTab);
      localStorage.setItem(STORAGE_KEYS.PPCT, JSON.stringify(ppctData));
      localStorage.setItem(STORAGE_KEYS.SCHEDULE, JSON.stringify(scheduleData));
      localStorage.setItem(STORAGE_KEYS.EQUIPMENT, JSON.stringify(equipmentData));
      localStorage.setItem(STORAGE_KEYS.EQUIPMENT_CONFIG, JSON.stringify(equipmentConfigData));
      localStorage.setItem(STORAGE_KEYS.TEACHER_NAME, teacherName);
      localStorage.setItem(STORAGE_KEYS.TIMETABLE_DATA, JSON.stringify(timetableData));
      localStorage.setItem(STORAGE_KEYS.TIMETABLE_FILE, timetableFileName);
      localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
      localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(classes));
      localStorage.setItem(STORAGE_KEYS.CURRENT_WEEK, currentWeek.toString());
      localStorage.setItem(STORAGE_KEYS.WEEK_START_DATE, weekStartDate);
      localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(assignments));
      localStorage.setItem(STORAGE_KEYS.SCHOOL_TKB, JSON.stringify(schoolTkbResult));
    }
  }, [isAuthenticated, activeTab, ppctData, scheduleData, equipmentData, equipmentConfigData, teacherName, timetableData, subjects, classes, currentWeek, weekStartDate, assignments, schoolTkbResult]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'ankhang' && password === '13579') {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Tên đăng nhập hoặc mật khẩu không chính xác.');
    }
  };

  const handleLogout = () => {
    if (confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      setIsAuthenticated(false);
      localStorage.removeItem(STORAGE_KEYS.AUTH_STATE);
    }
  };

  const findPPCTEntry = useCallback((subject: string, lessonNumber: string) => {
    return ppctData.find(p => {
      const pSub = p.subject?.toLowerCase() || '';
      const rowSub = subject.toLowerCase();
      return (pSub === rowSub || rowSub.startsWith(pSub)) && String(p.lessonNumber) === String(lessonNumber);
    });
  }, [ppctData]);

  const findEquipmentConfig = useCallback((subject: string, lessonNumber: string) => {
    return equipmentConfigData.find(c => {
      const cSub = c.subject?.toLowerCase() || '';
      const rowSub = subject.toLowerCase();
      return (cSub === rowSub || rowSub.startsWith(cSub)) && String(c.lessonNumber) === String(lessonNumber);
    });
  }, [equipmentConfigData]);

  const teacherSubjects = useMemo(() => {
    if (!teacherName) return [];
    const subjectsInTimetable = timetableData
      .filter(t => (t.teacherName || '').toLowerCase() === teacherName.toLowerCase())
      .map(t => formatSubjectName(t.subject, t.className));
    return Array.from(new Set(subjectsInTimetable)).sort();
  }, [timetableData, teacherName]);

  const handleScheduleUpdate = useCallback((newTeacherSchedule: ScheduleRow[]) => {
    setScheduleData(prev => {
      const others = prev.filter(s => s.teacherName !== teacherName || s.week !== currentWeek);
      return [...others, ...newTeacherSchedule];
    });
  }, [teacherName, currentWeek]);

  const handleEquipmentUpdate = useCallback((newTeacherEquipment: EquipmentRow[]) => {
    setEquipmentData(prev => {
      const others = prev.filter(e => e.teacherName !== teacherName || e.week !== currentWeek);
      return [...others, ...newTeacherEquipment];
    });
  }, [teacherName, currentWeek]);

  const handleApplyTimetable = useCallback((entries: TimetableEntry[], targetTeacher?: string) => {
    const tName = targetTeacher || teacherName;
    if (!tName) return;

    const sortedEntries = [...entries].sort((a, b) => {
      const dayA = DAYS_OF_WEEK.findIndex(d => a.dayOfWeek.includes(d));
      const dayB = DAYS_OF_WEEK.findIndex(d => b.dayOfWeek.includes(d));
      if (dayA !== dayB) return dayA - dayB;
      return a.period - b.period;
    });

    if (tName) setTeacherName(tName);

    const startWeek = 1;
    const endWeek = 35; 
    
    const currentViewDate = new Date(weekStartDate);
    const week1Monday = new Date(currentViewDate.getTime() - (currentWeek - 1) * 7 * 86400000);

    let allWeeksSchedule: ScheduleRow[] = [];
    let allWeeksEquipment: EquipmentRow[] = [];
    const counters: Record<string, number> = {}; 

    for (let w = startWeek; w <= endWeek; w++) {
        const thisWeekMonday = new Date(week1Monday.getTime() + (w - 1) * 7 * 86400000).toISOString().split('T')[0];

        const weekSchedule = sortedEntries.map(entry => {
             const dayIndex = DAYS_OF_WEEK.findIndex(d => entry.dayOfWeek.includes(d));
             const key = `${entry.subject.toLowerCase()}_${entry.className.toLowerCase()}`;
             const nextPPCT = (counters[key] || 0) + 1;
             counters[key] = nextPPCT;
             const lesson = findPPCTEntry(entry.subject, String(nextPPCT));
             const displaySubject = formatSubjectName(entry.subject, entry.className);

             return {
                id: crypto.randomUUID(), 
                week: w, 
                dayOfWeek: DAYS_OF_WEEK[dayIndex] || entry.dayOfWeek,
                date: new Date(new Date(thisWeekMonday).getTime() + (dayIndex >= 0 ? dayIndex : 0) * 86400000).toISOString().split('T')[0],
                period: entry.period, 
                subject: displaySubject, 
                className: entry.className,
                ppctNumber: nextPPCT.toString(), 
                lessonName: lesson?.lessonName || '', 
                notes: '', 
                teacherName: tName
             };
        });

        const weekEquipment = weekSchedule.map(row => {
            const config = findEquipmentConfig(row.subject, row.ppctNumber);
            return {
                id: crypto.randomUUID(), 
                week: w, 
                dayOfWeek: row.dayOfWeek, 
                date: row.date,
                period: row.period, 
                subject: row.subject, 
                className: row.className,
                ppctNumber: row.ppctNumber,
                equipmentName: config?.equipmentName || '',
                quantity: config?.quantity || (config?.equipmentName ? '1' : ''),
                teacherName: tName
            };
        });

        allWeeksSchedule = [...allWeeksSchedule, ...weekSchedule];
        allWeeksEquipment = [...allWeeksEquipment, ...weekEquipment];
    }

    setScheduleData(prev => {
       const others = prev.filter(s => s.teacherName !== tName);
       return [...others, ...allWeeksSchedule];
    });

    setEquipmentData(prev => {
       const others = prev.filter(e => e.teacherName !== tName);
       return [...others, ...allWeeksEquipment];
    });

    alert(`Đã tự động cập nhật lịch dạy cho tất cả các tuần (1-35) của giáo viên ${tName}. Tên môn đã tự động bổ sung khối lớp.`);
  }, [teacherName, weekStartDate, currentWeek, findPPCTEntry, findEquipmentConfig]);

  const handleTeacherSelect = useCallback((name: string) => {
    setTeacherName(name);
    const existingSchedule = scheduleData.filter(s => s.teacherName === name);
    if (existingSchedule.length === 0) {
      const teacherEntries = timetableData.filter(t => (t.teacherName || '').toLowerCase() === name.toLowerCase());
      if (teacherEntries.length > 0) {
        handleApplyTimetable(teacherEntries, name);
      }
    }
  }, [scheduleData, timetableData, handleApplyTimetable]);

  const handleWeekChange = useCallback((newWeek: number) => {
    const diff = newWeek - currentWeek;
    if (diff !== 0) {
      const oldDate = new Date(weekStartDate);
      const newDate = new Date(oldDate.getTime() + diff * 7 * 86400000);
      setWeekStartDate(newDate.toISOString().split('T')[0]);
    }
    setCurrentWeek(newWeek);
  }, [currentWeek, weekStartDate]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50 p-4 font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-orange-100 overflow-hidden">
          <div className="bg-indigo-600 p-10 text-center relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
             <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>
             
             <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-lg mb-6 relative z-10 animate-bounce-slow">
                <School className="w-10 h-10 text-indigo-600" />
             </div>
             <h1 className="text-3xl font-black text-white relative z-10">Hệ Thống <span className="text-indigo-200">AI</span></h1>
             <p className="text-indigo-100 mt-2 text-sm font-medium relative z-10 opacity-80 uppercase tracking-widest">Teacher Management Portal</p>
          </div>
          
          <form onSubmit={handleLogin} className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Tên đăng nhập</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold transition-all text-slate-700"
                  placeholder="Nhập tên đăng nhập..."
                  required
                />
                <User className="absolute left-4 top-3.5 w-5 h-5 text-indigo-400" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Mật khẩu</label>
              <div className="relative">
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold transition-all text-slate-700"
                  placeholder="Nhập mật khẩu..."
                  required
                />
                <Key className="absolute left-4 top-3.5 w-5 h-5 text-indigo-400" />
              </div>
            </div>

            {loginError && (
              <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs font-bold flex items-center gap-2 animate-shake">
                <ShieldCheck className="w-4 h-4 shrink-0" /> {loginError}
              </div>
            )}

            <button 
              type="submit" 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-100 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Lock className="w-5 h-5" /> ĐĂNG NHẬP NGAY
            </button>

            <div className="text-center pt-4">
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Thiết kế bởi TeacherScheduler Team &copy; 2025</p>
            </div>
          </form>
        </div>
        <style>{`
          @keyframes bounce-slow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-4px); }
            75% { transform: translateX(4px); }
          }
          .animate-shake { animation: shake 0.2s ease-in-out; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <header className="bg-white border-b border-indigo-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-xl"><School className="w-5 h-5 text-white" /></div>
            <h1 className="text-xl font-black text-indigo-900 tracking-tight">TeacherScheduler <span className="text-indigo-500">AI</span></h1>
          </div>
          <nav className="flex gap-1 bg-slate-100 p-1 rounded-xl overflow-x-auto max-w-full">
            <NavTab active={activeTab === AppTab.SCHOOL_TIMETABLE} onClick={() => setActiveTab(AppTab.SCHOOL_TIMETABLE)} icon={<School className="w-4 h-4" />} label="TKB Trường" />
            <NavTab active={activeTab === AppTab.TIMETABLE} onClick={() => setActiveTab(AppTab.TIMETABLE)} icon={<CalendarCheck className="w-4 h-4" />} label="TKB Cá nhân" />
            <NavTab active={activeTab === AppTab.SCHEDULE} onClick={() => setActiveTab(AppTab.SCHEDULE)} icon={<CalendarDays className="w-4 h-4" />} label="Báo giảng" />
            <NavTab active={activeTab === AppTab.EQUIPMENT} onClick={() => setActiveTab(AppTab.EQUIPMENT)} icon={<Microscope className="w-4 h-4" />} label="Phiếu Thiết bị" />
            <NavTab active={activeTab === AppTab.PPCT} onClick={() => setActiveTab(AppTab.PPCT)} icon={<FileText className="w-4 h-4" />} label="DS Bài dạy" />
            <NavTab active={activeTab === AppTab.DEVICE_LIST} onClick={() => setActiveTab(AppTab.DEVICE_LIST)} icon={<Settings2 className="w-4 h-4" />} label="DS Thiết bị" />
            <NavTab active={activeTab === AppTab.SETTINGS} onClick={() => setActiveTab(AppTab.SETTINGS)} icon={<Settings className="w-4 h-4" />} label="Cấu hình" />
          </nav>
          
          <button 
            onClick={handleLogout}
            className="ml-4 p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
            title="Đăng xuất"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 overflow-hidden flex flex-col">
        {activeTab === AppTab.SCHOOL_TIMETABLE && <SchoolTimetableManager assignments={assignments} onUpdateAssignments={setAssignments} tkbResult={schoolTkbResult} onGenerateTkb={setSchoolTkbResult} classes={classes} subjects={subjects} onUpdateClasses={setClasses} onUpdateSubjects={setSubjects} />}
        {activeTab === AppTab.TIMETABLE && <TimetableManager onApply={(entries) => { handleApplyTimetable(entries); setActiveTab(AppTab.SCHEDULE); }} savedData={timetableData} savedFileName={timetableFileName} onUpdateData={setTimetableData} onUpdateFileName={setTimetableFileName} teacherName={teacherName} onUpdateTeacherName={handleTeacherSelect} schoolTkbData={schoolTkbResult} />}
        {activeTab === AppTab.PPCT && <PPCTManager data={ppctData} onUpdate={setPpctData} availableSubjects={teacherSubjects} />}
        {activeTab === AppTab.DEVICE_LIST && <EquipmentManager data={equipmentConfigData} onUpdate={setEquipmentConfigData} availableSubjects={teacherSubjects} />}
        {activeTab === AppTab.SCHEDULE && <ScheduleEditor schedule={scheduleData.filter(s => s.teacherName === teacherName && s.week === currentWeek)} ppct={ppctData} onUpdateSchedule={handleScheduleUpdate} availableSubjects={subjects} onUpdateSubjects={setSubjects} availableClasses={classes} onUpdateClasses={setClasses} currentWeek={currentWeek} onWeekChange={handleWeekChange} weekStartDate={weekStartDate} onDateChange={setWeekStartDate} teacherName={teacherName} onTeacherNameChange={setTeacherName} referenceTimetable={timetableData} onApplyReference={(entries) => handleApplyTimetable(entries)} />}
        {activeTab === AppTab.EQUIPMENT && <EquipmentEditor data={equipmentData.filter(e => e.teacherName === teacherName && e.week === currentWeek)} equipmentConfig={equipmentConfigData} onUpdate={handleEquipmentUpdate} availableSubjects={subjects} onUpdateSubjects={setSubjects} availableClasses={classes} onUpdateClasses={setClasses} currentWeek={currentWeek} onWeekChange={handleWeekChange} weekStartDate={weekStartDate} onDateChange={setWeekStartDate} teacherName={teacherName} onTeacherNameChange={setTeacherName} />}
        {activeTab === AppTab.SETTINGS && <SettingsManager subjects={subjects} onUpdateSubjects={setSubjects} classes={classes} onUpdateClasses={setClasses} />}
      </main>

      <footer className="bg-white border-t border-slate-200 py-3 text-center text-xs text-slate-400">
        TeacherScheduler AI &copy; 2025. Hỗ trợ 5512 và quản lý hồ sơ chuyên môn tự động.
      </footer>
    </div>
  );
};

const NavTab = ({ active, onClick, icon, label }: any) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${active ? 'bg-white text-indigo-600 shadow-sm border border-indigo-100' : 'text-slate-500 hover:text-indigo-500'}`}>
    {icon} <span>{label}</span>
  </button>
);

export default App;
