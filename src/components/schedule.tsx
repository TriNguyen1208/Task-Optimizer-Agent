'use client';

import { useState } from 'react'
import { ChevronLeft, ChevronRight, X, Calendar as CalendarIcon } from 'lucide-react'
import { Card } from './ui/card'

type ViewType = 'weekly' | 'monthly'

const TASK_COLORS = [
  'bg-blue-600 dark:bg-blue-500',
  'bg-emerald-600 dark:bg-emerald-500',
  'bg-violet-600 dark:bg-violet-500',
  'bg-amber-600 dark:bg-amber-500',
  'bg-rose-600 dark:bg-rose-500',
];

const PREDEFINED_TASKS = [
  'Design System Update',
  'Weekly Team Meeting',
  'Fix API Authentication',
  'Client Feedback Review',
  'Database Optimization',
  'Content Strategy',
];

interface Task {
  id: number; title: string; startTime: string; endTime: string; date: string; color: string;
}

export default function Schedule() {
  const [viewType, setViewType] = useState<ViewType>('weekly')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: 'Design System Update', startTime: '09:00', endTime: '12:00', date: new Date().toISOString().split('T')[0], color: TASK_COLORS[0] },
    { id: 2, title: 'Weekly Team Meeting', startTime: '14:00', endTime: '15:30', date: new Date().toISOString().split('T')[0], color: TASK_COLORS[2] },
  ])

  // Logic chuyển đổi tháng/tuần
  const navigate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (viewType === 'weekly') {
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
  }

  const timeToMinutes = (time: string) => {
    const [h, m] = time.split(':').map(Number)
    return h * 60 + m
  }

  const getHourClass = (h: number) => {
    // const isWorkingHour = h >= 8 && h < 18;
    // return isWorkingHour 
    //   ? 'bg-slate-50/50 dark:bg-slate-900/40' 
    //   : 'bg-slate-100/80 dark:bg-black';

    if (h < 6 || (h >= 12 && h < 18)) return 'bg-white dark:bg-background'
    return 'bg-slate-50 dark:bg-slate-900/30'
  }

  const handleAddTask = (date: string, hour?: number) => {
    const newId = Date.now();
    const newTask: Task = {
      id: newId, 
      title: PREDEFINED_TASKS[0], 
      startTime: hour !== undefined ? `${String(hour).padStart(2, '0')}:00` : "09:00", 
      endTime: hour !== undefined ? `${String(hour + 1).padStart(2, '0')}:00` : "10:00",
      date: date, 
      color: TASK_COLORS[newId % TASK_COLORS.length]
    };
    setTasks([...tasks, newTask]);
  };

  // --- RENDER WEEKLY VIEW ---
  const renderWeeklyView = () => {
    const weekStart = new Date(currentDate); 
    const day = weekStart.getDay(); 
    const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1);
    weekStart.setDate(diff);

    const weekDays = Array.from({ length: 7 }, (_, i) => { 
      const d = new Date(weekStart); d.setDate(d.getDate() + i); return d; 
    });
    const hours = Array.from({ length: 24 }, (_, i) => i);

    return (
      <div className="flex flex-col h-full">
        <div className="flex pl-16 bg-slate-100/50 dark:bg-slate-900/80 border-b border-border sticky top-0 z-30 backdrop-blur-md">
          {weekDays.map(d => (
            <div key={d.toISOString()} className="flex-1 p-3 text-center border-r border-border/50 last:border-r-0">
              <div className="font-bold text-xs text-muted-foreground uppercase tracking-wider">{d.toLocaleDateString('en-US', { weekday: 'short' })}</div>
              <div className="text-lg font-semibold">{d.getDate()}</div>
            </div>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="flex min-h-max relative">
            <div className="w-16 flex-shrink-0 z-10 sticky left-0">
              {hours.map(h => (
                <div key={h} className={`h-20 border-b border-border/40 text-[10px] flex items-center justify-center font-medium text-muted-foreground/60 ${getHourClass(h)}`}>
                  {String(h).padStart(2, '0')}:00
                </div>
              ))}
            </div>
            <div className="flex-1 flex">
              {weekDays.map((d, dayIdx) => {
                const dateStr = d.toISOString().split('T')[0];
                return (
                  <div key={dateStr} className={`flex-1 relative min-w-[100px] ${dayIdx < 6 ? 'border-r border-border/30' : ''}`}>
                    {hours.map(h => (
                      <div key={h} 
                        className={`h-20 border-b border-border/30 w-full transition-all cursor-crosshair hover:bg-blue-500/5 dark:hover:bg-blue-400/10 hover:ring-1 hover:ring-inset hover:ring-blue-400/40 ${getHourClass(h)}`}
                        onClick={() => handleAddTask(dateStr, h)}
                      />
                    ))}
                    {tasks.filter(t => t.date === dateStr).map(t => (
                      <div key={t.id} className={`absolute left-1 right-1 rounded-lg shadow-sm border border-white/10 ${t.color} text-white p-2.5 overflow-hidden group transition-all hover:shadow-md hover:z-20`}
                        style={{ top: `${(timeToMinutes(t.startTime) / 60) * 80 + 2}px`, height: `${((timeToMinutes(t.endTime) - timeToMinutes(t.startTime)) / 60) * 80 - 4}px`, zIndex: 10 }}>
                        <select value={t.title} onChange={(e) => setTasks(prev => prev.map(tk => tk.id === t.id ? { ...tk, title: e.target.value } : tk))}
                          onMouseDown={(e) => e.stopPropagation()} className="bg-transparent font-bold text-xs w-full focus:outline-none cursor-pointer appearance-none mb-1">
                          {PREDEFINED_TASKS.map(name => <option key={name} value={name} className="text-slate-900">{name}</option>)}
                        </select>
                        <div className="text-[10px] opacity-80 font-medium">{t.startTime} - {t.endTime}</div>
                        <button onClick={(e) => { e.stopPropagation(); setTasks(tasks.filter(tk => tk.id !== t.id)); }}
                          className="absolute top-1 right-1 p-1 rounded-full hover:bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"><X size={12}/></button>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // --- RENDER MONTHLY VIEW ---
  const renderMonthlyView = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Tìm ngày bắt đầu (Monday) của hàng đầu tiên
    const startDate = new Date(firstDay);
    const dayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

    const calendarDays = [];
    const tempDate = new Date(startDate);
    for (let i = 0; i < 42; i++) { // 6 tuần
      calendarDays.push(new Date(tempDate));
      tempDate.setDate(tempDate.getDate() + 1);
    }

    const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return (
      <div className="flex flex-col h-full">
        {/* Header Ngày Thứ */}
        <div className="grid grid-cols-7 bg-slate-100/50 dark:bg-slate-900/80 border-b border-border backdrop-blur-md">
          {dayLabels.map(label => (
            <div key={label} className="p-3 text-center text-xs font-bold text-muted-foreground uppercase tracking-widest border-r border-border/50 last:border-r-0">
              {label}
            </div>
          ))}
        </div>
        {/* Grid Tháng */}
        <div className="flex-1 grid grid-cols-7 grid-rows-6">
          {calendarDays.map((date, idx) => {
            const dateStr = date.toISOString().split('T')[0];
            const isCurrentMonth = date.getMonth() === month;
            const dayTasks = tasks.filter(t => t.date === dateStr);

            return (
              <div key={idx} 
                onClick={() => handleAddTask(dateStr)}
                className={`relative border-r border-b border-border/30 p-2 transition-all cursor-pointer hover:ring-1 hover:ring-inset hover:ring-blue-400/40 hover:bg-blue-500/5
                  ${isCurrentMonth ? 'bg-white dark:bg-slate-950' : 'bg-slate-50/50 dark:bg-black opacity-40'}`}>
                
                <span className={`text-sm font-bold ${isCurrentMonth ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {date.getDate()}
                </span>

                <div className="mt-1 space-y-1 overflow-y-auto max-h-[80px] scrollbar-hide">
                  {dayTasks.map(t => (
                    <div key={t.id} className={`text-[10px] px-1.5 py-0.5 rounded shadow-sm text-white truncate font-medium ${t.color}`}>
                      {t.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-slate-50 dark:bg-[#0a0a0a] h-screen flex flex-col overflow-hidden text-slate-900 dark:text-slate-100">
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <h1 className="text-3xl font-bold tracking-tight">Schedule</h1>
        
        <div className="flex items-center gap-3">
           <div className="bg-slate-200/50 dark:bg-slate-800/50 p-1 rounded-lg flex gap-1">
             <button onClick={() => setViewType('weekly')} className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${viewType === 'weekly' ? 'bg-white dark:bg-slate-700 shadow-sm text-black dark:text-white' : 'text-slate-500 hover:text-slate-700'}`}>WEEKLY</button>
             <button onClick={() => setViewType('monthly')} className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${viewType === 'monthly' ? 'bg-white dark:bg-slate-700 shadow-sm text-black dark:text-white' : 'text-slate-500 hover:text-slate-700'}`}>MONTHLY</button>
           </div>
           
           <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-border/50 rounded-lg px-3 py-1.5 shadow-sm">
             <button onClick={() => navigate('prev')} className="hover:text-primary"><ChevronLeft size={16}/></button>
             <span className="font-semibold text-xs min-w-[100px] text-center uppercase tracking-wider">
               {currentDate.toLocaleString('default', { month: 'short', year: 'numeric' })}
             </span>
             <button onClick={() => navigate('next')} className="hover:text-primary"><ChevronRight size={16}/></button>
           </div>

           <button onClick={() => setCurrentDate(new Date())} className="p-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-black rounded-lg hover:opacity-80 transition-all">
             <CalendarIcon size={18} />
           </button>
        </div>
      </div>

      <Card className="flex-1 overflow-hidden border border-border/50 shadow-2xl flex flex-col rounded-2xl bg-white dark:bg-slate-950">
        {viewType === 'weekly' ? renderWeeklyView() : renderMonthlyView()}
      </Card>
    </div>
  )
}