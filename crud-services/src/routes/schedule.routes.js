import express from 'express'
import ScheduleController from '#@/controllers/schedule.controller.js'

const router = express.Router()

router.get('/:user_id', ScheduleController.getSchedule)
router.get('/:id', ScheduleController.getScheduleByID)


router.post('/', ScheduleController.createSchedule)

router.patch('/:id', ScheduleController.updateSchedule)

router.delete('/:id', ScheduleController.deleteSchedule)
export default router