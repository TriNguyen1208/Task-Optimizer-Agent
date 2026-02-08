import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
dotenv.config({ path: '../.env' });

const { ACCESS_SECRET } = process.env;

if (!ACCESS_SECRET) {
    throw new Error('ACCESS_SECRET chưa được thiết lập');
}

const authenticateToken = (req, res, next) => {
    const { accessToken, refreshToken } = req.cookies;
    if (!accessToken && !refreshToken) return res.status(401).json({ message: 'Thiếu token' });

    jwt.verify(accessToken, ACCESS_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Token không hợp lệ hoặc đã hết hạn' }); 

        req.user = user; 
        next();
    });
};

export { authenticateToken };
