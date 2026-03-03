import React from "react";

function Footer() {
  return (
    <footer className="bg-[#333333] text-white py-12 px-10 md:px-20">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">BUHREC</h2>
        <div className="space-y-1 text-sm text-gray-300">
          <p>Babcock University, Ilishan-Remo, Ogun State, Nigeria</p>
          <p>Office: Room 109, 1st floor SAT Building.</p>
          <p>Phone: 03036516700</p>
          <p>
            Email:{" "}
            <span className="hover:text-white cursor-pointer">
              buhrec@gmail.com
            </span>
            ,
            <span className="hover:text-white cursor-pointer ml-1">
              buhrec@babcock.edu.ng
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
