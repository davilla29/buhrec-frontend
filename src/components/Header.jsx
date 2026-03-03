import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="bg-[#003399] text-white sticky top-0 z-50">
      <div className="flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <div
          className="text-xl font-bold tracking-wider cursor-pointer"
          onClick={() => navigate("/")}
        >
          BUHREC
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-8 text-sm font-medium">
          <button
          
            onClick={() => navigate("/login/researcher")}
            className="hover:underline cursor-pointer"
          >
            Researcher
          </button>

          <button
          
            onClick={() => navigate("/login/reviewer")}
            className="hover:underline cursor-pointer"
          >
            Reviewer
          </button>

          <button
          
            onClick={() => navigate("/login/admin")}
            className="hover:underline cursor-pointer"
          >
            Administrator
          </button>

          <button
            onClick={() => navigate("/about")}
            className="hover:underline"
          >
            About
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden flex flex-col gap-4 px-6 pb-4 text-sm font-medium">
          <button
            className="cursor-pointer"
            onClick={() => navigate("/login/researcher")}
          >
            Researcher
          </button>

          <button
            className="cursor-pointer"
            onClick={() => navigate("/login/reviewer")}
          >
            Reviewer
          </button>

          <button
            className="cursor-pointer"
            onClick={() => navigate("/login/admin")}
          >
            Administrator
          </button>

          <button onClick={() => navigate("/about")}>About</button>
        </div>
      )}
    </header>
  );
}

export default Header;
