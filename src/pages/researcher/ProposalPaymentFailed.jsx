import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const ProposalPaymentFailed = () => {
  const navigate = useNavigate();
  const { proposalId } = useParams();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      {/* Card Container */}
      <div className="w-full max-w-lg px-6 py-12 md:px-12 md:py-16 rounded-4xl flex flex-col items-center text-center animate-in zoom-in-95 fade-in duration-300 ease-out">
        {/* Animated Cross/Failed Icon */}
        <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-red-500 bg-red-50 flex items-center justify-center mb-6 md:mb-8">
          <svg
            className="w-12 h-12 md:w-14 md:h-14 text-red-500"
            viewBox="0 0 52 52"
            fill="none"
          >
            <path
              d="M16 16L36 36M36 16L16 36"
              stroke="currentColor"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Heading */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 tracking-tight leading-snug">
          Payment Failed
        </h2>

        {/* Subtitle */}
        <p className="text-sm md:text-base text-gray-500 mb-8 md:mb-10 px-2 md:px-6 leading-relaxed">
          We couldn't process your transaction and your account has not been
          charged. Please check your payment details or internet connection and
          try again.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 w-full justify-center">
          {/* Secondary Button - Go Back to Dashboard */}
          <button
            onClick={() => navigate("/researcher/dashboard/my-proposals")}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-sm md:text-base text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all active:scale-95"
          >
            Later
          </button>

          {/* Primary Button - Try Again */}
          <button
            onClick={() =>
              navigate(`/researcher/dashboard/proposals/${proposalId}/payment`)
            }
            className="w-full sm:w-auto px-10 py-3.5 rounded-full font-bold text-sm md:text-base text-white bg-red-600 hover:bg-red-700 transition-all active:scale-95 shadow-md shadow-red-600/20"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProposalPaymentFailed;
