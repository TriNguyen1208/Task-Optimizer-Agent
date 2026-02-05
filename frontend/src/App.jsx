import {QueryClient, QueryClientProvider} from "@tanstack/react-query"
import { ToastContainer } from 'react-toastify';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/routes/router';
import { ThemeProvider } from "./context/theme.context";
// import { verifyFromToken } from './services/auth.api';
const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <RouterProvider router={router}/>
        <ToastContainer/>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
