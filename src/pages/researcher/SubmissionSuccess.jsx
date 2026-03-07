import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import { Check, ChevronLeft, LayoutDashboard } from "lucide-react";

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
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
      <div className="max-w-3xl w-full text-center">
        <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight mb-2">
          {proposal?.title || "Loading..."}
        </h1>
        <p className="text-gray-500 font-medium mb-16 uppercase tracking-widest text-xs">
          Application ID: {proposal?.applicationId}
        </p>

        <div className="relative w-56 h-56 mx-auto mb-12">
          {/* Outer Ring */}
          <div className="absolute inset-0 border-[6px] border-[#003399] rounded-full opacity-10 animate-pulse"></div>
          {/* Inner Circle */}
          <div className="w-full h-full border-[6px] border-[#003399] rounded-full flex items-center justify-center bg-white shadow-xl relative z-10">
            <Check size={90} className="text-[#003399]" strokeWidth={4} />
          </div>
        </div>

        <h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">
          Your proposal has been submitted
        </h2>
        <p className="text-gray-400 text-sm max-w-sm mx-auto mb-12 leading-relaxed">
          Updates on your application status will be shared via your researcher
          dashboard.
        </p>

        <button
          onClick={() => navigate("/researcher/dashboard")}
          className="group flex items-center gap-3 px-12 py-4 bg-[#003399] text-white rounded-full font-bold uppercase tracking-widest text-sm shadow-xl hover:bg-blue-900 transition-all hover:gap-5"
        >
          <LayoutDashboard size={18} />
          <span>Go to Dashboard</span>
        </button>
      </div>
    </div>
  );
};

export default SubmissionSuccess;
