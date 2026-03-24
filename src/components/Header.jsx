import React, { useState } from "react";
import { useNavigate, Link, NavLink } from "react-router-dom";
import { ChevronDown, Menu, X } from "lucide-react";

function Header() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const loginLinks = [
    { label: "Researchers", path: "/login/researcher" },
    { label: "Reviewers", path: "/login/reviewer" },
    { label: "Administrator", path: "/login/admin" },
  ];

  const aboutLinks = [
    { label: "About Us", path: "/about-us" },
    { label: "Our Objective", path: "/objectives" },
    { label: "NHREC Mission", path: "/nhrec-mission" },
    { label: "Contact Us", path: "/contact" },
    { label: "SOPs and Guidelines", path: "/sops-guidelines" },
  ];

  const closeMenus = () => {
    setIsAboutOpen(false);
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-[#003B95] sticky top-0 text-white z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          <Link
            to="/"
            className="shrink-0 flex items-center"
            onClick={closeMenus}
          >
            <span className="text-xl sm:text-2xl font-black tracking-tighter">
              BUHREC
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {loginLinks.map((link) => (
              <NavLink
                key={link.label}
                to={link.path}
                className="text-sm font-bold hover:text-blue-200 transition-colors uppercase tracking-wider"
              >
                {link.label}
              </NavLink>
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
                    <Link
                      key={item.label}
                      to={item.path}
                      onClick={closeMenus}
                      className="block px-6 py-4 text-xs font-black uppercase tracking-widest hover:bg-gray-50 transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#002D72] border-t border-white/10 px-4 pt-2 pb-6 space-y-2">
          {loginLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              onClick={closeMenus}
              className="block py-3 text-sm font-bold uppercase tracking-wider"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-white/10">
            {aboutLinks.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                onClick={closeMenus}
                className="block px-4 py-3 text-sm font-semibold uppercase tracking-widest"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
export default Header;
