import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ChevronDown, Check } from "lucide-react";
import axios from "../../utils/axios";
import toast from "react-hot-toast";

const CATEGORIES = [
  "Public Health & Epidemiology",
  "Clinical Psychology",
  "Biomedical Sciences",
  "Other",
];

const PROPOSAL_LEVELS = ["UG", "PG", "PhD", "Masters"];

const ConfirmModal = ({ onClose, onConfirm }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div
      className="absolute inset-0 bg-black/20 backdrop-blur-sm"
      onClick={onClose}
    />
    <div className="relative bg-white rounded-2xl px-20 py-15 w-full max-w-sm shadow-2xl text-center">
      <button
        onClick={onClose}
        className="absolute right-4 cursor-pointer top-4 p-1.5 hover:bg-gray-100 rounded-full"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M1 1l12 12M13 1L1 13"
            stroke="#9CA3AF"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <p className="text-lg font-bold text-gray-900 mb-6">
        You are about to assign a proposal
      </p>
      <button
        onClick={onConfirm}
        className="bg-[#003B95] cursor-pointer text-white px-10 py-3 rounded-full font-bold text-sm hover:bg-blue-900 transition-colors"
      >
        Proceed
      </button>
    </div>
  </div>
);

const SuccessScreen = ({ title, date, onBack }) => (
  <div className="min-h-screen flex flex-col">
    <button
      onClick={onBack}
      className="p-4 hover:bg-gray-200 cursor-pointer rounded-full self-start m-4 transition-colors"
    >
      <ArrowLeft size={22} className="text-gray-800" />
    </button>
    <div className="flex-1 flex flex-col items-center justify-center px-8 text-center max-w-2xl mx-auto w-full">
      <p className="text-[#003B95] font-bold text-base sm:text-lg uppercase tracking-wider mb-3">
        You have successfully assigned
      </p>
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-4">
        {title}
      </h2>
      <p className="text-base sm:text-lg text-gray-500 font-medium mb-10">
        {date}
      </p>
      <button
        onClick={onBack}
        className="bg-[#003B95] cursor-pointer text-white px-10 py-3.5 rounded-full font-bold text-base hover:bg-blue-900 transition-colors shadow-md hover:shadow-lg active:scale-95"
      >
        Back to Assignments
      </button>
    </div>
  </div>
);

const AssignProposal = () => {
  const navigate = useNavigate();
  const { proposalId } = useParams();

  const [proposal, setProposal] = useState(null);
  const [reviewers, setReviewers] = useState([]);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [level, setLevel] = useState("UG");
  const [selectedReviewerId, setSelectedReviewerId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [proposalRes, reviewersRes] = await Promise.all([
          axios.get(`/admin/proposals/${proposalId}/details`),
          axios.get("/admin/reviewers"),
        ]);

        if (proposalRes.data.success) {
          const proposalData = proposalRes.data.data.proposal;
          setProposal(proposalData);

          // Set level from currentVersion.formData.category
          const cat = proposalData.currentVersion?.formData?.category || "UG";

          // Map DB category to your PROPOSAL_LEVELS display
          let displayLevel = cat;
          if (cat === "UG" || cat === "Undergraduate") displayLevel = "UG";
          else if (cat === "PG" || cat === "Postgraduate") displayLevel = "PG";
          else if (cat === "Independent/Masters") displayLevel = "Masters";
          else if (cat === "PhD") displayLevel = "PhD";

          setLevel(displayLevel);
        }

        if (reviewersRes.data.success) setReviewers(reviewersRes.data.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, [proposalId]);

  const handleConfirm = async () => {
    if (!selectedReviewerId) return;

    try {
      const res = await axios.post(
        `/admin/proposals/${proposalId}/assign-reviewer`,
        {
          reviewerId: selectedReviewerId,
        },
      );

      // Update proposal state with the new assigned date from the backend
      if (res.data.success && res.data.data?.proposal?.assignedAt) {
        setProposal((prev) => ({
          ...prev,
          assignedAt: res.data.data.proposal.assignedAt,
        }));
      } else {
        // Fallback to current time if backend doesn't return it
        setProposal((prev) => ({
          ...prev,
          assignedAt: new Date().toISOString(),
        }));
      }
      setShowConfirm(false);
      setDone(true);
    } catch (err) {
      console.error("Error assigning reviewer:", err);
      toast.error(err.response?.data?.message || "Assignment failed");
    }
  };

  if (!proposal) return <div className="p-10 text-center">Loading...</div>;

  const title = proposal.title || "Untitled Proposal";

  const date = proposal.assignedAt
    ? new Date(proposal.assignedAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
      })
    : "No Assignment Date";

  if (done) {
    return (
      <SuccessScreen
        title={title}
        date={date}
        onBack={() => navigate("/admin/dashboard/assignments")}
      />
    );
  }

  return (
    <div className="min-h-screen ">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="p-4 cursor-pointer hover:bg-gray-200 rounded-full m-4 transition-colors inline-flex"
      >
        <ArrowLeft size={22} className="text-gray-800" />
      </button>

      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mt-2 sm:mt-0">
          <p className="text-[#003B95] font-black uppercase tracking-widest text-[10px] mb-2 sm:mb-1">
            You are about to assign...
          </p>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight mb-2 sm:mb-1 pr-4">
            {title}
          </h1>
          <p className="text-xs sm:text-sm font-black text-gray-400 uppercase tracking-widest mb-8">
            {date}
          </p>
        </div>

        {/* Proposal categories + Level */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-10 w-full">
          <div className="flex-1 w-full">
            <label className="block text-xs font-black uppercase tracking-widest text-gray-800 mb-2">
              Proposal category
            </label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full appearance-none bg-[#F3F4F6] border border-gray-200 rounded-xl px-4 py-3 sm:py-3.5 pr-10 text-sm font-bold text-gray-800 outline-none focus:ring-2 focus:ring-[#003B95] transition-all shadow-sm cursor-pointer"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={18}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#003B95] pointer-events-none"
              />
            </div>
          </div>

          <div className="w-full sm:w-40 shrink-0">
            <label className="block text-xs font-black uppercase tracking-widest text-gray-800 mb-2">
              Proposal Level
            </label>
            <div className="bg-[#F3F4F6] border border-gray-200 rounded-xl px-4 py-3 sm:py-3.5 text-sm text-gray-800 font-bold shadow-sm">
              {level}
            </div>
          </div>
        </div>

        {/* Assign Reviewer */}
        <div className="mb-8">
          <h2 className="text-base font-bold text-gray-900 mb-3">
            Assign Reviewer
          </h2>

          <div className="relative mb-4">
            <select
              value={selectedReviewerId ?? ""}
              onChange={(e) =>
                setSelectedReviewerId(e.target.value ? e.target.value : null)
              }
              className="w-full appearance-none bg-[#E5E7EB] rounded-xl px-4 py-3 pr-10 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[#003B95] transition-all cursor-pointer"
            >
              <option value="">Select Reviewer</option>
              {reviewers.map((r) => (
                <option key={r._id} value={r._id}>
                  {r.fullName} — {r.specialization}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            />
          </div>

          <div className="flex justify-center mt-8">
            <button
              onClick={() => selectedReviewerId && setShowConfirm(true)}
              disabled={!selectedReviewerId}
              className={`px-10 py-3 rounded-full font-bold text-sm transition-colors ${
                selectedReviewerId
                  ? "bg-[#003B95] text-white hover:bg-blue-900 cursor-pointer"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Assign Assignment
            </button>
          </div>
        </div>
      </div>

      {showConfirm && (
        <ConfirmModal
          onClose={() => setShowConfirm(false)}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
};

export default AssignProposal;
