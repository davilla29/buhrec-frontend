import { Outlet } from "react-router-dom";
import Sidebar from "../components/core/Sidebar";

const DashboardLayout = () => {
  return (
    <div className="flex h-screen bg-[#F3F4F6] overflow-hidden">
      <div className="shrink-0">
        <Sidebar />
      </div>
      <main className="flex-1 overflow-auto p-10">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
