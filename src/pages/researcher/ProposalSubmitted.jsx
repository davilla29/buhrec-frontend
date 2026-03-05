import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const ProposalSubmitted = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col items-center justify-center px-6 text-center">
      <div className="flex items-center justify-between w-full max-w-4xl mb-12">
        <h1 className="text-xl font-bold text-gray-900">Submit a Proposal</h1>
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-[#003B95] hover:bg-blue-900 text-white px-6 py-2.5 rounded-full font-bold text-sm transition-colors"
        >
          Go to Dashboard
        </button>
      </div>

      <div className="w-28 h-28 rounded-full border-[3px] border-[#003B95] flex items-center justify-center mb-8">
        <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
          <path
            d="M10 26L21 37L42 15"
            stroke="#003B95"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">
        Your proposal has been submitted
      </h2>
      <p className="text-sm text-gray-400 max-w-xs">
        Updates on your application status will be shared via your dashboard
      </p>
    </div>
  );
};

export default ProposalSubmitted;
