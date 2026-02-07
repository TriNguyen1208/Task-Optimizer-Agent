import services from '#@/services/schedule.services.js'
import {StatusCodes} from 'http-status-codes'
import getUserId from '#@/utils/get_userid.js'

class ScheduleController{
    static getInstance(){
        if(!ScheduleController.instance){
            ScheduleController.instance = new ScheduleController()
        }
        return ScheduleController.instance
    }
    async getSchedule(req, res){
        const user_id = getUserId(req)
        if (!user_id || isNaN(user_id)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
            message: 'Invalid id'
        })}
        const schedules = await services.getSchedule(user_id, req)
        return res.status(StatusCodes.OK).json(schedules)
    }
    async getScheduleByID(req, res){
        const {id} = req.params
        const user_id = getUserId(req)
        if (!user_id || isNaN(user_id)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
            message: 'Invalid id'
        })}
        const schedule = await services.getScheduleByID(user_id, id)
        return res.status(StatusCodes.OK).json(schedule)
    }
    async createSchedule(req, res){
        const {
            date,
            start_time,
            end_time,
            task_id, 
            task_name,
        } = req.body;
        
        const user_id = getUserId(req)
        console.log(user_id)
        if (!user_id || isNaN(user_id)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
            message: 'Invalid id'
        })}

        const schedule = await services.createSchedule(
            date,
            start_time,
            end_time,
            task_id,
            task_name,
            user_id
        )
        
        return res.status(StatusCodes.CREATED).json({
            "messages": "Create schedule successfully",
            schedule
        })
    }
    async deleteSchedule(req, res){
        const {id} = req.params
        const user_id = getUserId(req)
        if (!user_id || isNaN(user_id)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
            message: 'Invalid id'
        })}
        const schedule = await services.deleteSchedule(user_id, id)
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
        } = req.body

        const user_id = getUserId(req)
        if (!user_id || isNaN(user_id)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
            message: 'Invalid id'
        })}
        const schedule = await services.updateSchedule(
            date,
            start_time,
            end_time,
            user_id,
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