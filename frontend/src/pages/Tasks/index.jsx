import { useState } from 'react'
import { Plus, MessageSquare, Send, CheckCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import TaskDetailModal from '@/components/TaskDetailModal'


export default function Task() {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      name: 'Design System',
      description: 'Create a comprehensive design system with components',
      workingHours: 8,
      startDate: '2024-02-01',
      endDate: '2024-02-15',
      deadline: '2024-02-15',
      status: 'In Progress',
      timeLeft: '3 hours, 2 minutes',
      path: '/docs/design-system',
    },
    {
      id: 2,
      name: 'API Integration',
      description: 'Integrate third-party APIs for data synchronization',
      workingHours: 6,
      startDate: '2024-02-10',
      endDate: '2024-02-20',
      deadline: '2024-02-20',
      status: 'Pending',
      timeLeft: '3 hours, 2 minutes',
      path: 'https://api.example.com/docs',
    },
    {
      id: 3,
      name: 'Testing Phase',
      description: 'Run comprehensive testing suite and fix bugs',
      workingHours: 5,
      startDate: '2024-02-15',
      endDate: '2024-02-25',
      deadline: '2024-02-25',
      status: 'Not Started',
      timeLeft: '3 hours, 2 minutes',
      path: '/tests/suite.json',
    },
  ])


  const [selectedTask, setSelectedTask] = useState(null)
  const [finishedTasks, setFinishedTasks] = useState([])
  const handleFinishTask = (taskId) => {
    const task = tasks.find(t => t.id === taskId)
    if (task) {
      setFinishedTasks([...finishedTasks, task])
      setTasks(tasks.filter(t => t.id !== taskId))
    }
  }

  const handleTaskClick = (task) => {
    setSelectedTask(task)
  }

  const handleSaveTask = (updatedTask) => {
    setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t))
  }


  const [showAddModal, setShowAddModal] = useState(false)

  return (
    <div className="p-8 bg-background min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your task overview.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Tasks List */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-3">
            <div className='flex flex-col gap-4'>
              <h2 className="text-xl font-bold text-foreground">Tasks List</h2>
              <span className="text-muted-foreground text-sm font-bold">
                Current Date: {new Date().toLocaleDateString('en-GB')} {/* en-GB là chuẩn Ngày/Tháng/Năm */}
              </span>
            </div>
            <button onClick={() => setShowAddModal(true)} className="p-2 bg-primary text-primary-foreground hover:opacity-90 rounded-md">
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* Table Header */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground text-center">Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground text-center">Deadline</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground text-center">Working time</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground text-center">Time left</th>
                  <th className="text-center py-3 px-4 font-semibold text-foreground text-center">Finished</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id} className="border-b border-border hover:bg-secondary transition-colors">
                    <td
                      onClick={() => handleTaskClick(task)}
                      className="py-3 px-4 text-foreground cursor-pointer hover:text-primary font-medium text-center max-w-[200px] min-w-[150px]"
                    >
                      {/* Bọc nội dung vào div và đặt line-clamp ở đây */}
                      <div className="line-clamp-3">
                        {task.name}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-foreground text-center">{task.deadline}</td>
                    <td className="py-3 px-4 text-center text-center">
                      {task.workingHours}
                    </td>
                    <td className="py-3 px-4 text-foreground text-center">{task.timeLeft}</td>
                    <td className="py-3 px-4 text-center text-center">
                      <input
                        type="checkbox"
                        onChange={() => handleFinishTask(task.id)}
                        className="w-5 h-5 cursor-pointer accent-primary"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {tasks.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No active tasks. Great job!</p>
            </div>
          )}
        </Card>

      </div>

      <TaskDetailModal 
        task={selectedTask} 
        onClose={() => setSelectedTask(null)} 
        onSave={(updatedTask) => handleSaveTask(updatedTask)} 
      />
      <TaskDetailModal 
        task={showAddModal ? { id: Date.now(), name: '', description: '', workingHours: 0, startDate: '', endDate: '', deadline: '', status: 'Not Started', path: '' } : null} 
        onClose={() => setShowAddModal(false)} 
        onSave={(newTask) => {
          setTasks([...tasks, newTask])
          setShowAddModal(false)
        }}
        isNew
      />
    </div>
  )
}
