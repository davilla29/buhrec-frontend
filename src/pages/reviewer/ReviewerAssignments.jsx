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
//       const res = await axios.get("/reviewer/assignments");
//       setAssignments(res.data.assignments);
//     } catch (error) {
//       toast.error("Failed to load assignments");
//     } finally {
//       setLoading(false);
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

//   const filtered = filterAssignments();

//   return (
//     <div className="min-h-screen bg-[#f5f5f5] p-6">
//       <div className="max-w-5xl mx-auto">
//         {/* Header */}
//         <h1 className="text-2xl font-bold">Your Assignments</h1>
//         <p className="text-gray-500 text-sm mb-6">View all your assignments</p>

//         {/* Tabs */}
//         <div className="flex items-center justify-between mb-6">
//           <div className="flex gap-2">
//             {tabs.map((tab) => (
//               <button
//                 key={tab}
//                 onClick={() => setActiveTab(tab)}
//                 className={`px-4 py-1 rounded-full text-sm font-medium transition ${
//                   activeTab === tab
//                     ? "bg-blue-800 text-white"
//                     : "bg-gray-200 text-gray-700"
//                 }`}
//               >
//                 {tab}
//               </button>
//             ))}
//           </div>

//           <div className="flex gap-3">
//             <Search size={20} />
//             <SlidersHorizontal size={20} />
//           </div>
//         </div>

//         {/* Assignment List */}
//         <div className="space-y-4">
//           {loading ? (
//             <p>Loading...</p>
//           ) : filtered.length === 0 ? (
//             <p className="text-gray-500">No assignments here.</p>
//           ) : (
//             filtered.map((assignment) => (
//               <div
//                 key={assignment._id}
//                 className="bg-[#ededed] p-5 rounded-xl flex justify-between items-center"
//               >
//                 <div className="max-w-2xl">
//                   {activeTab === "Completed" && (
//                     <p className="text-xs text-red-500 font-semibold mb-1">
//                       Review Rejected
//                     </p>
//                   )}

//                   <h3 className="font-semibold">
//                     {assignment.proposal?.title}
//                   </h3>
//                 </div>

//                 {activeTab === "Unaccepted" && (
//                   <div className="flex gap-2">
//                     <button className="bg-[#d4af37] text-white px-5 py-1 rounded-full text-sm">
//                       Accept
//                     </button>
//                     <button className="bg-[#8b0000] text-white px-5 py-1 rounded-full text-sm">
//                       Decline
//                     </button>
//                   </div>
//                 )}

//                 {activeTab === "Not Reviewed" && (
//                   <button
//                     onClick={() =>
//                       navigate(`/reviewer/review/${assignment._id}`)
//                     }
//                     className="bg-[#d4af37] text-white px-5 py-1 rounded-full text-sm"
//                   >
//                     Begin Review
//                   </button>
//                 )}

//                 {activeTab === "Completed" && (
//                   <button
//                     onClick={() =>
//                       navigate(`/reviewer/review/${assignment._id}`)
//                     }
//                     className="bg-green-600 text-white px-5 py-1 rounded-full text-sm"
//                   >
//                     Inspect Review
//                   </button>
//                 )}
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ReviewerAssignments;

import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import { Search, SlidersHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const tabs = ["Unaccepted", "Not Reviewed", "Ongoing", "Completed"];

const ReviewerAssignments = () => {
  const navigate = useNavigate();

  const [assignments, setAssignments] = useState([]);
  const [activeTab, setActiveTab] = useState("Unaccepted");
  const [loading, setLoading] = useState(true);

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

  // Logic to handle Accept
  const handleAccept = async (assignmentId) => {
    try {
      await axios.patch(`/reviewer/assignments/${assignmentId}/accept`);
      toast.success("Assignment accepted");
      fetchAssignments(); // Refresh list
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to accept assignment",
      );
    }
  };

  // Logic to handle Decline (simple prompt for reason)
  const handleDecline = async (assignmentId) => {
    const reason = window.prompt("Please provide a reason for declining:");
    if (reason === null) return; // User cancelled

    try {
      await axios.patch(`/reviewer/assignments/${assignmentId}/decline`, {
        reason,
      });
      toast.success("Assignment declined");
      fetchAssignments();
    } catch (error) {
      toast.error("Failed to decline assignment");
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

  const filtered = filterAssignments();

  return (
    <div className="min-h-screen p-2">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <h1 className="text-2xl font-bold">Your Assignments</h1>
        <p className="text-gray-500 text-sm mb-6">View all your assignments</p>

        {/* Tabs */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1 rounded-full text-sm font-medium transition cursor-pointer ${
                  activeTab === tab
                    ? "bg-blue-800 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex gap-3 text-gray-600">
            <Search size={20} className="cursor-pointer hover:text-blue-800" />
            <SlidersHorizontal
              size={20}
              className="cursor-pointer hover:text-blue-800"
            />
          </div>
        </div>

        {/* Assignment List */}
        <div className="space-y-4">
          {loading ? (
            <p className="text-center py-10 text-gray-500 italic">
              Loading assignments...
            </p>
          ) : filtered.length === 0 ? (
            <p className="text-gray-500 text-center py-10 bg-white rounded-xl border border-dashed border-gray-300">
              No assignments found in this category.
            </p>
          ) : (
            filtered.map((assignment) => (
              <div
                key={assignment._id}
                className="bg-[#ededed] p-5 rounded-xl flex justify-between items-center shadow-sm"
              >
                <div className="max-w-2xl">
                  {/* Shows for Completed items that were rejected by the reviewer previously */}
                  {activeTab === "Completed" &&
                    assignment.decision === "reject" && (
                      <p className="text-xs text-red-500 font-semibold mb-1 uppercase tracking-wider">
                        Review Rejected
                      </p>
                    )}

                  <h3 className="font-semibold text-gray-800 text-lg">
                    {assignment.proposal?.title}
                  </h3>
                </div>

                {/* Actions per Tab */}
                <div className="flex gap-2">
                  {activeTab === "Unaccepted" && (
                    <>
                      <button
                        onClick={() => handleAccept(assignment._id)}
                        className="bg-[#d4af37] hover:bg-[#b8962e] text-white px-6 py-1.5 rounded-full text-sm font-bold transition cursor-pointer shadow-sm"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleDecline(assignment._id)}
                        className="bg-[#8b0000] hover:bg-[#6b0000] text-white px-6 py-1.5 rounded-full text-sm font-bold transition cursor-pointer shadow-sm"
                      >
                        Decline
                      </button>
                    </>
                  )}

                  {activeTab === "Not Reviewed" && (
                    <button
                      onClick={() =>
                        navigate(
                          `/reviewer/dashboard/assignments/${assignment._id}/review`,
                        )
                      }
                      className="bg-[#d4af37] hover:bg-[#b8962e] text-white px-6 py-1.5 rounded-full text-sm font-bold transition cursor-pointer shadow-sm"
                    >
                      Begin Review
                    </button>
                  )}

                  {activeTab === "Ongoing" && (
                    <button
                      onClick={() =>
                        navigate(
                          `/reviewer/dashboard/assignments/${assignment._id}/review`,
                        )
                      }
                      className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-1.5 rounded-full text-sm font-bold transition cursor-pointer shadow-sm"
                    >
                      Continue Review
                    </button>
                  )}

                  {activeTab === "Completed" && (
                    <button
                      onClick={() =>
                        navigate(
                          `/reviewer/assignments/${assignment._id}/review`,
                        )
                      }
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-1.5 rounded-full text-sm font-bold transition cursor-pointer shadow-sm"
                    >
                      Inspect Review
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewerAssignments;