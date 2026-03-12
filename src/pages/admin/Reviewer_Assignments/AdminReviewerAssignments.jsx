import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import axios from "../../../utils/axios";
import toast from "react-hot-toast";

function AdminReviewerAssignments() {
  const { reviewerId } = useParams();
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Ongoing");

  const tabs = ["Unaccepted", "Not Reviewed", "Ongoing", "Completed"];

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await axios.get(
          `/admin/reviewers/${reviewerId}/assignments`,
        );
        if (response.data.success) {
          setAssignments(response.data.data);
        }
      } catch (error) {
        toast.error("Failed to load reviewer assignments");
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, [reviewerId]);

  const filteredAssignments = useMemo(() => {
    return assignments.filter((a) => {
      const status = a.status?.toLowerCase();
      switch (activeTab) {
        case "Unaccepted":
          return status === "assigned";
        case "Not Reviewed":
          return status === "accepted";
        case "Ongoing":
          return status === "in_progress";
        case "Completed":
          return (
            status === "submitted" ||
            status === "rejected" ||
            status === "withdrawn"
          );
        default:
          return true;
      }
    });
  }, [assignments, activeTab]);

  const getStatusDisplay = (assignment) => {
    const s = assignment.status;
    const pStatus = assignment.proposal?.status;

    if (s === "submitted") {
      if (assignment.decision === "approve")
        return { text: "Review Approved", color: "text-[#003B95]" };
      if (assignment.decision === "reject")
        return { text: "Review Rejected", color: "text-[#C1121F]" };
      return { text: "Review Submitted", color: "text-green-600" };
    }

    if (pStatus === "Awaiting Modifications") {
      return {
        text: "● Changes Effected By Researcher",
        color: "text-[#003B95]",
      };
    }

    if (s === "assigned")
      return { text: "Awaiting Acceptance", color: "text-gray-500" };
    return { text: "", color: "" };
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#003B95]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-200 rounded-full transition"
          >
            <ChevronLeft size={24} className="text-gray-800" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            Reviewer's Assignments
          </h1>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "bg-[#003B95] text-white shadow-sm"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {filteredAssignments.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            No assignments found in {activeTab}.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAssignments.map((assignment) => {
              const statusInfo = getStatusDisplay(assignment);
              const isCompleted = assignment.status === "submitted";

              return (
                <div
                  key={assignment._id}
                  className="bg-[#F3F4F6] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:shadow-sm transition-shadow"
                >
                  <div className="flex flex-col gap-2 flex-1">
                    {statusInfo.text && (
                      <span
                        className={`text-[10px] font-black uppercase tracking-widest ${statusInfo.color}`}
                      >
                        {statusInfo.text}
                      </span>
                    )}
                    <h3 className="text-base font-bold text-gray-900 leading-tight">
                      {assignment.proposal?.title || "Untitled Proposal"}
                    </h3>
                  </div>

                  <button
                    onClick={() =>
                      navigate(
                        `/admin/dashboard/assignments/${assignment._id}/details`,
                      )
                    }
                    className={`shrink-0 px-6 py-2 rounded-full text-xs font-black uppercase tracking-wider text-white transition-colors cursor-pointer ${
                      isCompleted
                        ? "bg-[#16A34A] hover:bg-green-700"
                        : "bg-[#003B95] hover:bg-blue-900"
                    }`}
                  >
                    View Details
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminReviewerAssignments;
