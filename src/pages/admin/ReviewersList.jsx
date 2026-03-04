import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import toast from "react-hot-toast";

function ReviewersList() {
  const [reviewers, setReviewers] = useState([]);
  const [selectedReviewer, setSelectedReviewer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDotMenu, setShowDotMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReviewers();
  }, []);

  const fetchReviewers = async () => {
    try {
      const res = await axios.get("/admin/reviewers");
      if (res.data.success) setReviewers(res.data.data);
    } catch (err) {
      toast.error(err);
      console.error("Error fetching reviewers", err);
    }
  };

  const handleDeactivate = async (id, currentStatus) => {
    try {
      const endpoint = currentStatus ? "deactivate" : "reactivate";
      const res = await axios.patch(`/admin/reviewers/${id}/${endpoint}`);
      if (res.data.success) {
        if (endpoint === "deactivate") {
          toast.success("Reviewer deactivated successfully");
        } else {
          toast.success("Reviewer reactivated successfully");
        }
        setShowModal(false);
        fetchReviewers();
      }
    } catch (err) {
      toast.error("Failed to deactivate reviewer");
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Registered Reviewers
            </h1>
            <p className="text-sm text-gray-500">
              Here are all registered reviewers!
            </p>
          </div>
          <button
            onClick={() => navigate("/admin/dashboard/reviewers/add")}
            className="bg-[#002B7F] text-white px-6 py-2 rounded-full text-sm font-medium"
          >
            Add Reviewer
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-8">
          {["Title", "Years in Practice", "Specialization", "Institution"].map(
            (filter) => (
              <button
                key={filter}
                className="bg-gray-200 px-4 py-1 rounded-md text-xs font-medium text-gray-600"
              >
                {filter}
              </button>
            ),
          )}
        </div>

        {/* Reviewer Cards */}
        <div className="space-y-4">
          {reviewers.map((reviewer) => (
            <div
              key={reviewer._id}
              onClick={() => {
                setSelectedReviewer(reviewer);
                setShowModal(true);
              }}
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <img
                  src={reviewer.photoUrl || "https://via.placeholder.com/50"}
                  className="w-12 h-12 rounded-full object-cover border"
                  alt={reviewer.fullName}
                />
                <div>
                  <h3 className="font-bold text-gray-800">
                    {reviewer.title}. {reviewer.fullName}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {reviewer.specialization}
                  </p>
                </div>
              </div>
              <div className="text-[#002B7F] text-sm font-semibold">
                {reviewer.ongoingAssignments} ongoing assignments
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Reviewer Detail Modal */}
      {showModal && selectedReviewer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-150 p-8 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400"
            >
              ✕
            </button>

            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center gap-6">
                <img
                  src={
                    selectedReviewer.photoUrl ||
                    "https://via.placeholder.com/80"
                  }
                  className="w-20 h-20 rounded-full object-cover"
                  alt="Profile"
                />
                <div>
                  <h2 className="text-xl font-bold">
                    {selectedReviewer.title}. {selectedReviewer.fullName}
                  </h2>
                  <p className="text-gray-500">
                    {selectedReviewer.specialization}
                  </p>
                </div>
              </div>

              {/* Dot Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowDotMenu(!showDotMenu)}
                  className="p-2 hover:bg-gray-100 rounded-full font-bold text-xl"
                >
                  •••
                </button>
                {showDotMenu && (
                  <div className="absolute right-0 top-10 w-48 bg-white shadow-xl border rounded-lg overflow-hidden">
                    <button
                      onClick={() =>
                        handleDeactivate(
                          selectedReviewer._id,
                          selectedReviewer.isActive,
                        )
                      }
                      className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50"
                    >
                      {selectedReviewer.isActive
                        ? "Deactivate Reviewer"
                        : "Activate Reviewer"}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center mb-8">
              <div>
                <p className="text-xs text-gray-400">Title</p>
                <p className="font-bold text-sm">{selectedReviewer.title}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Speciality</p>
                <p className="font-bold text-sm">
                  {selectedReviewer.specialization}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Institution</p>
                <p className="font-bold text-sm">
                  {selectedReviewer.institution}
                </p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="font-bold text-lg mb-4">Statistics</h3>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: "Accepted", val: 10 },
                  { label: "Completed", val: 2 },
                  { label: "Incomplete", val: 8 },
                  { label: "Feedback", val: 3 },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-gray-50 p-3 rounded-lg text-left"
                  >
                    <p className="text-[10px] text-gray-500 leading-tight mb-1">
                      {stat.label} Assignments
                    </p>
                    <p className="text-xl font-bold">{stat.val}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center">
              <button className="bg-[#002B7F] text-white px-8 py-2 rounded-full text-sm font-medium">
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
