// import React from "react";

// function Footer() {
//   return (
//     <footer className="bg-[#333333] text-white py-12 px-10 md:px-20">
//       <div className="max-w-6xl mx-auto">
//         <h2 className="text-2xl font-bold mb-4">BUHREC</h2>
//         <div className="space-y-1 text-sm text-gray-300">
//           <p>Babcock University, Ilishan-Remo, Ogun State, Nigeria</p>
//           <p>Office: Room 109, 1st floor SAT Building.</p>
//           <p>Phone: 03036516700</p>
//           <p>
//             Email:{" "}
//             <span className="hover:text-white cursor-pointer">
//               buhrec@gmail.com
//             </span>
//             ,
//             <span className="hover:text-white cursor-pointer ml-1">
//               buhrec@babcock.edu.ng
//             </span>
//           </p>
//         </div>
//       </div>
//     </footer>
//   );
// }

// export default Footer;

import React from "react";

function Footer({ setCurrentView }) {
  return (
    <footer className="bg-[#1A1A1A] text-white py-12 sm:py-20 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-24 text-center md:text-left">
        <div className="space-y-6">
          <h3 className="text-2xl font-black tracking-tighter">BUHREC</h3>
          <p className="text-gray-400 text-sm font-medium max-w-md mx-auto md:mx-0">
            Babcock University, Ilishan-Remo, Ogun State, Nigeria
            <br /> Office: Room 109, 1st floor SAT Building,
            <br /> Phone: 09058096760
            <br /> Email:{" "}
            <a
              href="mailto:buhrec@gmail.com"
              className="underline hover:text-white transition-colors"
            >
              buhrec@gmail.com
            </a>
          </p>
        </div>
        <div className="flex flex-col justify-end items-center md:items-end space-y-6">
          <div className="flex flex-wrap justify-center md:justify-end gap-6">
            {[
              { label: "About", view: "about-us" },
              { label: "Objectives", view: "objectives" },
              { label: "Guidelines", view: "sops" },
              { label: "Contact", view: "contact" },
            ].map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentView(item.view);
                  window.scrollTo(0, 0);
                }}
                className="text-xs cursor-pointer font-black text-gray-500 hover:text-white uppercase tracking-widest transition-colors"
              >
                {item.label}
              </button>
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
