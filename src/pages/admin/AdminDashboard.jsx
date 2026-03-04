import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import toast from "react-hot-toast";

const FILTER_OPTIONS = [
  { label: "This Week", value: "this_week" },
  { label: "This Month", value: "this_month" },
  { label: "Last 3 Months", value: "last_3_months" },
  { label: "Last 6 Months", value: "last_6_months" },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("this_week");
  const [stats, setStats] = useState({
    topStats: {
      unassignedAssignments: 0,
      assignedAssignments: 0,
      completedAssignments: 0,
      incompleteAssignments: 0,
    },
    applicationStats: {
      ugSubmissions: 0,
      pgSubmissions: 0,
      newApplications: 0,
    },
    unassignedBannerCount: 0,
  });
  const [loading, setLoading] = useState(false);

  const fetchStats = async (filterValue) => {
    try {
      setLoading(true);
      const res = await axios.get("/admin/dashboard", {
        params: { timeframe: filterValue },
        withCredentials: true,
      });
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch dashboard stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats(activeFilter);
  }, [activeFilter]);

  const statCardsTop = useMemo(() => {
    return [
      {
        label: "Unassigned Assignments",
        value: stats.topStats.unassignedAssignments,
      },
      {
        label: "Assigned Assignments",
        value: stats.topStats.assignedAssignments,
      },
      {
        label: "Completed Assignments",
        value: stats.topStats.completedAssignments,
      },
      {
        label: "Incomplete Assignments",
        value: stats.topStats.incompleteAssignments,
      },
    ];
  }, [stats]);

  const statCardsBottom = useMemo(() => {
    return [
      {
        label: "UG Application Submissions",
        value: stats.applicationStats.ugSubmissions,
      },
      {
        label: "PG Application Submissions",
        value: stats.applicationStats.pgSubmissions,
      },
      {
        label: "New Applications",
        value: stats.applicationStats.newApplications,
      },
    ];
  }, [stats]);

  return (
    <div className="p-4 min-h-screen">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome, Admin</h1>
          <p className="text-gray-500">Here are your stats!</p>
        </div>
        <button
          onClick={() => navigate("/admin/dashboard/notifications")}
          className="p-2 cursor-pointer bg-gray-100 rounded-full hover:bg-gray-200"
        >
          <span className="sr-only">Notifications</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
          </svg>
        </button>
      </header>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {statCardsTop.map((stat, i) => (
          <div key={i} className="bg-[#F3F4F6] p-6 rounded-2xl">
            <p className="text-[10px] font-black text-gray-800 uppercase mb-2 tracking-wider">
              {stat.label}
            </p>
            {loading ? (
              <div className="h-10 w-10 border-4 border-gray-300 border-t-[#003B95] rounded-full animate-spin mx-auto" />
            ) : (
              <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
            )}
          </div>
        ))}
      </div>

      {/* Filter Buttons */}
      <div className="flex space-x-3 mb-8">
        {FILTER_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => setActiveFilter(option.value)}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
              activeFilter === option.value
                ? "bg-[#003B95] text-white shadow-md"
                : "bg-[#F3F4F6] text-gray-500 hover:bg-gray-200"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Bottom Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {statCardsBottom.map((stat, i) => (
          <div key={i} className="bg-[#F3F4F6] p-6 rounded-2xl">
            <p className="text-[10px] font-black text-gray-800 uppercase mb-2 tracking-wider">
              {stat.label}
            </p>
            {loading ? (
              <div className="h-10 w-10 border-4 border-gray-300 border-t-[#003B95] rounded-full animate-spin mx-auto" />
            ) : (
              <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
            )}
          </div>
        ))}
      </div>

      {/* Clickable Banner */}
      <h2 className="text-xl font-bold mb-4 text-gray-900 font-sans">
        Your Unassigned Assignments
      </h2>
      <div
        onClick={() => navigate("/dashboard/assignments")}
        className="group bg-[#F3F4F6] p-8 rounded-2xl flex justify-between items-center cursor-pointer hover:shadow-md transition-all active:scale-[0.99]"
      >
        <p className="text-lg font-semibold text-gray-900">
          You have{" "}
          <span className="text-[#003B95]">{stats.unassignedBannerCount}</span>{" "}
          Unassigned Assignments
        </p>
        <div className="p-3 bg-gray-200 rounded-full group-hover:bg-[#003B95] group-hover:text-white transition-colors">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
