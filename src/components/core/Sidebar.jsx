// import { useSelector, useDispatch } from "react-redux";
// import { NavLink, useNavigate } from "react-router-dom";
// import {
//   LayoutDashboard,
//   Briefcase,
//   MessageSquare,
//   LogOut,
//   Bell,
//   Users,
//   FileText,
//   CreditCard,
//   FlaskConical,
// } from "lucide-react";
// import { logout } from "../../redux/auth/authSlice";
// import { clearAssignments } from "../../redux/assignment/assignmentSlice";

// const ALL_NAV_LINKS = [
//   // Admin sidebar
//   {
//     label: "Reviewers",
//     path: "/admin/dashboard/reviewers",
//     roles: ["admin"],
//     icon: <Users size={20} />,
//   },
//   {
//     label: "Researchers",
//     path: "/admin/dashboard/researchers",
//     roles: ["admin"],
//     icon: <FlaskConical size={20} />,
//   },
//   {
//     label: "Assignments",
//     path: "/admin/dashboard/assignments",
//     roles: ["admin"],
//     icon: <Briefcase size={20} />,
//   },
//   {
//     label: "Payments",
//     path: "/admin/dashboard/payments",
//     roles: ["admin"],
//     icon: <CreditCard size={20} />,
//   },

//   // Reviewer sidebar
//   {
//     label: "Responses",
//     path: "/reviewer/dashboard/responses",
//     roles: ["reviewer"],
//     icon: <MessageSquare size={20} />,
//   },
//   {
//     label: "Assignments",
//     path: "/reviewer/dashboard/assignments",
//     roles: ["reviewer"],
//     icon: <Briefcase size={20} />,
//   },
//   {
//     label: "Notifications",
//     path: "/reviewer/dashboard/notifications",
//     roles: ["reviewer"],
//     icon: <Bell size={20} />,
//   },

//   // Researcher sidebar
//   {
//     label: "Proposals",
//     path: "/researcher/dashboard/my-proposals",
//     roles: ["researcher"],
//     icon: <FileText size={20} />,
//   },
// ];

// const Sidebar = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const user = useSelector((state) => state.auth.user);

//   // If no user yet (edge case), prevent crash
//   if (!user) return null;

//   // Dynamic dashboard path
//   const dashboardPath = `/${user.role}/dashboard`;

//   // Add dynamic dashboard link at the top
//   const dynamicLinks = [
//     {
//       label: "Dashboard",
//       path: dashboardPath,
//       roles: ["reviewer", "researcher", "admin"],
//       icon: <LayoutDashboard size={20} />,
//     },
//     ...ALL_NAV_LINKS,
//   ];

//   // Filter links based on user role
//   const userLinks = dynamicLinks.filter((link) =>
//     link.roles.includes(user.role),
//   );

//   const handleLogout = () => {
//     dispatch(logout());
//     dispatch(clearAssignments());
//     navigate(`/login/${user.role}`);
//   };

//   const getInitial = () => {
//     if (user.fullName) return user.fullName.charAt(0).toUpperCase();
//     if (user.email) return user.email.charAt(0).toUpperCase();
//     return "U";
//   };

//   return (
//     <div className="flex flex-col justify-between h-screen bg-[#003B95] p-6 w-72 text-white">
//       {/* Top section */}
//       <div>
//         <div className="mb-12 mt-4 px-4">
//           <h1 className="text-2xl font-bold tracking-tight">BUHREC</h1>
//         </div>

//         <nav>
//           <ul className="space-y-2">
//             {userLinks.map((link) => (
//               <li key={link.path}>
//                 <NavLink
//                   to={link.path}
//                   end={link.path === dashboardPath}
//                   className={({ isActive }) =>
//                     `flex items-center space-x-4 py-3 px-6 rounded-lg transition-all duration-200 ${
//                       isActive
//                         ? "bg-[#001F4D] text-white shadow-inner"
//                         : "text-blue-100 hover:bg-blue-800"
//                     }`
//                   }
//                 >
//                   {link.icon}
//                   <span className="font-medium">{link.label}</span>
//                 </NavLink>
//               </li>
//             ))}
//           </ul>
//         </nav>
//       </div>

//       {/* Bottom section */}
//       <div className="space-y-6">
//         {/* User Profile */}
//         <div className="flex items-center space-x-3 px-4">
//           <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-900 font-bold text-lg border-2 border-white/20 overflow-hidden">
//             {user.profilePicture ? (
//               <img
//                 src={user.profilePicture}
//                 alt="Profile"
//                 className="w-full h-full object-cover"
//               />
//             ) : (
//               getInitial()
//             )}
//           </div>
//           <div className="text-sm">
//             <p className="font-semibold leading-none">
//               {user.fullName || user.email || "User"}
//             </p>
//             <p className="text-blue-200 text-xs capitalize mt-1">{user.role}</p>
//           </div>
//         </div>

//         {/* Logout Button */}
//         <button
//           onClick={handleLogout}
//           className="flex cursor-pointer items-center justify-center space-x-2 w-full bg-[#B91C1C] hover:bg-red-800 text-white py-3 px-4 rounded-lg font-bold transition-all active:scale-95"
//         >
//           <LogOut size={20} />
//           <span>Log out</span>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  MessageSquare,
  LogOut,
  Bell,
  Users,
  FileText,
  CreditCard,
  FlaskConical,
  Menu,
  X,
} from "lucide-react";
import { logout } from "../../redux/auth/authSlice";
import { clearAssignments } from "../../redux/assignment/assignmentSlice";

const ALL_NAV_LINKS = [
  // Admin sidebar
  {
    label: "Reviewers",
    path: "/admin/dashboard/reviewers",
    roles: ["admin"],
    icon: <Users size={20} />,
  },
  {
    label: "Researchers",
    path: "/admin/dashboard/researchers",
    roles: ["admin"],
    icon: <FlaskConical size={20} />,
  },
  {
    label: "All Users",
    path: "/admin/dashboard/all-users",
    roles: ["admin"],
    icon: <Users size={20} />,
  },
  {
    label: "Assignments",
    path: "/admin/dashboard/assignments",
    roles: ["admin"],
    icon: <Briefcase size={20} />,
  },
  {
    label: "Payments",
    path: "/admin/dashboard/payments",
    roles: ["admin"],
    icon: <CreditCard size={20} />,
  },

  // Reviewer sidebar
  {
    label: "Responses",
    path: "/reviewer/dashboard/responses",
    roles: ["reviewer"],
    icon: <MessageSquare size={20} />,
  },
  {
    label: "Assignments",
    path: "/reviewer/dashboard/assignments",
    roles: ["reviewer"],
    icon: <Briefcase size={20} />,
  },
  {
    label: "Notifications",
    path: "/reviewer/dashboard/notifications",
    roles: ["reviewer"],
    icon: <Bell size={20} />,
  },

  // Researcher sidebar
  {
    label: "Proposals",
    path: "/researcher/dashboard/my-proposals",
    roles: ["researcher"],
    icon: <FileText size={20} />,
  },
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  // If no user yet (edge case), prevent crash
  if (!user) return null;

  // Dynamic dashboard path
  const dashboardPath = `/${user.role}/dashboard`;

  // Add dynamic dashboard link at the top
  const dynamicLinks = [
    {
      label: "Dashboard",
      path: dashboardPath,
      roles: ["reviewer", "researcher", "admin"],
      icon: <LayoutDashboard size={20} />,
    },
    ...ALL_NAV_LINKS,
  ];

  // Filter links based on user role
  const userLinks = dynamicLinks.filter((link) =>
    link.roles.includes(user.role),
  );

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearAssignments());
    navigate(`/login/${user.role}`);
  };

  const getInitial = () => {
    if (user.fullName) return user.fullName.charAt(0).toUpperCase();
    if (user.email) return user.email.charAt(0).toUpperCase();
    return "U";
  };

  // Close sidebar on mobile after clicking a link
  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-4 left-4 z-40 p-2 bg-[#003B95] text-white rounded-lg shadow-md hover:bg-blue-800 transition-colors"
        aria-label="Open Menu"
      >
        <Menu size={24} />
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <div
        className={`fixed inset-y-0 left-0 z-50 flex flex-col justify-between h-screen bg-[#003B95] p-6 w-72 text-white transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        {/* Top section */}
        <div>
          <div className="flex items-center justify-between mb-12 mt-4 px-4">
            <h1 className="text-2xl font-bold tracking-tight">BUHREC</h1>
            {/* Mobile Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="md:hidden text-white hover:text-gray-300 transition-colors"
              aria-label="Close Menu"
            >
              <X size={24} />
            </button>
          </div>

          <nav>
            <ul className="space-y-2">
              {userLinks.map((link) => (
                <li key={link.path}>
                  <NavLink
                    to={link.path}
                    end={link.path === dashboardPath}
                    onClick={handleLinkClick}
                    className={({ isActive }) =>
                      `flex items-center space-x-4 py-3 px-6 rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-[#001F4D] text-white shadow-inner"
                          : "text-blue-100 hover:bg-blue-800"
                      }`
                    }
                  >
                    {link.icon}
                    <span className="font-medium">{link.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom section */}
        <div className="space-y-6">
          {/* User Profile */}
          <div className="flex items-center space-x-3 px-4">
            <div className="w-10 h-10 shrink-0 rounded-full bg-white flex items-center justify-center text-gray-900 font-bold text-lg border-2 border-white/20 overflow-hidden">
              {user.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                getInitial()
              )}
            </div>
            <div className="text-sm overflow-hidden">
              <p className="font-semibold leading-none truncate">
                {user.fullName || user.email || "User"}
              </p>
              <p className="text-blue-200 text-xs capitalize mt-1 truncate">
                {user.role}
              </p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex cursor-pointer items-center justify-center space-x-2 w-full bg-[#B91C1C] hover:bg-red-800 text-white py-3 px-4 rounded-lg font-bold transition-all active:scale-95"
          >
            <LogOut size={20} />
            <span>Log out</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;