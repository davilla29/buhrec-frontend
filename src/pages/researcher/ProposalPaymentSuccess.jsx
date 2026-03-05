import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const ProposalPaymentSuccess = () => {
  const navigate = useNavigate();
  const { proposalId } = useParams();
  const [submitting, setSubmitting] = React.useState(false);

  const handleSubmitProposal = async () => {
    try {
      setSubmitting(true);
      const res = await axios.post(
        `/researcher/proposals/${proposalId}/submit`,
      );

      if (res.data.success) {
        navigate(`/proposals/${proposalId}/submitted`);
      }
    } catch (err) {
      console.error(err);
      alert("Submission failed. Try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col items-center justify-center px-6 text-center">
      <div className="w-28 h-28 rounded-full border-[3px] border-green-500 flex items-center justify-center mb-8">
        <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
          <path
            d="M10 26L21 37L42 15"
            stroke="#22c55e"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">
        Your payment was successful
      </h2>
      <p className="text-sm text-gray-400 mb-10">
        You can now submit your application.
      </p>
      <button
        onClick={handleSubmitProposal}
        disabled={submitting}
        className={`px-6 py-2.5 rounded-full font-bold text-sm transition-colors ${
          submitting
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-[#003B95] hover:bg-blue-900 text-white cursor-pointer"
        }`}
      >
        {submitting ? "Submitting..." : "Submit Proposal"}
      </button>
    </div>
  );
};

export default ProposalPaymentSuccess;
