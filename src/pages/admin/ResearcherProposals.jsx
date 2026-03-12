import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import axios from "../../utils/axios";
import toast from "react-hot-toast";

function ResearcherProposals() {
  const navigate = useNavigate();
  const { researcherId } = useParams();

  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Completed");

  const tabs = ["Unaccepted", "Not Reviewed", "Ongoing", "Completed"];

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const response = await axios.get(
          `/admin/researchers/${researcherId}/proposals`,
        );
        if (response.data.success) {
          setProposals(response.data.data);
        }
      } catch (error) {
        toast.error("Error fetching researcher proposals");
      } finally {
        setLoading(false);
      }
    };
    fetchProposals();
  }, [researcherId]);

  const filteredProposals = useMemo(() => {
    return proposals.filter((p) => {
      const status = p.status?.toLowerCase() || "";

      switch (activeTab) {
        case "Unaccepted":
          return status === "waiting to be assigned" || status === "draft";
        case "Not Reviewed":
          return status === "under review";
        case "Ongoing":
          return status === "awaiting modifications";
        case "Completed":
          return (
            status === "approved" ||
            status === "rejected" ||
            status === "completed"
          );
        default:
          return true;
      }
    });
  }, [proposals, activeTab]);

  const getStatusStyles = (status) => {
    const s = status?.toLowerCase();
    if (s === "rejected")
      return { text: "Review Rejected", color: "text-[#C1121F]" };
    if (s === "approved")
      return { text: "Review Approved", color: "text-[#003B95]" };
    return { text: "", color: "" };
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#003B95]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-2">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 cursor-pointer hover:bg-gray-200 rounded-full transition"
          >
            <ChevronLeft size={24} className="text-gray-800" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            Researcher's Proposals
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full cursor-pointer text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "bg-white shadow-sm text-gray-900"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Proposals List */}
        {filteredProposals.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            No proposals found in {activeTab}.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProposals.map((proposal) => {
              const statusInfo = getStatusStyles(proposal.status);
              const isGreenButton = [
                "rejected",
                "approved",
                "completed",
              ].includes(proposal.status?.toLowerCase());

              return (
                <div
                  key={proposal._id}
                  className="bg-[#F3F4F6] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
                >
                  <div className="flex flex-col gap-2">
                    {statusInfo.text && (
                      <span
                        className={`text-[10px] font-black uppercase tracking-widest ${statusInfo.color}`}
                      >
                        {statusInfo.text}
                      </span>
                    )}

                    <h3 className="text-base font-bold text-gray-900 max-w-lg leading-tight">
                      {proposal.title}
                    </h3>

                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden shrink-0">
                        {proposal.researcher?.avatar ? (
                          <img
                            src={proposal.researcher.avatar}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-[10px] font-bold text-blue-600">
                            {proposal.researcher?.fullName?.[0] || "R"}
                          </span>
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-600">
                        {proposal.researcher?.fullName || "Unknown Researcher"}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      navigate(`/admin/proposals/${proposal._id}/details`)
                    }
                    className={`shrink-0 px-6 py-2 rounded-full text-xs font-black uppercase tracking-wider text-white transition-colors ${
                      isGreenButton
                        ? "bg-[#16A34A] hover:bg-green-700"
                        : "bg-[#003B95] hover:bg-blue-900"
                    }`}
                  >
                    View Details
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default ResearcherProposals;
