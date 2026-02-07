import express from 'express'
import TaskController from '#@/controllers/task.controller.js'
import { authenticateToken } from '#@/middleware/auth.middleware.js'

const router = express.Router()

router.get('/', authenticateToken, TaskController.getTask)
router.get('/tasks', authenticateToken, TaskController.getAllTasks)
router.get('/task-history/', authenticateToken, TaskController.getTaskHistory)
router.get('/task-name/', authenticateToken, TaskController.getTaskName)
router.get('/:id', authenticateToken, TaskController.getTaskByID)

router.post('/', authenticateToken, TaskController.createTask)

router.patch('/:id', authenticateToken, TaskController.updateTask)

router.delete('/:id', authenticateToken, TaskController.deleteTask)

export default router