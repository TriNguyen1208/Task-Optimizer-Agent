const publicRoutes = [
  '/api/crud/auth/login',
  '/api/crud/auth/signup',
  '/api/crud/auth/refresh-token',
  '/api/crud/auth/logout',
];

const authenticateToken = (req, res, next) => {
    if (publicRoutes.includes(req.path)) {
      return next();
    }

    const accessToken = req.cookies?.accessToken;

    if (!accessToken) {
      return res.status(401).json({ message: 'Thiếu access token trong cookie' });
    }

    req.accessToken = accessToken;

    next();
};

export {authenticateToken}