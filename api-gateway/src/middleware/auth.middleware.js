const publicRoutes = [
  '/api/crud/auth/login',
  '/api/crud/auth/signup',
  '/api/crud/auth/refresh-token',
];

const authenticateToken = (req, res, next) => {
    console.log(req.path)
    // 1. Bỏ qua các route công khai
    if (publicRoutes.includes(req.path)) {
      return next();
    }

    // 2. Lấy accessToken từ req.cookies (đã được cookie-parser xử lý)
    const accessToken = req.cookies?.accessToken;
    // 3. Kiểm tra nếu không có token
    if (!accessToken) {
      return res.status(401).json({ message: 'Thiếu access token trong cookie' });
    }

    // 4. Gán token vào request để các middleware sau sử dụng
    req.accessToken = accessToken;

    next();
};

export {authenticateToken}