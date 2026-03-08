// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "../../utils/axios"; // Adjust path as needed
// import { ChevronLeft, FileText, PlusCircle } from "lucide-react";

// const ProposalDetails = () => {
//   const { proposalId } = useParams();
//   const navigate = useNavigate();
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchDetails = async () => {
//       try {
//         // Using listVersions to get the latest version number
//         const res = await axios.get(
//           `/researcher/proposals/${proposalId}/versions`,
//         );
//         const latestVersion = res.data.proposal.versionCount;

//         // Fetching comments for that version
//         const commentRes = await axios.get(
//           `/researcher/proposals/${proposalId}/versions/${latestVersion}/comments`,
//         );
//         setData({
//           proposal: res.data.proposal,
//           version: commentRes.data.version,
//           comments: commentRes.data.comments,
//         });
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchDetails();
//   }, [proposalId]);

//   if (loading)
//     return <div className="p-10 text-center">Loading details...</div>;

//   const sections = [
//     "Information",
//     "Chapter 1",
//     "Chapter 2",
//     "Chapter 3",
//     "References",
//     "Appendices",
//   ];

//   return (
//     <div className="min-h-screen p-2">
//       {/* Header Area */}
//       <div className="max-w-6xl mx-auto flex justify-between items-start mb-10">
//         <button
//           onClick={() => navigate(-1)}
//           className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 transition"
//         >
//           <ChevronLeft size={24} />
//         </button>
//         <div className="flex-1 px-10 text-center md:text-left">
//           <h1 className="text-xl font-bold text-gray-900 leading-tight uppercase max-w-2xl">
//             {data.proposal.title}
//           </h1>
//           <div className="flex gap-6 mt-2 text-sm text-gray-500 font-medium">
//             <span>
//               Assigned:{" "}
//               {new Date(data.proposal.assignedAt).toLocaleDateString()}
//             </span>
//             <span>Application ID: {data.proposal.applicationId}</span>
//           </div>
//         </div>
//         <div className="text-blue-700 font-bold">Version: Latest</div>
//       </div>

//       <div className="max-w-6xl mx-auto flex gap-12">
//         {/* Sidebar Navigation */}
//         <div className="w-48 flex flex-col gap-3">
//           <button
//             onClick={() =>
//               navigate(
//                 `/researcher/dashboard/proposals/${proposalId}/submit-revision`,
//               )
//             }
//             className="mt-12 cursor-pointer px-4 py-2 bg-[#003399] hover:bg-blue-900 text-white rounded-full text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
//           >
//             Attach new document
//           </button>
//         </div>

//         {/* Main Comments List */}
//         <div className="flex-1 space-y-4">
//           {data.comments.map((comment, idx) => (
//             <div
//               key={idx}
//               className="bg-[#EAEAEA] p-6 rounded-xl flex gap-4 border border-gray-100"
//             >
//               <img
//                 src="/avatar-placeholder.png"
//                 alt="Reviewer"
//                 className="w-10 h-10 rounded-full bg-gray-300"
//               />
//               <div>
//                 <h4 className="font-bold text-sm text-gray-900">
//                   {comment.reviewer?.fullName}
//                 </h4>
//                 <p className="text-gray-700 text-sm mt-2">{comment.comment}</p>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Comment Counter */}
//         <div className="w-32 flex items-center justify-center">
//           <h2 className="text-2xl font-bold text-gray-900 text-center">
//             {data.comments.length} comments
//           </h2>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProposalDetails;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../utils/axios"; // Adjust path as needed
import { ChevronLeft, FileText, PlusCircle } from "lucide-react";

const ProposalDetails = () => {
  const { proposalId } = useParams();
  const navigate = useNavigate();

  // State for base proposal and available versions
  const [proposalData, setProposalData] = useState(null);
  const [versions, setVersions] = useState([]);
  const [loadingBaseInfo, setLoadingBaseInfo] = useState(true);

  // State for the currently selected version and its comments
  const [selectedVersionNum, setSelectedVersionNum] = useState(null);
  const [currentVersionDetails, setCurrentVersionDetails] = useState(null);
  const [comments, setComments] = useState([]);
  const [loadingVersionData, setLoadingVersionData] = useState(false);

  // 1. Fetch overall proposal details and the list of all versions
  useEffect(() => {
    const fetchBaseDetails = async () => {
      try {
        const res = await axios.get(
          `/researcher/proposals/${proposalId}/versions`,
        );
        const { proposal, versions } = res.data;

        setProposalData(proposal);
        setVersions(versions);

        // Auto-select the most recent version if versions exist
        if (versions && versions.length > 0) {
          // The backend sorts versions descending, so index 0 is the latest
          setSelectedVersionNum(versions[0].versionNumber);
        }
      } catch (err) {
        console.error("Failed to fetch proposal base details:", err);
      } finally {
        setLoadingBaseInfo(false);
      }
    };
    fetchBaseDetails();
  }, [proposalId]);

  // 2. Fetch specific version details and comments whenever selectedVersionNum changes
  useEffect(() => {
    if (selectedVersionNum === null) return;

    const fetchVersionData = async () => {
      setLoadingVersionData(true);
      try {
        const res = await axios.get(
          `/researcher/proposals/${proposalId}/versions/${selectedVersionNum}/comments`,
        );
        setCurrentVersionDetails(res.data.version);
        setComments(res.data.comments);
      } catch (err) {
        console.error("Failed to fetch version comments:", err);
      } finally {
        setLoadingVersionData(false);
      }
    };

    fetchVersionData();
  }, [proposalId, selectedVersionNum]);

  if (loadingBaseInfo) {
    return (
      <div className="p-10 text-center text-gray-600 font-medium">
        Loading proposal details...
      </div>
    );
  }

  if (!proposalData) {
    return (
      <div className="p-10 text-center text-red-600 font-medium">
        Proposal not found.
      </div>
    );
  }

  // Determine if the currently viewed version is the absolute latest version
  const isLatestVersion =
    versions.length > 0 && selectedVersionNum === versions[0].versionNumber;

  return (
    <div className="min-h-screen p-2">
      {/* Header Area */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start mb-10 gap-4">
        <div className="flex gap-4 items-start w-full">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 transition shrink-0"
          >
            <ChevronLeft size={24} />
          </button>

          <div className="flex-1 px-4 md:px-6 text-left">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-gray-900 leading-tight uppercase">
                {proposalData.title}
              </h1>
              <span
                className={`px-3 py-1 text-xs font-bold rounded-full ${
                  proposalData.status === "Under Review"
                    ? "bg-yellow-100 text-yellow-800"
                    : proposalData.status === "Approved"
                      ? "bg-green-100 text-green-800"
                      : proposalData.status === "Awaiting Modifications"
                        ? "bg-red-100 text-red-800"
                        : "bg-blue-100 text-blue-800"
                }`}
              >
                {proposalData.status}
              </span>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2 text-sm text-gray-500 font-medium">
              <span>Application ID: {proposalData.applicationId}</span>
              <span>
                Submitted:{" "}
                {proposalData.submittedAt
                  ? new Date(proposalData.submittedAt).toLocaleDateString()
                  : "N/A"}
              </span>
              {proposalData.assignedAt && (
                <span>
                  Assigned:{" "}
                  {new Date(proposalData.assignedAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Version Selector */}
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
          <label
            htmlFor="version-select"
            className="text-sm font-bold text-gray-700"
          >
            Viewing Version:
          </label>
          <select
            id="version-select"
            value={selectedVersionNum || ""}
            onChange={(e) => setSelectedVersionNum(Number(e.target.value))}
            className="text-blue-700 font-bold bg-transparent outline-none cursor-pointer"
          >
            {versions.map((v) => (
              <option key={v._id} value={v.versionNumber}>
                v{v.versionNumber}{" "}
                {v.versionNumber === proposalData.versionCount
                  ? "(Latest)"
                  : ""}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12">
        {/* Sidebar Navigation & Actions */}
        <div className="w-full md:w-56 flex flex-col gap-6">
          {/* Action Button - Only show attach document if modifications are requested */}
          {proposalData.status === "Awaiting Modifications" &&
            isLatestVersion && (
              <button
                onClick={() =>
                  navigate(
                    `/researcher/dashboard/proposals/${proposalId}/submit-revision`,
                  )
                }
                className="cursor-pointer px-4 py-3 bg-[#003399] hover:bg-blue-900 text-white rounded-full text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition"
              >
                <PlusCircle size={16} />
                Submit Revision
              </button>
            )}

          {/* Current Version Metadata
          {currentVersionDetails && (
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-3 border-b pb-2">
                Version {selectedVersionNum} Details
              </h3>
              <p className="text-xs text-gray-500 mb-1">
                <span className="font-semibold text-gray-700">Submitted: </span>
                {new Date(
                  currentVersionDetails.submittedAt,
                ).toLocaleDateString()}
              </p>
              {currentVersionDetails.changeNote && (
                <div className="mt-3">
                  <span className="font-semibold text-gray-700 text-xs">
                    Change Note:
                  </span>
                  <p className="text-xs text-gray-600 mt-1 italic bg-gray-50 p-2 rounded">
                    "{currentVersionDetails.changeNote}"
                  </p>
                </div>
              )}
            </div>
          )} */}
        </div>

        {/* Main Comments List */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Reviewer Comments ({comments.length})
            </h2>
          </div>

          {loadingVersionData ? (
            <div className="animate-pulse space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          ) : comments.length === 0 ? (
            <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-10 text-center text-gray-500">
              No comments available for this version.
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment, idx) => (
                <div
                  key={comment._id || idx}
                  className="bg-[#EAEAEA] p-6 rounded-xl flex gap-4 border border-gray-100"
                >
                  <img
                    src="/avatar-placeholder.png"
                    alt="Reviewer"
                    className="w-10 h-10 rounded-full bg-gray-300 object-cover"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-gray-900">
                        {comment.reviewer?.fullName || "Anonymous Reviewer"}
                      </h4>
                      <span className="text-xs text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm mt-2 whitespace-pre-wrap leading-relaxed">
                      {comment.comment}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProposalDetails;
