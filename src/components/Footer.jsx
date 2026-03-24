import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-white py-12 sm:py-20 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-24 text-center md:text-left">
        <div className="space-y-6">
          <h3 className="text-2xl font-black tracking-tighter">BUHREC</h3>
          <p className="text-gray-400 text-sm font-medium">
            Babcock University, Ilishan-Remo, Ogun State, Nigeria
            <br />
            Office: Room 109, 1st floor SAT Building
            <br />
            Phone: 09058096760
            <br />
            Email:{" "}
            <a
              href="mailto:buhrec@gmail.com"
              className="underline hover:text-white"
            >
              buhrec@gmail.com
            </a>
          </p>
        </div>
        <div className="flex flex-col justify-end items-center md:items-end space-y-6">
          <div className="flex flex-wrap justify-center md:justify-end gap-6">
            {[
              { label: "About", path: "/about-us" },
              { label: "Objectives", path: "/objectives" },
              { label: "Guidelines", path: "/sops-guidelines" },
              { label: "Contact", path: "/contact" },
            ].map((item, idx) => (
              <Link
                key={idx}
                to={item.path}
                className="text-xs font-black text-gray-500 hover:text-white uppercase tracking-widest transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest opacity-60">
            © 2026 Babcock University BUHREC
          </p>
        </div>
      </div>
    </footer>
  );
}
export default Footer;
