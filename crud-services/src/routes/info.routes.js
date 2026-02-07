import express from 'express'
import InfoController from '#@/controllers/info.controller.js'
import {authenticateToken} from '#@/middleware/auth.middleware.js'

const router = express.Router()

router.get('/', authenticateToken, InfoController.getInfo)
router.patch('/', authenticateToken, InfoController.updateInfo)

export default router