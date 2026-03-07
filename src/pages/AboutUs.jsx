import React from "react";
import {
  ArrowLeft,
  Users,
  ShieldCheck,
  Microscope,
  GraduationCap,
} from "lucide-react";
import { Link } from "react-router-dom";

const AboutUs = () => {
  const applicantTypes = [
    { label: "Undergraduate students", icon: <GraduationCap size={20} /> },
    { label: "Postgraduate students", icon: <Users size={20} /> },
    { label: "Staff and Faculty", icon: <ShieldCheck size={20} /> },
    { label: "Community applicants", icon: <Microscope size={20} /> },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Header Section */}
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden bg-[#003B95]">
        <div className="relative text-center px-4 z-10">
          <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-[0.2em]">
            About Us
          </h1>
        </div>
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
      </section>

      {/* Content Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="space-y-6 text-center">
            <h2 className="text-2xl font-black text-[#003B95] uppercase tracking-widest">
              Scope of Review
            </h2>
            <p className="text-gray-800 text-lg font-bold leading-relaxed">
              The BUHREC reviews all proposals having focus on human health in
              line with the definition of 'Health' by the World Health
              Organization (WHO).
            </p>
          </div>

          <div className="bg-[#F8FAFC] p-8 sm:p-16 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-xl font-black text-[#003B95] mb-8 uppercase tracking-widest border-b pb-4">
              Eligible Applicants
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {applicantTypes.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-50 transition-transform hover:scale-105"
                >
                  <span className="p-3 bg-yellow-500/10 text-yellow-600 rounded-lg">
                    {item.icon}
                  </span>
                  <span className="text-gray-800 font-bold">{item.label}</span>
                </div>
              ))}
            </div>

            <div className="mt-12 p-6 bg-blue-50 rounded-2xl border-l-4 border-[#003B95]">
              <p className="text-sm text-gray-700 font-medium leading-loose">
                Our committee ensures that every research project involving
                human participants follows strict ethical guidelines to protect
                the dignity, rights, and welfare of the subjects involved.
              </p>
            </div>
          </div>

          {/* Navigation Back */}
          <div className="flex justify-center pt-8">
            <Link
              to="/"
              className="flex items-center gap-2 text-[#003B95] font-black uppercase text-sm tracking-widest hover:underline transition-all"
            >
              <ArrowLeft size={18} /> Back to Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
