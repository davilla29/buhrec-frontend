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

//   useEffect(() => {
//     const fetchDashboard = async () => {
//       try {
//         const response = await axios.get("/reviewer/dashboard");
//         setData(response.data);
//       } catch (err) {
//         console.error("Failed to fetch dashboard", err);
//       } finally {
//         setLoading(false);
//       }
//     };
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
//       fetchAssignments();
//     } catch (error) {
//       toast.error("Failed to decline assignment");
//     } finally {
//       setProcessingId(null);
//     }
//   };

//   if (loading)
//     return (
//       <div className="flex h-screen items-center justify-center bg-[#f5f5f5]">
//         <Loader2 className="animate-spin text-blue-600" size={48} />
//       </div>
//     );

//   const StatCard = ({ label, value }) => (
//     <div className="bg-[#ededed] p-6 rounded-2xl flex flex-col gap-2 min-w-45 flex-1 shadow-sm">
//       <span className="text-sm font-semibold text-gray-700">{label}</span>
//       <span className="text-4xl font-bold text-black">{value || 0}</span>
//     </div>
//   );

//   // Filter recent assignments to show ONLY those with 'assigned' status
//   const pendingAssignments =
//     data?.recentAssignments?.filter(
//       (assignment) => assignment.status === "assigned",
//     ) || [];

//   return (
//     <div className="min-h-screen p-4 font-sans text-gray-900">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="flex justify-between items-start mb-10">
//           <div>
//             <h1 className="text-3xl font-bold">Welcome, {data?.user?.name}</h1>
//             <p className="text-gray-500 text-sm mt-1">Here are your stats!</p>
//           </div>

//           <button
//             onClick={() => navigate("/reviewer/dashboard/notifications")}
//             className="p-2 hover:bg-gray-200 rounded-full"
//           >
//             <Bell size={24} className="fill-black" />
//           </button>
//         </div>

//         {/* Stats */}
//         <div className="flex gap-4 mb-12 overflow-x-auto pb-2">
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
//         <h2 className="text-2xl font-bold mb-6">New Requests</h2>

//         <div className="space-y-4">
//           {pendingAssignments.length > 0 ? (
//             pendingAssignments.map((assignment) => (
//               <div
//                 key={assignment.id}
//                 className="bg-[#ededed] p-6 rounded-xl flex justify-between items-center"
//               >
//                 <div className="max-w-2xl">
//                   <p className="text-xs text-gray-500 uppercase mb-1">
//                     New Assignment Received
//                   </p>
//                   <h3 className="text-lg font-bold">{assignment.title}</h3>
//                 </div>

//                 <div className="flex gap-3">
//                   <button
//                     onClick={() => handleAccept(assignment.id)}
//                     disabled={processingId === assignment.id}
//                     className="bg-[#d4af37] hover:bg-[#b5952f] text-white px-8 py-2 rounded-full text-sm font-bold"
//                   >
//                     {processingId === assignment.id ? "Accepting..." : "Accept"}
//                   </button>

//                   <button
//                     onClick={() => handleDecline(assignment._id)}
//                     disabled={processingId === assignment.id}
//                     className="bg-[#8b0000] hover:bg-[#6b0000] text-white px-6 py-1.5 rounded-full text-sm font-bold transition cursor-pointer shadow-sm"
//                   >
//                     {processingId === assignment.id
//                       ? "Declining..."
//                       : "Declining"}
//                   </button>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p className="text-gray-500 italic">
//               No new assignment requests found.
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ReviewerDashboard;

import React, { useState, useEffect } from "react";
import axios from "../../utils/axios";
import { Bell, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ReviewerDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

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

  const handleDecline = async (assignmentId) => {
    const reason = window.prompt("Please provide a reason for declining:");
    if (reason === null) return;

    try {
      setProcessingId(assignmentId);
      await axios.patch(`/reviewer/assignments/${assignmentId}/decline`, {
        reason,
      });
      toast.success("Assignment declined");
      fetchDashboard(); 
    } catch (error) {
      toast.error("Failed to decline assignment");
    } finally {
      setProcessingId(null);
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
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 font-sans text-gray-900 ">
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
            pendingAssignments.map((assignment) => (
              <div
                key={assignment.id}
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
                    onClick={() => handleAccept(assignment._id)}
                    disabled={processingId === assignment._id}
                    className="flex-1 md:flex-none bg-[#d4af37] hover:bg-[#b5952f] disabled:bg-gray-400 text-white px-6 sm:px-8 py-2.5 sm:py-2 rounded-full text-sm font-bold transition-colors cursor-pointer"
                  >
                    {processingId === assignment._id ? "Accepting..." : "Accept"}
                  </button>

                  <button
                    onClick={() => handleDecline(assignment._id)} 
                    disabled={processingId === assignment.id}
                    className="flex-1 md:flex-none bg-[#8b0000] hover:bg-[#6b0000] disabled:bg-gray-400 text-white px-6 py-2.5 sm:py-2 rounded-full text-sm font-bold transition-colors cursor-pointer shadow-sm"
                  >
                    {processingId === assignment._id
                      ? "Declining..."
                      : "Decline"}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-gray-50 p-8 rounded-xl border border-dashed border-gray-200 text-center">
              <p className="text-gray-500 font-medium">
                No new assignment requests found at the moment.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewerDashboard;