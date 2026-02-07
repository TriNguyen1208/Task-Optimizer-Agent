import express from 'express'
import AuthController from '#@/controllers/auth.controller.js'
import {authenticateToken} from '#@/middleware/auth.middleware.js'

const router = express.Router()

router.get('/login-result', authenticateToken, AuthController.getLoginResult);

router.post('/login', AuthController.login);
router.post('/signup', AuthController.signup);
router.post('/refresh-token', AuthController.refreshToken);
router.post('/send-reset-password', AuthController.sendResetPassword);
router.post('/logout', AuthController.logout);

// router.patch('/update-password', authenticateToken, AuthController.updatePassword);
router.patch('/reset-password', AuthController.resetPassword);
export default router