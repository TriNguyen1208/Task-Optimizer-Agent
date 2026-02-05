import Sidebar from "@/components/Sidebar";
import { Outlet } from "react-router-dom";

const DefaultLayout = () => {
  return (
    <div className="flex h-screen bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Outlet/>
      </div>
      
    </div>
  );
};
export default DefaultLayout