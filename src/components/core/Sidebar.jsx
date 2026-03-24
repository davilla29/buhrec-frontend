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
  Settings,
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
    label: "Settings",
    path: "/reviewer/dashboard/settings",
    roles: ["reviewer"],
    icon: <Settings size={20} />,
  },

  // Researcher sidebar
  {
    label: "Proposals",
    path: "/researcher/dashboard/my-proposals",
    roles: ["researcher"],
    icon: <FileText size={20} />,
  },

  {
    label: "Settings",
    path: "/researcher/dashboard/settings",
    roles: ["researcher"],
    icon: <Settings size={20} />,
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
  const notificationPath = `/${user.role}/dashboard/notifications`;

  // Add dynamic dashboard link at the top
  const dynamicLinks = [
    {
      label: "Dashboard",
      path: dashboardPath,
      roles: ["reviewer", "researcher", "admin"],
      icon: <LayoutDashboard size={20} />,
    },

    ...ALL_NAV_LINKS,

    {
      label: "Notifications",
      path: notificationPath,
      roles: ["reviewer", "researcher", "admin"],
      icon: <Bell size={20} />,
    },
  ];

  // Filter links based on user role
  const userLinks = dynamicLinks.filter((link) =>
    link.roles.includes(user.role),
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
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
      {/* Mobile Menu Toggle Button (Visible only on small screens) */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-4 left-4 z-40 p-2 bg-[#003B95] text-white rounded-lg shadow-md hover:bg-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
        aria-label="Open Menu"
      >
        <Menu size={24} />
      </button>

      {/* Mobile Overlay Background */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <div
        className={`fixed inset-y-0 left-0 z-50 flex flex-col h-screen w-72 bg-[#003B95] text-white transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        {/* Top section: Header & Navigation */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-8 md:py-10 shrink-0">
            <h1 className="text-2xl font-bold tracking-tight">BUHREC</h1>
            {/* Mobile Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="md:hidden p-1 text-white hover:bg-white/10 rounded-full transition-colors focus:outline-none"
              aria-label="Close Menu"
            >
              <X size={24} />
            </button>
          </div>

          {/* Navigation Links (Scrollable on small screens) */}
          <nav className="flex-1 overflow-y-auto px-4 pb-4 no-scrollbar">
            <ul className="space-y-2">
              {userLinks.map((link) => (
                <li key={link.path}>
                  <NavLink
                    to={link.path}
                    end={link.path === dashboardPath}
                    onClick={handleLinkClick}
                    className={({ isActive }) =>
                      `flex items-center space-x-4 py-3 px-4 rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-[#001F4D] text-white shadow-inner font-semibold"
                          : "text-blue-100 hover:bg-blue-800 hover:text-white"
                      }`
                    }
                  >
                    {link.icon}
                    <span className="font-medium text-sm">{link.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom section: Profile & Logout (Fixed to bottom) */}
        <div className="shrink-0 p-4 border-t border-white/10 bg-[#003B95]">
          <div className="space-y-4">
            {/* User Profile */}
            <div className="flex items-center space-x-3 px-2">
              <div className="w-10 h-10 shrink-0 rounded-full bg-white flex items-center justify-center text-[#003B95] font-bold text-lg border-2 border-white/20 overflow-hidden shadow-sm">
                {user.photoUrl ? (
                  <img
                    src={user.photoUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  getInitial()
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm leading-tight truncate text-white">
                  {user.fullName || user.email || "User"}
                </p>
                <p className="text-blue-200 text-xs capitalize mt-0.5 truncate">
                  {user.role}
                </p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center cursor-pointer justify-center space-x-2 w-full bg-[#B91C1C] hover:bg-red-800 text-white py-2.5 px-4 rounded-lg font-bold text-sm transition-all active:scale-95 shadow-sm"
            >
              <LogOut size={18} />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
