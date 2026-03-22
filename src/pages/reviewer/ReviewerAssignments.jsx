import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import { Search, SlidersHorizontal, X, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const tabs = ["Unaccepted", "Not Reviewed", "Ongoing", "Completed"];

const ReviewerAssignments = () => {
  const navigate = useNavigate();

  const [assignments, setAssignments] = useState([]);
  const [activeTab, setActiveTab] = useState("Unaccepted");
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  // --- NEW: Modal State ---
  const [declineModal, setDeclineModal] = useState({
    isOpen: false,
    assignId: null,
  });
  const [declineReason, setDeclineReason] = useState("");

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/reviewer/assignments");
      setAssignments(res.data.assignments);
    } catch (error) {
      toast.error("Failed to load assignments");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (assignmentId) => {
    try {
      setProcessingId(assignmentId);
      await axios.patch(`/reviewer/assignments/${assignmentId}/accept`);
      toast.success("Assignment accepted");
      fetchAssignments();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to accept assignment",
      );
    } finally {
      setProcessingId(null);
    }
  };

  // --- Opens the modal instead of window.prompt ---
  const openDeclineModal = (assignmentId) => {
    setDeclineReason(""); // Reset reason field
    setDeclineModal({ isOpen: true, assignId: assignmentId });
  };

  const closeDeclineModal = () => {
    setDeclineModal({ isOpen: false, assignId: null });
    setDeclineReason("");
  };

  // --- Handles the actual API call from the modal ---
  const handleDeclineSubmit = async () => {
    if (!declineReason.trim()) {
      return toast.error("A reason is required to decline an assignment.");
    }

    const { assignId } = declineModal;

    try {
      setProcessingId(assignId);
      await axios.patch(`/reviewer/assignments/${assignId}/decline`, {
        reason: declineReason,
      });
      toast.success("Assignment declined");
      closeDeclineModal();
      fetchAssignments(); // Refresh to remove it from the unaccepted list
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to decline assignment",
      );
    } finally {
      setProcessingId(null);
    }
  };

  const filterAssignments = () => {
    switch (activeTab) {
      case "Unaccepted":
        return assignments.filter((a) => a.status === "assigned");
      case "Not Reviewed":
        return assignments.filter((a) => a.status === "accepted");
      case "Ongoing":
        return assignments.filter((a) => a.status === "in_progress");
      case "Completed":
        return assignments.filter((a) => a.status === "submitted");
      default:
        return assignments;
    }
  };

  // Helper to render the status text above the title
  const renderStatusBadge = (assignment) => {
    const status = assignment.proposal?.status;
    const decision = assignment.decision;

    if (status === "Approved" || decision === "approve") {
      return (
        <p className="text-[10px] sm:text-xs text-[#003B95] font-bold mb-1.5 uppercase tracking-wider">
          Review Accepted
        </p>
      );
    }
    if (status === "Rejected" || decision === "reject") {
      return (
        <p className="text-[10px] sm:text-xs text-[#8B0000] font-bold mb-1.5 uppercase tracking-wider">
          Review Rejected
        </p>
      );
    }
    if (
      status === "Awaiting Modifications" ||
      decision === "changes_requested"
    ) {
      return (
        <p className="text-[10px] sm:text-xs text-[#008000] font-bold mb-1.5 uppercase tracking-wider">
          Changes Requested
        </p>
      );
    }
    return null;
  };

  const filtered = filterAssignments();

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-2 relative">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Your Assignments
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            View all your assignments
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 sm:mb-8">
          {/* Tabs - horizontally scrollable on mobile */}
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 whitespace-nowrap hide-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 sm:px-5 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === tab
                    ? "bg-blue-800 text-white shadow-sm"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Action Icons */}
          <div className="flex gap-3 text-gray-600 self-end md:self-auto shrink-0">
            <button className="p-2 hover:bg-gray-200 rounded-full transition-colors cursor-pointer">
              <Search size={20} />
            </button>
            <button className="p-2 hover:bg-gray-200 rounded-full transition-colors cursor-pointer">
              <SlidersHorizontal size={20} />
            </button>
          </div>
        </div>

        {/* Assignments List */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-800"></div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-gray-500 text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
              <p className="font-medium">
                No assignments found in this category.
              </p>
            </div>
          ) : (
            filtered.map((assignment) => {
              const assignId = assignment._id || assignment.id;

              return (
                <div
                  key={assignId}
                  className="bg-white border border-gray-100 p-5 sm:p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-full sm:max-w-xl">
                    {renderStatusBadge(assignment)}
                    <h3 className="font-bold text-gray-900 text-base sm:text-lg leading-snug">
                      {assignment.proposal?.title}
                    </h3>
                  </div>

                  <div className="flex flex-row w-full sm:w-auto gap-3 shrink-0 mt-2 sm:mt-0">
                    {activeTab === "Unaccepted" && (
                      <>
                        <button
                          onClick={() => handleAccept(assignId)}
                          disabled={processingId === assignId}
                          className="flex-1 sm:flex-none bg-[#d4af37] hover:bg-[#b8962e] disabled:bg-gray-400 text-white px-6 py-2.5 sm:py-2 rounded-full text-sm font-bold transition-colors cursor-pointer shadow-sm"
                        >
                          {processingId === assignId
                            ? "Accepting..."
                            : "Accept"}
                        </button>
                        <button
                          onClick={() => openDeclineModal(assignId)}
                          disabled={processingId === assignId}
                          className="flex-1 sm:flex-none bg-[#8b0000] hover:bg-[#6b0000] disabled:bg-gray-400 text-white px-6 py-2.5 sm:py-2 rounded-full text-sm font-bold transition-colors cursor-pointer shadow-sm"
                        >
                          Decline
                        </button>
                      </>
                    )}

                    {activeTab === "Not Reviewed" && (
                      <button
                        onClick={() =>
                          navigate(
                            `/reviewer/dashboard/assignments/${assignId}/review`,
                          )
                        }
                        className="w-full sm:w-auto bg-[#d4af37] hover:bg-[#b8962e] text-white px-8 py-2.5 sm:py-2 rounded-full text-sm font-bold transition-colors cursor-pointer shadow-sm"
                      >
                        Begin Review
                      </button>
                    )}

                    {activeTab === "Ongoing" && (
                      <button
                        onClick={() =>
                          navigate(
                            `/reviewer/dashboard/assignments/${assignId}/review`,
                          )
                        }
                        className="w-full sm:w-auto bg-blue-700 hover:bg-blue-800 text-white px-8 py-2.5 sm:py-2 rounded-full text-sm font-bold transition-colors cursor-pointer shadow-sm"
                      >
                        Continue Review
                      </button>
                    )}

                    {activeTab === "Completed" && (
                      <button
                        onClick={() =>
                          navigate(
                            `/reviewer/dashboard/assignments/${assignId}/review`,
                          )
                        }
                        className="w-full sm:w-auto bg-[#00c853] hover:bg-[#00a344] text-white px-8 py-2.5 sm:py-2 rounded-full text-sm font-bold transition-colors cursor-pointer shadow-sm"
                      >
                        Inspect Review
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* --- DECLINE MODAL --- */}
      {declineModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 sm:p-8 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button
              onClick={closeDeclineModal}
              disabled={processingId === declineModal.assignId}
              className="absolute right-4 top-4 p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-full transition-colors cursor-pointer disabled:opacity-50"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Decline Assignment
            </h3>
            <p className="text-sm text-gray-500 mb-5">
              Please provide a brief reason for declining this assignment.
            </p>

            <textarea
              className="w-full border border-gray-300 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#8b0000] focus:border-transparent resize-none bg-gray-50"
              rows={4}
              placeholder="E.g., Currently overloaded with other tasks, conflict of interest, etc."
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              disabled={processingId === declineModal.assignId}
            ></textarea>

            <div className="flex gap-3 mt-6">
              <button
                onClick={closeDeclineModal}
                disabled={processingId === declineModal.assignId}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-full text-sm font-bold hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeclineSubmit}
                disabled={processingId === declineModal.assignId}
                className="flex-1 bg-[#8b0000] hover:bg-[#6b0000] text-white px-4 py-2.5 rounded-full text-sm font-bold transition-colors cursor-pointer shadow-sm disabled:bg-gray-400 flex items-center justify-center gap-2"
              >
                {processingId === declineModal.assignId ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Declining...
                  </>
                ) : (
                  "Submit & Decline"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewerAssignments;

// import React, { useEffect, useState } from "react";
// import axios from "../../utils/axios";
// import { Search, SlidersHorizontal } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";

// const tabs = ["Unaccepted", "Not Reviewed", "Ongoing", "Completed"];

// const ReviewerAssignments = () => {
//   const navigate = useNavigate();

//   const [assignments, setAssignments] = useState([]);
//   const [activeTab, setActiveTab] = useState("Unaccepted");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchAssignments();
//   }, []);

//   const fetchAssignments = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get("/reviewer/assignments");
//       setAssignments(res.data.assignments);
//     } catch (error) {
//       toast.error("Failed to load assignments");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAccept = async (assignmentId) => {
//     try {
//       await axios.patch(`/reviewer/assignments/${assignmentId}/accept`);
//       toast.success("Assignment accepted");
//       fetchAssignments();
//     } catch (error) {
//       toast.error(
//         error.response?.data?.message || "Failed to accept assignment",
//       );
//     }
//   };

//   const handleDecline = async (assignmentId) => {
//     const reason = window.prompt("Please provide a reason for declining:");
//     if (reason === null) return;

//     try {
//       await axios.patch(`/reviewer/assignments/${assignmentId}/decline`, {
//         reason,
//       });
//       toast.success("Assignment declined");
//       fetchAssignments();
//     } catch (error) {
//       toast.error("Failed to decline assignment");
//     }
//   };

//   const filterAssignments = () => {
//     switch (activeTab) {
//       case "Unaccepted":
//         return assignments.filter((a) => a.status === "assigned");
//       case "Not Reviewed":
//         return assignments.filter((a) => a.status === "accepted");
//       case "Ongoing":
//         return assignments.filter((a) => a.status === "in_progress");
//       case "Completed":
//         return assignments.filter((a) => a.status === "submitted");
//       default:
//         return assignments;
//     }
//   };

//   // Helper to render the status text above the title
//   const renderStatusBadge = (assignment) => {
//     const status = assignment.proposal?.status;
//     const decision = assignment.decision;

//     if (status === "Approved" || decision === "approve") {
//       return (
//         <p className="text-[10px] sm:text-xs text-[#003B95] font-bold mb-1.5 uppercase tracking-wider">
//           Review Accepted
//         </p>
//       );
//     }
//     if (status === "Rejected" || decision === "reject") {
//       return (
//         <p className="text-[10px] sm:text-xs text-[#8B0000] font-bold mb-1.5 uppercase tracking-wider">
//           Review Rejected
//         </p>
//       );
//     }
//     if (
//       status === "Awaiting Modifications" ||
//       decision === "changes_requested"
//     ) {
//       return (
//         <p className="text-[10px] sm:text-xs text-[#008000] font-bold mb-1.5 uppercase tracking-wider">
//           Changes Requested
//         </p>
//       );
//     }
//     return null;
//   };

//   const filtered = filterAssignments();

//   return (
//     <div className="min-h-screen p-4 sm:p-6 lg:p-2">
//       <div className="max-w-5xl mx-auto">
//         {/* Header */}
//         <div className="mb-6 sm:mb-8">
//           <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
//             Your Assignments
//           </h1>
//           <p className="text-gray-500 text-sm mt-1">
//             View all your assignments
//           </p>
//         </div>

//         {/* Toolbar */}
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 sm:mb-8">
//           {/* Tabs - horizontally scrollable on mobile */}
//           <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 whitespace-nowrap hide-scrollbar">
//             {tabs.map((tab) => (
//               <button
//                 key={tab}
//                 onClick={() => setActiveTab(tab)}
//                 className={`px-4 sm:px-5 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
//                   activeTab === tab
//                     ? "bg-blue-800 text-white shadow-sm"
//                     : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//                 }`}
//               >
//                 {tab}
//               </button>
//             ))}
//           </div>

//           {/* Action Icons */}
//           <div className="flex gap-3 text-gray-600 self-end md:self-auto shrink-0">
//             <button className="p-2 hover:bg-gray-200 rounded-full transition-colors cursor-pointer">
//               <Search size={20} />
//             </button>
//             <button className="p-2 hover:bg-gray-200 rounded-full transition-colors cursor-pointer">
//               <SlidersHorizontal size={20} />
//             </button>
//           </div>
//         </div>

//         {/* Assignments List */}
//         <div className="space-y-4">
//           {loading ? (
//             <div className="flex justify-center py-20">
//               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-800"></div>
//             </div>
//           ) : filtered.length === 0 ? (
//             <div className="text-gray-500 text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
//               <p className="font-medium">
//                 No assignments found in this category.
//               </p>
//             </div>
//           ) : (
//             filtered.map((assignment) => (
//               <div
//                 key={assignment._id}
//                 className="bg-white border border-gray-100 p-5 sm:p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 shadow-sm hover:shadow-md transition-shadow"
//               >
//                 <div className="w-full sm:max-w-xl">
//                   {renderStatusBadge(assignment)}
//                   <h3 className="font-bold text-gray-900 text-base sm:text-lg leading-snug">
//                     {assignment.proposal?.title}
//                   </h3>
//                 </div>

//                 <div className="flex flex-row w-full sm:w-auto gap-3 shrink-0 mt-2 sm:mt-0">
//                   {activeTab === "Unaccepted" && (
//                     <>
//                       <button
//                         onClick={() => handleAccept(assignment._id)}
//                         className="flex-1 sm:flex-none bg-[#d4af37] hover:bg-[#b8962e] text-white px-6 py-2.5 sm:py-2 rounded-full text-sm font-bold transition-colors cursor-pointer shadow-sm"
//                       >
//                         Accept
//                       </button>
//                       <button
//                         onClick={() => handleDecline(assignment._id)}
//                         className="flex-1 sm:flex-none bg-[#8b0000] hover:bg-[#6b0000] text-white px-6 py-2.5 sm:py-2 rounded-full text-sm font-bold transition-colors cursor-pointer shadow-sm"
//                       >
//                         Decline
//                       </button>
//                     </>
//                   )}

//                   {activeTab === "Not Reviewed" && (
//                     <button
//                       onClick={() =>
//                         navigate(
//                           `/reviewer/dashboard/assignments/${assignment._id}/review`,
//                         )
//                       }
//                       className="w-full sm:w-auto bg-[#d4af37] hover:bg-[#b8962e] text-white px-8 py-2.5 sm:py-2 rounded-full text-sm font-bold transition-colors cursor-pointer shadow-sm"
//                     >
//                       Begin Review
//                     </button>
//                   )}

//                   {activeTab === "Ongoing" && (
//                     <button
//                       onClick={() =>
//                         navigate(
//                           `/reviewer/dashboard/assignments/${assignment._id}/review`,
//                         )
//                       }
//                       className="w-full sm:w-auto bg-blue-700 hover:bg-blue-800 text-white px-8 py-2.5 sm:py-2 rounded-full text-sm font-bold transition-colors cursor-pointer shadow-sm"
//                     >
//                       Continue Review
//                     </button>
//                   )}

//                   {activeTab === "Completed" && (
//                     <button
//                       onClick={() =>
//                         navigate(
//                           `/reviewer/dashboard/assignments/${assignment._id}/review`,
//                         )
//                       }
//                       className="w-full sm:w-auto bg-[#00c853] hover:bg-[#00a344] text-white px-8 py-2.5 sm:py-2 rounded-full text-sm font-bold transition-colors cursor-pointer shadow-sm"
//                     >
//                       Inspect Review
//                     </button>
//                   )}
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ReviewerAssignments;
