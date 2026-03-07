// import React, { useState, useEffect } from "react";
// import axios from "../../utils/axios";
// import { Bell, Loader2 } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// const ReviewerDashboard = () => {
//   const navigate = useNavigate();
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);

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

//   if (loading)
//     return (
//       <div className="flex h-screen items-center justify-center bg-[#f5f5f5]">
//         <Loader2 className="animate-spin text-blue-600" size={48} />
//       </div>
//     );

//   const StatCard = ({ label, value }) => (
//     <div className="bg-[#ededed] p-6 rounded-2xl flex flex-col gap-2 min-w-45 flex-1 shadow-sm">
//       <span className="text-sm font-semibold text-gray-700 leading-tight">
//         {label}
//       </span>
//       <span className="text-4xl font-bold text-black">{value || 0}</span>
//     </div>
//   );

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
//             className="p-2 cursor-pointer hover:bg-gray-200 rounded-full transition-all"
//           >
//             <Bell size={24} className="fill-black" />
//           </button>
//         </div>

//         {/* Stats Grid */}
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

//         {/* Recent Assignments Section */}
//         <h2 className="text-2xl font-bold mb-6">Your Recent Assignments</h2>

//         <div className="space-y-4">
//           {data?.recentAssignments.length > 0 ? (
//             data.recentAssignments.map((assignment) => (
//               <div
//                 key={assignment.id}
//                 className="bg-[#ededed] p-6 rounded-xl flex justify-between items-center shadow-sm"
//               >
//                 <div className="max-w-2xl">
//                   <p className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">
//                     New Assignment Received
//                   </p>
//                   <h3 className="text-lg font-bold leading-tight text-[#1a1a1a]">
//                     {assignment.title}
//                   </h3>
//                 </div>

//                 <div className="flex gap-3">
//                   <button className="bg-[#d4af37] hover:bg-[#b5952f] text-white px-8 py-2 rounded-full text-sm font-bold transition-colors">
//                     Accept
//                   </button>
//                   <button className="bg-[#8b0000] hover:bg-[#6b0000] text-white px-8 py-2 rounded-full text-sm font-bold transition-colors">
//                     Decline
//                   </button>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p className="text-gray-500 italic">No recent assignments found.</p>
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

  useEffect(() => {
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

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-[#f5f5f5]">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );

  const StatCard = ({ label, value }) => (
    <div className="bg-[#ededed] p-6 rounded-2xl flex flex-col gap-2 min-w-45 flex-1 shadow-sm">
      <span className="text-sm font-semibold text-gray-700">{label}</span>
      <span className="text-4xl font-bold text-black">{value || 0}</span>
    </div>
  );

  return (
    <div className="min-h-screen p-4 font-sans text-gray-900">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-10">
          <div>
            <h1 className="text-3xl font-bold">Welcome, {data?.user?.name}</h1>
            <p className="text-gray-500 text-sm mt-1">Here are your stats!</p>
          </div>

          <button
            onClick={() => navigate("/reviewer/dashboard/notifications")}
            className="p-2 hover:bg-gray-200 rounded-full"
          >
            <Bell size={24} className="fill-black" />
          </button>
        </div>

        {/* Stats */}
        <div className="flex gap-4 mb-12 overflow-x-auto pb-2">
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
        <h2 className="text-2xl font-bold mb-6">Your Recent Assignments</h2>

        <div className="space-y-4">
          {data?.recentAssignments?.length > 0 ? (
            data.recentAssignments.map((assignment) => (
              <div
                key={assignment.id}
                className="bg-[#ededed] p-6 rounded-xl flex justify-between items-center"
              >
                <div className="max-w-2xl">
                  <p className="text-xs text-gray-500 uppercase mb-1">
                    New Assignment Received
                  </p>

                  <h3 className="text-lg font-bold">{assignment.title}</h3>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleAccept(assignment.id)}
                    disabled={processingId === assignment.id}
                    className="bg-[#d4af37] hover:bg-[#b5952f] text-white px-8 py-2 rounded-full text-sm font-bold"
                  >
                    {processingId === assignment.id ? "Accepting..." : "Accept"}
                  </button>

                  <button className="bg-[#8b0000] hover:bg-[#6b0000] text-white px-8 py-2 rounded-full text-sm font-bold">
                    Decline
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">No recent assignments found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewerDashboard;