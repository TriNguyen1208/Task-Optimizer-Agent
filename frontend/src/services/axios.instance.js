import axios from "axios";
import {API_ROUTES} from "@/constant/constant";


const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
    withCredentials: true, // Gửi cookie (accessToken/refreshToken) kèm theo request
    headers: { "Content-Type": "application/json" }
});

// Tự động gọi refresh token nếu accessToken hết hạn
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        console.log("Mã lỗi trả về từ Server:", error.response?.status);
        console.log("Dữ liệu lỗi:", error.response?.data);
        // accessToken hết hạn, còn refreshToken
        if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // const res = await axios.post(API_ROUTES.auth.refreshToken);
                const res = await axios.post(
                    `${API_ROUTES.auth.refreshToken}`,
                    {},
                    { withCredentials: true }
                );
                if (res.status === 200) {
                    return api(originalRequest);
                }
            } catch (refreshError) {
                if (window.location.pathname !== '/login') {
                    console.warn('Token hết hạn, chuyển hướng về trang đăng nhập.');
                    window.location.href = '/login';
                }
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
