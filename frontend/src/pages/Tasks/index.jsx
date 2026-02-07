import { useEffect, useState } from 'react'
import { Plus, MessageSquare, Send, CheckCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import TaskDetailModal from '@/components/TaskDetailModal'
import useTask from '@/hooks/useTask'
import calculateTimeLeft from '@/utils/calculate_time'
import { useMode } from '@/context/setting.context'

//Ý tưởng là đầu tiên fetch data từ database về sau đó render lên, fetch những thằng nào chưa finish thôi
//Có thể là get 1 task cụ thể, tạo 1 task cụ thể và sửa 1 task cụ thể
//
export default function Task() {
  const {data: task_data, isLoading: isLoadingGetTasks} = useTask.getTask()
  const {mutate: updateTask} = useTask.updateTask()
  const {mutate: addTask} = useTask.addTask()
  const [tasks, setTasks] = useState([])
  const {isAutoSchedule} = useMode()
  const TimeLeftBadge = ({ deadline }) => {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(deadline));

    useEffect(() => {
      const timer = setInterval(() => {
        setTimeLeft(calculateTimeLeft(deadline));
      }, 1000); // Cập nhật mỗi giây
      return () => clearInterval(timer);
    }, [deadline]);

    return <span>{timeLeft}</span>;
  };

  useEffect(() => {
      if(!task_data){
        return;
      }
      setTasks(task_data)
  }, [isLoadingGetTasks, task_data])

  const [selectedTask, setSelectedTask] = useState(null)

  const handleFinishTask = (e, taskId) => {
    e.preventDefault()
    const task = tasks.find(t => t.id === taskId)
    if (task) {
      updateTask({
        ...task,
        finished: true
      });
    }
  }

  const handleTaskClick = (e, task) => {
    setSelectedTask(task)
  }

  const handleSaveTask = (updatedTask) => {
    setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t))
    updateTask(updatedTask)
  }

  const handleCreateTask = () => {
    setTasks([...tasks, newTask])
    setShowAddModal(false)
    addTask(newTask)
  }
  const [showAddModal, setShowAddModal] = useState(false)

  if(isLoadingGetTasks){
    return<></>
  }
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
                  <th className="py-3 px-4 font-semibold text-foreground text-center">Working time</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground ">Time left</th>
                  <th className="text-center py-3 px-4 font-semibold text-foreground text-center">Finished</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id || Math.random()} className="border-b border-border hover:bg-secondary transition-colors">
                    <td
                      onClick={(e) => handleTaskClick(e, task)}
                      className="py-3 px-4 text-foreground cursor-pointer hover:text-primary font-medium max-w-[300px] min-w-[150px]"
                    >
                      {/* Bọc nội dung vào div và đặt line-clamp ở đây */}
                      <div className="line-clamp-3">
                        {task.name}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-foreground max-w-[120px] min-w-[120px]">{(new Date(task.deadline)).toLocaleString("en-GB")}</td>
                    <td className="py-3 px-4 text-center text-center">
                      {task.working_time}
                    </td>
                    <td className="py-3 px-4 text-foreground"><TimeLeftBadge deadline={(new Date(task.deadline)).toLocaleString()} /></td>
                    <td className="py-3 px-4 text-center text-center">
                      <input
                        type="checkbox"
                        onChange={(e) => handleFinishTask(e, task.id)}
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
        onClose={() => setSelectedTask(null)} 
        onSave={(updatedTask) => handleSaveTask(updatedTask)} 
        task={selectedTask} 
      />
      <TaskDetailModal 
        onClose={() => setShowAddModal(false)} 
        onSave={(newTask) => {
          setTasks([...tasks, newTask])
          setShowAddModal(false)
          addTask({task: newTask, isAutoSchedule})
        }}
        isNew
        task={showAddModal ? { name: '', description: '', working_time: 0, deadline: ''} : null} 
      />
    </div>
  )
}
