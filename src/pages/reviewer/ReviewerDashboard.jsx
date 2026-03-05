import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import { Bell, X, Loader } from "lucide-react";
import toast from "react-hot-toast";

const ReviewerDashboard = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState({
    stats: {
      accepted: 0,
      completed: 0,
      incomplete: 0,
      feedback: 0,
    },
    assignments: [],
    unreadNotifications: 0,
    reviewerName: "",
  });

  const [declineTarget, setDeclineTarget] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get("/reviewer/dashboard");

        if (res.data.success) {
          setDashboard(res.data.data);
        }
      } catch (err) {
        toast.error("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 bg-white min-h-screen">
      {/* Header */}
      <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 capitalize">
            Welcome, {dashboard.reviewerName || "Reviewer"}
          </h1>
          <p className="text-gray-500 text-sm font-medium">
            Here are your stats!
          </p>
        </div>

        <button
          onClick={() => navigate("/reviewer/dashboard/notifications")}
          className="p-3 bg-gray-100 rounded-full relative hover:bg-gray-200 transition-all"
        >
          <Bell size={22} className="text-gray-700" />

          {dashboard.unreadNotifications > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-[10px] font-black rounded-full flex items-center justify-center">
              {dashboard.unreadNotifications}
            </span>
          )}
        </button>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {[
          { label: "Accepted Assignments", value: dashboard.stats.accepted },
          { label: "Completed Assignments", value: dashboard.stats.completed },
          {
            label: "Incomplete Assignments",
            value: dashboard.stats.incomplete,
          },
          { label: "Pending Feedback", value: dashboard.stats.feedback },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-[#F3F4F6] p-6 rounded-2xl hover:border-blue-100 border"
          >
            <p className="text-[10px] font-black text-gray-500 uppercase mb-2 tracking-widest">
              {stat.label}
            </p>
            <p className="text-4xl font-black text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Assignments */}
      <h2 className="text-xl font-bold mb-6">Your Recent Assignments</h2>

      {dashboard.assignments.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 font-bold text-lg">
            No pending assignments
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {dashboard.assignments.map((task) => (
            <div
              key={task._id}
              className="bg-[#F3F4F6] p-6 rounded-2xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6"
            >
              <div>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">
                  New Assignment
                </p>

                <h3 className="text-lg font-black text-gray-900">
                  {task.projectName}
                </h3>
              </div>

              <div className="flex gap-3">
                {/* Accept Button */}
                <button className="bg-yellow-500 text-white px-8 py-3 rounded-full font-bold text-xs uppercase hover:bg-yellow-600">
                  Accept
                </button>

                {/* Decline Button */}
                <button
                  onClick={() => setDeclineTarget(task._id)}
                  className="bg-red-700 text-white px-8 py-3 rounded-full font-bold text-xs uppercase hover:bg-red-900"
                >
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Decline Modal */}
      {declineTarget && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl p-8 w-96 text-center relative">
            <button
              onClick={() => setDeclineTarget(null)}
              className="absolute right-4 top-4"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-bold mb-4">Decline this assignment?</h3>

            <div className="flex gap-3">
              <button
                onClick={() => setDeclineTarget(null)}
                className="flex-1 py-2 rounded-full bg-gray-200"
              >
                Cancel
              </button>

              <button className="flex-1 py-2 rounded-full bg-red-700 text-white">
                Yes, Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewerDashboard;
