// import { Outlet } from "react-router-dom";
// import Sidebar from "../components/core/Sidebar";
// import ScrollToTop from "../hooks/ScrollToTop";

// const DashboardLayout = () => {
//   return (
//     <div className="flex h-screen bg-white overflow-hidden">
//       <ScrollToTop />
//       <div className="shrink-0">
//         <Sidebar />
//       </div>
//       <main className="flex-1 overflow-auto p-10">
//         <Outlet />
//       </main>
//     </div>
//   );
// };

// export default DashboardLayout;

import { Outlet } from "react-router-dom";
import Sidebar from "../components/core/Sidebar";
import ScrollToTop from "../hooks/ScrollToTop";

const DashboardLayout = () => {
  return (
    <div className="flex h-screen w-full bg-white overflow-hidden">
      <ScrollToTop />

      {/* Sidebar: Hidden on mobile screens, visible on tablet/desktop */}
      <div className=" md:block shrink-0 h-full">
        <Sidebar />
      </div>

      {/* Main Content: Responsive padding scales up with screen size */}
      <main className="flex-1 overflow-y-auto p-2 mt-10 sm:mt-0 sm:p-6 lg:p-10 w-full relative">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;