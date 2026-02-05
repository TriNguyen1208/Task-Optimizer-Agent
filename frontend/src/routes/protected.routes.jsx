import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

function ProtectedRoute({children}) {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const isLoading = useSelector((state) => state.auth.loading);
    const location = useLocation();
    if(isLoading){
        return null
    }
    if(!isAuthenticated){
        return <Navigate to='/' replace state={{ from: location }}/>
    }
    return <>{children}</>;
}
export default ProtectedRoute