import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import toast from "react-hot-toast";

const ProposalDecision = () => {
  const { id } = useParams(); // Proposal ID
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchDecisionDetails = async () => {
      try {
        // Fetch the proposal details (Assuming you have an endpoint that returns the proposal and its assignment/decision reason)
        // If your existing /researcher/proposals/:id endpoint doesn't return the review assignment, you may need to populate it on the backend.
        const res = await axios.get(`/researcher/proposals/${id}`);
        setData(res.data.proposal);
      } catch (err) {
        toast.error("Failed to load decision details");
      } finally {
        setLoading(false);
      }
    };

    fetchDecisionDetails();
  }, [id]);

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

  // Format the date
  const dateStr = data.createdAt
    ? new Date(data.createdAt).toLocaleDateString()
    : "N/A";

  // The reason from the reviewer (Make sure your backend populates this from the Assignment model)
  const reasonText = data.decisionReason || "No additional comment provided";

  return (
    <div className="min-h-screen bg-[#F9F9F9] flex flex-col items-center justify-center p-6 font-sans">
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
            onClick={() => navigate("/researcher/dashboard/proposals")}
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
