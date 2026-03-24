import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; 
import axios from "../../utils/axios";
import toast from "react-hot-toast";

const ProposalPaymentSuccess = () => {
  const navigate = useNavigate();
  const { proposalId } = useParams(); 

  const [submitting, setSubmitting] = useState(false);

  const handleSubmitProposal = async () => {
    if (!proposalId) {
      toast.error("Proposal ID is missing.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await axios.post(
        `/researcher/proposals/${proposalId}/submit`,
      );

      if (res.data.success) {
        navigate(`/researcher/dashboard/proposals/${proposalId}/submitted`);
      }
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Submission failed. Try again.",
      );
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-lg px-6 py-12 md:px-12 md:py-16 rounded-4xl flex flex-col items-center text-center animate-in zoom-in-95 fade-in duration-300 ease-out">
        {/* Animated Checkmark Icon */}
        <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-green-500 bg-green-50 flex items-center justify-center mb-6 md:mb-8">
          <svg
            className="w-12 h-12 md:w-14 md:h-14 text-green-500"
            viewBox="0 0 52 52"
            fill="none"
          >
            <path
              d="M10 26L21 37L42 15"
              stroke="currentColor"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Heading */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 tracking-tight leading-snug">
          Your payment was successful!
        </h2>

        {/* Subtitle */}
        <p className="text-sm md:text-base text-gray-500 mb-8 md:mb-10 px-2 md:px-6 leading-relaxed">
          Your transaction has been securely processed. You can now finalize and
          submit your application.
        </p>

        {/* Submit Button */}
        <button
          onClick={handleSubmitProposal}
          disabled={submitting}
          className={`w-full sm:w-auto px-10 py-3.5 sm:py-3.5 rounded-full font-bold text-sm md:text-base transition-all active:scale-95 shadow-md ${
            submitting
              ? "bg-gray-200 text-gray-500 cursor-not-allowed shadow-none"
              : "bg-[#003B95] hover:bg-blue-900 text-white cursor-pointer shadow-blue-900/20"
          }`}
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Submitting...
            </span>
          ) : (
            "Submit Proposal"
          )}
        </button>
      </div>
    </div>
  );
};

export default ProposalPaymentSuccess;
