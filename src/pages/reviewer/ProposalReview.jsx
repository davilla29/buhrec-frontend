import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import toast from "react-hot-toast";
import { Plus, X, ChevronDown, Search, Info } from "lucide-react";
import SmartDocumentViewer from "../../components/SmartDocumentViewer";

const ProposalReview = () => {
  const { assignmentId, version: versionParam } = useParams();
  const navigate = useNavigate();

  // State Management
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null); // Assignment, Proposal, Version
  const [versions, setVersions] = useState([]);
  const [comments, setComments] = useState([]);

  // Search State
  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState("");

  // Modal States
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showDecisionModal, setShowDecisionModal] = useState(false);
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [decisionType, setDecisionType] = useState(null); // 'approve', 'reject', 'changes'

  // Form States
  const [commentText, setCommentText] = useState("");
  const [decisionReason, setDecisionReason] = useState("");

  // 1. Find the actual maximum version number available
  const latestVersionNumber = React.useMemo(() => {
    if (!versions || versions.length === 0) return null;
    return Math.max(...versions.map((v) => v.versionNumber));
  }, [versions]);

  // Determine if the currently viewed version is the absolute latest version
  // versions[0] is always the latest because the backend sorts by versionNumber: -1
  // 2. Check if the current data matches that number
  const isLatestVersion = data?.version?.versionNumber === latestVersionNumber;

  // Helper to check if the review is currently active AND on the latest version
  const isAssignmentActive = ["accepted", "in_progress"].includes(
    data?.assignment?.status,
  );
  const canInteract = isAssignmentActive && isLatestVersion;

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
      await Promise.all([
        axios
          .get(`/reviewer/assignments/${assignmentId}/proposal/versions`)
          .then((vRes) => setVersions(vRes.data.versions)),
        fetchComments(res.data.version._id),
      ]);
    } catch (err) {
      toast.error("Failed to load proposal data");
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (proposalVersionId) => {
    if (!proposalVersionId) return;
    try {
      const cRes = await axios.get(
        `/reviewer/assignments/${assignmentId}/comments?proposalVersionId=${proposalVersionId}`,
      );
      setComments(cRes.data.comments);
    } catch (err) {
      console.error("Fetch comments error:", err);
    }
  };

  // --- Add Comment Function ---
  const handleAddComment = async () => {
    if (!commentText.trim()) {
      return toast.error("Comment cannot be empty");
    }

    if (!data?.version?._id) {
      return toast.error("Proposal version not loaded");
    }

    const commentPromise = axios.post(
      `/reviewer/assignments/${assignmentId}/comments`,
      {
        proposalVersionId: data.version._id,
        comment: commentText,
        fieldPath: "",
        severity: "medium",
        requestsChange: true,
      },
    );

    toast.promise(commentPromise, {
      loading: "Adding comment...",
      success: () => {
        // Logic to run only on success
        setCommentText("");
        setShowCommentModal(false);
        fetchComments(data.version._id);
        return "Comment added successfully";
      },
      error: (err) => {
        console.error("Add comment error:", err.response || err);
        return err.response?.data?.message || "Failed to add comment";
      },
    });
  };

  const handleSubmitDecision = async (decision) => {
    const finalDecision = decision === "send" ? "changes_requested" : decision;
    const successMessage =
      decision === "send"
        ? "Comments sent to researcher"
        : "Decision submitted";

    // Create the promise
    const decisionPromise = axios.post(
      `/reviewer/assignments/${assignmentId}/decision`,
      {
        decision: finalDecision,
        reason: decisionReason,
      },
    );

    // Link promise to toast
    toast.promise(decisionPromise, {
      loading: "Submitting your decision...",
      success: () => {
        navigate("/reviewer/dashboard");
        return successMessage;
      },
      error: (err) => err.response?.data?.message || "Submission failed",
    });
  };

  // const handleSubmitDecision = async (decision) => {
  //   try {
  //     // If it's "Send Comments", we use 'changes_requested' as per your logic
  //     const finalDecision =
  //       decision === "send" ? "changes_requested" : decision;

  //     await axios.post(`/reviewer/assignments/${assignmentId}/decision`, {
  //       decision: finalDecision,
  //       reason: decisionReason,
  //     });

  //     toast.success(
  //       decision === "send" ? "Comments sent successfully" : "Review completed",
  //     );
  //     navigate("/reviewer/dashboard");
  //   } catch (err) {
  //     toast.error("Submission failed");
  //   }
  // };

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
    <div className="min-h-screen flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b px-4 md:px-8 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 top-0 z-10">
        <div className="flex flex-col w-full">
          <h1 className="text-lg md:text-xl font-bold text-gray-800 uppercase tracking-tight line-clamp-2 md:line-clamp-1">
            {data?.proposal?.title}
          </h1>

          <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm mt-2 md:mt-1">
            <span
              className="text-blue-600 font-medium cursor-pointer hover:underline"
              onClick={() =>
                navigate(`/reviewer/dashboard/assignments/${assignmentId}/info`)
              }
            >
              ID: {data?.proposal?.applicationId}
            </span>
            <span className="text-gray-400 hidden sm:inline">|</span>
            <button
              onClick={() => setShowVersionModal(true)}
              className="text-blue-600 cursor-pointer font-medium flex items-center gap-1 hover:text-blue-800 bg-blue-50 md:bg-transparent px-2 py-1 md:p-0 rounded"
            >
              Version:{" "}
              {versionParam ? `v${data?.version?.versionNumber}` : "Latest"}
              <ChevronDown size={14} />
            </button>

            {/* Status Indicators */}
            {!isLatestVersion ? (
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase border border-gray-200">
                Older Version (Read-Only)
              </span>
            ) : !isAssignmentActive ? (
              <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase whitespace-nowrap">
                Read Only: {data?.assignment?.status?.replace("_", " ")}
              </span>
            ) : null}

            <button
              onClick={() => setShowSearch(!showSearch)}
              className="ml-auto p-1.5 md:p-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-full transition-colors cursor-pointer border border-gray-200"
              title="Search Document"
            >
              <Search size={16} className="md:w-5 md:h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex justify-center p-3 md:p-6 relative">
        <div className="w-full max-w-5xl bg-white shadow-sm rounded-lg overflow-hidden relative border border-gray-200">
          {showSearch && (
            <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 animate-in slide-in-from-top-2">
              <Search size={18} className="text-gray-400" />
              <input
                autoFocus
                type="text"
                placeholder="Type to highlight, press Enter to jump to matches..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => {
                  // When the user presses Enter, natively scroll to the match!
                  if (e.key === "Enter" && searchText) {
                    e.preventDefault();
                    // window.find(text, caseSensitive, backwards, wrapAround)
                    window.find(searchText, false, false, true);
                  }
                }}
                className="flex-1 outline-none text-sm text-gray-700 bg-transparent"
              />
              <button
                onClick={() => {
                  setShowSearch(false);
                  setSearchText("");
                }}
                className="text-gray-400 hover:text-gray-600 p-1 bg-gray-50 rounded-md cursor-pointer transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          )}
          {/* Google Docs Iframe */}
          <div className="relative w-full h-[65vh] md:h-[80vh] bg-gray-50 flex-1">
            <SmartDocumentViewer url={docUrl} searchText={searchText} />

            {/* Floating Add Comment Button */}
            <button
              onClick={() => setShowCommentModal(true)}
              disabled={!canInteract}
              className={`absolute right-4 md:right-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all shadow-md z-10 ${
                canInteract
                  ? "bg-gray-200 hover:bg-gray-300 text-gray-600 cursor-pointer"
                  : "bg-gray-100 text-gray-300 cursor-not-allowed opacity-50"
              }`}
            >
              <Plus size={24} className="text-gray-600" />
            </button>
          </div>

          {/* Dynamic Comment Count Footer */}
          <div className="bg-white border-t px-4 md:px-6 py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            {!isLatestVersion && (
              <p className="text-xs text-red-500 font-medium flex items-start sm:items-center gap-1">
                <Info size={14} className="shrink-0 mt-0.5 sm:mt-0" />
                <span>
                  You cannot add comments to past versions. Switch to the latest
                  version.
                </span>
              </p>
            )}
            <div className="sm:ml-auto w-full sm:w-auto text-right">
              <span className="text-sm text-gray-500 font-medium bg-gray-50 px-3 py-1 rounded-full">
                {comments.length} comment{comments.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Actions */}
      <footer className="bg-[#F3F4F6] p-4 md:p-6 flex flex-col sm:flex-row justify-center gap-3 md:gap-4 border-t border-gray-200">
        <button
          onClick={() => handleSubmitDecision("send")}
          // Disabled if no comments OR if cannot interact
          disabled={comments.length === 0 || !canInteract}
          className={`w-full sm:w-auto px-6 md:px-10 py-3 md:py-3.5 font-semibold rounded-full transition-all uppercase tracking-wide text-xs md:text-sm ${
            comments.length > 0 && canInteract
              ? "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 shadow-sm cursor-pointer"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Send Comments
        </button>
        <button
          onClick={() => setShowDecisionModal(true)}
          disabled={!canInteract}
          className={`w-full sm:w-auto px-6 md:px-10 py-3 md:py-3.5 font-semibold rounded-full transition-all uppercase tracking-wide text-xs md:text-sm shadow-sm ${
            canInteract
              ? "bg-[#003B95] text-white hover:bg-blue-900 cursor-pointer"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Complete Review
        </button>
      </footer>

      {/* --- MODALS --- */}

      {/* 1. Add Comment Modal */}
      {showCommentModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden relative">
            <div className="p-8">
              <textarea
                className="w-full h-40 p-4 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none text-gray-700"
                placeholder="Add Comment"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />

              <div className="mt-6 flex justify-center gap-4">
                <button
                  onClick={handleAddComment}
                  className="bg-[#003B95] text-white px-8 py-2 rounded-full font-medium hover:bg-blue-900 cursor-pointer"
                >
                  Add Comment
                </button>

                <button
                  onClick={() => setShowCommentModal(false)}
                  className="bg-gray-200 text-gray-700 px-8 py-2 rounded-full font-medium hover:bg-gray-300 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Complete Review Decision (Accept/Reject Selection) */}
      {showDecisionModal && !decisionType && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl w-full max-w-md p-8 shadow-xl relative text-center">
            <button
              onClick={() => setShowDecisionModal(false)}
              className="absolute cursor-pointer right-4 top-4 text-gray-400 hover:text-black"
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
                className="bg-[#C1121F] cursor-pointer text-white px-6 py-2 rounded-lg font-bold flex-1"
              >
                Reject Proposal
              </button>
              <button
                onClick={() => setDecisionType("approve")}
                className="bg-[#003B95] cursor-pointer text-white px-6 py-2 rounded-lg font-bold flex-1"
              >
                Accept Proposal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Final Decision Reason Modal (Approve/Reject) */}
      {decisionType && (
        <div className="fixed inset-0 bg-white z-60 flex flex-col items-center justify-center p-4 md:p-6 text-center overflow-y-auto">
          <button
            onClick={() => setDecisionType(null)}
            className="absolute cursor-pointer right-4 top-4 md:right-8 md:top-8 text-gray-500 hover:text-gray-800 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={28} />
          </button>

          <div className="max-w-2xl w-full my-auto py-10">
            <h2 className="text-xl md:text-2xl font-medium mb-2 text-gray-600">
              You are about to {decisionType}:
            </h2>
            <h1 className="text-2xl md:text-3xl font-black mb-8 text-gray-900 uppercase tracking-tight leading-snug">
              {data?.proposal?.title}
            </h1>

            <textarea
              className="w-full h-48 md:h-64 p-4 md:p-6 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none mb-8 text-base md:text-lg text-gray-700 resize-none shadow-inner"
              placeholder="Add final comments or reasons (Optional)"
              value={decisionReason}
              onChange={(e) => setDecisionReason(e.target.value)}
            />

            <button
              onClick={() => handleSubmitDecision(decisionType)}
              className={`w-full sm:w-auto px-8 md:px-12 py-3.5 md:py-4 cursor-pointer rounded-full text-white font-bold text-sm md:text-lg uppercase tracking-widest shadow-lg transition-transform active:scale-95 ${
                decisionType === "approve"
                  ? "bg-[#003B95] hover:bg-blue-900 shadow-blue-900/20"
                  : "bg-[#C1121F] hover:bg-red-900 shadow-red-900/20"
              }`}
            >
              Confirm & {decisionType}
            </button>
          </div>
        </div>
      )}

      {/* 4. Version History Modal */}
      {showVersionModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-900">Version History</h3>
              <button
                className="p-1.5 hover:bg-gray-200 rounded-full transition-colors cursor-pointer text-gray-500"
                onClick={() => setShowVersionModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-2">
              {versions.map((v, idx) => (
                <div
                  key={v._id}
                  onClick={() => {
                    navigate(
                      `/reviewer/dashboard/assignments/${assignmentId}/review/${v._id}`,
                    );
                    setShowVersionModal(false);
                  }}
                  className={`p-4 m-2 rounded-xl cursor-pointer flex justify-between items-center transition-colors border border-transparent ${
                    v._id === data?.version?._id
                      ? "bg-blue-50 border-blue-200"
                      : "hover:bg-gray-50 hover:border-gray-200"
                  }`}
                >
                  <div>
                    <p
                      className={`font-bold ${v._id === data?.version?._id ? "text-blue-800" : "text-gray-800"}`}
                    >
                      Version {v.versionNumber}{" "}
                      {idx === 0 && (
                        <span className="text-xs font-semibold ml-1 text-gray-500">
                          (Latest)
                        </span>
                      )}
                    </p>
                    <p className="text-[11px] text-gray-500 mt-0.5 font-medium">
                      {new Date(v.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  {v.kind === "submitted" && (
                    <span className="text-[10px] bg-green-100 text-green-800 px-2.5 py-1 rounded-full uppercase font-bold tracking-wider">
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
