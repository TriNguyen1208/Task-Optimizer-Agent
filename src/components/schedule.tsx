'use client';

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Card } from './ui/card'

type ViewType = 'weekly' | 'monthly'

interface ScheduleTask {
  id: number
  name: string
  startTime: string
  endTime: string
  date: string
  color: string
}

export default function Schedule() {
  const [viewType, setViewType] = useState<ViewType>('weekly')
  const [currentDate, setCurrentDate] = useState(new Date(2024, 1, 15))

  const scheduleTasks: ScheduleTask[] = [
    { id: 1, name: 'Design System', startTime: '09:00', endTime: '12:00', date: '2024-02-15', color: 'bg-blue-500' },
    { id: 2, name: 'API Integration', startTime: '14:00', endTime: '17:00', date: '2024-02-15', color: 'bg-purple-500' },
    { id: 3, name: 'Testing Phase', startTime: '10:00', endTime: '12:30', date: '2024-02-16', color: 'bg-green-500' },
    { id: 4, name: 'Code Review', startTime: '15:00', endTime: '16:00', date: '2024-02-17', color: 'bg-orange-500' },
    { id: 5, name: 'Team Meeting', startTime: '11:00', endTime: '12:00', date: '2024-02-20', color: 'bg-red-500' },
    { id: 6, name: 'Documentation', startTime: '09:00', endTime: '11:00', date: '2024-02-22', color: 'bg-indigo-500' },
  ]

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const getWeekStart = (date: Date) => {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day
    return new Date(d.setDate(diff))
  }

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0]
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const getTasksForDate = (date: string) => {
    return scheduleTasks.filter(task => task.date === date)
  }

  // Monthly View
  const renderMonthlyView = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []

    for (let i = 0; i < firstDay; i++) {
      days.push(null)
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i))
    }

    return (
      <div className="bg-card overflow-hidden border border-border">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 bg-secondary">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-4 text-center font-semibold text-foreground border-r border-border last:border-r-0">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-px bg-border p-px">
          {days.map((day, idx) => {
            const dateStr = day ? formatDate(day) : ''
            const tasksForDay = day ? getTasksForDate(dateStr) : []
            const isCurrentMonth = day && day.getMonth() === currentDate.getMonth()

            return (
              <div
                key={idx}
                className={`min-h-24 p-2 ${
                  isCurrentMonth ? 'bg-card' : 'bg-muted'
                } border border-border relative`}
              >
                {day && (
                  <>
                    <div className={`text-sm font-semibold mb-1 ${isCurrentMonth ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {day.getDate()}
                    </div>
                    <div className="space-y-1">
                      {tasksForDay.slice(0, 2).map(task => (
                        <div
                          key={task.id}
                          className={`text-xs p-1 text-white truncate ${task.color}`}
                          title={task.name}
                        >
                          {task.name}
                        </div>
                      ))}
                      {tasksForDay.length > 2 && (
                        <div className="text-xs text-muted-foreground">
                          +{tasksForDay.length - 2} more
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // Weekly View
  const renderWeeklyView = () => {
    const weekStart = getWeekStart(currentDate)
    const weekDays = []
    const hours = Array.from({ length: 24 }, (_, i) => i)

    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart)
      date.setDate(date.getDate() + i)
      weekDays.push(date)
    }

    return (
      <div className="bg-card overflow-hidden border border-border">
        {/* Week Header */}
        <div className="flex">
          <div className="w-20 bg-secondary border-r border-border border-b border-border flex-shrink-0"></div>
          <div className="flex-1 grid grid-cols-7 bg-secondary border-b border-border">
            {weekDays.map(day => (
              <div key={day.toISOString()} className="p-4 text-center border-r border-border last:border-r-0">
                <div className="font-semibold text-foreground">
                  {day.toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className="text-sm text-muted-foreground">
                  {day.getDate()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Time slots and tasks */}
        <div className="flex overflow-x-auto">
          <div className="w-20 bg-muted border-r border-border flex-shrink-0">
            {hours.map(hour => (
              <div key={hour} className="h-20 p-2 border-b border-border text-xs font-medium text-foreground text-center flex items-center justify-center">
                {String(hour).padStart(2, '0')}:00
              </div>
            ))}
          </div>

          <div className="flex-1 grid grid-cols-7">
            {weekDays.map(day => {
              const dateStr = formatDate(day)
              const tasksForDay = getTasksForDate(dateStr)

              return (
                <div key={day.toISOString()} className="border-r border-border last:border-r-0 bg-card">
                  {hours.map(hour => {
                    const timeStr = `${String(hour).padStart(2, '0')}:00`
                    const tasksAtHour = tasksForDay.filter(task => {
                      const startHour = parseInt(task.startTime.split(':')[0])
                      return startHour === hour
                    })

                    return (
                      <div
                        key={`${day.toISOString()}-${hour}`}
                        className="h-20 border-b border-border p-1 relative hover:bg-secondary transition-colors"
                      >
                        {tasksAtHour.map(task => (
                          <div
                            key={task.id}
                            className={`${task.color} text-white text-xs p-1 cursor-pointer hover:opacity-90 transition-opacity truncate`}
                            title={`${task.name} (${task.startTime} - ${task.endTime})`}
                          >
                            <div className="font-semibold text-xs">{task.name}</div>
                            <div className="text-xs opacity-90">{task.startTime}</div>
                          </div>
                        ))}
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // Daily View
  const renderDailyView = () => {
    const dateStr = formatDate(currentDate)
    const tasksForDay = getTasksForDate(dateStr)
    const hours = Array.from({ length: 24 }, (_, i) => i)

    return (
      <div className="bg-card border border-border overflow-hidden">
        <div className="p-4 bg-secondary border-b border-border">
          <h3 className="font-semibold text-foreground">
            {currentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </h3>
        </div>

        <div className="divide-y divide-border max-h-96 overflow-y-auto">
          {hours.map(hour => {
            const timeStr = `${String(hour).padStart(2, '0')}:00`
            const tasksAtHour = tasksForDay.filter(task => {
              const startHour = parseInt(task.startTime.split(':')[0])
              return startHour === hour
            })

            return (
              <div key={hour} className="flex">
                <div className="w-20 p-3 bg-muted text-sm font-medium text-foreground border-r border-border flex-shrink-0">
                  {timeStr}
                </div>
                <div className="flex-1 p-3">
                  <div className="space-y-2">
                    {tasksAtHour.map(task => (
                      <div
                        key={task.id}
                        className={`${task.color} text-white p-3 text-sm cursor-pointer hover:opacity-90 transition-opacity`}
                      >
                        <div className="font-semibold">{task.name}</div>
                        <div className="text-xs opacity-90">
                          {task.startTime} - {task.endTime}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 bg-background min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Schedule</h1>
        <p className="text-muted-foreground">View your tasks and schedule in multiple calendar formats.</p>
      </div>

      {/* View Toggle and Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setViewType('weekly')}
            className={`px-4 py-2 font-medium transition-colors ${
              viewType === 'weekly'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-foreground hover:bg-secondary/80'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setViewType('monthly')}
            className={`px-4 py-2 font-medium transition-colors ${
              viewType === 'monthly'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-foreground hover:bg-secondary/80'
            }`}
          >
            Monthly
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={viewType === 'monthly' ? handlePrevMonth : () => setCurrentDate(new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000))}
            className="p-2 hover:bg-secondary transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="text-center min-w-40">
            <h2 className="font-semibold text-foreground">
              {viewType === 'monthly'
                ? currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                : `Week of ${getWeekStart(currentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
              }
            </h2>
          </div>

          <button
            onClick={viewType === 'monthly' ? handleNextMonth : () => setCurrentDate(new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000))}
            className="p-2 hover:bg-secondary transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Calendar View */}
      <Card className="p-0 overflow-hidden border border-border">
        {viewType === 'monthly' && renderMonthlyView()}
        {viewType === 'weekly' && renderWeeklyView()}
      </Card>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500"></div>
          <span className="text-sm text-foreground">Design System</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-purple-500"></div>
          <span className="text-sm text-foreground">API Integration</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500"></div>
          <span className="text-sm text-foreground">Testing Phase</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-orange-500"></div>
          <span className="text-sm text-foreground">Code Review</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500"></div>
          <span className="text-sm text-foreground">Team Meeting</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-indigo-500"></div>
          <span className="text-sm text-foreground">Documentation</span>
        </div>
      </div>
    </div>
  )
}
