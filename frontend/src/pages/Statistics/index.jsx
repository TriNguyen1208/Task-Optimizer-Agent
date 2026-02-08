import { Card } from '@/components/ui/card'
import { TrendingUp, Clock, Zap, CheckCircle } from 'lucide-react'
import useStatistics from '@/hooks/useStatistics'
import useTask from '@/hooks/useTask'
//Đầu tiên là lấy dữ liệu từ database history task về
//Lấy statistic về và render ra. Không cần bỏ vào state gì hết
export default function Statistics() {
  const {data: historyData, isLoading: isLoadingTaskHistory} = useTask.getTaskHistory()
  const {data: statistics, isLoading: isLoadingStatistics} = useStatistics.getStatistics()

  if(isLoadingStatistics || isLoadingTaskHistory || !historyData || !statistics){
    return <></>
  }
  return (
    <div className="p-8 bg-background min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Statistics</h1>
        <p className="text-muted-foreground">Track your productivity metrics and completed work history.</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
            <p className="text-2xl font-bold text-foreground text-center">{statistics.totalHours.toFixed(1)}h</p>
          </div>
        </Card>

        <Card className="p-6 flex items-center gap-4 border border-border">
          <div className="p-3 bg-green-900">
            <TrendingUp className="w-6 h-6 text-green-300" />
          </div>
          <div className='flex flex-col gap-3'>
            <p className="text-sm text-muted-foreground">Avg Hours/Task</p>
            <p className="text-2xl font-bold text-foreground text-center">{statistics.avgTotalHours}h</p>
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
                    <div className='line-clamp-1'>{item.name}</div>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground min-w-[150px] max-w-[400px]">
                    <div className='line-clamp-1'>{item.description}</div>
                  </td>
                  <td className="py-3 px-4 text-foreground min-w-[150px] max-w-[400px]">
                    <div className='line-clamp-1'>{(new Date(item.deadline)).toLocaleString("en-GB")}</div>
                  </td>
                  <td className="py-3 px-4 text-right text-foreground font-medium min-w-[150px] max-w-[400px]">
                    <div className='line-clamp-1'>{item.working_time}h</div>
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
