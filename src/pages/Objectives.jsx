import React from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Objectives = () => {
  return (
    <div className="bg-white">
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden bg-[#003B95]">
        <div className="relative text-center px-4">
          <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-[0.2em]">
            Our Objective
          </h1>
        </div>
      </section>

      <section className="py-16 px-4 max-w-4xl mx-auto">
        <div className="space-y-12">
          <p className="text-gray-800 text-lg sm:text-xl font-medium leading-relaxed text-center">
            The main objective of Babcock University Health Research Ethics
            Committee is to enhance, uphold and ensure that the quality of
            researches which emanate from Babcock University are of utmost
            standards, thereby leading Babcock University to excellence and
            giving it visibility worldwide.
          </p>

          <div className="bg-gray-50 p-8 sm:p-12 rounded-3xl border border-gray-100 shadow-sm space-y-8">
            <h3 className="text-xl font-black text-[#003B95] uppercase tracking-wider">
              Please take note of the following points:
            </h3>
            <ul className="space-y-6">
              {[
                "All students are expected to submit their research proposals and requests for ethical clearance, preferably during the first semester, and always well ahead of their pre-field presentation.",
                "Supervisors are ensure that students obtain ethical clearance certificates before being allowed to do their pre-field presentation.",
                "Supervisors are to partner with BUHREC in monitoring the research as it goes on till completion",
              ].map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-4 text-gray-700 font-semibold leading-relaxed"
                >
                  <span className="mt-2 w-2 h-2 shrink-0 rounded-full bg-[#003B95]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <Link
            to="/"
            className="flex items-center justify-center gap-2 text-[#003B95] font-black uppercase text-sm tracking-widest hover:underline"
          >
            <ArrowLeft size={18} /> Back to Home
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Objectives;
