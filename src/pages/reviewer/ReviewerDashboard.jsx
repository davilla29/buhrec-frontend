import React, { useState, useEffect } from "react";
import axios from "../../utils/axios";
import { Bell, Loader2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ReviewerDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  // --- NEW: Modal State ---
  const [declineModal, setDeclineModal] = useState({
    isOpen: false,
    assignId: null,
  });
  const [declineReason, setDeclineReason] = useState("");

  const fetchDashboard = async () => {
    try {
      const response = await axios.get("/reviewer/dashboard");
      setData(response.data);
    } catch (err) {
      console.error("Failed to fetch dashboard", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleAccept = async (assignmentId) => {
    try {
      setProcessingId(assignmentId);
      await axios.patch(`/reviewer/assignments/${assignmentId}/accept`);
      toast.success("Assignment accepted");

      setTimeout(() => {
        navigate("/reviewer/dashboard/assignments");
      }, 800);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to accept assignment",
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
      fetchDashboard(); // Refresh to remove it from pending list
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to decline assignment",
      );
      setProcessingId(null); // Only reset here so modal button doesn't get stuck if it fails
    }
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );

  const StatCard = ({ label, value }) => (
    <div className="bg-[#ededed] p-5 sm:p-6 rounded-2xl flex flex-col gap-1 sm:gap-2 shadow-sm w-full">
      <span className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">
        {label}
      </span>
      <span className="text-3xl sm:text-4xl font-bold text-black">
        {value || 0}
      </span>
    </div>
  );

  // Filter recent assignments to show ONLY those with 'assigned' status
  const pendingAssignments =
    data?.recentAssignments?.filter(
      (assignment) => assignment.status === "assigned",
    ) || [];

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 font-sans text-gray-900 relative">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8 sm:mb-10">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">
              Welcome, {data?.user?.name}
            </h1>
            <p className="text-gray-500 text-sm mt-1">Here are your stats!</p>
          </div>

          <button
            onClick={() => navigate("/reviewer/dashboard/notifications")}
            className="p-2 sm:p-2.5 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell size={24} className="fill-black" />
          </button>
        </div>

        {/* Stats Grid - 1 col mobile, 2 col tablet, 4 col desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10 sm:mb-12">
          <StatCard
            label="Accepted Assignments"
            value={data?.stats?.accepted}
          />
          <StatCard
            label="Completed Assignments"
            value={data?.stats?.completed}
          />
          <StatCard
            label="Incomplete Assignments"
            value={data?.stats?.incomplete}
          />
          <StatCard
            label="Pending Feedback"
            value={data?.stats?.pendingFeedback}
          />
        </div>

        {/* Assignments */}
        <h2 className="text-xl sm:text-2xl font-bold mb-5 sm:mb-6">
          New Requests
        </h2>

        <div className="space-y-4">
          {pendingAssignments.length > 0 ? (
            pendingAssignments.map((assignment) => {
              // Standardize the ID so it works perfectly for the API and state checks
              const assignId = assignment._id || assignment.id;

              return (
                <div
                  key={assignId}
                  className="bg-[#ededed] p-5 sm:p-6 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6 border border-gray-200"
                >
                  <div className="w-full md:max-w-2xl">
                    <p className="text-[10px] sm:text-xs text-gray-500 font-bold tracking-wider uppercase mb-1.5">
                      New Assignment Received
                    </p>
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-snug">
                      {assignment.title}
                    </h3>
                  </div>

                  {/* Buttons stack full-width on mobile, side-by-side on tablet/desktop */}
                  <div className="flex flex-row w-full md:w-auto gap-3 shrink-0">
                    <button
                      onClick={() => handleAccept(assignId)}
                      disabled={processingId === assignId}
                      className="flex-1 md:flex-none bg-[#d4af37] hover:bg-[#b5952f] disabled:bg-gray-400 text-white px-6 sm:px-8 py-2.5 sm:py-2 rounded-full text-sm font-bold transition-colors cursor-pointer"
                    >
                      {processingId === assignId ? "Accepting..." : "Accept"}
                    </button>

                    <button
                      onClick={() => openDeclineModal(assignId)}
                      disabled={processingId === assignId}
                      className="flex-1 md:flex-none bg-[#8b0000] hover:bg-[#6b0000] disabled:bg-gray-400 text-white px-6 py-2.5 sm:py-2 rounded-full text-sm font-bold transition-colors cursor-pointer shadow-sm"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-gray-50 p-8 rounded-xl border border-dashed border-gray-200 text-center">
              <p className="text-gray-500 font-medium">
                No new assignment requests found at the moment.
              </p>
            </div>
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

export default ReviewerDashboard;

// import React, { useState, useEffect } from "react";
// import axios from "../../utils/axios";
// import { Bell, Loader2 } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";

// const ReviewerDashboard = () => {
//   const navigate = useNavigate();
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [processingId, setProcessingId] = useState(null);

//   const fetchDashboard = async () => {
//     try {
//       const response = await axios.get("/reviewer/dashboard");
//       setData(response.data);
//     } catch (err) {
//       console.error("Failed to fetch dashboard", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDashboard();
//   }, []);

//   const handleAccept = async (assignmentId) => {
//     try {
//       setProcessingId(assignmentId);
//       await axios.patch(`/reviewer/assignments/${assignmentId}/accept`);
//       toast.success("Assignment accepted");

//       setTimeout(() => {
//         navigate("/reviewer/dashboard/assignments");
//       }, 800);
//     } catch (error) {
//       toast.error(
//         error?.response?.data?.message || "Failed to accept assignment",
//       );
//     } finally {
//       setProcessingId(null);
//     }
//   };

//   const handleDecline = async (assignmentId) => {
//     const reason = window.prompt("Please provide a reason for declining:");
//     if (reason === null) return;

//     try {
//       setProcessingId(assignmentId);
//       await axios.patch(`/reviewer/assignments/${assignmentId}/decline`, {
//         reason,
//       });
//       toast.success("Assignment declined");
//       fetchDashboard();
//     } catch (error) {
//       toast.error("Failed to decline assignment");
//     } finally {
//       setProcessingId(null);
//     }
//   };

//   if (loading)
//     return (
//       <div className="flex h-screen items-center justify-center">
//         <Loader2 className="animate-spin text-blue-600" size={48} />
//       </div>
//     );

//   const StatCard = ({ label, value }) => (
//     <div className="bg-[#ededed] p-5 sm:p-6 rounded-2xl flex flex-col gap-1 sm:gap-2 shadow-sm w-full">
//       <span className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">
//         {label}
//       </span>
//       <span className="text-3xl sm:text-4xl font-bold text-black">
//         {value || 0}
//       </span>
//     </div>
//   );

//   // Filter recent assignments to show ONLY those with 'assigned' status
//   const pendingAssignments =
//     data?.recentAssignments?.filter(
//       (assignment) => assignment.status === "assigned",
//     ) || [];

//   return (
//     <div className="min-h-screen p-4 sm:p-6 lg:p-8 font-sans text-gray-900 ">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="flex justify-between items-start mb-8 sm:mb-10">
//           <div>
//             <h1 className="text-2xl sm:text-3xl font-bold">
//               Welcome, {data?.user?.name}
//             </h1>
//             <p className="text-gray-500 text-sm mt-1">Here are your stats!</p>
//           </div>

//           <button
//             onClick={() => navigate("/reviewer/dashboard/notifications")}
//             className="p-2 sm:p-2.5 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
//             aria-label="Notifications"
//           >
//             <Bell size={24} className="fill-black" />
//           </button>
//         </div>

//         {/* Stats Grid - 1 col mobile, 2 col tablet, 4 col desktop */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10 sm:mb-12">
//           <StatCard
//             label="Accepted Assignments"
//             value={data?.stats?.accepted}
//           />
//           <StatCard
//             label="Completed Assignments"
//             value={data?.stats?.completed}
//           />
//           <StatCard
//             label="Incomplete Assignments"
//             value={data?.stats?.incomplete}
//           />
//           <StatCard
//             label="Pending Feedback"
//             value={data?.stats?.pendingFeedback}
//           />
//         </div>

//         {/* Assignments */}
//         <h2 className="text-xl sm:text-2xl font-bold mb-5 sm:mb-6">
//           New Requests
//         </h2>

//         <div className="space-y-4">
//           {pendingAssignments.length > 0 ? (
//             pendingAssignments.map((assignment) => (
//               <div
//                 key={assignment.id}
//                 className="bg-[#ededed] p-5 sm:p-6 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6 border border-gray-200"
//               >
//                 <div className="w-full md:max-w-2xl">
//                   <p className="text-[10px] sm:text-xs text-gray-500 font-bold tracking-wider uppercase mb-1.5">
//                     New Assignment Received
//                   </p>
//                   <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-snug">
//                     {assignment.title}
//                   </h3>
//                 </div>

//                 {/* Buttons stack full-width on mobile, side-by-side on tablet/desktop */}
//                 <div className="flex flex-row w-full md:w-auto gap-3 shrink-0">
//                   <button
//                     onClick={() => handleAccept(assignment._id)}
//                     disabled={processingId === assignment._id}
//                     className="flex-1 md:flex-none bg-[#d4af37] hover:bg-[#b5952f] disabled:bg-gray-400 text-white px-6 sm:px-8 py-2.5 sm:py-2 rounded-full text-sm font-bold transition-colors cursor-pointer"
//                   >
//                     {processingId === assignment._id ? "Accepting..." : "Accept"}
//                   </button>

//                   <button
//                     onClick={() => handleDecline(assignment._id)}
//                     disabled={processingId === assignment.id}
//                     className="flex-1 md:flex-none bg-[#8b0000] hover:bg-[#6b0000] disabled:bg-gray-400 text-white px-6 py-2.5 sm:py-2 rounded-full text-sm font-bold transition-colors cursor-pointer shadow-sm"
//                   >
//                     {processingId === assignment._id
//                       ? "Declining..."
//                       : "Decline"}
//                   </button>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="bg-gray-50 p-8 rounded-xl border border-dashed border-gray-200 text-center">
//               <p className="text-gray-500 font-medium">
//                 No new assignment requests found at the moment.
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ReviewerDashboard;
