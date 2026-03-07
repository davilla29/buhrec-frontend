// import React, { useState, useEffect, useMemo } from "react";
// import { Search, SlidersHorizontal, X } from "lucide-react";
// import axios from "../../utils/axios";
// import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";

// function Proposals() {
//   const navigate = useNavigate();

//   const [proposals, setProposals] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState("All");
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [title, setTitle] = useState("");

//   const tabs = ["Drafts", "Not Reviewed", "Ongoing", "Completed"];

//   useEffect(() => {
//     const fetchProposals = async () => {
//       try {
//         const response = await axios.get("/researcher/proposals");
//         if (response.data.success) {
//           setProposals(response.data.proposals);
//         }
//       } catch (error) {
//         console.error("Error fetching proposals:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProposals();
//   }, []);

//   const filteredProposals = useMemo(() => {
//     if (activeTab === "All") return proposals;

//     return proposals.filter((p) => {
//       const status = p.status?.toLowerCase();
//       switch (activeTab) {
//         case "Drafts":
//           return status === "draft";
//         case "Waiting to be assigned":
//           return status === "pending" || status === "submitted";
//         case "Ongoing":
//           return status === "under review" || status === "revisions needed";
//         case "Completed":
//           return status === "accepted" || status === "rejected";
//         default:
//           return true;
//       }
//     });
//   }, [proposals, activeTab]);

//   const getStatusStyles = (status) => {
//     switch (status?.toLowerCase()) {
//       case "rejected":
//         return { text: "Review Rejected", color: "text-red-600" };
//       case "revisions needed":
//         return { text: "Revisions Needed", color: "text-yellow-500" };
//       case "accepted":
//         return { text: "Review Accepted", color: "text-blue-600" };
//       default:
//         return { text: "", color: "" };
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex h-full items-center justify-center min-h-screen">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-800"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen p-2">
//       <div className="max-w-4xl">
//         <header className="mb-8">
//           <h1 className="text-2xl font-bold text-gray-800">Your Proposals</h1>
//           <p className="text-gray-500">Here are your proposals!</p>
//         </header>

//         {/* Filter Toolbar */}
//         <div className="flex items-center justify-between mb-6">
//           <div className="flex gap-2">
//             <button
//               onClick={() => setActiveTab("All")}
//               className={`px-4 py-1.5 rounded-full cursor-pointer text-sm font-medium transition-colors ${
//                 activeTab === "All"
//                   ? "bg-blue-800 text-white"
//                   : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//               }`}
//             >
//               All
//             </button>
//             {tabs.map((tab) => (
//               <button
//                 key={tab}
//                 onClick={() => setActiveTab(tab)}
//                 className={`px-4 py-1.5 rounded-full cursor-pointer text-sm font-medium transition-colors ${
//                   activeTab === tab
//                     ? "bg-blue-800 text-white"
//                     : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//                 }`}
//               >
//                 {tab}
//               </button>
//             ))}
//           </div>
//           <div className="flex gap-4 text-gray-600">
//             <Search className="w-5 h-5 cursor-pointer hover:text-blue-800" />
//             <SlidersHorizontal className="w-5 h-5 cursor-pointer hover:text-blue-800" />
//           </div>
//         </div>

//         {/* Main Content Area */}
//         {filteredProposals.length === 0 ? (
//           <div className="flex flex-col items-center justify-center py-20">
//             <p className="text-gray-500 mb-4">
//               {activeTab === "All"
//                 ? "You have no proposals"
//                 : `No proposals found in ${activeTab}`}
//             </p>
//             <button
//               onClick={() => setShowCreateModal(true)}
//               className="bg-[#1e40af] cursor-pointer text-white px-6 py-2 rounded-full font-medium hover:bg-blue-800 transition-all"
//             >
//               New Submission
//             </button>
//           </div>
//         ) : (
//           <div className="flex flex-col gap-4">
//             {filteredProposals.map((proposal) => {
//               const isDraft = proposal.status?.toLowerCase() === "draft";
//               const isAwaitingPayment =
//                 proposal.status?.toLowerCase() === "Awaiting Payment";
//               const statusInfo = getStatusStyles(proposal.status);
//               const isPaid = proposal.payment?.status === "paid"; // payment completed
//               const reviewerName =
//                 proposal.lastStatusChangedBy?.fullName || "Pending Assignment";
//               const reviewerAvatar =
//                 proposal.reviewer?.avatar || "/api/placeholder/24/24";

//               return (
//                 <div
//                   key={proposal._id}
//                   onClick={() =>
//                     navigate(
//                       `/researcher/dashboard/proposals/${proposal._id}/draft`,
//                     )
//                   }
//                   // onClick={() =>
//                   //   isDraft
//                   //     ? navigate(
//                   //         `/researcher/dashboard/proposals/${proposal._id}/draft`,
//                   //       )
//                   //     : navigate(
//                   //         `/researcher/dashboard/proposals/${proposal._id}/details`,
//                   //       )
//                   // }
//                   // onClick={() => {
//                   //   const status = proposal.status?.toLowerCase();

//                   //   if (status === "draft") {
//                   //     // Open draft editor
//                   //     navigate(
//                   //       `/researcher/dashboard/proposals/${proposal._id}/draft`,
//                   //     );
//                   //   } else if (status === "awaiting payment") {
//                   //     // Redirect to existing payment page with txRef
//                   //     navigate(
//                   //       `/researcher/dashboard/proposals/${proposal._id}/payment?txRef=${proposal.payment.txRef}`,
//                   //     );
//                   //   } else {
//                   //     // Open details page for all other statuses
//                   //     navigate(
//                   //       `/researcher/dashboard/proposals/${proposal._id}/details`,
//                   //     );
//                   //   }
//                   // }}
//                   className="bg-[#f0f0f0] rounded-xl p-5 flex items-center justify-between transition-shadow hover:shadow-md cursor-pointer border border-transparent hover:border-gray-300"
//                 >
//                   <div className="flex flex-col gap-2">
//                     {!isDraft && statusInfo.text && (
//                       <span className={`text-xs font-bold ${statusInfo.color}`}>
//                         {statusInfo.text}{" "}
//                         <span className="text-blue-600 ml-1">•</span>
//                       </span>
//                     )}

//                     <h3 className="text-lg font-semibold text-gray-800 leading-tight max-w-lg">
//                       {proposal.title}
//                     </h3>

//                     <div className="flex items-center gap-2 mt-1">
//                       <div className="w-6 h-6 rounded-full bg-gray-400 overflow-hidden border border-gray-200">
//                         <img
//                           src={reviewerAvatar}
//                           alt={reviewerName}
//                           className="w-full h-full object-cover"
//                         />
//                       </div>
//                       <span className="text-sm text-gray-600 font-medium">
//                         {reviewerName}
//                       </span>
//                     </div>
//                   </div>

//                   {!isDraft && !isAwaitingPayment && !isPaid && (
//                     <span
//                       className={`px-5 py-1.5 rounded-full text-white text-sm font-medium transition-colors ${
//                         proposal.status?.toLowerCase() === "revisions needed"
//                           ? "bg-[#1e40af] hover:bg-blue-900"
//                           : "bg-[#16a34a] hover:bg-green-700"
//                       }`}
//                     >
//                       View Details
//                     </span>
//                   )}
//                   {proposal.status?.toLowerCase() === "awaiting payment" && (
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation(); // avoid triggering the card click
//                         navigate(
//                           `/researcher/dashboard/proposals/${proposal._id}/payment?txRef=${proposal.payment.txRef}`,
//                         );
//                       }}
//                       className="px-5 py-1.5 rounded-full text-white text-sm font-medium bg-[#1e40af] hover:bg-blue-900"
//                     >
//                       Pay Now
//                     </button>
//                   )}
//                   {isPaid && (
//                     <button
//                       onClick={async (e) => {
//                         e.stopPropagation();
//                         try {
//                           // Call the submit function
//                           const res = await axios.post(
//                             `/researcher/proposals/${proposal._id}/submit`,
//                           );

//                           if (res.data.success) {
//                             navigate(
//                               `/researcher/dashboard/proposals/${proposal._id}/submitted`,
//                             );
//                           }
//                         } catch (err) {
//                           console.error(err);
//                           toast.error(
//                             err.response?.data?.message ||
//                               "Submission failed. Try again.",
//                           );
//                         }
//                       }}
//                       className="px-5 py-1.5 rounded-full text-white text-sm font-medium bg-green-600 hover:bg-green-700"
//                     >
//                       Submit Proposal
//                     </button>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>

//       {/* Create Modal */}
//       {showCreateModal && (
//         <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
//           <div className="bg-white p-8 rounded-2xl w-96 relative">
//             <button
//               onClick={() => setShowCreateModal(false)}
//               className="absolute cursor-pointer right-4 top-4"
//             >
//               <X size={16} />
//             </button>

//             <h3 className="font-bold mb-4">Create New Proposal</h3>

//             <input
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               placeholder="Enter proposal title"
//               className="w-full cursor-pointer bg-[#E5E7EB] rounded-xl px-4 py-3 mb-6 focus:ring-2 focus:ring-[#003B95]"
//             />

//             <button
//               onClick={async () => {
//                 if (!title.trim()) {
//                   toast.error("Proposal title is required");
//                   return;
//                 }
//                 try {
//                   const res = await axios.post("/researcher/create-proposal", {
//                     title,
//                   });

//                   toast.success("Created as draft successfully");

//                   const proposalId = res.data.proposal._id;

//                   navigate(
//                     `/researcher/dashboard/proposals/${proposalId}/draft`,
//                   );
//                 } catch (err) {
//                   toast.error(
//                     err.response?.data?.message || "Failed to create proposal",
//                   );
//                 }
//               }}
//               className="w-full cursor-pointer py-3 rounded-full bg-[#003B95] text-white font-semibold"
//             >
//               Create Draft
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Proposals;

import React, { useState, useEffect, useMemo } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import axios from "../../utils/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Proposals() {
  const navigate = useNavigate();

  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState("");

  const tabs = ["Drafts", "Not Reviewed", "Ongoing", "Completed"];

  /* ------------------------------------------------ */
  /* Fetch Proposals                                  */
  /* ------------------------------------------------ */

  const fetchProposals = async () => {
    try {
      const response = await axios.get("/researcher/proposals");

      if (response.data.success) {
        setProposals(response.data.proposals);
      }
    } catch (error) {
      console.error("Error fetching proposals:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, []);

  /* ------------------------------------------------ */
  /* Filtering Logic                                  */
  /* ------------------------------------------------ */

  const filteredProposals = useMemo(() => {
    if (activeTab === "All") return proposals;

    return proposals.filter((p) => {
      const status = p.status?.toLowerCase();

      switch (activeTab) {
        case "Drafts":
          return status === "draft";

        case "Not Reviewed":
          return status === "waiting to be assigned";

        case "Ongoing":
          return (
            status === "under review" || status === "awaiting modifications"
          );

        case "Completed":
          return status === "approved" || status === "rejected";

        default:
          return true;
      }
    });
  }, [proposals, activeTab]);

  /* ------------------------------------------------ */
  /* Status Styling                                   */
  /* ------------------------------------------------ */

  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case "rejected":
        return { text: "Review Rejected", color: "text-red-600" };

      case "awaiting modifications":
        return { text: "Modifications Requested", color: "text-yellow-500" };

      case "approved":
        return { text: "Review Approved", color: "text-blue-600" };

      default:
        return { text: "", color: "" };
    }
  };

  /* ------------------------------------------------ */

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  /* ------------------------------------------------ */

  return (
    <div className="min-h-screen p-2">
      <div className="max-w-4xl">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Your Proposals</h1>
          <p className="text-gray-500">Here are your proposals!</p>
        </header>

        {/* Filter Toolbar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("All")}
              className={`px-4 py-1.5 rounded-full cursor-pointer text-sm font-medium ${
                activeTab === "All"
                  ? "bg-blue-800 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              All
            </button>

            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-full cursor-pointer text-sm font-medium ${
                  activeTab === tab
                    ? "bg-blue-800 text-white "
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex gap-4 text-gray-600">
            <Search className="w-5 h-5 cursor-pointer hover:text-blue-800" />
            <SlidersHorizontal className="w-5 h-5 cursor-pointer hover:text-blue-800" />
          </div>
        </div>

        {/* ------------------------------------------------ */}
        {/* Main Content                                     */}
        {/* ------------------------------------------------ */}

        {filteredProposals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-gray-500 mb-4">
              {activeTab === "All"
                ? "You have no proposals"
                : `No proposals found in ${activeTab}`}
            </p>

            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-800 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-900"
            >
              New Submission
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredProposals.map((proposal) => {
              const status = proposal.status?.toLowerCase();

              const isAwaitingModifications =
                status === "awaiting modifications";

              const isPaid = proposal.payment?.status === "paid";

              const isSubmitted = proposal.versionCount > 0;

              const statusInfo = getStatusStyles(proposal.status);

              const reviewerName =
                proposal.reviewerName || "Pending Assignment";

              const reviewerAvatar =
                proposal.reviewer?.avatar || "/api/placeholder/24/24";

              /* ------------------------------------------ */
              /* Card Navigation Logic                      */
              /* ------------------------------------------ */

              const handleCardClick = () => {
                if (isAwaitingModifications) {
                  navigate(
                    `/researcher/dashboard/proposals/${proposal._id}/details`,
                  );
                  return;
                }

                if (isPaid) {
                  navigate(
                    `/researcher/dashboard/proposals/${proposal._id}/draft`,
                  );
                  return;
                }

                navigate(
                  `/researcher/dashboard/proposals/${proposal._id}/draft`,
                );
              };

              /* ------------------------------------------ */
              /* Submit Proposal                            */
              /* ------------------------------------------ */

              const handleSubmit = async (e) => {
                e.stopPropagation();

                try {
                  const res = await axios.post(
                    `/researcher/proposals/${proposal._id}/submit`,
                  );

                  if (res.data.success) {
                    toast.success("Proposal submitted successfully");

                    /* Refresh proposals (recommended improvement) */
                    await fetchProposals();

                    navigate(
                      `/researcher/dashboard/proposals/${proposal._id}/submitted`,
                    );
                  }
                } catch (err) {
                  toast.error(
                    err.response?.data?.message ||
                      "Submission failed. Try again.",
                  );
                }
              };

              /* ------------------------------------------ */

              return (
                <div
                  key={proposal._id}
                  onClick={handleCardClick}
                  className="bg-[#f0f0f0] rounded-xl p-5 flex items-center justify-between hover:shadow-md cursor-pointer border border-transparent hover:border-gray-300"
                >
                  {/* Left Content */}
                  <div className="flex flex-col gap-2">
                    {statusInfo.text && (
                      <span className={`text-xs font-bold ${statusInfo.color}`}>
                        {statusInfo.text}
                      </span>
                    )}

                    <h3 className="text-lg font-semibold text-gray-800 max-w-lg">
                      {proposal.title}
                    </h3>

                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gray-400 overflow-hidden">
                        <img
                          src={reviewerAvatar}
                          alt={reviewerName}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <span className="text-sm text-gray-600">
                        {reviewerName}
                      </span>
                    </div>
                  </div>

                  {/* ------------------------------------------------ */}
                  {/* Button Logic                                     */}
                  {/* ------------------------------------------------ */}

                  {/* Awaiting Modifications */}
                  {isAwaitingModifications && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(
                          `/researcher/dashboard/proposals/${proposal._id}/details`,
                        );
                      }}
                      className="px-5 py-1.5 rounded-full cursor-pointer text-white text-sm font-medium bg-blue-800 hover:bg-blue-900"
                    >
                      View Details
                    </button>
                  )}

                  {/* Not Paid */}
                  {!isPaid && !isAwaitingModifications && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(
                          `/researcher/dashboard/proposals/${proposal._id}/payment?txRef=${proposal.payment?.txRef}`,
                        );
                      }}
                      className="px-5 py-1.5 cursor-pointer rounded-full text-white text-sm font-medium bg-blue-800 hover:bg-blue-900"
                    >
                      Pay
                    </button>
                  )}

                  {/* Paid but not submitted */}
                  {isPaid && !isSubmitted && (
                    <button
                      onClick={handleSubmit}
                      className="px-5 py-1.5 rounded-full cursor-pointer text-white text-sm font-medium bg-green-600 hover:bg-green-700"
                    >
                      Submit
                    </button>
                  )}

                  {/* Paid and submitted */}
                  {!isAwaitingModifications && isPaid && isSubmitted && (
                    <button
                      disabled
                      className="px-5 py-1.5 rounded-full text-sm font-medium bg-gray-300 text-gray-600 cursor-not-allowed"
                    >
                      Submitted
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ------------------------------------------------ */}
      {/* Create Proposal Modal                           */}
      {/* ------------------------------------------------ */}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
          <div className="bg-white p-8 rounded-2xl w-96 relative">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute right-4 top-4"
            >
              <X size={16} />
            </button>

            <h3 className="font-bold mb-4">Create New Proposal</h3>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter proposal title"
              className="w-full bg-gray-200 rounded-xl px-4 py-3 mb-6"
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
              className="w-full py-3 rounded-full bg-blue-900 text-white font-semibold"
            >
              Create Draft
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Proposals;
