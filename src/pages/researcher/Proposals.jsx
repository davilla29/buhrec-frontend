import React, { useState, useEffect, useMemo } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import axios from "../../utils/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Proposals() {
  const navigate = useNavigate();

  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState("");

  // Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const tabs = ["Drafts", "Not Reviewed", "Ongoing", "Completed"];

  /* ------------------------------------------------ */
  /* Fetch Proposals                                  */
  /* ------------------------------------------------ */

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

  useEffect(() => {
    fetchProposals();
  }, []);

  /* ------------------------------------------------ */
  /* Filtering & Search Logic                         */
  /* ------------------------------------------------ */

  const filteredProposals = useMemo(() => {
    let filtered = proposals;

    // 1. Filter by Tab
    if (activeTab !== "All") {
      filtered = filtered.filter((p) => {
        const status = p.status?.toLowerCase();
        switch (activeTab) {
          case "Drafts":
            return status === "draft";
          case "Not Reviewed":
            return status === "waiting to be assigned";
          case "Ongoing":
            return (
              status === "under review" || status === "awaiting modifications"
            );
          case "Completed":
            return status === "approved" || status === "rejected";
          default:
            return true;
        }
      });
    }

    // 2. Filter by Search Query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((p) => p.title?.toLowerCase().includes(query));
    }

    return filtered;
  }, [proposals, activeTab, searchQuery]);

  const handleToggleSearch = () => {
    setIsSearchOpen((prev) => !prev);
    if (isSearchOpen) {
      setSearchQuery(""); // Clear search when closing
    }
  };

  /* ------------------------------------------------ */
  /* Status Styling                                   */
  /* ------------------------------------------------ */

  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case "rejected":
        return { text: "Review Rejected", color: "text-red-600" };
      case "awaiting modifications":
        return { text: "Modifications Requested", color: "text-yellow-500" };
      case "under review":
        return { text: "Under Review", color: "text-blue-500" };
      case "approved":
        return { text: "Review Approved", color: "text-blue-600" };
      default:
        return { text: "", color: "" };
    }
  };

  /* ------------------------------------------------ */

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-3">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-blue-800"></div>
          <p className="text-gray-500 font-medium">Loading proposals...</p>
        </div>
      </div>
    );
  }

  /* ------------------------------------------------ */

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 max-w-5xl mx-auto">
      <div>
        {/* Header */}
        <header className="mb-6 flex justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Your Proposals
            </h1>
            <p className="text-sm md:text-base text-gray-500 mt-1">
              Here are your proposals!
            </p>
          </div>

          {/* Search Toggle & Filter Icons */}
          <div className="flex gap-2 md:gap-4 text-gray-600 items-center">
            <button
              onClick={handleToggleSearch}
              className="p-2 cursor-pointer hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center active:scale-95"
              aria-label="Toggle search"
            >
              {isSearchOpen ? (
                <X className="w-5 h-5 md:w-6 md:h-6 text-gray-800" />
              ) : (
                <Search className="w-5 h-5 md:w-6 md:h-6 hover:text-blue-800 transition-colors" />
              )}
            </button>
          </div>
        </header>

        {/* Conditionally Rendered Search Input */}
        {isSearchOpen && (
          <div className="mb-6 animate-in slide-in-from-top-2 fade-in duration-200">
            <input
              type="text"
              autoFocus
              placeholder="Search proposals by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-100 rounded-xl px-4 py-3 md:py-3.5 text-sm outline-none border border-transparent focus:border-blue-800 focus:bg-white focus:shadow-sm transition-all"
            />
          </div>
        )}

        {/* Filter Toolbar (Tabs) */}
        <div className="flex gap-2 mb-6 md:mb-8 overflow-x-auto pb-2 no-scrollbar whitespace-nowrap">
          <button
            onClick={() => {
              setActiveTab("All");
              setSearchQuery("");
            }}
            className={`px-5 py-2 rounded-full cursor-pointer text-sm font-semibold transition-colors ${
              activeTab === "All"
                ? "bg-blue-800 text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All
          </button>

          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setSearchQuery("");
              }}
              className={`px-5 py-2 rounded-full cursor-pointer text-sm font-semibold transition-colors ${
                activeTab === tab
                  ? "bg-blue-800 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ------------------------------------------------ */}
        {/* Main Content                                     */}
        {/* ------------------------------------------------ */}

        {filteredProposals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 md:py-24 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 text-center px-4">
            <p className="text-gray-500 mb-6 font-medium">
              {activeTab === "All" && !searchQuery
                ? "You have no proposals yet."
                : searchQuery
                  ? `No results found for "${searchQuery}"`
                  : `No proposals found in ${activeTab}`}
            </p>

            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-800 cursor-pointer text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-900 transition-all active:scale-95 shadow-md"
            >
              New Submission
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredProposals.map((proposal) => {
              const status = proposal.status?.toLowerCase();

              // Group 'awaiting modifications' and 'under review' together for routing purposes
              const canViewDetails =
                status === "awaiting modifications" ||
                status === "under review";
              const isApproved = status === "approved";
              const isRejected = status === "rejected";
              const isDecisionFinal = isApproved || isRejected;

              const isPaid = proposal.payment?.status === "paid";
              const isSubmitted = proposal.versionCount > 0;

              const statusInfo = getStatusStyles(proposal.status);

              const reviewerName =
                proposal.reviewerName || "Pending Assignment";
              const reviewerAvatar = proposal.reviewerPhoto || "";

              /* ------------------------------------------ */
              /* Card Navigation Logic                      */
              /* ------------------------------------------ */

              const handleCardClick = () => {
                if (isDecisionFinal) {
                  navigate(
                    `/researcher/dashboard/proposals/${proposal._id}/decision`,
                  );
                  return;
                }
                if (canViewDetails) {
                  navigate(
                    `/researcher/dashboard/proposals/${proposal._id}/details`,
                  );
                  return;
                }
                if (isPaid) {
                  navigate(
                    `/researcher/dashboard/proposals/${proposal._id}/draft`,
                  );
                  return;
                }
                navigate(
                  `/researcher/dashboard/proposals/${proposal._id}/draft`,
                );
              };

              /* ------------------------------------------ */
              /* Submit Proposal                            */
              /* ------------------------------------------ */

              const handleSubmit = async (e) => {
                e.stopPropagation();

                try {
                  const res = await axios.post(
                    `/researcher/proposals/${proposal._id}/submit`,
                  );

                  if (res.data.success) {
                    toast.success("Proposal submitted successfully");
                    await fetchProposals();
                    navigate(
                      `/researcher/dashboard/proposals/${proposal._id}/submitted`,
                    );
                  }
                } catch (err) {
                  toast.error(
                    err.response?.data?.message ||
                      "Submission failed. Try again.",
                  );
                }
              };

              /* ------------------------------------------ */

              return (
                <div
                  key={proposal._id}
                  onClick={handleCardClick}
                  className="bg-[#f8f9fa] rounded-2xl p-4 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 hover:shadow-md cursor-pointer border border-gray-100 hover:border-gray-300 transition-all active:scale-[0.99]"
                >
                  {/* Left Content */}
                  <div className="flex flex-col gap-2.5 w-full sm:w-auto flex-1">
                    {statusInfo.text && (
                      <span
                        className={`text-[10px] md:text-xs font-black uppercase tracking-wider ${statusInfo.color}`}
                      >
                        {statusInfo.text}
                      </span>
                    )}

                    <h3 className="text-base md:text-lg font-bold text-gray-900 max-w-xl leading-tight">
                      {proposal.title}
                    </h3>

                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden shrink-0 border border-gray-300">
                        <img
                          src={reviewerAvatar}
                          alt={reviewerName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-xs md:text-sm text-gray-600 font-medium truncate">
                        {reviewerName}
                      </span>
                    </div>
                  </div>

                  {/* ------------------------------------------------ */}
                  {/* Button Logic                                     */}
                  {/* ------------------------------------------------ */}
                  <div className="w-full sm:w-auto shrink-0 mt-2 sm:mt-0">
                    {/* Final Decision Button (Approved/Rejected) */}
                    {isDecisionFinal && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(
                            `/researcher/dashboard/proposals/${proposal._id}/decision`,
                          );
                        }}
                        className={`w-full sm:w-auto px-6 py-2.5 md:py-2 rounded-full cursor-pointer text-white text-sm font-bold transition-colors ${
                          isApproved
                            ? "bg-[#003B95] hover:bg-blue-900"
                            : "bg-[#C1121F] hover:bg-red-900"
                        }`}
                      >
                        View Decision
                      </button>
                    )}

                    {/* Awaiting Modifications or Under Review */}
                    {canViewDetails && !isDecisionFinal && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(
                            `/researcher/dashboard/proposals/${proposal._id}/details`,
                          );
                        }}
                        className="w-full sm:w-auto px-6 py-2.5 md:py-2 rounded-full cursor-pointer text-white text-sm font-bold bg-blue-800 hover:bg-blue-900 transition-colors"
                      >
                        View Details
                      </button>
                    )}

                    {/* Not Paid */}
                    {!isPaid && !canViewDetails && !isDecisionFinal && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(
                            `/researcher/dashboard/proposals/${proposal._id}/payment?txRef=${proposal.payment?.txRef}`,
                          );
                        }}
                        className="w-full sm:w-auto px-8 py-2.5 md:py-2 cursor-pointer rounded-full text-white text-sm font-bold bg-blue-800 hover:bg-blue-900 transition-colors"
                      >
                        Pay
                      </button>
                    )}

                    {/* Paid but not submitted */}
                    {isPaid &&
                      !isSubmitted &&
                      !canViewDetails &&
                      !isDecisionFinal && (
                        <button
                          onClick={handleSubmit}
                          className="w-full sm:w-auto px-8 py-2.5 md:py-2 rounded-full cursor-pointer text-white text-sm font-bold bg-green-600 hover:bg-green-700 transition-colors shadow-sm"
                        >
                          Submit
                        </button>
                      )}

                    {/* Paid and submitted (Pending review or fully finalized) */}
                    {!canViewDetails &&
                      !isDecisionFinal &&
                      isPaid &&
                      isSubmitted && (
                        <button
                          disabled
                          className="w-full sm:w-auto px-6 py-2.5 md:py-2 rounded-full text-sm font-bold bg-gray-200 text-gray-500 cursor-not-allowed"
                        >
                          Submitted
                        </button>
                      )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ------------------------------------------------ */}
      {/* Create Proposal Modal                            */}
      {/* ------------------------------------------------ */}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4 sm:p-0">
          <div className="bg-white p-6 sm:p-8 rounded-3xl sm:rounded-2xl w-full sm:w-100 max-w-md relative animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200 shadow-2xl">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute right-4 top-4 sm:right-5 sm:top-5 p-2 rounded-full hover:bg-gray-100 cursor-pointer transition-colors"
              aria-label="Close modal"
            >
              <X size={20} className="text-gray-500" />
            </button>

            <h3 className="text-lg md:text-xl font-bold mb-6 text-gray-900 pr-8">
              Create New Proposal
            </h3>

            <div>
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 block">
                Proposal Title
              </label>
              <input
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter proposal title..."
                className="w-full cursor-text bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 sm:py-3 mb-8 focus:outline-none focus:ring-2 focus:ring-blue-800/50 focus:border-blue-800 transition-all text-sm sm:text-base"
              />
            </div>

            <button
              onClick={async () => {
                if (!title.trim()) {
                  toast.error("Proposal title is required");
                  return;
                }

                try {
                  const res = await axios.post("/researcher/create-proposal", {
                    title,
                  });

                  toast.success("Created as draft successfully");

                  const proposalId = res.data.proposal._id;

                  navigate(
                    `/researcher/dashboard/proposals/${proposalId}/draft`,
                  );
                } catch (err) {
                  toast.error(
                    err.response?.data?.message || "Failed to create proposal",
                  );
                }
              }}
              className="w-full cursor-pointer py-3.5 sm:py-3 rounded-full bg-blue-800 hover:bg-blue-900 text-white font-bold transition-all active:scale-95 shadow-md shadow-blue-900/20"
            >
              Create Draft
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Proposals;
