import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import axios from "../../utils/axios";
import toast from "react-hot-toast";

function ProposalPayment() {
  const navigate = useNavigate();
  const { proposalId } = useParams();

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

  return (
    <div className="flex flex-col items-center justify-center px-6">
      <div className="flex items-center w-full max-w-4xl justify-between mb-12">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-200 cursor-pointer rounded-full transition-colors"
        >
          <ArrowLeft size={18} className="text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Submit a Proposal</h1>
        <div /> {/* Empty placeholder for spacing */}
      </div>

      <p className="text-sm text-gray-500 mb-2">Your total is</p>
      <p className="text-5xl font-bold text-gray-900 mb-3">N7000</p>
      <p className="text-sm text-gray-400 max-w-xs mb-10 text-center">
        Once payment is made, your application cannot be edited
      </p>
      <button
        onClick={handleMakePayment}
        className="bg-[#003B95] hover:bg-blue-900 text-white px-8 py-3 rounded-full font-bold text-sm transition-colors"
      >
        Make Payment
      </button>
    </div>
  );
}

export default ProposalPayment;
