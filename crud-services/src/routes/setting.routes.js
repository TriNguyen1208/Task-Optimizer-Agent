import express from 'express'
import SettingController from '#@/controllers/setting.controller.js'
import { authenticateToken } from '#@/middleware/auth.middleware.js'

const router = express.Router()

router.get('/', authenticateToken, SettingController.getSetting)
router.patch('/', authenticateToken, SettingController.updateSetting)

export default router