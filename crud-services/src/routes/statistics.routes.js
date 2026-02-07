import express from 'express'
import StatisticsController from '#@/controllers/statistics.controller.js'

const router = express.Router()

router.get('/', StatisticsController.getStatistics)

export default router