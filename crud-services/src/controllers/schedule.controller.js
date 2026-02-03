import services from '#@/services/schedule.services.js'
import {StatusCodes} from 'http-status-codes'

class ScheduleController{
    static getInstance(){
        if(!ScheduleController.instance){
            ScheduleController.instance = new ScheduleController()
        }
        return ScheduleController.instance
    }
    async getSchedule(req, res){
        const schedules = await services.getSchedule(req)
        return res.status(StatusCodes.OK).json({
            "messages": "Get schedule successfully",
            schedules,
        })
    }
    async getScheduleByID(req, res){
        const {id} = req.params
        const schedule = await services.getScheduleById(id)
        return res.status(StatusCodes.OK).json({
            "messages": "Get schedules by id successfully",
            schedule
        })
    }
    async getScheduleByDate(req, res){
        const {date} = req.params
        const schedule = await services.getScheduleByDate(date)
        return res.status(StatusCodes.OK).json({
            "messages": "Get schedules by date",
            schedule
        })
    }
    async getScheduleBetweenDays(req, res){
        const {from_date, to_date} = req.params
        const schedules = await services.getScheduleBetweenDays(from_date, to_date)
        return res.status(StatusCodes.OK).json({
            "messages": "Get schedules between date successfully",
            schedules
        })
    }
    async getScheduleByTask(req, res){
        const {task_id} = req.params;
        const schedule = await services.getScheduleByTask(task_id)
        return res.status(StatusCodes.OK).json({
            "messages": "Get schedules by task successfully",
            schedule
        })
    }
    async createSchedule(req, res){
        const {
            date,
            start_time,
            end_time,
            task_id,
        } = req.body;
        const schedule = await services.createSchedule(
            date,
            start_time,
            end_time,
            task_id
        )
        return res.status(StatusCodes.CREATED).json({
            "messages": "Create schedule successfully",
            schedule
        })
    }
    async deleteSchedule(req, res){
        const {id} = req.params
        const schedule = await services.deleteSchedule(id)
        return res.status(StatusCodes.ACCEPTED).json({
            "messages": "Delete schedule successfully",
            schedule
        })
    }
    async updateSchedule(req, res){
        const {id} = req.params
        const {
            date, 
            start_time, 
            end_time, 
            task_id
        } = req.body

        const schedule = await services.updateSchedule(
            date,
            start_time,
            end_time,
            task_id,
            id
        )
        return res.status(StatusCodes.ACCEPTED).json({
            "messages": "Delete schedule successfully",
            schedule
        })
    }
}

const instance = ScheduleController.getInstance()
export default instance