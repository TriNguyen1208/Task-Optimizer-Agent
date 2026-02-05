import {StatusCodes} from 'http-status-codes'
import services from '#@/services/task.services.js'

class TaskController{
    static getInstance(){
        if (!TaskController.instance){
            TaskController.instance = new TaskController()
        }
        return TaskController.instance
    }
    async getTask(req, res){
        const tasks = await services.getTask(req)
        return res.status(StatusCodes.OK).json({
            "messages": "Get all tasks successfully",
            tasks
        })
    }
    async getTaskByID(req, res){
        const {id} = req.params
        const task = await services.getTaskByID(id)
        return res.status(StatusCodes.OK).json({
            "messages": "Get task by id",
            task
        })
    }
    async createTask(req, res){
        const {
            name,
            description,
            deadline,
            working_time,
            finished,
            user_id
        } = req.body
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
            user_id
        } = req.body
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
        const {id} = req.params
        const task = await services.deleteTask(id)
        return res.status(StatusCodes.OK).json({
            "messages": "Delete task successfully",
            task
        })
    }
}

const instance = TaskController.getInstance()
export default instance