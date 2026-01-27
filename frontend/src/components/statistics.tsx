import { Card } from './ui/card'
import { TrendingUp, Clock, Zap, CheckCircle } from 'lucide-react'

export default function Statistics() {
  const historyData = [
    { id: 1, task: 'Homepage Design', description: 'Create mockups and wireframes', hours: 4.5, completedDate: '2024-02-10' },
    { id: 2, task: 'API Development', description: 'Build user authentication', hours: 6.0, completedDate: '2024-02-08' },
    { id: 3, task: 'Database Setup', description: 'Configure PostgreSQL database', hours: 3.2, completedDate: '2024-02-05' },
    { id: 4, task: 'UI Components', description: 'Design reusable component library', hours: 5.5, completedDate: '2024-02-03' },
    { id: 5, task: 'Bug Fixes', description: 'Fix critical production bugs', hours: 2.8, completedDate: '2024-02-01' },
  ]

  const totalCompletedHours = historyData.reduce((sum, item) => sum + item.hours, 0)
  const averageHoursPerTask = (totalCompletedHours / historyData.length).toFixed(1)

  return (
    <div className="p-8 bg-background min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Statistics</h1>
        <p className="text-muted-foreground">Track your productivity metrics and completed work history.</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 flex items-center gap-4 border border-border">
          <div className="p-3 bg-blue-900">
            <CheckCircle className="w-6 h-6 text-blue-300" />
          </div>
          <div className='flex flex-col gap-3'>
            <p className="text-sm text-muted-foreground">Tasks Completed</p>
            <p className="text-2xl font-bold text-foreground text-center">{historyData.length}</p>
          </div>
        </Card>

        <Card className="p-6 flex items-center gap-4 border border-border">
          <div className="p-3 bg-purple-900">
            <Clock className="w-6 h-6 text-purple-300" />
          </div>
          <div className='flex flex-col gap-3'>
            <p className="text-sm text-muted-foreground">Total Hours Worked</p>
            <p className="text-2xl font-bold text-foreground text-center">{totalCompletedHours.toFixed(1)}h</p>
          </div>
        </Card>

        <Card className="p-6 flex items-center gap-4 border border-border">
          <div className="p-3 bg-green-900">
            <TrendingUp className="w-6 h-6 text-green-300" />
          </div>
          <div className='flex flex-col gap-3'>
            <p className="text-sm text-muted-foreground">Avg Hours/Task</p>
            <p className="text-2xl font-bold text-foreground text-center">{averageHoursPerTask}h</p>
          </div>
        </Card>

        <Card className="p-6 flex items-center gap-4 border border-border">
          <div className="p-3 bg-orange-900">
            <Zap className="w-6 h-6 text-orange-300" />
          </div>
          <div className='flex flex-col gap-3'>
            <p className="text-sm text-muted-foreground">Completion Rate</p>
            <p className="text-2xl font-bold text-foreground text-center">100%</p>
          </div>
        </Card>
      </div>

      {/* History Table */}
      <Card className="p-6">
        <h2 className="text-lg font-bold text-foreground mb-4">Completed Tasks History</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-semibold text-foreground">Task</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Description</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Completed Date</th>
                <th className="text-right py-3 px-4 font-semibold text-foreground">Hours</th>
              </tr>
            </thead>
            <tbody>
              {historyData.map((item) => (
                <tr key={item.id} className="border-b border-border hover:bg-secondary transition-colors">
                  <td className="py-3 px-4 text-foreground font-medium min-w-[200px] max-w-[300px]"> 
                    <div className='line-clamp-1'>{item.task}</div>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground min-w-[150px] max-w-[400px]">
                    <div className='line-clamp-1'>{item.description}</div>
                  </td>
                  <td className="py-3 px-4 text-foreground min-w-[150px] max-w-[400px]">
                    <div className='line-clamp-1'>{item.completedDate}</div>
                  </td>
                  <td className="py-3 px-4 text-right text-foreground font-medium min-w-[150px] max-w-[400px]">
                    <div className='line-clamp-1'>{item.hours}h</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
