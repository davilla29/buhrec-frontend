import React from "react";
import { useNavigate } from "react-router-dom";
import Objective from "../assets/images/objective.jpg";
import Clearance from "../assets/images/clearance.jpg";
import nhrec from "../assets/images/nhrec.jpg";

function Home() {
  const navigate = useNavigate();

  return (
    <main className="w-full">
      {/* Hero */}
      <section
        className="relative h-[60vh] flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80')`,
        }}
      >
        <h1 className="text-white text-3xl md:text-5xl font-black text-center px-4 uppercase tracking-tight">
          Babcock University Health Research <br /> Ethics Committee (BUHREC)
        </h1>
      </section>

      {/* Objective Preview */}
      <section className="py-16 px-6 md:px-20 grid md:grid-cols-2 gap-12 items-center bg-white">
        <img
          src={Objective}
          alt="Objective"
          className="rounded-2xl shadow-xl w-full h-80 object-cover"
        />
        <div>
          <h2 className="text-2xl font-black text-[#003B95] mb-4 uppercase tracking-widest">
            Our Objective
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6 font-medium">
            The main objective of BUHREC is to enhance, uphold and ensure that
            the quality of researches which emanate from Babcock University are
            of utmost standards...
          </p>
          <button
            onClick={() => navigate("/objectives")}
            className="bg-[#003B95] text-white px-8 py-3 rounded-md font-black text-xs uppercase tracking-widest hover:bg-blue-900 transition-all"
          >
            View Full Objective
          </button>
        </div>
      </section>

      {/* Mission Preview */}
      <section className="py-16 px-6 md:px-20 grid md:grid-cols-2 gap-12 items-center bg-[#003B95] text-white">
        <div className="order-2 md:order-1">
          <h2 className="text-2xl font-black mb-4 uppercase tracking-widest">
            NHREC MISSION
          </h2>
          <p className="leading-relaxed mb-6 font-medium opacity-90">
            BUHREC upholds and promotes the mission of the National Health
            Research Ethics Committee (NHREC).
          </p>
          <button
            onClick={() => navigate("/nhrec-mission")}
            className="bg-white text-[#003B95] px-8 py-3 rounded-md font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all"
          >
            View Full Mission
          </button>
        </div>
        <div className="order-1 md:order-2 flex justify-center">
          <img
            src={nhrec}
            alt="nhrec_logo"
            className="bg-white p-6 rounded-2xl shadow-xl w-64 h-64 object-contain"
          />
        </div>
      </section>

      {/* Requirements Preview */}
      <section className="py-16 px-6 md:px-20 grid md:grid-cols-2 gap-12 items-center bg-white">
        <img
          src={Clearance}
          alt="Clearance"
          className="rounded-2xl shadow-xl w-full h-80 object-cover"
        />
        <div>
          <h2 className="text-2xl font-black text-[#003B95] mb-4 uppercase tracking-widest">
            Ethical Clearance
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6 font-medium">
            All BSc, MSc, MPhil, PhD, PGD and Independent research projects must
            obtain ethical clearance before commencement.
          </p>
          <button
            onClick={() => navigate("/sops-guidelines")}
            className="bg-[#003B95] text-white px-8 py-3 rounded-md font-black text-xs uppercase tracking-widest hover:bg-blue-900 transition-all"
          >
            View Requirements
          </button>
        </div>
      </section>
    </main>
  );
}
export default Home;
