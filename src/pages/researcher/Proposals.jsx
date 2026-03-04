import React, { useState, useEffect, useMemo } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import axios from "../../utils/axios";

function Proposals() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All"); // Default to showing everything or a specific tab

  const tabs = ["Drafts", "Not Reviewed", "Ongoing", "Completed"];

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const response = await axios.get("/researcher/proposals");
        if (response.data.success) {
          setProposals(response.data.proposals);
        }
      } catch (error) {
        console.error("Error fetching proposals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, []);

  // Frontend Filtering Logic
  const filteredProposals = useMemo(() => {
    if (activeTab === "All") return proposals;

    return proposals.filter((p) => {
      const status = p.status?.toLowerCase();
      switch (activeTab) {
        case "Drafts":
          return status === "draft";
        case "Waiting to be assigned":
          return status === "pending" || status === "submitted";
        case "Ongoing":
          return status === "under review" || status === "revisions needed";
        case "Completed":
          return status === "accepted" || status === "rejected";
        default:
          return true;
      }
    });
  }, [proposals, activeTab]);

  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case "rejected":
        return { text: "Review Rejected", color: "text-red-600" };
      case "revisions needed":
        return { text: "Revisions Needed", color: "text-yellow-500" };
      case "accepted":
        return { text: "Review Accepted", color: "text-blue-600" };
      default:
        return { text: "", color: "" };
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  p-2">
      <div className="max-w-4xl">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Your Proposals</h1>
          <p className="text-gray-500">Here are your proposals!</p>
        </header>

        {/* Filter Toolbar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("All")}
              className={`px-4 py-1.5 rounded-full cursor-pointer text-sm font-medium transition-colors ${
                activeTab === "All"
                  ? "bg-blue-800 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              All
            </button>
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-full cursor-pointer text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? "bg-blue-800 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex gap-4 text-gray-600">
            <Search className="w-5 h-5 cursor-pointer hover:text-blue-800" />
            <SlidersHorizontal className="w-5 h-5 cursor-pointer hover:text-blue-800" />
          </div>
        </div>

        {/* Main Content Area */}
        {filteredProposals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-gray-500 mb-4">
              {activeTab === "All"
                ? "You have no proposals"
                : `No proposals found in ${activeTab}`}
            </p>
            <button className="bg-[#1e40af] text-white px-6 py-2 rounded-full font-medium hover:bg-blue-800 transition-all">
              New Submission
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredProposals.map((proposal) => {
              const isDraft = proposal.status?.toLowerCase() === "draft";
              const statusInfo = getStatusStyles(proposal.status);

              // Dynamic Reviewer Data
              const reviewerName =
                proposal.reviewer?.name || "Pending Assignment";
              const reviewerAvatar =
                proposal.reviewer?.avatar || "/api/placeholder/24/24";

              return (
                <div
                  key={proposal._id}
                  className="bg-[#f0f0f0] rounded-xl p-5 flex items-center justify-between transition-shadow hover:shadow-md cursor-pointer border border-transparent hover:border-gray-300"
                >
                  <div className="flex flex-col gap-2">
                    {!isDraft && statusInfo.text && (
                      <span className={`text-xs font-bold ${statusInfo.color}`}>
                        {statusInfo.text}{" "}
                        <span className="text-blue-600 ml-1">•</span>
                      </span>
                    )}

                    <h3 className="text-lg font-semibold text-gray-800 leading-tight max-w-lg">
                      {proposal.title}
                    </h3>

                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-6 h-6 rounded-full bg-gray-400 overflow-hidden border border-gray-200">
                        <img
                          src={reviewerAvatar}
                          alt={reviewerName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-sm text-gray-600 font-medium">
                        {reviewerName}
                      </span>
                    </div>
                  </div>

                  {!isDraft && (
                    <button
                      className={`px-5 py-1.5 rounded-full text-white text-sm font-medium transition-colors ${
                        proposal.status?.toLowerCase() === "revisions needed"
                          ? "bg-[#1e40af] hover:bg-blue-900"
                          : "bg-[#16a34a] hover:bg-green-700"
                      }`}
                    >
                      View Details
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Proposals;
