// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// function Header() {
//   const [isOpen, setIsOpen] = useState(false);
//   const navigate = useNavigate();

//   return (
//     <header className="bg-[#003399] text-white sticky top-0 z-50">
//       <div className="flex justify-between items-center px-6 py-4">
//         {/* Logo */}
//         <div
//           className="text-xl font-bold tracking-wider cursor-pointer"
//           onClick={() => navigate("/")}
//         >
//           BUHREC
//         </div>

//         {/* Desktop Menu */}
//         <nav className="hidden md:flex gap-8 text-sm font-medium">
//           <button

//             onClick={() => navigate("/login/researcher")}
//             className="hover:underline cursor-pointer"
//           >
//             Researcher
//           </button>

//           <button

//             onClick={() => navigate("/login/reviewer")}
//             className="hover:underline cursor-pointer"
//           >
//             Reviewer
//           </button>

//           <button

//             onClick={() => navigate("/login/admin")}
//             className="hover:underline cursor-pointer"
//           >
//             Administrator
//           </button>

//           <button
//             onClick={() => navigate("/about")}
//             className="hover:underline"
//           >
//             About
//           </button>
//         </nav>

//         {/* Mobile Menu Button */}
//         <button
//           className="md:hidden text-2xl"
//           onClick={() => setIsOpen(!isOpen)}
//         >
//           ☰
//         </button>
//       </div>

//       {/* Mobile Dropdown */}
//       {isOpen && (
//         <div className="md:hidden flex flex-col gap-4 px-6 pb-4 text-sm font-medium">
//           <button
//             className="cursor-pointer"
//             onClick={() => navigate("/login/researcher")}
//           >
//             Researcher
//           </button>

//           <button
//             className="cursor-pointer"
//             onClick={() => navigate("/login/reviewer")}
//           >
//             Reviewer
//           </button>

//           <button
//             className="cursor-pointer"
//             onClick={() => navigate("/login/admin")}
//           >
//             Administrator
//           </button>

//           <button onClick={() => navigate("/about")}>About</button>
//         </div>
//       )}
//     </header>
//   );
// }

// export default Header;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Menu, X } from "lucide-react";

function Header({ setCurrentView }) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const loginLinks = [
    { label: "Researchers", path: "/login/researcher" },
    { label: "Reviewers", path: "/login/reviewer" },
    { label: "Administrator", path: "/login/admin" },
  ];

  const aboutLinks = [
    { label: "About Us", view: "about-us" },
    { label: "Our Objective", view: "objectives" },
    { label: "NHREC Mission", view: "nhrec-mission" },
    { label: "Contact Us", view: "contact" },
    { label: "SOPs and Guidelines", view: "sops" },
  ];

  const handleNavClick = (view) => {
    setCurrentView(view);
    setIsAboutOpen(false);
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  };

  return (
    <header className="left-0 right-0 bg-[#003B95] sticky top-0 text-white z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <div
            className="shrink-0 flex items-center cursor-pointer"
            onClick={() => navigate("/")}
          >
            <span className="text-xl sm:text-2xl font-black tracking-tighter">
              BUHREC
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {loginLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => navigate(link.path)}
                className="text-sm font-bold hover:text-blue-200 transition-colors uppercase tracking-wider"
              >
                {link.label}
              </button>
            ))}

            <div className="relative">
              <button
                onClick={() => setIsAboutOpen(!isAboutOpen)}
                className="flex items-center space-x-1 text-sm font-bold hover:text-blue-200 transition-colors uppercase tracking-wider"
              >
                <span>About</span>
                <ChevronDown
                  size={14}
                  className={`transition-transform ${isAboutOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isAboutOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl py-2 text-gray-800 z-50 border border-gray-100 overflow-hidden">
                  {aboutLinks.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => handleNavClick(item.view)}
                      className="w-full text-left px-6 py-4 text-xs font-black uppercase tracking-widest hover:bg-gray-50 transition-colors"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#002D72] border-t border-white/10 px-4 pt-2 pb-6 space-y-2">
          {loginLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => {
                navigate(link.path);
                setIsMenuOpen(false);
              }}
              className="block w-full text-left py-3 text-sm font-bold uppercase tracking-wider"
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2 border-t border-white/10">
            {aboutLinks.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.view)}
                className="block w-full text-left px-4 py-3 text-sm font-semibold uppercase tracking-widest"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
