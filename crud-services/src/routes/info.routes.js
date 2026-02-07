import express from 'express'
import InfoController from '#@/controllers/info.controller.js'

const router = express.Router()

router.get('/', InfoController.getInfo)
router.patch('/', InfoController.updateInfo)

export default router