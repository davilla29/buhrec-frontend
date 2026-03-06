import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, SlidersHorizontal } from "lucide-react";
import axios from "../../utils/axios";

const getInitials = (name) =>
  name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "??";

const TABS = ["Assigned", "Unassigned", "Completed"];

const AdminAssignments = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("Assigned");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [assignments, setAssignments] = useState({
    assigned: [],
    unassigned: [],
    completed: [],
  });

  const [loading, setLoading] = useState(true);

  // FETCH DATA FROM BACKEND
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await axios.get("/admin/assignments/list");

        if (res.data.success) {
          setAssignments(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching assignments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  // SELECT DATA BASED ON TAB
  const currentList = useMemo(() => {
    if (activeTab === "Assigned") return assignments.assigned || [];
    if (activeTab === "Unassigned") return assignments.unassigned || [];
    if (activeTab === "Completed") return assignments.completed || [];
    return [];
  }, [activeTab, assignments]);

  // SEARCH FILTER
  const filtered = useMemo(() => {
    return currentList.filter((item) => {
      const title = item.title || item.proposal?.title || "Untitled Proposal";

      if (!searchQuery.trim()) return true;

      return title.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [currentList, searchQuery]);

  const handleViewDetails = (id) => {
    navigate(`/dashboard/assignments/${id}/view`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="font-bold text-gray-500">Loading assignments...</p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-5">Assignments</h1>

      {/* Tabs */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-5">
        <div className="flex space-x-2 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setSearchQuery("");
              }}
              className={`px-5 py-2 rounded-full text-sm font-semibold ${
                activeTab === tab
                  ? "bg-[#003B95] text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              setSearchOpen((s) => !s);
              setSearchQuery("");
            }}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <Search size={18} />
          </button>

          <button className="p-2 hover:bg-gray-100 rounded-full">
            <SlidersHorizontal size={18} />
          </button>
        </div>
      </div>

      {/* Search */}
      {searchOpen && (
        <div className="relative mb-5">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search assignment"
            className="w-full bg-[#F3F4F6] rounded-xl pl-10 pr-4 py-3 text-sm outline-none"
          />
        </div>
      )}

      {/* Cards */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 font-bold text-lg">
              No {activeTab.toLowerCase()} assignments
            </p>
          </div>
        ) : (
          filtered.map((item) => {
            const title =
              item.title || item.proposal?.title || "Untitled Proposal";

            const reviewerName = item.reviewer?.fullName || "Not assigned";

            const reviewerInitials = getInitials(reviewerName);

            const id = item._id || item.proposal?._id;

            return (
              <div
                key={id}
                className="bg-[#F3F4F6] rounded-2xl px-6 py-5 flex flex-col sm:flex-row justify-between gap-5"
              >
                {/* Left */}
                <div className="flex-1">
                  <p className="font-black text-gray-900">{title}</p>

                  {/* Reviewer */}
                  {activeTab !== "Unassigned" && (
                    <div className="flex items-center gap-2 mt-3 bg-white w-fit pr-4 py-1.5 rounded-full border border-gray-100">
                      <div className="w-6 h-6 rounded-full bg-[#003B95] flex items-center justify-center text-white text-xs font-bold">
                        {reviewerInitials}
                      </div>

                      <span className="text-xs font-bold">{reviewerName}</span>
                    </div>
                  )}
                </div>

                {/* Button */}
                <div className="w-full sm:w-auto">
                  {activeTab === "Unassigned" ? (
                    <button
                      onClick={() =>
                        navigate(`/dashboard/assignments/${id}/assign`)
                      }
                      className="px-8 py-3 rounded-full bg-yellow-500 text-white font-bold"
                    >
                      Assign Reviewer
                    </button>
                  ) : (
                    <button
                      onClick={() => handleViewDetails(id)}
                      className="px-8 py-3 rounded-full bg-[#003B95] text-white font-bold"
                    >
                      View Details
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AdminAssignments;
