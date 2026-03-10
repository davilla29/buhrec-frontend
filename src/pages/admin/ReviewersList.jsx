import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import toast from "react-hot-toast";

function ReviewersList() {
  const [reviewers, setReviewers] = useState([]);
  const [selectedReviewer, setSelectedReviewer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDotMenu, setShowDotMenu] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);

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
    <div className="min-h-screen">
      <main className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-row justify-between items-center mb-6 md:mb-8 gap-4">
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

        {/* Reviewer Cards List */}
        <div className="space-y-4 md:space-y-5">
          {reviewers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-4 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-gray-300 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <h2 className="text-lg md:text-xl font-semibold text-gray-700 mb-2">
                No reviewers added yet
              </h2>
              <p className="text-gray-500 text-sm">
                Once you add reviewers, they will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
              {reviewers.map((reviewer) => (
                <div
                  key={reviewer._id}
                  onClick={() => handleOpenModal(reviewer._id)}
                  className="bg-white p-4 md:p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between cursor-pointer hover:shadow-md hover:border-blue-100 transition-all active:scale-[0.98] gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        reviewer.photoUrl || "https://via.placeholder.com/60"
                      }
                      className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover border border-gray-200 shrink-0 bg-gray-50"
                      alt={reviewer.fullName}
                    />

                    <div>
                      <h3 className="font-semibold text-gray-800 text-sm md:text-base leading-tight">
                        {reviewer.title} {reviewer.fullName}
                      </h3>
                      <p className="text-xs md:text-sm text-gray-500 mt-1 line-clamp-1">
                        {reviewer.specialization}
                      </p>
                    </div>
                  </div>

                  <div className="text-[#002B7F] text-xs md:text-sm font-semibold sm:text-right bg-blue-50 sm:bg-transparent px-3 py-1.5 sm:px-0 sm:py-0 rounded-full self-start sm:self-auto">
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
                <img
                  src={
                    selectedReviewer.photoUrl ||
                    "https://via.placeholder.com/100"
                  }
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-gray-50 shadow-sm shrink-0 bg-gray-100"
                  alt="Profile"
                />

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

            {/* Info Grid - 1 col on mobile, 3 cols on tablet/desktop */}
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

            {/* Statistics - 2 cols on mobile, 4 cols on desktop */}
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
              <button className="w-full sm:w-auto bg-[#002B7F] text-white px-10 py-3.5 sm:py-3 rounded-full text-sm font-semibold cursor-pointer hover:bg-blue-900 transition-all active:scale-95 shadow-lg shadow-blue-900/20">
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
