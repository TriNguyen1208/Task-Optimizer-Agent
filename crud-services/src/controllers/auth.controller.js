import authServices from '#@/services/auth.services.js'
import {StatusCodes} from 'http-status-codes'

class AuthController{
    static getInstance(){
        if(!AuthController.instance){
            AuthController.instance = new AuthController()
        }
        return AuthController.instance
    }
    async login(req, res){
        try {
            const { status, message, token = null, user = null } = await authServices.login(req.body);
            if (token) {
                const { accessToken, refreshToken } = token;
                res.cookie('accessToken', accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production', 
                    sameSite: 'Strict',      
                    path: '/',
                    maxAge: 15 * 60 * 1000
                });

                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'Strict',
                    path: '/',
                    maxAge: 7 * 24 * 60 * 60 * 1000
                });
            }

            res.status(status).json({ message: message, user });
        } catch (error) {
            console.error('Lỗi đăng nhập: ', error);
            res.status(500).json({ message: 'Lỗi máy chủ nội bộ'});
        }
    };
    async signup(req, res){
        try {
            const { status, message, token = null, user = null } = await authServices.signup(req.body);
            if (token) {
                const { accessToken, refreshToken } = token;
                res.cookie('accessToken', accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production', 
                    sameSite: 'Strict',      
                    path: '/',
                    maxAge: 15 * 60 * 1000
                });

                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'Strict',
                    path: '/',
                    maxAge: 7 * 24 * 60 * 60 * 1000
                });
            }

            res.status(status).json({ message: message, user });
        } catch (error) {
            console.error('Lỗi đăng nhập: ', error);
            res.status(500).json({ message: 'Lỗi máy chủ nội bộ'});
        }
    }
    async logout(req, res){
        try {
            res.clearCookie('accessToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Strict',
                path: '/'
            });

            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Strict',
                path: '/'
            });
            res.status(200).json({ message: "Đăng xuất thành công" });
        } catch (error) {
            console.error('Lỗi khi logout: ', error);
            res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
        }
    }
    async refreshToken(req, res) {
        try {
            const { refreshToken: _refreshToken } = req.cookies
            const { status, message, accessToken } = await authServices.refreshToken(_refreshToken);
            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', 
                sameSite: 'Strict',      
                path: '/',
                maxAge: 15 * 60 * 1000  
            });
            res.status(status).json({ message: message, accessToken });
        } catch (error) {
            console.error('Lỗi đăng nhập: ', error);
            res.status(500).json({ message: 'Lỗi máy chủ nội bộ'});
        }
    }
    async getLoginResult(req, res){
        try {
            const user = await authServices.getUserIdByEmail(req.user.email);
            res.status(200).json({
                message: 'Đăng nhập thành công', 
                user
            });
        } catch (error) {
            console.error('Lỗi lấy thông tin user: ', error);
            res.status(500).json({ message: 'Lỗi máy chủ nội bộ'});        
        }    
    }
    async sendResetPassword (req, res){
        try {
            const { status, message } = await authServices.sendResetPassword(req.body);
            res.status(status).json({ message });
        } catch (error) {
            console.error('Lỗi gửi reset mật khẩu: ', error);
            res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
        }
    }
    async resetPassword(req, res){
    try {
        const { status, message } = await authServices.resetPassword(req.body);
        res.status(status).json({ message });
    } catch (error) {
        console.error('Lỗi reset mật khẩu: ', error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
    }
}
}

const instance = AuthController.getInstance()
export default instance