import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import axios from "../../utils/axios";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

function ProposalPayment() {
  const navigate = useNavigate();
  const { proposalId } = useParams();

  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProposal = async () => {
      try {
        // Get all proposals
        const res = await axios.get("/researcher/proposals");

        if (res.data.success) {
          const found = res.data.proposals.find((p) => p._id === proposalId);

          if (!found) {
            toast.error("Proposal not found");
            navigate("/researcher/dashboard/proposals");
            return;
          }

          setProposal(found);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch proposal");
      } finally {
        setLoading(false);
      }
    };

    fetchProposal();
  }, [proposalId, navigate]);

  const handleMakePayment = async () => {
    try {
      const res = await axios.post(
        `/researcher/proposals/${proposalId}/payment/init`,
      );

      if (res.data.success && res.data.paymentLink) {
        window.location.href = res.data.paymentLink;
      }
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message ||
          "Payment initialization failed. Try again.",
      );
    }
  };

  const handleSubmitProposal = () => {
    navigate(`/researcher/dashboard/proposals/${proposalId}/submit`);
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-blue-800"></div>
      </div>
    );
  }

  const isPaid = proposal?.payment?.status === "paid";
  const isSubmitted = proposal?.versionCount > 0;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Top Navigation */}
      <div className="flex items-center justify-between w-full px-4 sm:px-6 md:px-10 py-4 md:py-8 z-10 gap-2 md:gap-4">
        {/* BACK BUTTON */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 cursor-pointer rounded-full transition-colors active:scale-95 shrink-0"
          aria-label="Go back"
        >
          <ArrowLeft className="w-6 h-6 md:w-7 md:h-7 text-gray-800" />
        </button>

        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 flex-1 text-center truncate px-2">
          Submit a proposal
        </h1>

        {/* SUBMIT BUTTON */}
        <button
          onClick={handleSubmitProposal}
          disabled={!isPaid || isSubmitted}
          className={`px-4 py-2 md:px-6 md:py-2.5 rounded-full font-medium text-xs md:text-sm transition-all active:scale-95 whitespace-nowrap shadow-sm shrink-0 ${
            isSubmitted
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : isPaid
                ? "bg-blue-800 text-white hover:bg-blue-900 cursor-pointer shadow-blue-900/20"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
        >
          {isSubmitted ? "Already Submitted" : "Submit Proposal"}
        </button>
      </div>

      {/* Center Content */}
      <div className="grow flex flex-col items-center justify-center px-6 -mt-10 md:-mt-20">
        <p className="text-base md:text-lg text-gray-800 mb-2 md:mb-3 font-medium">
          Your total is
        </p>

        <h2 className="text-6xl sm:text-[80px] md:text-[100px] font-bold text-black leading-none mb-6 md:mb-8 tracking-tight">
          ₦{proposal?.feeAmount ?? 7000}
        </h2>

        <p className="text-gray-500 text-center max-w-xs md:max-w-md mb-10 md:mb-12 text-sm md:text-lg leading-relaxed md:leading-snug">
          Once payment is made, your application cannot be
          <br className="hidden sm:block" /> edited.
        </p>

        {/* PAYMENT BUTTON */}
        <button
          onClick={handleMakePayment}
          disabled={isPaid}
          className={`w-full sm:w-auto px-10 md:px-14 py-3.5 md:py-4 rounded-full font-bold text-base md:text-lg shadow-md transition-all active:scale-95 ${
            isPaid
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-[#003B95] hover:bg-[#002e75] text-white cursor-pointer shadow-blue-900/20"
          }`}
        >
          {isPaid ? "Payment Completed" : "Make Payment"}
        </button>
      </div>
    </div>
  );
}

export default ProposalPayment;
