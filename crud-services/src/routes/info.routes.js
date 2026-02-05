import express from 'express'
import InfoController from '#@/controllers/info.controller.js'

const router = express.Router()

router.get('/:id', InfoController.getInfo)
router.patch('/:id', InfoController.editInfo)
router.delete('/:id', InfoController.deleteInfo)

export default router