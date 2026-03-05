// import { useNavigate, useParams } from "react-router-dom";
// import { ArrowLeft } from "lucide-react";
// import axios from "../../utils/axios";
// import toast from "react-hot-toast";

// function ProposalPayment() {
//   const navigate = useNavigate();
//   const { proposalId } = useParams();

//   const handleMakePayment = async () => {
//     try {
//       const res = await axios.post(
//         `/researcher/proposals/${proposalId}/payment/init`,
//       );

//       if (res.data.success && res.data.paymentLink) {
//         // Redirect to Flutterwave payment page
//         window.location.href = res.data.paymentLink;
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error(
//         err.response?.data?.message ||
//           "Payment initialization failed. Try again.",
//       );
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center px-6">
//       <div className="flex items-center w-full max-w-4xl justify-between mb-12">
//         <button
//           onClick={() => navigate(-1)}
//           className="p-2 hover:bg-gray-200 cursor-pointer rounded-full transition-colors"
//         >
//           <ArrowLeft size={18} className="text-gray-700" />
//         </button>
//         <h1 className="text-xl font-bold text-gray-900">Submit a Proposal</h1>
//         <div /> {/* Empty placeholder for spacing */}
//       </div>

//       <p className="text-sm text-gray-500 mb-2">Your total is</p>
//       <p className="text-5xl font-bold text-gray-900 mb-3">N7000</p>
//       <p className="text-sm text-gray-400 max-w-xs mb-10 text-center">
//         Once payment is made, your application cannot be edited
//       </p>
//       <button
//         onClick={handleMakePayment}
//         className="bg-[#003B95] hover:bg-blue-900 text-white px-8 py-3 rounded-full font-bold text-sm transition-colors"
//       >
//         Make Payment
//       </button>
//     </div>
//   );
// }

// export default ProposalPayment;


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
    <div className="min-h-screen  flex flex-col">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between w-full px-10 py-8">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 cursor-pointer rounded-full transition-colors cursor-pointer"
          aria-label="Go back"
        >
          <ArrowLeft size={28} className="text-gray-800" />
        </button>

        <h1 className="text-2xl font-bold text-gray-900">Submit a proposal</h1>

        {/* Placeholder button matching the top-right of the image */}
        <button className="bg-[#EEEEEE] text-[#4A4A4A] px-6 py-2.5 rounded-full font-medium text-sm cursor-pointer hover:bg-gray-200 transition-colors">
          Submit Proposal
        </button>
      </div>

      {/* Center Content */}
      <div className="flex-grow flex flex-col items-center justify-center px-6 -mt-20">
        <p className="text-lg text-gray-800 mb-2">Your total is</p>
        
        <h2 className="text-[100px] font-bold text-black leading-none mb-6">
          N7000
        </h2>
        
        <p className="text-gray-500 text-center max-w-md mb-12 text-lg leading-snug">
          Once payment is made, your application cannot be <br className="hidden md:block" /> edited
        </p>

        <button
          onClick={handleMakePayment}
          className="bg-[#003B95] hover:bg-[#002e75] text-white px-14 py-4 rounded-full font-bold text-lg transition-all cursor-pointer shadow-md active:scale-95"
        >
          Make Payment
        </button>
      </div>
    </div>
  );
}

export default ProposalPayment;