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
      title: "Literature Review",
      desc: "Summarize relevant previous studies and identify gaps in knowledge that the proposed research intends to address.",
    },
    {
      title: "Methodology",
      desc: "Describe the research design, sampling technique, data collection methods, and data analysis plan.",
    },
    {
      title: "Study Population",
      desc: "Define the target population, inclusion and exclusion criteria, and the sample size with justification.",
    },
    {
      title: "Study Product (where applicable)",
      desc: "If applicable, describe the product being studied, including dosage, formulation, administration route, and storage requirements.",
    },
    {
      title: "Study Procedure (where applicable)",
      desc: "Outline the step-by-step procedure for the study, including the sequence of events and timelines for each phase.",
    },
    {
      title: "Assessment of Safety (where applicable)",
      desc: "Describe the safety monitoring plan, adverse event reporting procedures, and any stopping rules for the study.",
    },
    {
      title: "Clinical Management (where applicable)",
      desc: "Describe the clinical management plan, including how participants will be monitored and managed during and after the study.",
    },
    {
      title: "Statistics, data handling and record keeping",
      desc: "Explain the statistical methods to be used, data management procedures, confidentiality measures, and record-keeping protocols.",
    },
    {
      title: "Other requirements",
      desc: "Include any additional documents such as informed consent forms, questionnaires, data collection tools, and CVs of researchers.",
    },
    {
      title: "Further Information",
      desc: "Any additional information relevant to the ethical review, including funding sources, potential conflicts of interest, and institutional approvals.",
    },
  ];

  const consentChecklist = [
    "End of the research",
    "Purpose(s) of research",
    "Very brief information on the procedures of the research",
    "Compensation (available or not)",
    "Consequences of participants' decision to withdraw from research also procedure for orderly termination of participation",
    "Modality of providing treatments and action(s) to be taken in case of injury or adverse event (where applicable)",
    "What happens to research results, participants and communities when the research has completed (where applicable)",
    "Post-research benefits to participants (where applicable)",
    "Any apparent or potential conflict of interest by the researcher",
    "Contact person information including contact address, telephone, fax, e-mail and any other relevant information of researcher(s)",
    "Name and signature of researcher and date",
  ];

  return (
    <div className="bg-white">
      <section className="h-[40vh] flex items-center justify-center bg-[#003B95]">
        <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-widest text-center px-4">
          BUHREC SOPs
        </h1>
      </section>

      <section className="py-16 px-4 max-w-5xl mx-auto space-y-12">
        <div className="space-y-6 text-center">
          <h2 className="text-xl font-black text-yellow-500 uppercase tracking-widest">
            Submission PROCEDURE
          </h2>
          <div className="bg-gray-50 border border-gray-100 p-8 rounded-3xl text-sm sm:text-base text-gray-800 font-bold leading-relaxed max-w-4xl mx-auto italic">
            Categories of researcher: BSc., MSc., M.Phil., PhD, PG Diploma,
            Independent researchers.
            <br />
            <br />A well written protocol, which contains all the information
            listed below, as may be relevant to each discipline, should be
            submitted when requesting for Ethical clearance.
          </div>
        </div>
        <div className="flex justify-center border-b border-gray-100">
          <div className="flex gap-12">
            <button
              onClick={() => setSopSubView("steps")}
              className={`pb-4 text-sm cursor-pointer font-black uppercase tracking-widest transition-all ${sopSubView === "steps" ? "text-yellow-500 border-b-4 border-yellow-500" : "text-gray-400"}`}
            >
              Steps
            </button>
            <button
              onClick={() => setSopSubView("consent")}
              className={`pb-4 text-sm cursor-pointer font-black uppercase tracking-widest transition-all ${sopSubView === "consent" ? "text-yellow-500 border-b-4 border-yellow-500" : "text-gray-400"}`}
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
