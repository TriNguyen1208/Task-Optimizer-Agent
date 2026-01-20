'use client';

import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight, X, Calendar as CalendarIcon, GripHorizontal } from 'lucide-react'
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

interface DragState {
  taskId: number;
  type: 'move' | 'resize-top' | 'resize-bottom';
  initialMouseY: number;
  initialMouseX: number;
  initialTop: number;
  initialHeight: number;
  initialDate: string;
}

export default function Schedule() {
  const [viewType, setViewType] = useState<ViewType>('weekly')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: 'Design System Update', startTime: '09:00', endTime: '12:00', date: new Date().toISOString().split('T')[0], color: TASK_COLORS[0] },
    { id: 2, title: 'Weekly Team Meeting', startTime: '14:00', endTime: '15:30', date: new Date().toISOString().split('T')[0], color: TASK_COLORS[2] },
  ])

  const [dragState, setDragState] = useState<DragState | null>(null);

  const timeToMinutes = (time: string) => {
    const [h, m] = time.split(':').map(Number)
    return h * 60 + m
  }

  const minutesToTime = (totalMinutes: number) => {
    const mins = Math.max(0, Math.min(24 * 60 - 15, totalMinutes));
    const h = Math.floor(mins / 60);
    const m = Math.floor((mins % 60) / 15) * 15;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }

  const getHourClass = (h: number) => {
    if (h < 6 || (h >= 12 && h < 18)) return 'bg-white dark:bg-background'
    return 'bg-slate-50 dark:bg-slate-900/30'
  }

  const navigate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (viewType === 'weekly') {
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
  }

  const handleAddTask = (date: string, hour?: number) => {
    if (dragState) return;
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

  // --- LOGIC KÉO THẢ & RESIZE ---
  const onMouseDown = (e: React.MouseEvent, taskId: number, type: 'move' | 'resize-top' | 'resize-bottom') => {
    e.stopPropagation(); // Ngăn chặn sự kiện lan ra cha hoặc con khác
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    setDragState({
      taskId, type,
      initialMouseY: e.clientY,
      initialMouseX: e.clientX,
      initialTop: (timeToMinutes(task.startTime) / 60) * 80,
      initialHeight: ((timeToMinutes(task.endTime) - timeToMinutes(task.startTime)) / 60) * 80,
      initialDate: task.date
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragState) return;
      const deltaY = e.clientY - dragState.initialMouseY;
      const deltaX = e.clientX - dragState.initialMouseX;
      const hourPixels = 80;

      setTasks(prev => prev.map(task => {
        if (task.id !== dragState.taskId) return task;
        let newStartTime = task.startTime;
        let newEndTime = task.endTime;
        let newDate = task.date;

        if (dragState.type === 'move') {
          const newTop = dragState.initialTop + deltaY;
          newStartTime = minutesToTime((newTop / hourPixels) * 60);
          const duration = timeToMinutes(task.endTime) - timeToMinutes(task.startTime);
          newEndTime = minutesToTime(timeToMinutes(newStartTime) + duration);

          if (viewType === 'weekly') {
            const dayDelta = Math.round(deltaX / 150);
            if (dayDelta !== 0) {
              const d = new Date(dragState.initialDate);
              d.setDate(d.getDate() + dayDelta);
              newDate = d.toISOString().split('T')[0];
            }
          }
        } else if (dragState.type === 'resize-bottom') {
          const newHeight = Math.max(20, dragState.initialHeight + deltaY);
          newEndTime = minutesToTime(timeToMinutes(task.startTime) + (newHeight / hourPixels) * 60);
        } else if (dragState.type === 'resize-top') {
          const newTop = dragState.initialTop + deltaY;
          const newStartMins = Math.min(timeToMinutes(task.endTime) - 15, (newTop / hourPixels) * 60);
          newStartTime = minutesToTime(newStartMins);
        }
        return { ...task, startTime: newStartTime, endTime: newEndTime, date: newDate };
      }));
    };
    const handleMouseUp = () => setDragState(null);
    if (dragState) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragState, viewType]);

  // --- WEEKLY VIEW ---
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
                      <div 
                        key={t.id} 
                        onMouseDown={(e) => onMouseDown(e, t.id, 'move')}
                        className={`absolute left-1 right-1 rounded-lg shadow-sm border border-white/10 ${t.color} text-white p-2.5 overflow-visible group transition-shadow hover:shadow-md cursor-move`}
                        style={{ 
                          top: `${(timeToMinutes(t.startTime) / 60) * 80 + 2}px`, 
                          height: `${((timeToMinutes(t.endTime) - timeToMinutes(t.startTime)) / 60) * 80 - 4}px`, 
                          zIndex: dragState?.taskId === t.id ? 50 : 10,
                          opacity: dragState?.taskId === t.id ? 0.8 : 1
                        }}
                      >
                        {/* Z-INDEX HIERARCHY QUAN TRỌNG:
                            z-50: Nút xóa (Cao nhất, luôn click được)
                            z-40: Resize handles (Cao hơn content để click được)
                            z-30: Content (Chữ, giờ)
                        */}

                        {/* --- RESIZE TOP --- */}
                        <div 
                            className="absolute -top-1 left-0 right-0 h-4 cursor-ns-resize z-40 hover:bg-white/10 rounded-t-lg transition-colors" 
                            onMouseDown={(e) => onMouseDown(e, t.id, 'resize-top')} 
                        />

                        {/* --- CONTENT --- */}
                        <div className="relative z-30 mr-8 pointer-events-none"> 
                            {/* pointer-events-none cho div bao ngoài để click xuyên qua nếu cần, 
                                nhưng enable lại pointer-events-auto cho select */}
                            <div className="flex items-center gap-1 mb-0.5 opacity-70">
                                <GripHorizontal size={10} />
                                <span className="text-[9px] font-bold uppercase tracking-tighter">Task</span>
                            </div>
                            <select 
                                value={t.title} 
                                onChange={(e) => setTasks(prev => prev.map(tk => tk.id === t.id ? { ...tk, title: e.target.value } : tk))}
                                onMouseDown={(e) => e.stopPropagation()} 
                                className="pointer-events-auto bg-transparent font-bold text-xs w-full focus:outline-none cursor-pointer appearance-none uppercase truncate"
                            >
                                {PREDEFINED_TASKS.map(name => <option key={name} value={name} className="text-slate-900">{name}</option>)}
                            </select>
                            <div className="text-[10px] opacity-80 font-medium">{t.startTime} - {t.endTime}</div>
                        </div>
                        
                        {/* --- DELETE BUTTON --- */}
                        <button 
                          onMouseDown={(e) => e.stopPropagation()} 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            setTasks(tasks.filter(tk => tk.id !== t.id)); 
                          }}
                          className="absolute top-1 right-1 h-6 w-6 flex items-center justify-center rounded-full bg-black/20 text-white hover:bg-red-500 hover:text-white hover:scale-110 transition-all opacity-0 group-hover:opacity-100 z-50 cursor-pointer"
                          title="Delete task"
                        >
                          <X size={14} strokeWidth={3} />
                        </button>

                        {/* --- RESIZE BOTTOM --- */}
                        <div 
                            className="absolute -bottom-1 left-0 right-0 h-4 cursor-ns-resize z-40 hover:bg-white/10 rounded-b-lg transition-colors" 
                            onMouseDown={(e) => onMouseDown(e, t.id, 'resize-bottom')} 
                        />
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

  // --- MONTHLY VIEW ---
  const renderMonthlyView = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    const dayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

    const calendarDays = [];
    const tempDate = new Date(startDate);
    for (let i = 0; i < 42; i++) {
      calendarDays.push(new Date(tempDate));
      tempDate.setDate(tempDate.getDate() + 1);
    }
    const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return (
      <div className="flex flex-col h-full">
        <div className="grid grid-cols-7 bg-slate-100/50 dark:bg-slate-900/80 border-b border-border">
          {dayLabels.map(label => (
            <div key={label} className="p-3 text-center text-xs font-bold text-muted-foreground uppercase tracking-widest border-r border-border/50 last:border-r-0">{label}</div>
          ))}
        </div>
        <div className="flex-1 grid grid-cols-7 grid-rows-6">
          {calendarDays.map((date, idx) => {
            const dateStr = date.toISOString().split('T')[0];
            const isCurrentMonth = date.getMonth() === month;
            const dayTasks = tasks.filter(t => t.date === dateStr);
            return (
              <div key={idx} onClick={() => handleAddTask(dateStr)}
                className={`relative border-r border-b border-border/30 p-2 transition-all cursor-pointer hover:bg-blue-500/5 ${isCurrentMonth ? 'bg-white dark:bg-slate-950' : 'bg-slate-50/50 dark:bg-black opacity-40'}`}>
                <span className={`text-sm font-bold ${isCurrentMonth ? 'text-foreground' : 'text-muted-foreground'}`}>{date.getDate()}</span>
                <div className="mt-1 space-y-1">
                  {dayTasks.map(t => (
                    <div key={t.id} className={`group relative text-[10px] pl-1.5 pr-6 py-0.5 rounded shadow-sm text-white truncate font-medium ${t.color}`}>
                      {t.title}
                      <button 
                         onMouseDown={(e) => e.stopPropagation()}
                         onClick={(e) => { e.stopPropagation(); setTasks(tasks.filter(tk => tk.id !== t.id)); }}
                         className="absolute right-0 top-0 bottom-0 w-5 flex items-center justify-center bg-black/20 hover:bg-red-500 opacity-0 group-hover:opacity-100 transition-all">
                        <X size={10} strokeWidth={3} />
                      </button>
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
             <span className="font-semibold text-xs min-w-[100px] text-center uppercase tracking-wider">{currentDate.toLocaleString('default', { month: 'short', year: 'numeric' })}</span>
             <button onClick={() => navigate('next')} className="hover:text-primary"><ChevronRight size={16}/></button>
           </div>
           <button onClick={() => setCurrentDate(new Date())} className="p-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-black rounded-lg hover:opacity-80 transition-all"><CalendarIcon size={18} /></button>
        </div>
      </div>
      <Card className="flex-1 overflow-hidden border border-border/50 shadow-2xl flex flex-col rounded-2xl bg-white dark:bg-slate-950">
        {viewType === 'weekly' ? renderWeeklyView() : renderMonthlyView()}
      </Card>
    </div>
  )
}