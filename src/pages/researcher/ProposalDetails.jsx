// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "../../utils/axios"; // Adjust path as needed
// import { ChevronLeft, FileText, PlusCircle } from "lucide-react";

// const ProposalDetails = () => {
//   const { proposalId } = useParams();
//   const navigate = useNavigate();

//   // State for base proposal and available versions
//   const [proposalData, setProposalData] = useState(null);
//   const [versions, setVersions] = useState([]);
//   const [loadingBaseInfo, setLoadingBaseInfo] = useState(true);

//   // State for the currently selected version and its comments
//   const [selectedVersionNum, setSelectedVersionNum] = useState(null);
//   const [currentVersionDetails, setCurrentVersionDetails] = useState(null);
//   const [comments, setComments] = useState([]);
//   const [loadingVersionData, setLoadingVersionData] = useState(false);

//   // 1. Fetch overall proposal details and the list of all versions
//   useEffect(() => {
//     const fetchBaseDetails = async () => {
//       try {
//         const res = await axios.get(
//           `/researcher/proposals/${proposalId}/versions`,
//         );
//         const { proposal, versions } = res.data;

//         setProposalData(proposal);
//         setVersions(versions);

//         // Auto-select the most recent version if versions exist
//         if (versions && versions.length > 0) {
//           // The backend sorts versions descending, so index 0 is the latest
//           setSelectedVersionNum(versions[0].versionNumber);
//         }
//       } catch (err) {
//         console.error("Failed to fetch proposal base details:", err);
//       } finally {
//         setLoadingBaseInfo(false);
//       }
//     };
//     fetchBaseDetails();
//   }, [proposalId]);

//   // 2. Fetch specific version details and comments whenever selectedVersionNum changes
//   useEffect(() => {
//     if (selectedVersionNum === null) return;

//     const fetchVersionData = async () => {
//       setLoadingVersionData(true);
//       try {
//         const res = await axios.get(
//           `/researcher/proposals/${proposalId}/versions/${selectedVersionNum}/comments`,
//         );
//         setCurrentVersionDetails(res.data.version);
//         setComments(res.data.comments);
//       } catch (err) {
//         console.error("Failed to fetch version comments:", err);
//       } finally {
//         setLoadingVersionData(false);
//       }
//     };

//     fetchVersionData();
//   }, [proposalId, selectedVersionNum]);

//   if (loadingBaseInfo) {
//     return (
//       <div className="p-10 text-center text-gray-600 font-medium">
//         Loading proposal details...
//       </div>
//     );
//   }

//   if (!proposalData) {
//     return (
//       <div className="p-10 text-center text-red-600 font-medium">
//         Proposal not found.
//       </div>
//     );
//   }

//   // Determine if the currently viewed version is the absolute latest version
//   const isLatestVersion =
//     versions.length > 0 && selectedVersionNum === versions[0].versionNumber;

//   return (
//     <div className="min-h-screen p-2">
//       {/* Header Area */}
//       <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start mb-10 gap-4">
//         <div className="flex gap-4 items-start w-full">
//           <button
//             onClick={() => navigate(-1)}
//             className="p-2 cursor-pointer bg-white rounded-full shadow-sm hover:bg-gray-100 transition shrink-0"
//           >
//             <ChevronLeft size={24} />
//           </button>

//           <div className="flex-1 px-4 md:px-6 text-left">
//             <div className="flex items-center gap-3">
//               <h1 className="text-xl font-bold text-gray-900 leading-tight uppercase">
//                 {proposalData.title}
//               </h1>
//               <span
//                 className={`px-3 py-1 text-xs font-bold rounded-full ${
//                   proposalData.status === "Under Review"
//                     ? "bg-yellow-100 text-yellow-800"
//                     : proposalData.status === "Approved"
//                       ? "bg-green-100 text-green-800"
//                       : proposalData.status === "Awaiting Modifications"
//                         ? "bg-red-100 text-red-800"
//                         : "bg-blue-100 text-blue-800"
//                 }`}
//               >
//                 {proposalData.status}
//               </span>
//             </div>

//             <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2 text-sm text-gray-500 font-medium">
//               <span>Application ID: {proposalData.applicationId}</span>
//               <span>
//                 Submitted:{" "}
//                 {proposalData.submittedAt
//                   ? new Date(proposalData.submittedAt).toLocaleDateString()
//                   : "N/A"}
//               </span>
//               {proposalData.assignedAt && (
//                 <span>
//                   Assigned:{" "}
//                   {new Date(proposalData.assignedAt).toLocaleDateString()}
//                 </span>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Version Selector */}
//         <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
//           <label
//             htmlFor="version-select"
//             className="text-sm font-bold text-gray-700"
//           >
//             Version:
//           </label>
//           <select
//             id="version-select"
//             value={selectedVersionNum || ""}
//             onChange={(e) => setSelectedVersionNum(Number(e.target.value))}
//             className="text-blue-700 font-bold bg-transparent outline-none cursor-pointer"
//           >
//             {versions.map((v) => (
//               <option key={v._id} value={v.versionNumber}>
//                 v{v.versionNumber}{" "}
//                 {v.versionNumber === proposalData.versionCount
//                   ? "(Latest)"
//                   : ""}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12">
//         {/* Sidebar Navigation & Actions */}
//         <div className="w-full md:w-56 flex flex-col gap-6">
//           {/* Action Button - Only show attach document if modifications are requested */}
//           {proposalData.status === "Awaiting Modifications" &&
//             isLatestVersion && (
//               <button
//                 onClick={() =>
//                   navigate(
//                     `/researcher/dashboard/proposals/${proposalId}/submit-revision`,
//                   )
//                 }
//                 className="cursor-pointer px-4 py-3 bg-[#003399] hover:bg-blue-900 text-white rounded-full text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition"
//               >
//                 <PlusCircle size={16} />
//                 Attach Document
//               </button>
//             )}

//           {/* Current Version Metadata
//           {currentVersionDetails && (
//             <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
//               <h3 className="text-sm font-bold text-gray-900 mb-3 border-b pb-2">
//                 Version {selectedVersionNum} Details
//               </h3>
//               <p className="text-xs text-gray-500 mb-1">
//                 <span className="font-semibold text-gray-700">Submitted: </span>
//                 {new Date(
//                   currentVersionDetails.submittedAt,
//                 ).toLocaleDateString()}
//               </p>
//               {currentVersionDetails.changeNote && (
//                 <div className="mt-3">
//                   <span className="font-semibold text-gray-700 text-xs">
//                     Change Note:
//                   </span>
//                   <p className="text-xs text-gray-600 mt-1 italic bg-gray-50 p-2 rounded">
//                     "{currentVersionDetails.changeNote}"
//                   </p>
//                 </div>
//               )}
//             </div>
//           )} */}
//         </div>

//         {/* Main Comments List */}
//         <div className="flex-1">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-xl font-bold text-gray-900">
//               Reviewer Comments ({comments.length})
//             </h2>
//           </div>

//           {loadingVersionData ? (
//             <div className="animate-pulse space-y-4">
//               {[1, 2].map((i) => (
//                 <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
//               ))}
//             </div>
//           ) : comments.length === 0 ? (
//             <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-10 text-center text-gray-500">
//               No comments available for this version.
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {comments.map((comment, idx) => (
//                 <div
//                   key={comment._id || idx}
//                   className="bg-[#EAEAEA] p-6 rounded-xl flex gap-4 border border-gray-100"
//                 >
//                   <img
//                     src={comment.reviewer?.photoUrl}
//                     alt="Reviewer"
//                     className="w-10 h-10 rounded-full bg-gray-300 object-cover"
//                   />
//                   <div>
//                     <div className="flex items-center gap-2">
//                       <h4 className="font-bold text-sm text-gray-900">
//                         {comment.reviewer?.fullName || "Anonymous Reviewer"}
//                       </h4>
//                       <span className="text-xs text-gray-500">
//                         {new Date(comment.createdAt).toLocaleDateString()}
//                       </span>
//                     </div>
//                     <p className="text-gray-700 text-sm mt-2 whitespace-pre-wrap leading-relaxed">
//                       {comment.comment}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProposalDetails;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../utils/axios"; // Adjust path as needed
import { ChevronLeft, PlusCircle } from "lucide-react";

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
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <div className="animate-pulse text-gray-500 font-medium">
          Loading proposal details...
        </div>
      </div>
    );
  }

  if (!proposalData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-10 text-center text-red-600 font-medium bg-[#FAFAFA]">
        Proposal not found.
      </div>
    );
  }

  // Determine if the currently viewed version is the absolute latest version
  const isLatestVersion =
    versions.length > 0 && selectedVersionNum === versions[0].versionNumber;

  return (
    <div className="min-h-screen mt-3 p-4 sm:p-6 lg:p-2">
      {/* Header Area */}
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 sm:mb-10 gap-6">
        {/* Title and Meta Info */}
        <div className="flex gap-3 sm:gap-4 items-start w-full lg:w-auto">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 sm:p-2 mt-0.5 sm:mt-0 cursor-pointer bg-white rounded-full shadow-sm border border-gray-100 hover:bg-gray-50 transition shrink-0"
          >
            <ChevronLeft size={24} className="text-gray-700" />
          </button>

          <div className="flex-1 text-left">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-1 sm:mb-0">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight uppercase line-clamp-2">
                {proposalData.title}
              </h1>
              <span
                className={`px-3 py-1 text-[10px] sm:text-xs font-bold rounded-full w-max uppercase tracking-wider ${
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

            <div className="flex flex-wrap gap-x-4 sm:gap-x-6 gap-y-1 sm:gap-y-2 mt-2 text-sm sm:text-sm text-gray-500 font-medium">
              <span>
                Application ID:{" "}
                <span className="text-gray-700">
                  {proposalData.applicationId}
                </span>
              </span>
              <span className="hidden sm:inline text-gray-300">|</span>
              <span>
                Submitted:{" "}
                <span className="text-gray-700">
                  {proposalData.submittedAt
                    ? new Date(proposalData.submittedAt).toLocaleDateString()
                    : "N/A"}
                </span>
              </span>
              {proposalData.assignedAt && (
                <>
                  <span className="hidden sm:inline text-gray-300">|</span>
                  <span>
                    Assigned:{" "}
                    <span className="text-gray-700">
                      {new Date(proposalData.assignedAt).toLocaleDateString()}
                    </span>
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Version Selector */}
        <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl shadow-sm border border-gray-200 w-full sm:w-auto shrink-0">
          <label
            htmlFor="version-select"
            className="text-sm font-bold text-gray-700 whitespace-nowrap"
          >
            Version:
          </label>
          <select
            id="version-select"
            value={selectedVersionNum || ""}
            onChange={(e) => setSelectedVersionNum(Number(e.target.value))}
            className="text-blue-700 font-bold bg-transparent outline-none cursor-pointer w-full"
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

      {/* Main Layout Area */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 lg:gap-12">
        {/* Sidebar Navigation & Actions */}
        <div className="w-full md:w-56 shrink-0 flex flex-col gap-6">
          {/* Action Button - Only show attach document if modifications are requested */}
          {proposalData.status === "Awaiting Modifications" &&
            isLatestVersion && (
              <button
                onClick={() =>
                  navigate(
                    `/researcher/dashboard/proposals/${proposalId}/submit-revision`,
                  )
                }
                className="w-full cursor-pointer px-4 py-3.5 sm:py-3 bg-[#003399] hover:bg-blue-900 text-white rounded-full text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-colors"
              >
                <PlusCircle size={18} />
                Attach Document
              </button>
            )}
        </div>

        {/* Main Comments List */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4 sm:mb-6 border-b border-gray-200 pb-3">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
              Reviewer Comments ({comments.length})
            </h2>
          </div>

          {loadingVersionData ? (
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-28 bg-gray-200 rounded-2xl"></div>
              ))}
            </div>
          ) : comments.length === 0 ? (
            <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-10 sm:p-16 text-center text-gray-500 shadow-sm">
              <p className="font-medium text-sm sm:text-base">
                No comments available for this version.
              </p>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-5">
              {comments.map((comment, idx) => (
                <div
                  key={comment._id || idx}
                  className="bg-white p-5 sm:p-6 rounded-2xl flex flex-col sm:flex-row gap-3 sm:gap-4 border border-gray-200 shadow-sm"
                >
                  {/* Reviewer Avatar / Fallback */}
                  <div className="w-10 h-10 rounded-full bg-blue-100 border border-blue-200 overflow-hidden shrink-0 flex items-center justify-center text-[#003B95] font-bold">
                    {comment.reviewer?.photoUrl ? (
                      <img
                        src={comment.reviewer.photoUrl}
                        alt="Reviewer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>
                        {comment.reviewer?.fullName?.charAt(0) || "R"}
                      </span>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2">
                      <h4 className="font-bold text-sm text-gray-900 leading-tight">
                        {comment.reviewer?.fullName || "Anonymous Reviewer"}
                      </h4>
                      <span className="hidden sm:inline text-gray-300">•</span>
                      <span className="text-[10px] sm:text-xs text-gray-500 font-medium">
                        {new Date(comment.createdAt).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm mt-2 sm:mt-1.5 whitespace-pre-wrap leading-relaxed bg-gray-50 p-3 sm:p-4 rounded-xl border border-gray-100">
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