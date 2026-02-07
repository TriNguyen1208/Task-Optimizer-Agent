import {QueryClient, QueryClientProvider} from "@tanstack/react-query"
import { ToastContainer } from 'react-toastify';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/routes/router';
import { SettingProvider } from "./context/setting.context";
import { verifyFromToken } from '@/services/auth.api';
import { useDispatch } from "react-redux";
import { useEffect } from "react";

const queryClient = new QueryClient();

export default function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(verifyFromToken());
  }, [])
  
  return (
    <QueryClientProvider client={queryClient}>
      <SettingProvider>
        <RouterProvider router={router}/>
        <ToastContainer/>
      </SettingProvider>
    </QueryClientProvider>
  )
}
