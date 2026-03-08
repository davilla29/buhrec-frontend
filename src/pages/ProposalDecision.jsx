import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import toast from "react-hot-toast";

const ProposalDecision = () => {
  const { proposalId } = useParams(); // Proposal id
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchDecisionDetails = async () => {
      try {
        const res = await axios.get(`/researcher/proposals/${proposalId}`);
        setData(res.data.proposal);
      } catch (err) {
        toast.error("Failed to load decision details");
      } finally {
        setLoading(false);
      }
    };

    fetchDecisionDetails();
  }, [proposalId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#003B95]"></div>
      </div>
    );
  }

  if (!data) return null;

  const isApproved = data.status?.toLowerCase() === "approved";
  const isRejected = data.status?.toLowerCase() === "rejected";

  // Colors based on status
  const themeColor = isApproved ? "text-[#003B95]" : "text-[#C1121F]";
  const buttonBg = isApproved
    ? "bg-[#003B95] hover:bg-blue-900"
    : "bg-[#C1121F] hover:bg-red-900";
  const headerText = isApproved
    ? "Your proposal was approved"
    : "Your proposal was rejected";

  // Format the date explicitly to match the "D/M/YYYY" mockup style (e.g., 4/2/2026)
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const d = new Date(dateString);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  // Uses the newly added assignedAt field from the backend, falls back to createdAt
  const dateStr = formatDate(data.assignedAt || data.createdAt);

  // The reason from the reviewer
  const reasonText = data.decisionReason || "No additional comment provided";

  return (
    <div className="min-h-screen  flex flex-col items-center justify-center p-2 font-sans">
      <div className="w-full max-w-4xl">
        {/* Header Section */}
        <div className="mb-24">
          <h2 className={`text-xl font-bold ${themeColor} mb-2`}>
            {headerText}
          </h2>
          <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-2">
            {data.title}
          </h1>
          <p className="text-gray-500 font-medium">Assigned {dateStr}</p>
        </div>

        {/* Reason Section */}
        <div className="flex justify-center mb-24">
          <p className="text-gray-500 font-medium text-center max-w-2xl text-lg">
            {reasonText}
          </p>
        </div>

        {/* Action Button */}
        <div className="flex justify-center">
          <button
            onClick={() => navigate("/researcher/dashboard/my-proposals")}
            className={`px-8 py-3 rounded-full text-white font-medium transition-all cursor-pointer ${buttonBg}`}
          >
            Back to proposals
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProposalDecision;
