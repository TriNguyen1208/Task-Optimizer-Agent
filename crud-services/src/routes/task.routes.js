import express from 'express'
import TaskController from '#@/controllers/task.controller.js'

const router = express.Router()

router.get('/:user_id', TaskController.getTask)
router.get('/:id', TaskController.getTaskByID)

router.post('/', TaskController.createTask)

router.patch('/:id', TaskController.updateTask)

router.delete('/:id', TaskController.deleteTask)

export default router