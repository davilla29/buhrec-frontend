// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { ChevronLeft } from "lucide-react";
// import axios from "../../utils/axios";

// function UnassignedAssignments() {
//   const [proposals, setProposals] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchUnassigned = async () => {
//       try {
//         const response = await axios.get(
//           "/admin/assignments/list?filter=unassigned",
//         );
//         if (response.data.success) {
//           setProposals(response.data.data);
//         }
//       } catch (error) {
//         console.error("Error fetching unassigned assignments:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUnassigned();
//   }, []);

//   return (
//     <div className="min-h-screen p-2">
//       {/* Header */}
//       <div className="flex items-center gap-4 mb-8">
//         <button
//           onClick={() => navigate(-1)}
//           className="p-2 cursor-pointer hover:bg-gray-200 rounded-full transition-colors"
//         >
//           <ChevronLeft size={28} />
//         </button>
//         <h1 className="text-2xl font-bold text-gray-800">
//           Unassigned Assignments
//         </h1>
//       </div>

//       {/* List Container */}
//       <div className="max-w-5xl mx-auto flex flex-col gap-4">
//         {loading ? (
//           <p className="text-center py-10 text-gray-500">
//             Loading assignments...
//           </p>
//         ) : proposals.length > 0 ? (
//           proposals.map((proposal, index) => (
//             <div
//               key={proposal._id}
//               className="bg-[#EEEEEE] rounded-xl p-6 flex items-center justify-between shadow-sm"
//             >
//               <h3 className="text-lg font-semibold text-gray-800 max-w-[70%] leading-tight">
//                 {proposal.title}
//               </h3>

//               <button
//                 onClick={() =>
//                   navigate(`/admin/dashboard/proposals/${proposal._id}/details`)
//                 }
//                 className="bg-[#EAB308] cursor-pointer text-white px-8 py-2.5 rounded-full font-medium hover:bg-[#CA8A04] transition-all shadow-sm active:scale-95"
//               >
//                 View Details
//               </button>
//             </div>
//           ))
//         ) : (
//           <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed">
//             <p className="text-gray-500">No unassigned assignments found.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default UnassignedAssignments;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import axios from "../../utils/axios";

function UnassignedAssignments() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUnassigned = async () => {
      try {
        const response = await axios.get(
          "/admin/assignments/list?filter=unassigned",
        );
        if (response.data.success) {
          setProposals(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching unassigned assignments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUnassigned();
  }, []);

  return (
    <div className="min-h-screen mt-3 md:mt-0 p-4 sm:p-6 lg:p-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 sm:p-2 cursor-pointer bg-white sm:bg-transparent hover:bg-gray-200 border border-gray-200 sm:border-transparent rounded-full transition-colors shadow-sm sm:shadow-none shrink-0"
          >
            <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7 text-gray-800" />
          </button>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
            Unassigned Assignments
          </h1>
        </div>

        {/* List Container */}
        <div className="flex flex-col gap-4">
          {loading ? (
            <div className="flex flex-col justify-center items-center py-20 gap-3">
              {/* The Spinner */}
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-[#003B95] border-r-[#003B95]"></div>

              {/* The Text */}
              <p className="text-gray-500 text-sm font-medium animate-pulse">
                Loading...
              </p>
            </div>
          ) : proposals.length > 0 ? (
            proposals.map((proposal) => (
              <div
                key={proposal._id}
                className="bg-[#EEEEEE] rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="w-full sm:max-w-[70%]">
                  <span className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">
                    Pending Assignment
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-snug">
                    {proposal.title}
                  </h3>
                </div>

                <button
                  onClick={() =>
                    navigate(
                      `/admin/dashboard/proposals/${proposal._id}/details`,
                    )
                  }
                  className="w-full sm:w-auto shrink-0 bg-[#EAB308] cursor-pointer text-white px-6 sm:px-8 py-3 sm:py-2.5 rounded-full text-sm font-bold hover:bg-[#CA8A04] transition-all shadow-sm active:scale-95 whitespace-nowrap"
                >
                  View Details
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200 shadow-sm">
              <p className="text-gray-500 font-medium">
                No unassigned assignments found.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UnassignedAssignments;