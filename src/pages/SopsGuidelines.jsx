import React, { useState } from "react";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const SopsGuidelines = () => {
  const [sopSubView, setSopSubView] = useState("steps");
  const [openStep, setOpenStep] = useState(null);

  const steps = [
    {
      title: "Application Letter",
      desc: "A formal letter addressed to the Chair of BUHREC requesting ethical clearance. Must include the title of research, names and affiliations of all researchers, and the expected duration of the study.",
    },
    {
      title: "Title",
      desc: "The full title of the research project. Should be clear, concise, and accurately reflect the scope of the study.",
    },
    {
      title: "Introduction",
      desc: "Provide the background and context of the research, including the problem statement, justification, and relevance of the study.",
    },
    {
      title: "Objective",
      desc: "State the general and specific objectives of the research clearly and precisely.",
    },
    {
      title: "Methodology",
      desc: "Describe the research design, sampling technique, data collection methods, and data analysis plan.",
    },
    // ... add remaining steps here
  ];

  const consentChecklist = [
    "Purpose(s) of research",
    "Procedures of the research",
    "Compensation (available or not)",
    "Withdrawal procedures",
    "Confidentiality modality",
    "Contact person information",
  ];

  return (
    <div className="bg-white">
      <section className="h-[40vh] flex items-center justify-center bg-[#003B95]">
        <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-widest text-center px-4">
          BUHREC SOPs
        </h1>
      </section>

      <section className="py-16 px-4 max-w-5xl mx-auto space-y-12">
        <div className="flex justify-center border-b border-gray-100">
          <div className="flex gap-12">
            <button
              onClick={() => setSopSubView("steps")}
              className={`pb-4 text-sm font-black uppercase tracking-widest transition-all ${sopSubView === "steps" ? "text-yellow-500 border-b-4 border-yellow-500" : "text-gray-400"}`}
            >
              Steps
            </button>
            <button
              onClick={() => setSopSubView("consent")}
              className={`pb-4 text-sm font-black uppercase tracking-widest transition-all ${sopSubView === "consent" ? "text-yellow-500 border-b-4 border-yellow-500" : "text-gray-400"}`}
            >
              Consent Checklist
            </button>
          </div>
        </div>

        {sopSubView === "steps" ? (
          <div className="space-y-3">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="bg-[#F8FAFC] border border-gray-100 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setOpenStep(openStep === idx ? null : idx)}
                  className="w-full flex justify-between items-center p-5 text-left group"
                >
                  <span className="text-sm font-bold text-gray-700 group-hover:text-[#003B95]">
                    Step {idx + 1}: {step.title}
                  </span>
                  <ChevronRight
                    size={18}
                    className={`transition-transform ${openStep === idx ? "rotate-90 text-[#003B95]" : ""}`}
                  />
                </button>
                {openStep === idx && (
                  <div className="px-5 pb-5 pt-2 text-sm text-gray-600 font-medium">
                    {step.desc}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#F8FAFC] p-8 rounded-3xl border border-gray-100 space-y-8 max-w-4xl mx-auto">
            <h3 className="text-lg font-black text-[#003B95] uppercase tracking-wider">
              Informed Consent Checklist
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {consentChecklist.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-4 text-gray-800 font-bold text-sm"
                >
                  <span className="mt-1.5 w-1.5 h-1.5 shrink-0 rounded-full bg-[#003B95]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        <Link
          to="/"
          className="flex items-center justify-center gap-2 text-[#003B95] font-black uppercase text-sm tracking-widest hover:underline pt-8"
        >
          <ArrowLeft size={18} /> Back to Home
        </Link>
      </section>
    </div>
  );
};

export default SopsGuidelines;
