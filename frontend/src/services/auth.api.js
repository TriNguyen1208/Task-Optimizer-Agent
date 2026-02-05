import axios from "@/services/axiosInstance.js"
import API_ROUTES from "../../../shared/routesAPIServer";
import { setCredentials, logout, setLoading } from '@/slices/auth.slice';

export const loginUser = (username, password, remember) => async (dispatch) => {
    try {
        const res = await axios.post(API_ROUTES.auth.login, {
            username,
            password,
            remember //True hoặc false
        });

        const user = res.data.user;
        
        localStorage.setItem('user', JSON.stringify(user));
        dispatch(setCredentials({ user }));

        return res.data; // { status, message, user }
    } catch (err) {
        throw err;
    }
};

export const logoutUser = async () => {
    try {
        const res = await axios.post(API_ROUTES.auth.logout);
        return res
    } catch (err) {
        throw err;
    }
}

export const sendResetPassword = (username, email) => async (dispatch) => {
    try {
        const res = await axios.post(API_ROUTES.auth.sendResetPassword, {
            username,
            email
        });
        return res; 
    } catch (err) {
        throw err;
    }
};

export const resetPassword = (token, newPassword) => async (dispatch) => {
    try {
        const res = await axios.patch(API_ROUTES.auth.resetPassword, {
            token,
            newPassword
        });
        return res; // { status, message }
    } catch (err) {
        throw err;
    }
};

export const verifyFromToken = () => async (dispatch) => {
    dispatch(setLoading(true));
    try{
        await axios.get(API_ROUTES.auth.verifyLogin);
        dispatch(setCredentials({
            user: JSON.parse(localStorage.getItem('user')) || null
        }));
    }catch{
        dispatch(logout());
    }finally{
        dispatch(setLoading(false))
    }
}
export const updateProfile = (data) => async (dispatch) => {
    try {
        const res = await axios.patch(API_ROUTES.auth.updateProfile, data);
        const user = res.data?.user;
        
        if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        dispatch(setCredentials({ user }));
        } else {
        console.warn('API không trả về user mới');
        }

    } catch (err) {
        console.error('Cập nhật thông tin người dùng thất bại:', err);
        throw err;
    } finally {
        dispatch(setLoading(false));
    }
};
export const updatePassword = (data) => async (dispatch) => {
    try {
        const res = await axios.patch(API_ROUTES.auth.updatePassword, data);
        const user = res.data?.user;
        
        if (user?.fullname) {
            localStorage.setItem('user', JSON.stringify(user));
            dispatch(setCredentials({ user }));
        } else {
            console.warn('API không trả về user mới');
        }
        return res.data.message; // Trả về thông báo thành công
    } catch (err) {
        console.error('Cập nhật mật khẩu thất bại:', err);
        throw err;
    } finally {
        dispatch(setLoading(false));
    }
};