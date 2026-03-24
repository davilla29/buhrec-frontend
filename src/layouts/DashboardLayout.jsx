import { Outlet } from "react-router-dom";
import Sidebar from "../components/core/Sidebar";
import ScrollToTop from "../hooks/ScrollToTop";

const DashboardLayout = () => {
  return (
    <div className="flex h-screen w-full bg-white overflow-hidden">
      <div className=" md:block shrink-0 h-full">
        <Sidebar />
      </div>

      <ScrollToTop />
      <main
        id="dashboard-scroll"
        className="flex-1 overflow-y-auto p-2 mt-10 sm:mt-0 sm:p-6 lg:p-10 w-full relative"
      >
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
