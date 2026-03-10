import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import { Check, LayoutDashboard } from "lucide-react";

const SubmissionSuccess = () => {
  const { proposalId } = useParams();
  const navigate = useNavigate();
  const [proposal, setProposal] = useState(null);

  useEffect(() => {
    const fetchProposal = async () => {
      try {
        const res = await axios.get(`/researcher/proposals/${proposalId}/versions`);
        setProposal(res.data.proposal);
      } catch (err) {
        console.error("Success page fetch error", err);
      }
    };
    fetchProposal();
  }, [proposalId]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="max-w-3xl w-full text-center animate-in zoom-in-95 fade-in duration-500 ease-out">
        
        {/* Title & App ID */}
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 uppercase tracking-tight mb-1 md:mb-2 px-2">
          {proposal?.title || "Loading..."}
        </h1>
        <p className="text-gray-500 font-medium mb-8 md:mb-16 uppercase tracking-widest text-[10px] md:text-xs px-4 truncate">
          Application ID: {proposal?.applicationId || "..."}
        </p>

        {/* Animated Success Icon */}
        <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 mx-auto mb-8 md:mb-12">
          {/* Outer Ring */}
          <div className="absolute inset-0 border-4 md:border-[6px] border-[#003399] rounded-full opacity-10 animate-pulse"></div>
          {/* Inner Circle */}
          <div className="w-full h-full border-4 md:border-[6px] border-[#003399] rounded-full flex items-center justify-center bg-white shadow-xl relative z-10">
            <Check 
              className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-22.5 lg:h-22.5 text-[#003399]" 
              strokeWidth={4} 
            />
          </div>
        </div>

        {/* Main Success Message */}
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 mb-3 md:mb-4 tracking-tight px-4 leading-snug">
          Your proposal has been submitted
        </h2>
        <p className="text-gray-500 text-sm md:text-base max-w-xs md:max-w-sm mx-auto mb-10 md:mb-12 leading-relaxed px-4">
          Updates on your application status will be shared via your researcher dashboard.
        </p>

        {/* Action Button */}
        <button
          onClick={() => navigate("/researcher/dashboard")}
          className="group flex cursor-pointer items-center justify-center mx-auto gap-3 w-full sm:w-auto px-8 py-4 md:px-12 md:py-4 bg-[#003399] text-white rounded-full font-bold uppercase tracking-widest text-xs md:text-sm shadow-xl shadow-blue-900/20 hover:bg-blue-900 transition-all hover:gap-4 active:scale-95"
        >
          <LayoutDashboard size={18} className="shrink-0" />
          <span>Go to Dashboard</span>
        </button>
      </div>
    </div>
  );
};

export default SubmissionSuccess;