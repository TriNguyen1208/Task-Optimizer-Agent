import axios from "axios";
import API_ROUTES from "../../../shared/routesAPIServer";


const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
    withCredentials: true,
    headers: { "Content-Type": "application/json" }
});

// Tự động gọi refresh token nếu accessToken hết hạn
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // accessToken hết hạn, còn refreshToken
        if (error.response?.status === 403 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const res = await api.post(API_ROUTES.auth.refreshToken);

                if (res.status === 200) {
                    return api(originalRequest);
                }
            } catch {
                window.location.href = '/dang-nhap';
            }
        }

        // accessToken và refreshToken hết hạn
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            if (window.location.pathname !== '/dang-nhap') {
                console.warn('Token hết hạn, chuyển hướng về trang đăng nhập.');
                window.location.href = '/dang-nhap';
            }
        }

        return Promise.reject(error);
    }
);

export default api;
