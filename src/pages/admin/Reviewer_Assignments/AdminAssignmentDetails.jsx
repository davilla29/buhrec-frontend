import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Search } from "lucide-react";
import axios from "../../../utils/axios";
import SmartDocumentViewer from "../../../components/SmartDocumentViewer";

function AdminAssignmentDetails() {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axios.get(
          `/admin/assignments/${assignmentId}/details`,
        );
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [assignmentId]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#FAFAFA]">
        <div className="animate-pulse text-gray-500 font-medium">
          Loading Assignment...
        </div>
      </div>
    );
  }

  if (!data)
    return (
      <div className="p-10 text-center text-red-500">Details not found.</div>
    );

  const { assignment, proposal, latestVersion, comments } = data;

  const documentContent = latestVersion?.documents?.find(
    (d) => d.type === "proposalDocument",
  );
  let rawUrl = documentContent?.url || "";
  if (rawUrl.startsWith("//")) rawUrl = `https:${rawUrl}`;
  const previewUrl = rawUrl
    ? `https://docs.google.com/gview?url=${encodeURIComponent(rawUrl)}&embedded=true`
    : "";

  // Logic for the bottom text indicator
  let bottomText = "Review not started";
  let bottomColor = "text-gray-400";

  if (assignment.status === "submitted") {
    if (assignment.decision === "approve") {
      bottomText = "Proposal Approved";
      bottomColor = "text-[#003B95] font-bold";
    } else if (assignment.decision === "reject") {
      bottomText = "Proposal Rejected";
      bottomColor = "text-[#C1121F] font-bold";
    } else {
      bottomText = "Review awaiting researcher changes";
      bottomColor = "text-yellow-600 font-medium";
    }
  } else if (assignment.status === "in_progress") {
    bottomText = "Review in progress";
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#E5E5E5] p-4 lg:p-8">
      {/* Back Header */}
      <div className="max-w-350 w-full mx-auto mb-4 flex items-center text-gray-400">
        <h1 className="text-xl font-medium tracking-wide">View Details Page</h1>
      </div>

      <div className="max-w-350 w-full mx-auto bg-white rounded-xl shadow-lg flex flex-col h-[85vh] overflow-hidden">
        {/* Main Toolbar */}
        <header className="px-6 lg:px-8 py-5 flex items-start justify-between border-b border-gray-100">
          <div className="flex gap-4 items-start w-full">
            <button
              onClick={() => navigate(-1)}
              className="p-1 mt-1 hover:bg-gray-100 rounded-full transition-colors shrink-0"
            >
              <ChevronLeft size={24} className="text-gray-900" />
            </button>
            <div className="flex-1">
              <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-1 max-w-2xl">
                {proposal.title}
              </h2>
              <div className="flex gap-6 text-xs font-semibold text-[#003B95]">
                <span>
                  Assigned{" "}
                  {new Date(assignment.assignedAt).toLocaleDateString()}
                </span>
                <span>Application ID: {proposal.applicationId}</span>
                <span className="ml-auto">Version: Latest</span>
              </div>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors shrink-0">
              <Search size={20} className="text-gray-600" />
            </button>
          </div>
        </header>

        {/* Content Layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Center Document Area */}
          <div className="flex-1 bg-gray-50 p-6 overflow-y-auto relative">
            {rawUrl ? (
              //   <iframe
              //     src={previewUrl}
              //     className="w-full h-full bg-white shadow-sm rounded-lg border border-gray-200"
              //     title="Proposal"
              //               />
              <SmartDocumentViewer url={rawUrl} />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 italic">
                No document available
              </div>
            )}

            {/* Bottom Status Text */}
            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center text-sm px-2 pointer-events-none">
              <span className={bottomColor}>{bottomText}</span>
              {assignment.status !== "submitted" && (
                <span className="text-gray-400">Review not finished</span>
              )}
            </div>
          </div>

          {/* Right Sidebar (Comments) */}
          <div className="w-80 border-l border-gray-100 bg-white flex flex-col">
            <div className="p-5 border-b border-gray-100">
              <h3 className="font-bold text-lg text-gray-900">
                {comments.length} comments
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
              {comments.length === 0 ? (
                <p className="text-center text-gray-400 text-sm mt-10">
                  No comments made yet.
                </p>
              ) : (
                comments.map((comment) => (
                  <div
                    key={comment._id}
                    className="bg-[#F8F9FA] rounded-xl p-4 shadow-sm border border-gray-100"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 overflow-hidden shrink-0">
                        {comment.reviewer?.photoUrl ? (
                          <img
                            src={comment.reviewer.photoUrl}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#003B95] font-bold text-xs">
                            {comment.reviewer?.fullName?.charAt(0) || "R"}
                          </div>
                        )}
                      </div>
                      <p className="font-bold text-xs text-gray-900">
                        {comment.reviewer?.fullName || "Reviewer"}
                      </p>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {comment.comment}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminAssignmentDetails;
