import db from '#@/db/init.db.js'

class StatisticsServices{
    static getInstance(){
        if (!StatisticsServices.instance){
            StatisticsServices.instance = new StatisticsServices()
        }
        return StatisticsServices.instance
    }
    async getStatistics(user_id){
        const queryTextTaskComplete = `
            SELECT COUNT(*) AS completed_count
            FROM task
            WHERE user_id = $1 AND finished = TRUE;
        `
        const queryTextTotalHour = `
            SELECT sum(t.working_time)
            FROM task t
            WHERE t.user_id = $1
        `
        
        const [completedTasksQuery, totalHoursQuery] = await Promise.all([
            db.query(queryTextTaskComplete, [user_id]),
            db.query(queryTextTotalHour, [user_id])
        ]);
        const completedTasks = completedTasksQuery.rows[0].completed_count
        const totalHours = totalHoursQuery.rows[0].sum || 0

        let avgTotalHours = 0
        if (completedTasks != 0){
            avgTotalHours = totalHours / completedTasks
        }

        return {
            completedTasks: Number(completedTasks),
            totalHours: Number(totalHours),
            avgTotalHours: Number(avgTotalHours)
        }
    }
}

const instance = StatisticsServices.getInstance()
export default instance