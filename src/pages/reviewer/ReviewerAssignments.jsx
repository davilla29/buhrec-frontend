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
      const res = await axios.get("/reviewer/assignments");
      setAssignments(res.data.assignments);
    } catch (error) {
      toast.error("Failed to load assignments");
    } finally {
      setLoading(false);
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
    <div className="min-h-screen bg-[#f5f5f5] p-6">
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
                className={`px-4 py-1 rounded-full text-sm font-medium transition ${
                  activeTab === tab
                    ? "bg-blue-800 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <Search size={20} />
            <SlidersHorizontal size={20} />
          </div>
        </div>

        {/* Assignment List */}
        <div className="space-y-4">
          {loading ? (
            <p>Loading...</p>
          ) : filtered.length === 0 ? (
            <p className="text-gray-500">No assignments here.</p>
          ) : (
            filtered.map((assignment) => (
              <div
                key={assignment._id}
                className="bg-[#ededed] p-5 rounded-xl flex justify-between items-center"
              >
                <div className="max-w-2xl">
                  {activeTab === "Completed" && (
                    <p className="text-xs text-red-500 font-semibold mb-1">
                      Review Rejected
                    </p>
                  )}

                  <h3 className="font-semibold">
                    {assignment.proposal?.title}
                  </h3>
                </div>

                {activeTab === "Unaccepted" && (
                  <div className="flex gap-2">
                    <button className="bg-[#d4af37] text-white px-5 py-1 rounded-full text-sm">
                      Accept
                    </button>
                    <button className="bg-[#8b0000] text-white px-5 py-1 rounded-full text-sm">
                      Decline
                    </button>
                  </div>
                )}

                {activeTab === "Not Reviewed" && (
                  <button
                    onClick={() =>
                      navigate(`/reviewer/review/${assignment._id}`)
                    }
                    className="bg-[#d4af37] text-white px-5 py-1 rounded-full text-sm"
                  >
                    Begin Review
                  </button>
                )}

                {activeTab === "Completed" && (
                  <button
                    onClick={() =>
                      navigate(`/reviewer/review/${assignment._id}`)
                    }
                    className="bg-green-600 text-white px-5 py-1 rounded-full text-sm"
                  >
                    Inspect Review
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewerAssignments;
