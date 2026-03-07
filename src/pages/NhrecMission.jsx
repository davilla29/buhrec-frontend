import React, { useEffect } from "react";
import { ArrowLeft, CheckCircle2, ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";

const NhrecMission = () => {
  // Ensure the page starts at the top when navigated to
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const responsibilities = [
    "Determine guidelines for the functioning of health research ethics committees;",
    "Register and audit health research ethics committees;",
    "Set norms and standards for conducting research on humans and animals, including clinical trials;",
    "Adjudicate in complaints about the functioning of health research ethics committees;",
    "Refer violations of ethical rules to relevant statutory health professional councils;",
    "Institute disciplinary action against persons found in violation of research norms;",
    "Advise Federal and State Ministries on ethical issues concerning research.",
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden bg-[#003B95]">
        <div className="relative text-center px-4 z-10">
          <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-[0.2em]">
            NHREC Mission
          </h1>
        </div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border-4 border-white rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 border-4 border-white rounded-full"></div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 sm:py-24 px-4 max-w-5xl mx-auto">
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <p className="text-gray-800 text-lg font-bold leading-relaxed max-w-3xl mx-auto">
              BUHREC upholds and promotes the mission of the National Health
              Research Ethics Committee (NHREC) as established under the
              National Health Act.
            </p>
            <div className="w-24 h-1 bg-yellow-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Sidebar Note */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-blue-50 p-8 rounded-3xl border border-blue-100">
                <ShieldAlert className="text-[#003B95] mb-4" size={32} />
                <h3 className="text-lg font-black text-[#003B95] uppercase tracking-wider mb-2">
                  Statutory Mandate
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed font-semibold">
                  The NHREC is the apex body responsible for ensuring that all
                  health research in Nigeria follows international best
                  practices and ethical standards.
                </p>
              </div>
            </div>

            {/* Main List */}
            <div className="lg:col-span-8">
              <div className="space-y-6">
                <h2 className="text-xl font-black text-gray-900 uppercase tracking-widest flex items-center gap-3">
                  The Committee Shall:
                </h2>
                <div className="space-y-4">
                  {responsibilities.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-4 p-5 bg-[#F8FAFC] rounded-2xl border border-gray-100 hover:border-blue-200 transition-colors group"
                    >
                      <CheckCircle2
                        className="mt-1 text-yellow-600 shrink-0 group-hover:scale-110 transition-transform"
                        size={20}
                      />
                      <p className="text-gray-700 font-bold text-sm leading-relaxed">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Back Navigation */}
          <div className="flex justify-center pt-8 border-t border-gray-100">
            <Link
              to="/"
              className="flex items-center gap-2 text-[#003B95] font-black uppercase text-sm tracking-widest hover:underline"
            >
              <ArrowLeft size={18} /> Back to Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NhrecMission;
