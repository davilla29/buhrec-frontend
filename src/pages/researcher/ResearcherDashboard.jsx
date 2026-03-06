import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import { Bell, X } from "lucide-react";
import toast from "react-hot-toast";

function ResearcherDashboard() {
  const navigate = useNavigate();

  // Get the logged-in user from authSlice
  const user = useSelector((state) => state.auth.user);

  const [stats, setStats] = useState({
    completedProposals: 0,
    draftProposals: 0,
    ongoingProposalStatus: "None",
  });
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
        <p className="text-gray-500 font-bold">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="p-2 min-h-screen">
      {/* Verification Alert */}
      {!user?.isVerified && (
        <div className="bg-[#FEF9C3] p-4 rounded-lg flex justify-between items-center mb-6 border border-[#EAB308]/30">
          <div>
            <p className="text-[#854D0E] font-bold text-sm">
              Please verify your email
            </p>
            <p className="text-[#A16207] text-xs">
              You must verify your email to submit a proposal to the BUHREC
            </p>
          </div>
          <button className="text-[#854D0E] font-bold text-sm underline">
            Verify email
          </button>
        </div>
      )}

      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome,{" "}
            {user?.fullName?.split(" ")[0] ||
              user?.email?.split("@")[0] ||
              "Researcher"}
          </h1>
          <p className="text-gray-500 text-sm font-medium">
            Here are your stats!
          </p>
        </div>
        <button
          onClick={() => navigate("/researcher/dashboard/notifications")}
          className="p-2 cursor-pointer bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
        >
          <Bell size={20} />
        </button>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-[#EDEDED] p-8 rounded-2xl">
          <p className="text-[10px] font-black text-gray-800 uppercase mb-3 tracking-widest">
            Completed Proposals
          </p>
          <p className="text-4xl font-bold">{stats.completedProposals}</p>
        </div>
        <div className="bg-[#EDEDED] p-8 rounded-2xl">
          <p className="text-[10px] font-black text-gray-800 uppercase mb-3 tracking-widest">
            Draft Proposals
          </p>
          <p className="text-4xl font-bold">{stats.draftProposals}</p>
        </div>
        <div className="bg-[#EDEDED] p-8 rounded-2xl">
          <p className="text-[10px] font-black text-gray-800 uppercase mb-3 tracking-widest">
            Ongoing Proposal Status
          </p>
          <p className="text-3xl font-bold">{stats.ongoingProposalStatus}</p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-10">
        <h2 className="text-xl font-bold">Ongoing Proposal Status</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-[#003B95] cursor-pointer text-white px-8 py-3 rounded-full font-bold hover:bg-blue-800 transition-all shadow-md"
        >
          New Submission
        </button>
      </div>

      {ongoingProposal ? (
        <div className="bg-[#F3F4F6] p-6 rounded-xl">
          <h3 className="font-bold text-lg mb-4">{ongoingProposal.title}</h3>
          <ul className="space-y-2">
            {ongoingProposal.timeline.map((event, idx) => (
              <li key={idx} className="flex items-center space-x-3">
                <span
                  className={`w-3 h-3 rounded-full ${
                    event.isCurrent ? "bg-blue-600" : "bg-green-500"
                  }`}
                />
                <span className="text-sm text-gray-700">{event.label}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-400 font-bold text-lg">
            You have no ongoing proposals
          </p>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
          <div className="bg-white px-8 py-12 rounded-2xl w-96 relative">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute right-4 top-4 cursor-pointer"
            >
              <X size={20} />
            </button>

            <h3 className="font-bold mb-4">Create New Proposal</h3>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter proposal title"
              className="w-full cursor-pointer bg-[#E5E7EB] rounded-xl px-4 py-3 mb-6 focus:ring-2 focus:ring-[#003B95]"
            />

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
              className="w-full cursor-pointer py-3 rounded-full bg-[#003B95] text-white font-semibold"
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
