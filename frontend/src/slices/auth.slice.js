import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    user: (() => {
        try {
            return JSON.parse(localStorage.getItem('user'));
        } catch {
            return null;
        }
    })(),
    isAuthenticated: false,
    loading: true
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const user = action.payload.user || null;
            state.user = user;
            state.isAuthenticated = true;
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        }
    }
})
export const {setCredentials, logout, setLoading} = authSlice.actions;
export default authSlice.reducer;