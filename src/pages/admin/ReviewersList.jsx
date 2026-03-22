// import React, { useState, useEffect, useMemo } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "../../utils/axios";
// import toast from "react-hot-toast";
// import { getInitials } from "../../utils/initialsHelper";
// import { MoreHorizontal, ChevronRight, X, Search } from "lucide-react";

// function ReviewersList() {
//   const [reviewers, setReviewers] = useState([]);
//   const [selectedReviewer, setSelectedReviewer] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [showDotMenu, setShowDotMenu] = useState(false);
//   const [loadingDetails, setLoadingDetails] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");

//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchReviewers();
//   }, []);

//   const fetchReviewers = async () => {
//     try {
//       const res = await axios.get("/admin/reviewers");
//       if (res.data.success) setReviewers(res.data.data);
//     } catch (err) {
//       toast.error("Failed to fetch reviewers");
//       console.error(err);
//     }
//   };

//   const filteredReviewers = useMemo(() => {
//     if (!searchQuery) return reviewers;
//     return reviewers.filter(
//       (r) =>
//         r.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         r.department?.toLowerCase().includes(searchQuery.toLowerCase()),
//     );
//   }, [reviewers, searchQuery]);

//   // Fetch FULL reviewer details
//   const handleOpenModal = async (id) => {
//     try {
//       setLoadingDetails(true);
//       const res = await axios.get(`/admin/reviewers/${id}`);

//       if (res.data.success) {
//         setSelectedReviewer(res.data.data);
//         setShowModal(true);
//       }
//     } catch (err) {
//       toast.error("Failed to fetch reviewer details");
//       console.error(err);
//     } finally {
//       setLoadingDetails(false);
//     }
//   };

//   const handleDeactivate = async (id, currentStatus) => {
//     try {
//       const endpoint = currentStatus ? "deactivate" : "reactivate";
//       const res = await axios.patch(`/admin/reviewers/${id}/${endpoint}`);

//       if (res.data.success) {
//         toast.success(
//           currentStatus
//             ? "Reviewer deactivated successfully"
//             : "Reviewer reactivated successfully",
//         );
//         setShowModal(false);
//         fetchReviewers();
//       }
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Something went wrong");
//     }
//   };

//   return (
//     <div className="min-h-screen">
//       <main className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex flex-row justify-between items-center mb-6 md:mb-8 gap-4">
//           <div>
//             <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800">
//               Registered Reviewers
//             </h1>
//             <p className="text-xs md:text-sm text-gray-500 mt-1">
//               Here are all registered reviewers
//             </p>
//           </div>

//           <button
//             onClick={() => navigate("/admin/dashboard/reviewers/add")}
//             className="bg-[#002B7F] text-white px-5 py-2.5 md:px-6 md:py-2.5 rounded-full text-xs md:text-sm font-medium cursor-pointer transition-all active:scale-95 hover:bg-blue-900 whitespace-nowrap shadow-sm"
//           >
//             Add Reviewer
//           </button>
//         </div>

//         {/* Toolbar: Filters and Search */}
//         <div className="flex flex-col-reverse md:flex-row justify-between items-stretch md:items-center gap-4 mb-8">
//           {/* Horizontal Scrollable Filters */}
//           <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar whitespace-nowrap">
//             {[
//               "Title",
//               "Years in practice",
//               "Specialization",
//               "Institution",
//             ].map((filter) => (
//               <span
//                 key={filter}
//                 className="px-5 py-2 md:py-1.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full cursor-pointer hover:bg-gray-200 transition-colors"
//               >
//                 {filter}
//               </span>
//             ))}
//           </div>

//           <div className="relative w-full md:w-auto shrink-0">
//             <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
//             <input
//               type="text"
//               placeholder="Search researchers..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full md:w-72 pl-10 pr-4 py-3 md:py-2.5 bg-gray-100 rounded-xl md:rounded-full text-sm focus:outline-none border border-transparent focus:bg-white focus:border-blue-500 transition-all shadow-sm"
//             />
//           </div>
//         </div>

//         {/* Reviewer Cards List */}
//         <div className="space-y-4 md:space-y-5">
//           {reviewers.length === 0 ? (
//             <div className="flex flex-col items-center justify-center py-20 px-4 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 text-center">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-16 w-16 text-gray-300 mb-4"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//                 strokeWidth={2}
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M12 4v16m8-8H4"
//                 />
//               </svg>
//               <h2 className="text-lg md:text-xl font-semibold text-gray-700 mb-2">
//                 No reviewers added yet
//               </h2>
//               <p className="text-gray-500 text-sm">
//                 Once you add reviewers, they will appear here.
//               </p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
//               {filteredReviewers.map((reviewer) => (
//                 <div
//                   key={reviewer._id}
//                   onClick={() => handleOpenModal(reviewer._id)}
//                   className="bg-white p-4 md:p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between cursor-pointer hover:shadow-md hover:border-blue-100 transition-all active:scale-[0.98] gap-4"
//                 >
//                   <div className="flex items-center gap-4">
//                     <div className="w-15 h-15 md:w-20 md:h-20 sm:w-24 sm:h-24 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center text-xl sm:text-3xl overflow-hidden shrink-0 ">
//                       {reviewer.photoUrl ? (
//                         <img
//                           src={reviewer.photoUrl}
//                           alt="Avatar"
//                           className="w-full h-full object-cover"
//                         />
//                       ) : (
//                         getInitials(reviewer.fullName || reviewer.name)
//                       )}
//                     </div>

//                     <div>
//                       <h3 className="font-semibold text-gray-800 text-md md:text-base leading-tight">
//                         {reviewer.title} {reviewer.fullName}
//                       </h3>
//                       <p className="text-sm md:text-sm text-gray-500 mt-1 line-clamp-1">
//                         {reviewer.specialization}
//                       </p>
//                     </div>
//                   </div>

//                   <div className="text-[#002B7F] text-sm md:text-sm font-semibold sm:text-right bg-blue-50 sm:bg-transparent px-3 py-1.5 sm:px-0 sm:py-0 rounded-full self-start sm:self-auto">
//                     {reviewer.ongoingAssignments || 0} ongoing
//                   </div>
//                 </div>
//               ))}

//               {filteredReviewers.length === 0 && (
//                 <div className="col-span-full text-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl py-16">
//                   <p className="text-gray-500 font-medium">
//                     No reviewers found.
//                   </p>
//                   <p className="text-gray-400 text-sm mt-1">
//                     Try adjusting your search query.
//                   </p>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </main>

//       {/* ================= MODAL ================= */}
//       {showModal && selectedReviewer && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
//           <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-3xl p-6 sm:p-10 relative max-h-[90vh] overflow-y-auto no-scrollbar animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">
//             {/* Mobile Drag Handle Indicator */}
//             <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6 sm:hidden"></div>

//             {/* Close Button */}
//             <button
//               onClick={() => {
//                 setShowModal(false);
//                 setShowDotMenu(false);
//               }}
//               className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 cursor-pointer transition-colors"
//               aria-label="Close modal"
//             >
//               <svg
//                 width="20"
//                 height="20"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M6 18L18 6M6 6l12 12"
//                 />
//               </svg>
//             </button>

//             {/* Top Section */}
//             <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between mb-8 sm:mb-10 gap-4 text-center sm:text-left relative">
//               <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 w-full">
//                 <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center text-2xl sm:text-3xl overflow-hidden shrink-0 ">
//                   {selectedReviewer.photoUrl ? (
//                     <img
//                       src={selectedReviewer.photoUrl}
//                       alt="Avatar"
//                       className="w-full h-full object-cover"
//                     />
//                   ) : (
//                     getInitials(
//                       selectedReviewer.fullName || selectedReviewer.name,
//                     )
//                   )}
//                 </div>

//                 <div className="pt-2">
//                   <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight pr-0 sm:pr-8">
//                     {selectedReviewer.title} {selectedReviewer.fullName}
//                   </h2>

//                   <p className="text-gray-500 font-medium text-sm mt-1">
//                     {selectedReviewer.specialization}
//                   </p>

//                   <p className="text-xs text-gray-400 mt-1">
//                     {selectedReviewer.institution}
//                   </p>
//                 </div>
//               </div>

//               {/* Dot Menu */}
//               <div className="absolute top-6 right-0 sm:relative">
//                 <button
//                   onClick={() => setShowDotMenu(!showDotMenu)}
//                   className="p-2 hover:bg-gray-100 rounded-full text-gray-500 cursor-pointer transition-colors"
//                 >
//                   <svg
//                     width="24"
//                     height="24"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                   >
//                     <circle cx="12" cy="12" r="1"></circle>
//                     <circle cx="12" cy="5" r="1"></circle>
//                     <circle cx="12" cy="19" r="1"></circle>
//                   </svg>
//                 </button>

//                 {showDotMenu && (
//                   <div className="absolute right-0 top-10 w-48 bg-white shadow-xl border border-gray-100 rounded-xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-100">
//                     <button
//                       onClick={() =>
//                         handleDeactivate(
//                           selectedReviewer._id,
//                           selectedReviewer.isActive,
//                         )
//                       }
//                       className="w-full text-left px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
//                     >
//                       {selectedReviewer.isActive
//                         ? "Deactivate Reviewer"
//                         : "Activate Reviewer"}
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Info Grid - 1 col on mobile, 3 cols on tablet/desktop */}
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 mb-8 sm:mb-10 text-center bg-gray-50 sm:bg-transparent p-5 sm:p-0 rounded-2xl">
//               <div className="py-2 border-b border-gray-200 sm:border-0 sm:py-0">
//                 <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-400 mb-1 sm:mb-2">
//                   Years of Experience
//                 </p>
//                 <p className="font-semibold text-gray-900">
//                   {selectedReviewer.yearsOfExperience} Years
//                 </p>
//               </div>

//               <div className="py-2 border-b border-gray-200 sm:border-0 sm:py-0">
//                 <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-400 mb-1 sm:mb-2">
//                   Email
//                 </p>
//                 <p className="font-semibold text-sm text-gray-900 truncate px-2">
//                   {selectedReviewer.email}
//                 </p>
//               </div>

//               <div className="py-2 sm:py-0">
//                 <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-400 mb-1 sm:mb-2">
//                   Status
//                 </p>
//                 <p
//                   className={`font-bold ${
//                     selectedReviewer.isActive
//                       ? "text-green-600"
//                       : "text-red-600"
//                   }`}
//                 >
//                   {selectedReviewer.isActive ? "Active" : "Inactive"}
//                 </p>
//               </div>
//             </div>

//             {/* Statistics - 2 cols on mobile, 4 cols on desktop */}
//             <div className="mb-8 sm:mb-10">
//               <h3 className="font-bold text-base sm:text-lg mb-4 text-gray-900">
//                 Assignment Statistics
//               </h3>

//               <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
//                 {[
//                   {
//                     label: "Accepted",
//                     val: selectedReviewer.statistics?.accepted || 0,
//                   },
//                   {
//                     label: "Completed",
//                     val: selectedReviewer.statistics?.completed || 0,
//                   },
//                   {
//                     label: "Incomplete",
//                     val: selectedReviewer.statistics?.incomplete || 0,
//                   },
//                   {
//                     label: "Pending Feedback",
//                     val: selectedReviewer.statistics?.pendingFeedback || 0,
//                   },
//                 ].map((stat) => (
//                   <div
//                     key={stat.label}
//                     className="bg-[#F8F9FA] p-4 sm:p-5 rounded-2xl text-center border border-gray-100"
//                   >
//                     <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wide text-gray-500 mb-1 sm:mb-2 leading-tight h-8 sm:h-auto flex items-center justify-center">
//                       {stat.label}
//                     </p>
//                     <p className="text-2xl sm:text-3xl font-black text-[#002B7F]">
//                       {stat.val}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Button */}
//             <div className="text-center pt-2">
//               <button
//                 onClick={() =>
//                   navigate(
//                     `/admin/dashboard/reviewers/${selectedReviewer._id}/assignments`,
//                   )
//                 }
//                 className="w-full sm:w-auto bg-[#002B7F] text-white px-10 py-3.5 sm:py-3 rounded-full text-sm font-semibold cursor-pointer hover:bg-blue-900 transition-all active:scale-95 shadow-lg shadow-blue-900/20"
//               >
//                 View Assignments
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default ReviewersList;

import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import toast from "react-hot-toast";
import { getInitials } from "../../utils/initialsHelper";
import { Search, ChevronDown } from "lucide-react";

function ReviewersList() {
  const [reviewers, setReviewers] = useState([]);
  const [selectedReviewer, setSelectedReviewer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDotMenu, setShowDotMenu] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTitle, setFilterTitle] = useState("");
  const [filterSpecialization, setFilterSpecialization] = useState("");
  const [filterExperience, setFilterExperience] = useState("");
  const [filterInstitution, setFilterInstitution] = useState(""); // NEW: Institution Filter

  const navigate = useNavigate();

  useEffect(() => {
    fetchReviewers();
  }, []);

  const fetchReviewers = async () => {
    try {
      const res = await axios.get("/admin/reviewers");
      if (res.data.success) setReviewers(res.data.data);
    } catch (err) {
      toast.error("Failed to fetch reviewers");
      console.error(err);
    }
  };

  // --- 1. Generate Dynamic Dropdown Options from Database ---
  const availableTitles = useMemo(() => {
    const titles = reviewers.map((r) => r.title).filter(Boolean);
    return [...new Set(titles)].sort();
  }, [reviewers]);

  const availableSpecializations = useMemo(() => {
    const specs = reviewers.map((r) => r.specialization).filter(Boolean);
    return [...new Set(specs)].sort();
  }, [reviewers]);

  const availableInstitutions = useMemo(() => {
    const insts = reviewers.map((r) => r.institution).filter(Boolean);
    return [...new Set(insts)].sort();
  }, [reviewers]);

  // --- 2. Filter Logic (Search + Dropdowns) ---
  const filteredReviewers = useMemo(() => {
    return reviewers.filter((r) => {
      // Search check (Name or Specialization)
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        (r.name || r.fullName || "").toLowerCase().includes(searchLower) ||
        (r.specialization || "").toLowerCase().includes(searchLower);

      // Dropdown checks
      const matchesTitle = filterTitle === "" || r.title === filterTitle;
      const matchesSpecialization =
        filterSpecialization === "" ||
        r.specialization === filterSpecialization;
      const matchesInstitution =
        filterInstitution === "" || r.institution === filterInstitution;

      // Experience check
      let matchesExperience = true;
      if (filterExperience) {
        const yrs = Number(r.yearsOfExperience) || 0;
        if (filterExperience === "0-5")
          matchesExperience = yrs >= 0 && yrs <= 5;
        else if (filterExperience === "6-10")
          matchesExperience = yrs >= 6 && yrs <= 10;
        else if (filterExperience === "11-15")
          matchesExperience = yrs >= 11 && yrs <= 15;
        else if (filterExperience === "16+") matchesExperience = yrs >= 16;
      }

      // Must pass all applied filters to show up
      return (
        matchesSearch &&
        matchesTitle &&
        matchesSpecialization &&
        matchesExperience &&
        matchesInstitution
      );
    });
  }, [
    reviewers,
    searchQuery,
    filterTitle,
    filterSpecialization,
    filterExperience,
    filterInstitution,
  ]);

  // Fetch FULL reviewer details
  const handleOpenModal = async (id) => {
    try {
      setLoadingDetails(true);
      const res = await axios.get(`/admin/reviewers/${id}`);

      if (res.data.success) {
        setSelectedReviewer(res.data.data);
        setShowModal(true);
      }
    } catch (err) {
      toast.error("Failed to fetch reviewer details");
      console.error(err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleDeactivate = async (id, currentStatus) => {
    try {
      const endpoint = currentStatus ? "deactivate" : "reactivate";
      const res = await axios.patch(`/admin/reviewers/${id}/${endpoint}`);

      if (res.data.success) {
        toast.success(
          currentStatus
            ? "Reviewer deactivated successfully"
            : "Reviewer reactivated successfully",
        );
        setShowModal(false);
        fetchReviewers();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen font-sans">
      <main className="p-2 md:p-3 lg:p-4 md:mt-0 mt-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mt:10 flex flex-row justify-between items-center mb-6 md:mb-8 gap-4">
          <div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800">
              Registered Reviewers
            </h1>
            <p className="text-xs md:text-sm text-gray-500 mt-1">
              Here are all registered reviewers
            </p>
          </div>

          <button
            onClick={() => navigate("/admin/dashboard/reviewers/add")}
            className="bg-[#002B7F] text-white px-5 py-2.5 md:px-6 md:py-2.5 rounded-full text-xs md:text-sm font-medium cursor-pointer transition-all active:scale-95 hover:bg-blue-900 whitespace-nowrap shadow-sm"
          >
            Add Reviewer
          </button>
        </div>

        {/* Toolbar: Filters and Search */}
        <div className="flex flex-col-reverse lg:flex-row justify-between items-stretch lg:items-center gap-4 mb-8">
          {/* Dropdown Filters */}
          <div className="flex gap-2 pt-2 overflow-x-auto pb-2 md:pb-0 w-full lg:w-auto no-scrollbar whitespace-nowrap">
            {/* Title Dropdown */}
            <div className="relative shrink-0">
              <select
                value={filterTitle}
                onChange={(e) => setFilterTitle(e.target.value)}
                className="appearance-none pl-5 pr-10 py-2 md:py-1.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full cursor-pointer hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Title</option>
                {availableTitles.map((title) => (
                  <option key={title} value={title}>
                    {title}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
            </div>

            {/* Experience Dropdown */}
            <div className="relative shrink-0">
              <select
                value={filterExperience}
                onChange={(e) => setFilterExperience(e.target.value)}
                className="appearance-none pl-5 pr-10 py-2 md:py-1.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full cursor-pointer hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Years in practice</option>
                <option value="0-5">0 - 5 Years</option>
                <option value="6-10">6 - 10 Years</option>
                <option value="11-15">11 - 15 Years</option>
                <option value="16+">16+ Years</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
            </div>

            {/* Specialization Dropdown */}
            <div className="relative shrink-0">
              <select
                value={filterSpecialization}
                onChange={(e) => setFilterSpecialization(e.target.value)}
                className="appearance-none pl-5 pr-10 py-2 md:py-1.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full cursor-pointer hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Specialization</option>
                {availableSpecializations.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
            </div>

            {/* Institution Dropdown */}
            <div className="relative shrink-0">
              <select
                value={filterInstitution}
                onChange={(e) => setFilterInstitution(e.target.value)}
                className="appearance-none pl-5 pr-10 py-2 md:py-1.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full cursor-pointer hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-[200px] truncate"
              >
                <option value="">Institution</option>
                {availableInstitutions.map((inst) => (
                  <option key={inst} value={inst}>
                    {inst}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative w-full lg:w-auto shrink-0">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search name or specialization..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full lg:w-72 pl-10 pr-4 py-3 md:py-2.5 bg-gray-100 rounded-xl md:rounded-full text-sm focus:outline-none border border-transparent focus:bg-white focus:border-blue-500 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Reviewer Cards List */}
        <div className="space-y-4 md:space-y-5">
          {filteredReviewers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-4 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 text-center">
              <Search className="h-12 w-12 text-gray-300 mb-4" />
              <h2 className="text-lg md:text-xl font-semibold text-gray-700 mb-2">
                No reviewers found
              </h2>
              <p className="text-gray-500 text-sm">
                Try adjusting your search or filters.
              </p>
              {(searchQuery ||
                filterTitle ||
                filterSpecialization ||
                filterExperience ||
                filterInstitution) && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setFilterTitle("");
                    setFilterSpecialization("");
                    setFilterExperience("");
                    setFilterInstitution("");
                  }}
                  className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-800 underline cursor-pointer"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
              {filteredReviewers.map((reviewer) => (
                <div
                  key={reviewer._id}
                  onClick={() => handleOpenModal(reviewer._id)}
                  className="bg-white p-4 md:p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between cursor-pointer hover:shadow-md hover:border-blue-100 transition-all active:scale-[0.98] gap-4"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center text-xl sm:text-3xl overflow-hidden shrink-0">
                      {reviewer.photoUrl ? (
                        <img
                          src={reviewer.photoUrl}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        getInitials(reviewer.fullName || reviewer.name)
                      )}
                    </div>

                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-800 text-md md:text-base leading-tight truncate">
                        {reviewer.title} {reviewer.fullName}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                        {reviewer.specialization}
                      </p>
                      {reviewer.institution && (
                        <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                          {reviewer.institution}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-[#002B7F] text-xs sm:text-sm font-semibold sm:text-right bg-blue-50 sm:bg-transparent px-3 py-1.5 sm:px-0 sm:py-0 rounded-full self-start sm:self-auto shrink-0 whitespace-nowrap">
                    {reviewer.ongoingAssignments || 0} ongoing
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ================= MODAL ================= */}
      {showModal && selectedReviewer && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-3xl p-6 sm:p-10 relative max-h-[90vh] overflow-y-auto no-scrollbar animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">
            {/* Mobile Drag Handle Indicator */}
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6 sm:hidden"></div>

            {/* Close Button */}
            <button
              onClick={() => {
                setShowModal(false);
                setShowDotMenu(false);
              }}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 cursor-pointer transition-colors"
              aria-label="Close modal"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Top Section */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between mb-8 sm:mb-10 gap-4 text-center sm:text-left relative">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 w-full">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center text-2xl sm:text-3xl overflow-hidden shrink-0 ">
                  {selectedReviewer.photoUrl ? (
                    <img
                      src={selectedReviewer.photoUrl}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    getInitials(
                      selectedReviewer.fullName || selectedReviewer.name,
                    )
                  )}
                </div>

                <div className="pt-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight pr-0 sm:pr-8">
                    {selectedReviewer.title} {selectedReviewer.fullName}
                  </h2>

                  <p className="text-gray-500 font-medium text-sm mt-1">
                    {selectedReviewer.specialization}
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    {selectedReviewer.institution}
                  </p>
                </div>
              </div>

              {/* Dot Menu */}
              <div className="absolute top-6 right-0 sm:relative">
                <button
                  onClick={() => setShowDotMenu(!showDotMenu)}
                  className="p-2 hover:bg-gray-100 rounded-full text-gray-500 cursor-pointer transition-colors"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="12" cy="5" r="1"></circle>
                    <circle cx="12" cy="19" r="1"></circle>
                  </svg>
                </button>

                {showDotMenu && (
                  <div className="absolute right-0 top-10 w-48 bg-white shadow-xl border border-gray-100 rounded-xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-100">
                    <button
                      onClick={() =>
                        handleDeactivate(
                          selectedReviewer._id,
                          selectedReviewer.isActive,
                        )
                      }
                      className="w-full text-left px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      {selectedReviewer.isActive
                        ? "Deactivate Reviewer"
                        : "Activate Reviewer"}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 mb-8 sm:mb-10 text-center bg-gray-50 sm:bg-transparent p-5 sm:p-0 rounded-2xl">
              <div className="py-2 border-b border-gray-200 sm:border-0 sm:py-0">
                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-400 mb-1 sm:mb-2">
                  Years of Experience
                </p>
                <p className="font-semibold text-gray-900">
                  {selectedReviewer.yearsOfExperience} Years
                </p>
              </div>

              <div className="py-2 border-b border-gray-200 sm:border-0 sm:py-0">
                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-400 mb-1 sm:mb-2">
                  Email
                </p>
                <p className="font-semibold text-sm text-gray-900 truncate px-2">
                  {selectedReviewer.email}
                </p>
              </div>

              <div className="py-2 sm:py-0">
                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-400 mb-1 sm:mb-2">
                  Status
                </p>
                <p
                  className={`font-bold ${
                    selectedReviewer.isActive
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {selectedReviewer.isActive ? "Active" : "Inactive"}
                </p>
              </div>
            </div>

            {/* Statistics */}
            <div className="mb-8 sm:mb-10">
              <h3 className="font-bold text-base sm:text-lg mb-4 text-gray-900">
                Assignment Statistics
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                {[
                  {
                    label: "Accepted",
                    val: selectedReviewer.statistics?.accepted || 0,
                  },
                  {
                    label: "Completed",
                    val: selectedReviewer.statistics?.completed || 0,
                  },
                  {
                    label: "Incomplete",
                    val: selectedReviewer.statistics?.incomplete || 0,
                  },
                  {
                    label: "Pending Feedback",
                    val: selectedReviewer.statistics?.pendingFeedback || 0,
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-[#F8F9FA] p-4 sm:p-5 rounded-2xl text-center border border-gray-100"
                  >
                    <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wide text-gray-500 mb-1 sm:mb-2 leading-tight h-8 sm:h-auto flex items-center justify-center">
                      {stat.label}
                    </p>
                    <p className="text-2xl sm:text-3xl font-black text-[#002B7F]">
                      {stat.val}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Button */}
            <div className="text-center pt-2">
              <button
                onClick={() =>
                  navigate(
                    `/admin/dashboard/reviewers/${selectedReviewer._id}/assignments`,
                  )
                }
                className="w-full sm:w-auto bg-[#002B7F] text-white px-10 py-3.5 sm:py-3 rounded-full text-sm font-semibold cursor-pointer hover:bg-blue-900 transition-all active:scale-95 shadow-lg shadow-blue-900/20"
              >
                View Assignments
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReviewersList;
