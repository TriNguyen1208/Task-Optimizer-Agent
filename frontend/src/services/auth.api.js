import axios from "@/services/axios.instance"
import {API_ROUTES} from "@/constant/constant";
import { setCredentials, logout, setLoading } from '@/slices/auth.slice';

//Login user
export const loginUser = (email, password) => async (dispatch) => {
    try {
        console.log(API_ROUTES.auth.login)
        const res = await axios.post(API_ROUTES.auth.login, {
            email,
            password,
        });

        const user = res.data.user;
        
        localStorage.setItem('user', JSON.stringify(user));
        dispatch(setCredentials({ user }));

        return res.data; 
    } catch (err) {
        throw err;
    }
};

//Signup user
export const signupUser = (email, password) => async (dispatch) => {
    try{
        console.log(email, password)
        const res = await axios.post(API_ROUTES.auth.signup, {
            email, 
            password
        })
        const user = res.data.user
        localStorage.setItem('user', JSON.stringify(user))
        dispatch(setCredentials({user}))
        return res.data
    }catch(err){
        throw err
    }
}

//Logout user
export const logoutUser = async () => {
    try {
        const res = await axios.post(API_ROUTES.auth.logout);
        return res
    } catch (err) {
        throw err;
    }
}

//Send reset password
export const sendResetPassword = async (username, email) => {
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

export const resetPassword = async (token, newPassword) => {
    try {
        const res = await axios.patch(API_ROUTES.auth.resetPassword, {
            token,
            newPassword
        });
        return res;
    } catch (err) {
        throw err;
    }
};

//Verify token.
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

//Update profile
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

//Update password
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
        return res.data.message; 
    } catch (err) {
        console.error('Cập nhật mật khẩu thất bại:', err);
        throw err;
    } finally {
        dispatch(setLoading(false));
    }
};