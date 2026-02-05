import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '@/slices/auth.slice.js';
import { useNavigate } from 'react-router-dom';

export default function AuthGate({ children }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        const user = localStorage.getItem('user');
        if (!user) {
            dispatch(logout());
            navigate('/', { replace: true });
        }
    }, []);
    return <>{children}</>;
}
