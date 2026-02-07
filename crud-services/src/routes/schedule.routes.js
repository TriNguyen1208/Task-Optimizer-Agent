import express from 'express'
import ScheduleController from '#@/controllers/schedule.controller.js'
import { authenticateToken } from '#@/middleware/auth.middleware.js'
const router = express.Router()

router.get('/', authenticateToken, ScheduleController.getSchedule)
router.get('/:id', authenticateToken, ScheduleController.getScheduleByID)

router.post('/', authenticateToken, ScheduleController.createSchedule)

router.patch('/:id', authenticateToken, ScheduleController.updateSchedule)

router.delete('/:id', authenticateToken, ScheduleController.deleteSchedule)

export default router