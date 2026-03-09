import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import { Bell, X } from "lucide-react";
import toast from "react-hot-toast";

function ResearcherDashboard() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const [stats, setStats] = useState({
    completedProposals: 0,
    draftProposals: 0,
    ongoingProposalStatus: "None",
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const [ongoingProposal, setOngoingProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState("");

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const res = await axios.get("/researcher/dashboard", {
          withCredentials: true,
        });
        if (res.data.success) {
          setStats(res.data.data.stats);
          setOngoingProposal(res.data.data.ongoingProposal);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-[#003B95] rounded-full animate-spin" />
          <p className="text-gray-500 font-bold animate-pulse">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 min-h-screen max-w-7xl mx-auto">
      {/* Verification Alert */}
      {!user?.isVerified && (
        <div className="bg-[#FEF9C3] p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 border border-[#EAB308]/30">
          <div>
            <p className="text-[#854D0E] font-bold text-sm md:text-base">
              Please verify your email
            </p>
            <p className="text-[#A16207] text-xs md:text-sm mt-0.5">
              You must verify your email to submit a proposal to the BUHREC
            </p>
          </div>
          <button className="text-[#854D0E] font-bold text-sm underline hover:text-[#713f0b] transition-colors whitespace-nowrap">
            Verify email
          </button>
        </div>
      )}

      {/* Header */}
      <header className="mb-8 flex justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
            Welcome,{" "}
            <span className="truncate block sm:inline">
              {user?.fullName?.split(" ")[0] ||
                user?.email?.split("@")[0] ||
                "Researcher"}
            </span>
          </h1>
          <p className="text-gray-500 text-sm md:text-base font-medium mt-1">
            Here are your stats!
          </p>
        </div>
        <button
          onClick={() => navigate("/researcher/dashboard/notifications")}
          className="p-2.5 md:p-3 cursor-pointer bg-gray-100 rounded-full hover:bg-gray-200 transition-colors shrink-0 active:scale-95"
          aria-label="Notifications"
        >
          <Bell size={22} className="text-gray-700" />
        </button>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-10 md:mb-12">
        <div className="bg-[#EDEDED] p-6 md:p-8 rounded-2xl flex flex-col justify-center">
          <p className="text-[10px] md:text-xs font-black text-gray-500 uppercase mb-2 md:mb-3 tracking-widest leading-snug">
            Completed <br className="hidden sm:block md:hidden" /> Proposals
          </p>
          <p className="text-3xl md:text-4xl font-bold text-gray-900">
            {stats.completedProposals}
          </p>
        </div>
        <div className="bg-[#EDEDED] p-6 md:p-8 rounded-2xl flex flex-col justify-center">
          <p className="text-[10px] md:text-xs font-black text-gray-500 uppercase mb-2 md:mb-3 tracking-widest leading-snug">
            Draft <br className="hidden sm:block md:hidden" /> Proposals
          </p>
          <p className="text-3xl md:text-4xl font-bold text-gray-900">
            {stats.draftProposals}
          </p>
        </div>
        <div className="bg-[#EDEDED] p-6 md:p-8 rounded-2xl sm:col-span-2 md:col-span-1 flex flex-col justify-center">
          <p className="text-[10px] md:text-xs font-black text-gray-500 uppercase mb-2 md:mb-3 tracking-widest leading-snug">
            Ongoing Proposal Status
          </p>
          <p className="text-2xl md:text-3xl font-bold text-[#003B95] capitalize">
            {stats.ongoingProposalStatus}
          </p>
        </div>
      </div>

      {/* Ongoing Proposal Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
        <h2 className="text-lg md:text-xl font-bold text-gray-900">
          Ongoing Proposal Timeline
        </h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="w-full sm:w-auto bg-[#003B95] cursor-pointer text-white px-8 py-3.5 sm:py-3 rounded-full font-bold hover:bg-blue-800 transition-all active:scale-95 shadow-md shadow-blue-900/20 text-sm md:text-base"
        >
          New Submission
        </button>
      </div>

      {/* Timeline List */}
      <div>
        {ongoingProposal && ongoingProposal.timeline?.length > 0 ? (
          <div className="space-y-4 sm:space-y-6 bg-white sm:bg-transparent p-4 sm:p-0 rounded-2xl border sm:border-none border-gray-100 shadow-sm sm:shadow-none">
            {ongoingProposal.timeline.map((event, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4"
              >
                <div className="flex items-center space-x-3 sm:space-x-4">
                  {/* The Dot */}
                  <div
                    className={`w-3 h-3 rounded-full shrink-0 ${
                      event.isCurrent
                        ? "bg-[#003B95] shadow-[0_0_0_4px_rgba(0,59,149,0.1)]"
                        : "bg-gray-300"
                    }`}
                  />
                  {/* The Label */}
                  <span
                    className={`text-sm sm:text-base font-semibold ${
                      event.isCurrent ? "text-gray-900" : "text-gray-400"
                    }`}
                  >
                    {event.label}
                  </span>
                </div>

                {/* The Date */}
                <span
                  className={`text-xs sm:text-sm font-semibold pl-6 sm:pl-0 ${
                    event.isCurrent ? "text-gray-900" : "text-gray-400"
                  }`}
                >
                  {formatDate(event.date)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 md:py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <p className="text-gray-500 font-medium">
              You have no ongoing proposals
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Click 'New Submission' to get started.
            </p>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4 sm:p-0">
          <div className="bg-white p-6 sm:p-8 rounded-3xl sm:rounded-2xl w-full sm:w-96 max-w-md relative animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">
            {/* Mobile Drag Handle */}
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6 sm:hidden"></div>

            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute right-4 top-4 sm:right-5 sm:top-5 p-2 rounded-full hover:bg-gray-100 cursor-pointer transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>

            <h3 className="text-lg font-bold mb-6 text-gray-900 pr-8">
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
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 mb-8 focus:outline-none focus:ring-2 focus:ring-[#003B95]/50 focus:border-[#003B95] transition-all text-sm sm:text-base cursor-text"
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
              className="w-full cursor-pointer py-3.5 sm:py-3 rounded-full bg-[#003B95] text-white font-bold hover:bg-blue-900 transition-all active:scale-95 shadow-md"
            >
              Create Draft
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResearcherDashboard;
