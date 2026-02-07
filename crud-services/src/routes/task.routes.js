import express from 'express'
import TaskController from '#@/controllers/task.controller.js'

const router = express.Router()

router.get('/', TaskController.getTask)
router.get('/task-history/', TaskController.getTaskHistory)
router.get('/task-name/', TaskController.getTaskName)
router.get('/:id', TaskController.getTaskByID)

router.post('/', TaskController.createTask)

router.patch('/:id', TaskController.updateTask)

router.delete('/:id', TaskController.deleteTask)

export default router