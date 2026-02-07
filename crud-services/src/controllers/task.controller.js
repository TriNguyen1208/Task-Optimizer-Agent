import {StatusCodes} from 'http-status-codes'
import services from '#@/services/task.services.js'
import 'dotenv/config'
import getUserId from '#@/utils/get_userid.js'

class TaskController{
    static getInstance(){
        if (!TaskController.instance){
            TaskController.instance = new TaskController()
        }
        return TaskController.instance
    }
    async getTask(req, res){
        const user_id = getUserId(req)
        if (!user_id || isNaN(user_id)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
            message: 'Invalid id'
        })}
        
        const tasks = await services.getTask(user_id)
        return res.status(StatusCodes.OK).json(tasks)
    }
    async getTaskHistory(req, res){
        const user_id = getUserId(req)
        if(!user_id || isNaN(user_id)){
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Invalid id"
            })
        }
        const tasks = await services.getTaskHistory(user_id)
        return res.status(StatusCodes.OK).json(tasks)
    }
    async getTaskByID(req, res){
        const {id} = req.params
        const user_id = getUserId(req)
        if (!user_id || isNaN(user_id)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
            message: 'Invalid id'
        })}

        const task = await services.getTaskByID(user_id, id)
        return res.status(StatusCodes.OK).json(task)
    }
    async getTaskName(req, res){
        const user_id = getUserId(req)
        if (!user_id || isNaN(user_id)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
            message: 'Invalid id'
        })}

        const task = await services.getTaskName(user_id)
        return res.status(StatusCodes.OK).json(task)
    }
    async createTask(req, res){
        const {
            name,
            description,
            deadline,
            working_time,
            finished,
        } = req.body

        const user_id = getUserId(req)
        if (!user_id || isNaN(user_id)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
            message: 'Invalid id'
        })}

        const task = await services.createTask(
            name,
            description,
            deadline,
            working_time,
            finished,
            user_id
        )
        return res.status(StatusCodes.CREATED).json({
            "messages": "Create new task successfully",
            task
        })
    }
    async updateTask(req, res){
        const {
            name,
            description,
            deadline,
            working_time,
            finished,
        } = req.body
        const user_id = getUserId(req)
        if (!user_id || isNaN(user_id)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
            message: 'Invalid id'
        })}

        const {id} = req.params
        const task = await services.updateTask(
            id,
            name,
            description,
            deadline,
            working_time,
            finished,
            user_id
        )
        return res.status(StatusCodes.OK).json({
            "messages": "Update task successfully",
            task
        })
    }
    async deleteTask(req, res){
        const user_id = getUserId(req)
        if (!user_id || isNaN(user_id)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
            message: 'Invalid id'
        })}
        const {id} = req.params
        const task = await services.deleteTask(user_id, id)
        return res.status(StatusCodes.OK).json({
            "messages": "Delete task successfully",
            task
        })
    }
}

const instance = TaskController.getInstance()
export default instance