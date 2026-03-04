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

// const ALL_NAV_LINKS = [
//   // All roles
//   {
//     label: "Dashboard",
//     path: "/admin/dashboard",
//     roles: ["reviewer", "researcher", "admin"],
//     icon: <LayoutDashboard size={20} />,
//   },

//   // Admin sidebar
//   {
//     label: "Reviewers",
//     path: "/admin/dashboard/reviewers",
//     roles: ["admin"],
//     icon: <Users size={20} />,
//   },
//   {
//     label: "Researchers",
//     path: "/dashboard/researchers",
//     roles: ["admin"],
//     icon: <FlaskConical size={20} />,
//   },
//   {
//     label: "Assignments",
//     path: "/dashboard/assignments",
//     roles: ["reviewer", "admin"],
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
//     path: "/dashboard/responses",
//     roles: ["reviewer"],
//     icon: <MessageSquare size={20} />,
//   },
//   {
//     label: "Notifications",
//     path: "/dashboard/notifications",
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

//   // Filter links based on user role
//   const userLinks = ALL_NAV_LINKS.filter((link) =>
//     link.roles.includes(user?.role),
//   );

//   const handleLogout = () => {
//     dispatch(logout());
//     navigate(`/login/${user?.role || "researcher"}`);
//   };

//   // Get the first letter of user's name or email
//   const getInitial = () => {
//     if (user?.fullName) return user.fullName.charAt(0).toUpperCase();
//     if (user?.email) return user.email.charAt(0).toUpperCase();
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
//                   end={link.path === "/dashboard"}
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
//             {user?.profilePicture ? (
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
//               {user?.fullName || user?.email || "User"}
//             </p>
//             <p className="text-blue-200 text-xs capitalize mt-1">
//               {user?.role}
//             </p>
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
} from "lucide-react";
import { logout } from "../../redux/auth/authSlice";

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
    label: "Assignments",
    path: "/admin/dashboard/assignments",
    roles: ["reviewer", "admin"],
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
    navigate(`/login/${user.role}`);
  };

  const getInitial = () => {
    if (user.fullName) return user.fullName.charAt(0).toUpperCase();
    if (user.email) return user.email.charAt(0).toUpperCase();
    return "U";
  };

  return (
    <div className="flex flex-col justify-between h-screen bg-[#003B95] p-6 w-72 text-white">
      {/* Top section */}
      <div>
        <div className="mb-12 mt-4 px-4">
          <h1 className="text-2xl font-bold tracking-tight">BUHREC</h1>
        </div>

        <nav>
          <ul className="space-y-2">
            {userLinks.map((link) => (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  end={link.path === dashboardPath}
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
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-900 font-bold text-lg border-2 border-white/20 overflow-hidden">
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
          <div className="text-sm">
            <p className="font-semibold leading-none">
              {user.fullName || user.email || "User"}
            </p>
            <p className="text-blue-200 text-xs capitalize mt-1">{user.role}</p>
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
  );
};

export default Sidebar;