import React from "react";

function Header() {
  return (
    <header className="bg-[#003399] text-white py-4 px-8 flex justify-between items-center sticky top-0 z-50">
      <div className="text-xl font-bold tracking-wider">BUHREC</div>
      <nav>
        <ul className="flex gap-8 text-sm font-medium">
          <li className="hover:underline cursor-pointer">Researcher</li>
          <li className="hover:underline cursor-pointer">Reference</li>
          <li className="hover:underline cursor-pointer">Administration</li>
          <li className="hover:underline cursor-pointer">About</li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
