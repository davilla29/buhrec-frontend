// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { ChevronLeft, Search } from "lucide-react";
// import axios from "../../utils/axios";

// function AdminProposalDetails() {
//   const { proposalId } = useParams();
//   const navigate = useNavigate();
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchDetails = async () => {
//       try {
//         const response = await axios.get(
//           `/admin/proposals/${proposalId}/details`,
//         );
//         if (response.data.success) setData(response.data.data);
//       } catch (err) {
//         console.error("Fetch error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchDetails();
//   }, [proposalId]);

//   if (loading)
//     return (
//       <div className="h-screen flex items-center justify-center">
//         Loading Proposal...
//       </div>
//     );

//   if (!data)
//     return (
//       <div className="p-10 text-center text-red-500">
//         Proposal details not found.
//       </div>
//     );

//   const { proposal, latestVersion } = data;
//   const documentContent = latestVersion?.documents?.find(
//     (doc) => doc.type === "proposalDocument",
//   );

//   return (
//     <div className="flex flex-col min-h-screen ">
//       {/* Top Sticky Header */}
//       <header className="bg-white px-8 py-5 flex items-center justify-between  fixed top-0 z-120 ">
//         <div className="flex items-center gap-5">
//           <button
//             onClick={() => navigate(-1)}
//             className="p-1.5 hover:bg-gray-100 rounded-lg"
//           >
//             <ChevronLeft size={24} className="text-gray-700" />
//           </button>
//           <div>
//             <h1 className="text-lg font-bold text-gray-900 truncate max-w-2xl uppercase tracking-tight">
//               {proposal.title}
//             </h1>
//             <div className="flex gap-4 text-[11px] font-bold text-gray-500 mt-0.5">
//               <span className="bg-gray-100 px-2 py-0.5 rounded uppercase tracking-widest">
//                 {proposal.status || "Unassigned"}
//               </span>
//               <span className="text-blue-700">
//                 APP ID: {proposal.applicationId}
//               </span>
//               <span className="text-blue-700">VERSION: LATEST</span>
//             </div>
//           </div>
//         </div>
//         <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
//           <Search size={22} className="text-gray-600" />
//         </button>
//       </header>

//       {/* Document Previewer */}
//       <div className="flex-1 overflow-y-auto p-2 lg:pt-16">
//         <div className="max-w-4xl mx-auto bg-white shadow-2xl p-8 lg:p-10 rounded-sm">
//           <h2 className="text-xl font-bold uppercase mb-6 border-b-2 border-gray-800 pb-2">
//             Proposal Document Preview
//           </h2>

//           {documentContent ? (
//             <iframe
//               src={`https://docs.google.com/gview?url=${encodeURIComponent(
//                 documentContent.url,
//               )}&embedded=true`}
//               title="Proposal Document"
//               className="w-full h-[80vh] border border-gray-300 rounded"
//             />
//           ) : (
//             <p className="text-gray-700 italic">
//               No proposal document uploaded for this version.
//             </p>
//           )}

//           {/* Assign Button Under Preview */}
//           <div className="mt-6 flex justify-center">
//             <button
//               onClick={() => navigate(`/admin/proposals/${proposalId}/assign`)}
//               className="bg-[#003399] text-white px-10 py-3.5 rounded-full font-bold shadow-2xl hover:bg-[#002266] transition-all transform hover:scale-105 active:scale-95"
//             >
//               Assign Reviewer
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AdminProposalDetails;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import axios from "../../utils/axios";

function AdminProposalDetails() {
  const { proposalId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(
          `/admin/proposals/${proposalId}/details`,
        );
        if (response.data.success) setData(response.data.data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [proposalId]);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
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

  const { proposal, latestVersion } = data;
  const documentContent = latestVersion?.documents?.find(
    (doc) => doc.type === "proposalDocument",
  );

  return (
    <div className="flex flex-col min-h-screen ">
      {/* FIXED HEADER 
          Changed: Added w-full, left-0, and border-b. 
          Standardized z-index for clarity.
      */}
      <header className="bg-white px-6 lg:px-12 py-4 flex items-center justify-between fixed top-0 left-0 w-full z-50 border-b shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Go back"
          >
            <ChevronLeft size={24} className="text-gray-700" />
          </button>
          <div>
            <h1 className="text-base lg:text-lg font-bold text-gray-900 truncate max-w-50 md:max-w-md lg:max-w-2xl uppercase tracking-tight">
              {proposal.title}
            </h1>
            <div className="flex flex-wrap gap-3 text-[10px] font-bold text-gray-500 mt-0.5">
              <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded uppercase tracking-widest border border-blue-100">
                {proposal.status || "Unassigned"}
              </span>
              <span className="text-gray-400">
                APP ID:{" "}
                <span className="text-gray-700">{proposal.applicationId}</span>
              </span>
              <span className="text-gray-400">
                VERSION: <span className="text-gray-700">LATEST</span>
              </span>
            </div>
          </div>
        </div>

        {/* Action Button replaces Search Icon */}
        <button
          onClick={() => navigate(`/admin/dashboard/proposals/${proposalId}/assign`)}
          className="bg-[#003399] text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-md hover:bg-[#002266] transition-all transform active:scale-95 cursor-pointer whitespace-nowrap"
        >
          Assign Reviewer
        </button>
      </header>

      {/* DOCUMENT PREVIEWER CONTAINER 
          Added: pt-24 to prevent the fixed header from covering the content.
      */}
      <main className="flex-1 pt-24 pb-12 px-4 lg:px-8">
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
            {documentContent ? (
              <div className="relative w-full h-[75vh] bg-gray-100 rounded border border-gray-200 shadow-inner">
                <iframe
                  src={`https://docs.google.com/gview?url=${encodeURIComponent(
                    documentContent.url,
                  )}&embedded=true`}
                  title="Proposal Document"
                  className="w-full h-full rounded"
                  loading="lazy"
                />
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
    </div>
  );
}

export default AdminProposalDetails;