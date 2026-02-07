import db from '#@/db/init.db.js'
import { hashPassword, comparePasswords } from '#@/utils/auth.js'
import jwt from 'jsonwebtoken'
import 'dotenv/config'
import sendMail from '#@/utils/mailer.js'

const {
    ACCESS_SECRET,
    REFRESH_SECRET,
    RESET_SECRET
} = process.env

class AuthServices{
    static getInstance(){
        if (!AuthServices.instance){
            AuthServices.instance = new AuthServices()
        }
        return AuthServices.instance
    }
    async isValidPassword(email, password){
        const queryText = `
            SELECT password as hashed_password
            FROM users
            WHERE email = $1
        `
        const user = await db.query(queryText, [email])
        if (user.rowCount === 0) return false;
        const hashedPassword = user.rows[0].hashed_password;
        return await comparePasswords(password, hashedPassword)
    }
    async getUserIdByEmail(email){
        const queryText = `
            SELECT u.id
            FROM users u
            WHERE u.email = $1
        `
        const user = await db.query(queryText, [email])
        if (user.rowCount === 0) return null
        const id = user.rows[0].id;
        return id
    }
    async login(loginData){
        const { email, password } = loginData;
        const isPasswordValid = await this.isValidPassword(email, password);
        if (!isPasswordValid) return {
            status: 401,
            message: 'Sai thông tin đăng nhập'
        }
        const id = await this.getUserIdByEmail(email)
        // Tạo access token
        const accessToken = jwt.sign(
            { email: email, user_id: id},
            ACCESS_SECRET,
            { expiresIn: '15m' }
        );

        // Tạo refresh token
        const refreshToken = jwt.sign(
            { email: email, user_id: id},
            REFRESH_SECRET,
            { expiresIn: '7d' }
        );
        const user = {
            email: email,
            user_id: id
        }
        return {
            status: 200,
            message: 'Đăng nhập thành công',
            token: { accessToken, refreshToken },
            user,
        }
    };
    async initSetting(user_id){
        const queryText = `
            INSERT INTO setting (user_id) VALUES ($1) 
        `
        await db.query(queryText, [user_id])
    }   
    async initInfo(user_id){
        const queryText = `
            INSERT INTO user_info (user_id) VALUES ($1)
        `
        await db.query(queryText, [user_id])
    }
    async signup(signupData){
        const {email, password} = signupData
        const queryText = `
            SELECT email
            FROM users
            WHERE email = $1
        `

        const result = await db.query(queryText, [email])
        if(result.rowCount != 0){
            return {
                status: 401,
                message: "Email is existed",
            }
        }
        
        const hashedPassword = await hashPassword(password)
        const result_insert = await db.query(
            `INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *`,
            [email, hashedPassword]
        );
        const id = result_insert.rows[0].id
        await this.initSetting(id)
        await this.initInfo(id)
        
        // Tạo access token
        const accessToken = jwt.sign(
            { email: email, user_id: id },
            ACCESS_SECRET,
            { expiresIn: '15m' }
        );

        // Tạo refresh token
        const refreshToken = jwt.sign(
            { email: email, user_id: id },
            REFRESH_SECRET,
            { expiresIn: '7d' }
        );

        const user = {
            email: email,
            user_id: id
        }
        return {
            status: 200,
            message: `Signup successfully`,
            token: { accessToken, refreshToken },
            user
        }
    }
    async refreshToken(refreshToken){
        console.error('Gọi api refresh token thành công ', refreshToken)
        if (!refreshToken) {
            return {
                status: 401,
                message: 'Không có refresh token'
            };
        }

        try {
            const decodedUser = jwt.verify(refreshToken, REFRESH_SECRET);

            const accessToken = jwt.sign(
                { email: decodedUser.email, user_id: decodedUser.user_id },
                ACCESS_SECRET,
                { expiresIn: '15m' }
            );

            return {
                status: 200,
                message: 'Refresh token thành công',
                accessToken
            };
        } catch (err) {
            return {
                status: 403,
                message: 'Token không hợp lệ hoặc đã hết hạn'
            };
        }
    };
    async updatePassword (data, user){
        const {
            old_password,
            new_password,
            verify_password
        } = data;
        
        const isOldPasswordValid = await this.isValidPassword(user.email, old_password);
        if (!isOldPasswordValid) return {
            status: 409,
            message: "Mật khẩu cũ không đúng"
        }

        if (new_password != verify_password) return {
            status: 409,
            message: "Mật khẩu xác nhận chưa trùng khớp"
        }

        const hashed_new_password = await authUtil.hashPassword(new_password);

        const queryText = `
            UPDATE users
            SET
                password = $1
            WHERE
                email = $2
        `
        await db.query(queryText, [hashed_new_password, user.email])

        return {
            status: 200,
            message: "Cập nhật mật khẩu thành công",
            user
        }
    }
    async sendResetPassword(data){
        const { email = null } = data;
        if (!email) return {
            status: 400,
            message: "Thiếu thông tin email"
        }
        const queryText = `
            SELECT email
            FROM users
            WHERE email = $1
        `
        const result = await db.query(queryText, [email])

        if (result.rowCount == 0) return {
            status: 404,
            message: "Email không tồn tại"
        }

        const token = jwt.sign(
            { email: email, user_id: user_id },
            RESET_SECRET,
            { expiresIn: '15m' }
        );

        const resetUrl = `${process.env.VITE_ADMIN_URL || 'http://localhost:3001'}/dang-nhap?token=${token}`;

        await sendMail({
            to: email,
            subject: 'Yêu cầu khôi phục mật khẩu',
            html: `
            <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; color: #333333;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden; color: #000000">
                <div style="background-color: #4CAF50; color: #ffffff; padding: 25px; text-align: center;">
                <h1 style="margin: 0; font-size: 24px;">Khôi phục mật khẩu</h1>
                </div>
                
                <div style="padding: 25px;">
                <p style="font-size: 16px; margin: 0 0 15px; color: #000000">Xin chào <strong>${email}</strong>,</p>
                <p style="font-size: 16px; margin: 0 0 25px; color: #000000">Bạn đã yêu cầu khôi phục mật khẩu cho tài khoản của mình. Vui lòng nhấn vào nút dưới đây để tiếp tục:</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" style="background-color: #4CAF50; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold; border: 1px solid #0056b3;">Khôi phục mật khẩu</a>
                </div>
                
                <p style="font-size: 16px; margin: 0 0 10px; color: #000000">Nếu nút trên không hoạt động, bạn có thể sao chép và dán liên kết sau vào trình duyệt của mình:</p>
                <p style="font-size: 14px; color: #007bff; word-wrap: break-word;">${resetUrl}</p>
                
                <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 25px 0;">
                
                <p style="font-size: 14px; color: #777777; margin: 0;">Lưu ý: Liên kết này chỉ có hiệu lực trong <strong>15 phút</strong>. Nếu bạn không yêu cầu khôi phục mật khẩu, vui lòng bỏ qua email này.</p>
                </div>
                
                <div style="background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #999999; border-top: 1px solid #e2e6ea;">
                <p style="margin: 0;">Email này được gửi tự động từ hệ thống. Vui lòng không trả lời.</p>
                </div>
            </div>
            </div>
            `,
        });

        return {
            status: 200,
            message: 'Link khôi phục mật khẩu đã được gửi về email',
        };
    }

    async resetPassword(data){
        const { token, newPassword } = data;
        
        if (!token || !newPassword) {
            return {
                status: 400,
                message: "Thiếu token hoặc mật khẩu mới"
            }
        }

        // 1. Giải mã token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.RESET_SECRET);
        } catch (err) {
            return {
                status: 401,
                message: 'Token không hợp lệ hoặc đã hết hạn'
            }
        }
        const { email } = decoded;

        // 2. Kiểm tra user có tồn tại
        const result = await db.query(
            `SELECT email FROM users WHERE email = $1`,
        [email]
        );

        if (result.rowCount === 0) {
            return {
                status: 404,
                message: "Tài khoản không tồn tại"
            }
        }

        // 3. Băm mật khẩu mới
        const hashedPassword = await hashPassword(newPassword)

        // 4. Cập nhật mật khẩu
        await db.query(
            `UPDATE users SET password = $1 WHERE email = $2`,
            [hashedPassword, email]
        );

        return {
            status: 200,
            message: "Reset mật khẩu thành công"
        }
    }
}

const instance = AuthServices.getInstance()
export default instance