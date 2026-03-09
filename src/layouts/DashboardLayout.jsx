import { Outlet } from "react-router-dom";
import Sidebar from "../components/core/Sidebar";
import ScrollToTop from "../hooks/ScrollToTop";

const DashboardLayout = () => {
  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <ScrollToTop />
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
