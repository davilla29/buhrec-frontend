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
        const res = await axios.get(
          `/researcher/proposals/${proposalId}/draft`,
        );
        if (res.data.success) {
          setProposal(res.data.proposal);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch proposal details");
      } finally {
        setLoading(false);
      }
    };

    fetchProposal();
  }, [proposalId]);

  const handleMakePayment = async () => {
    try {
      const res = await axios.post(
        `/researcher/proposals/${proposalId}/payment/init`,
      );

      if (res.data.success && res.data.paymentLink) {
        // Redirect to Flutterwave payment page
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
    // Navigate to submit page
    navigate(`/researcher/dashboard/proposals/${proposalId}/submit`);
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  const isPaid = proposal?.payment?.status === "paid";

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between w-full px-10 py-8">
        <button
          onClick={() => navigate("/researcher/dashboard/proposals")}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft size={28} className="text-gray-800" />
        </button>

        <h1 className="text-2xl font-bold text-gray-900">Submit a proposal</h1>

        <button
          onClick={handleSubmitProposal}
          disabled={!isPaid}
          className={`px-6 py-2.5 rounded-full font-medium text-sm transition-colors ${
            isPaid
              ? "bg-blue-800 text-white hover:bg-blue-900 cursor-pointer"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
        >
          Submit Proposal
        </button>
      </div>

      {/* Center Content */}
      <div className="flex-grow flex flex-col items-center justify-center px-6 -mt-20">
        <p className="text-lg text-gray-800 mb-2">Your total is</p>

        <h2 className="text-[100px] font-bold text-black leading-none mb-6">
          N{proposal?.feeAmount ?? 7000}
        </h2>

        <p className="text-gray-500 text-center max-w-md mb-12 text-lg leading-snug">
          Once payment is made, your application cannot be{" "}
          <br className="hidden md:block" /> edited
        </p>

        <button
          onClick={handleMakePayment}
          disabled={isPaid}
          className={`px-14 py-4 rounded-full font-bold text-lg shadow-md transition-all ${
            isPaid
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-[#003B95] hover:bg-[#002e75] text-white cursor-pointer active:scale-95"
          }`}
        >
          {isPaid ? "Payment Completed" : "Make Payment"}
        </button>
      </div>
    </div>
  );
}

export default ProposalPayment;
