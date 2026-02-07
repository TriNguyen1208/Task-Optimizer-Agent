import express from 'express'
import StatisticsController from '#@/controllers/statistics.controller.js'
import { authenticateToken } from '#@/middleware/auth.middleware.js'

const router = express.Router()

router.get('/', authenticateToken, StatisticsController.getStatistics)

export default router