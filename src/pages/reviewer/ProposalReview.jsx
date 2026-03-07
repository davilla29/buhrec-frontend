import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import toast from "react-hot-toast";
import { Plus, X, ChevronDown, Info } from "lucide-react";

const ProposalReview = () => {
  const { assignmentId, version: versionParam } = useParams();
  const navigate = useNavigate();

  // State Management
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null); // Assignment, Proposal, Version
  const [versions, setVersions] = useState([]);
  const [comments, setComments] = useState([]);

  // Modal States
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showDecisionModal, setShowDecisionModal] = useState(false);
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [decisionType, setDecisionType] = useState(null); // 'approve', 'reject', 'changes'

  // Form States
  const [commentText, setCommentText] = useState("");
  const [decisionReason, setDecisionReason] = useState("");

  useEffect(() => {
    fetchReviewData();
  }, [assignmentId, versionParam]);

  const fetchReviewData = async () => {
    try {
      setLoading(true);
      const endpoint = versionParam
        ? `/reviewer/assignments/${assignmentId}/proposal/version/${versionParam}`
        : `/reviewer/assignments/${assignmentId}/proposal`;

      const res = await axios.get(endpoint);
      setData(res.data);

      // Fetch versions and comments
      const [vRes, cRes] = await Promise.all([
        axios.get(
          `/reviewer/assignments/${assignmentId}/proposal/versions`,
        ),
        axios.get(
          `/reviewer/assignments/${assignmentId}/comments?proposalVersionId=${res.data.version._id}`,
        ),
      ]);

      setVersions(vRes.data.versions);
      setComments(cRes.data.comments);
    } catch (err) {
      toast.error("Failed to load proposal data");
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return toast.error("Comment cannot be empty");
    try {
      await axios.post(`/reviewer/assignments/${assignmentId}/comments`, {
        proposalVersionId: data.version._id,
        message: commentText,
        severity: "medium",
      });
      toast.success("Comment added");
      setCommentText("");
      setShowCommentModal(false);
      fetchReviewData();
    } catch (err) {
      toast.error("Failed to add comment");
    }
  };

  const handleSubmitDecision = async (decision) => {
    try {
      // If it's "Send Comments", we use 'changes_requested' as per your logic
      const finalDecision =
        decision === "send" ? "changes_requested" : decision;

      await axios.post(`/reviewer/assignments/${assignmentId}/decision`, {
        decision: finalDecision,
        reason: decisionReason,
      });

      toast.success(
        decision === "send" ? "Comments sent successfully" : "Review completed",
      );
      navigate("/reviewer/dashboard");
    } catch (err) {
      toast.error("Submission failed");
    }
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );

  const docUrl = data?.version?.documents?.find(
    (d) => d.type === "proposalDocument",
  )?.url;

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b px-8 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex flex-col">
          <h1 className="text-xl font-bold text-gray-800 uppercase tracking-tight">
            {data?.proposal?.title}
          </h1>
          <div className="flex items-center gap-4 text-sm mt-1">
            <span
              className="text-blue-600 font-medium cursor-pointer hover:underline"
              onClick={() =>
                navigate(`/reviewer/assignments/${assignmentId}/info`)
              }
            >
              Application ID: {data?.proposal?.applicationId}
            </span>
            <span className="text-gray-400">|</span>
            <button
              onClick={() => setShowVersionModal(true)}
              className="text-blue-600 font-medium flex items-center gap-1 hover:text-blue-800"
            >
              Version:{" "}
              {versionParam ? `v${data?.version?.versionNumber}` : "Latest"}
              <ChevronDown size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex justify-center p-6 relative">
        <div className="w-full max-w-5xl bg-white shadow-sm rounded-lg overflow-hidden relative border border-gray-200">
          {/* Google Docs Iframe */}
          <div className="relative w-full h-[80vh] bg-gray-50">
            <iframe
              src={`https://docs.google.com/gview?url=${encodeURIComponent(docUrl)}&embedded=true`}
              title="Proposal Document"
              className="w-full h-full border-none"
              loading="lazy"
            />

            {/* Floating Add Comment Button */}
            <button
              onClick={() => setShowCommentModal(true)}
              className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors shadow-md"
            >
              <Plus size={24} className="text-gray-600" />
            </button>
          </div>

          {/* Dynamic Comment Count Footer */}
          <div className="bg-white border-t px-6 py-3 flex justify-end">
            <span className="text-sm text-gray-500 font-medium">
              {comments.length} comments
            </span>
          </div>
        </div>
      </main>

      {/* Footer Actions */}
      <footer className="bg-[#F3F4F6] p-6 flex justify-center gap-4">
        <button
          onClick={() => handleSubmitDecision("send")}
          disabled={comments.length === 0}
          className={`px-10 py-3 font-semibold rounded-full transition-all uppercase tracking-wide text-sm ${
            comments.length > 0
              ? "bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          Send Comments
        </button>
        <button
          onClick={() => setShowDecisionModal(true)}
          className="px-10 py-3 bg-[#003B95] text-white font-semibold rounded-full hover:bg-blue-900 transition-all uppercase tracking-wide text-sm"
        >
          Complete Review
        </button>
      </footer>

      {/* --- MODALS --- */}

      {/* 1. Add Comment Modal */}
      {showCommentModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="p-8">
              <textarea
                className="w-full h-40 p-4 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none text-gray-700"
                placeholder="Add Comment"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <div className="mt-6 flex justify-center">
                <button
                  onClick={handleAddComment}
                  className="bg-[#003B95] text-white px-8 py-2 rounded-full font-medium hover:bg-blue-900"
                >
                  Add Comment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Complete Review Decision (Accept/Reject Selection) */}
      {showDecisionModal && !decisionType && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl w-full max-w-md p-8 shadow-xl relative text-center">
            <button
              onClick={() => setShowDecisionModal(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-black"
            >
              <X size={24} />
            </button>
            <h3 className="text-xl font-semibold mb-2">
              You are about to complete your review.
            </h3>
            <p className="text-gray-500 text-sm mb-8 font-medium">
              Select an option below
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setDecisionType("reject")}
                className="bg-[#C1121F] text-white px-6 py-2 rounded-lg font-bold flex-1"
              >
                Reject Proposal
              </button>
              <button
                onClick={() => setDecisionType("approve")}
                className="bg-[#003B95] text-white px-6 py-2 rounded-lg font-bold flex-1"
              >
                Accept Proposal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Final Decision Reason Modal (Approve/Reject) */}
      {decisionType && (
        <div className="fixed inset-0 bg-white z-60 flex flex-col items-center justify-center p-6 text-center">
          <button
            onClick={() => setDecisionType(null)}
            className="absolute left-10 top-10 text-gray-800"
          >
            <X size={32} />
          </button>
          <div className="max-w-2xl w-full">
            <h2 className="text-2xl font-medium mb-1">
              You are about to {decisionType}:
            </h2>
            <h1 className="text-2xl font-bold mb-8 uppercase">
              {data?.proposal?.title}
            </h1>

            <textarea
              className="w-full h-64 p-6 bg-gray-100 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none mb-8 text-lg"
              placeholder="Add Comment (Optional)"
              value={decisionReason}
              onChange={(e) => setDecisionReason(e.target.value)}
            />

            <button
              onClick={() => handleSubmitDecision(decisionType)}
              className={`px-12 py-3 rounded-full text-white font-bold text-lg uppercase tracking-widest ${decisionType === "approve" ? "bg-[#003B95]" : "bg-[#C1121F]"}`}
            >
              {decisionType === "approve"
                ? "Approve Proposal"
                : "Reject Proposal"}
            </button>
          </div>
        </div>
      )}

      {/* 4. Version History Modal */}
      {showVersionModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl w-full max-w-sm overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-bold">Available Versions</h3>
              <X
                className="cursor-pointer"
                onClick={() => setShowVersionModal(false)}
              />
            </div>
            <div className="max-h-60 overflow-y-auto">
              {versions.map((v) => (
                <div
                  key={v._id}
                  onClick={() => {
                    navigate(
                      `/reviewer/assignments/${assignmentId}/review/${v._id}`,
                    );
                    setShowVersionModal(false);
                  }}
                  className={`p-4 border-b hover:bg-blue-50 cursor-pointer flex justify-between items-center ${v._id === data?.version?._id ? "bg-blue-50 border-l-4 border-l-blue-600" : ""}`}
                >
                  <div>
                    <p className="font-semibold text-gray-800">
                      Version {v.versionNumber}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(v.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {v.kind === "submitted" && (
                    <span className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded uppercase font-bold">
                      Submitted
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProposalReview;
