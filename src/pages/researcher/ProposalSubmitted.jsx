import React from "react";
import { useNavigate } from "react-router-dom";

const ProposalSubmitted = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Top Header Area */}
      <header className="w-full px-4 sm:px-6 md:px-10 py-6 md:py-8 flex flex-col sm:flex-row items-center justify-between gap-4 z-10">
        {/* <h1 className="text-lg md:text-xl font-bold text-gray-900 text-center sm:text-left">
          Submit a Proposal
        </h1> */}

        <button
          onClick={() => navigate("/dashboard")}
          className="w-full sm:w-auto bg-[#003B95] hover:bg-blue-900 text-white px-8 py-3.5 sm:py-2.5 rounded-full font-bold text-sm transition-all active:scale-95 shadow-md shadow-blue-900/20"
        >
          Go to Dashboard
        </button>
      </header>

      {/* Centered Success Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-20 sm:pb-24 animate-in zoom-in-95 fade-in duration-300 ease-out text-center">
        {/* Animated Checkmark Icon */}
        <div className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full border-4 border-[#003B95] flex items-center justify-center mb-6 md:mb-8 bg-blue-50/30">
          <svg
            className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 text-[#003B95]"
            viewBox="0 0 52 52"
            fill="none"
            stroke="currentColor"
          >
            <path
              d="M10 26L21 37L42 15"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4 tracking-tight leading-snug px-2">
          Your proposal has been submitted
        </h2>

        <p className="text-sm md:text-base text-gray-500 max-w-xs md:max-w-sm leading-relaxed">
          Updates on your application status will be shared via your dashboard.
        </p>
      </main>
    </div>
  );
};

export default ProposalSubmitted;
