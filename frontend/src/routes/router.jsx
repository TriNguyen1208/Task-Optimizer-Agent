import Schedule from "@/pages/Schedules";
import Setting from "@/pages/Setting";
import Statistics from "@/pages/Statistics";
import Task from "@/pages/Tasks";
import DefaultLayout from "@/layouts/default.layouts";
import PageNotFound from "@/pages/PageNotFound";
import { createBrowserRouter } from "react-router-dom";
import AuthGate from "@/components/AuthGate";
import ProtectedRoute from "./protected.routes";
import Profile from "@/pages/Profile";
import Login from "@/pages/Login";
import { AuthProvider } from "@/context/auth.context";

export const router = createBrowserRouter([
    {
        path: "/",
        element:
            <DefaultLayout/>,
        children: [
            {
                path: "/",
                element: <Task/>
            },
            {
                path: "/schedule",
                element: <Schedule/>
            },
            {
                path: "/statistics",
                element: <Statistics/>
            },
            {
                path: "/settings",
                element: <Setting/>
            },
            {
                path: "/profile",
                element: <AuthProvider><Profile/></AuthProvider>
            },
        ]
    },
    {
        path: "/login",
        element: <AuthProvider><Login/></AuthProvider>
    },
    {
        path: "*",
        element: <PageNotFound />,
    },
])