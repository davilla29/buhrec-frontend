import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, X, ExternalLink, FileText } from "lucide-react";
import axios from "../../utils/axios";
import SmartDocumentViewer from "../../components/SmartDocumentViewer";

// Helper to format camelCase document types
const formatDocType = (type) => {
  return type
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
};

function AdminProposalDetails() {
  const { proposalId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [assignment, setAssignment] = useState(null);

  const [showUnassignModal, setShowUnassignModal] = useState(false);
  const [unassignLoading, setUnassignLoading] = useState(false);

  // --- NEW STATE FOR SECURE DOCUMENT LOADING ---
  const [securePdfUrl, setSecurePdfUrl] = useState(null);
  const [docLoading, setDocLoading] = useState(false);
  const [docError, setDocError] = useState(false);

  // --- MODAL STATE FOR OTHER DOCUMENTS ---
  const [showDocsModal, setShowDocsModal] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const [proposalRes, assignmentRes] = await Promise.all([
          axios.get(`/admin/proposals/${proposalId}/details`),
          axios.get(`/admin/proposals/${proposalId}/assignments`),
        ]);

        if (proposalRes.data.success) {
          setData(proposalRes.data.data);
        }

        if (
          assignmentRes.data.success &&
          Array.isArray(assignmentRes.data.assignments)
        ) {
          const activeAssignment = assignmentRes.data.assignments.find(
            (a) => a.status !== "withdrawn" && a.status !== "rejected",
          );

          if (activeAssignment) {
            setAssignment(activeAssignment);
          }
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [proposalId]);

  useEffect(() => {
    const documentContent = data?.latestVersion?.documents?.find(
      (doc) => doc.type === "proposalDocument",
    );

    let rawUrl = documentContent?.url || "";

    if (!rawUrl) return;

    if (rawUrl.startsWith("//")) {
      rawUrl = `https:${rawUrl}`;
    }

    setSecurePdfUrl(rawUrl);
  }, [data]);

  const handleUnassign = async () => {
    try {
      setUnassignLoading(true);

      const res = await axios.put(
        `/admin/assignments/${assignment._id}/unassign`,
      );

      if (res.data.success) {
        setAssignment(null);
        setShowUnassignModal(false);
        setData((prev) => ({
          ...prev,
          proposal: {
            ...prev.proposal,
            status: "Waiting to be assigned",
          },
        }));
      }
    } catch (error) {
      console.error("Unassign error:", error);
    } finally {
      setUnassignLoading(false);
    }
  };

  // Filter out the main proposal document to only get the "other" documents
  const otherDocuments =
    data?.latestVersion?.documents?.filter(
      (doc) => doc.type !== "proposalDocument",
    ) || [];

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500 font-medium">
          Loading Proposal...
        </div>
      </div>
    );

  if (!data)
    return (
      <div className="p-10 text-center text-red-500">
        Proposal details not found.
      </div>
    );

  const { proposal } = data;

  return (
    <div className="flex flex-col min-h-screen ">
      <header className="bg-white px-6 lg:px-12 py-4 flex flex-wrap items-center justify-between fixed top-0 left-0 w-full z-50 border-b shadow-sm gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer shrink-0"
            aria-label="Go back"
          >
            <ChevronLeft size={24} className="text-gray-700" />
          </button>
          <div>
            <h1 className="text-base lg:text-lg font-bold text-gray-900 truncate max-w-50 md:max-w-md lg:max-w-2xl uppercase tracking-tight">
              {proposal.title}
            </h1>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] sm:text-xs font-bold text-gray-500 mt-1">
              <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded uppercase tracking-widest border border-blue-100">
                {proposal.status || "Unassigned"}
              </span>
              <span className="text-gray-400 flex items-center gap-1">
                APP ID:{" "}
                <span className="text-gray-700">{proposal.applicationId}</span>
              </span>
              <span className="text-gray-300 hidden sm:inline">|</span>
              <span className="text-gray-400 flex items-center gap-1">
                VERSION: <span className="text-gray-700">LATEST</span>
              </span>

              {otherDocuments.length > 0 && (
                <>
                  <span className="text-gray-300 cursor-pointer hidden sm:inline">
                    |
                  </span>
                  <button
                    onClick={() => setShowDocsModal(true)}
                    className="text-[#003B95] hover:text-blue-900 underline cursor-pointer transition-colors"
                  >
                    View other documents ({otherDocuments.length})
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <button
          disabled={!!assignment}
          onClick={() => {
            if (assignment) {
              setShowUnassignModal(true);
            } else {
              navigate(`/admin/dashboard/proposals/${proposalId}/assign`);
            }
          }}
          className={`px-5 py-2.5 rounded-full text-sm font-bold shadow-md transition-all transform active:scale-95 cursor-pointer whitespace-nowrap ml-auto
  ${
    assignment
      ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
      : "bg-[#003399] hover:bg-[#002266] text-white"
  }`}
        >
          {assignment ? "Assigned" : "Assign Reviewer"}
        </button>
      </header>

      <main className="flex-1 pt-28 sm:pt-24 pb-12 px-4 lg:px-8">
        <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-md overflow-hidden">
          <div className="p-6 border-b bg-gray-50 flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase text-gray-700 tracking-wider">
              Proposal Document Preview
            </h2>
            <span className="text-xs text-gray-400 italic">
              Scroll to view full document
            </span>
          </div>

          <div className="p-4 lg:p-8">
            {docLoading ? (
              <div className="py-20 text-center bg-gray-50 rounded border border-dashed border-gray-300">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#003B95] mx-auto mb-4"></div>
                <p className="text-gray-500 italic">
                  Fetching secure document...
                </p>
              </div>
            ) : docError ? (
              <div className="py-20 text-center bg-red-50 rounded border border-dashed border-red-300">
                <p className="text-red-500 font-semibold">
                  Failed to load the document. You may not have permission to
                  view it.
                </p>
              </div>
            ) : securePdfUrl ? (
              <div className="relative w-full h-[75vh] bg-gray-100 rounded border border-gray-200 shadow-inner">
                <SmartDocumentViewer url={securePdfUrl} />
              </div>
            ) : (
              <div className="py-20 text-center bg-gray-50 rounded border border-dashed border-gray-300">
                <p className="text-gray-500 italic">
                  No proposal document uploaded for this version.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* --- NEW: Other Documents Modal --- */}
      {showDocsModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setShowDocsModal(false)}
              className="absolute cursor-pointer top-4 right-4 text-gray-400 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold text-gray-900 mb-1 pr-8">
              Additional Documents
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Select a document to open it in a new tab.
            </p>

            <div className="space-y-3">
              {otherDocuments.map((doc, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    // Opens the new route in a new tab
                    window.open(
                      `/admin/dashboard/proposals/${proposalId}/document/${doc.type}`,
                      "_blank",
                    );
                  }}
                  className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-[#003B95] hover:bg-blue-50 transition-all cursor-pointer group text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-100 p-2 rounded-lg group-hover:bg-blue-100 group-hover:text-[#003B95] transition-colors">
                      <FileText size={20} />
                    </div>
                    <span className="font-semibold text-gray-800 group-hover:text-[#003B95]">
                      {formatDocType(doc.type)}
                    </span>
                  </div>
                  <ExternalLink
                    size={18}
                    className="text-gray-400 group-hover:text-[#003B95]"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Unassign Modal */}
      {showUnassignModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-60">
          <div className="bg-white rounded-lg shadow-xl w-105 p-6 relative">
            <button
              onClick={() => setShowUnassignModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
            >
              ×
            </button>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              You are about to unassign a proposal
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Unassigning a proposal will revert it to an unassigned assignment.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowUnassignModal(false)}
                className="px-4 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleUnassign}
                disabled={unassignLoading}
                className="px-5 py-2 text-sm rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold cursor-pointer"
              >
                {unassignLoading ? "Unassigning..." : "Proceed"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProposalDetails;
