import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAssignments } from "../../redux/assignment/assignmentSlice";
import { Search, SlidersHorizontal } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const AssignmentsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("assigned");
  const [searchQuery, setSearchQuery] = useState(""); // ← new state
  const dispatch = useDispatch();
  const { items, status } = useSelector((state) => state.assignments);

  useEffect(() => {
    dispatch(fetchAssignments(activeTab));
  }, [dispatch, activeTab]);

  const tabs = ["assigned", "unassigned", "completed"];

  // FILTERED ASSIGNMENTS BASED ON SEARCH
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;

    return items.filter((item) => {
      const title = item.title || item.proposal?.title || "";
      const userName =
        item.reviewer?.fullName || item.researcher?.fullName || "";

      return (
        title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        userName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [items, searchQuery]);

  return (
    <div className="p-2 min-h-screen">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Assignments</h1>
        <div className="flex gap-4 items-center">
          <Search className="text-gray-500 cursor-pointer" size={20} />
          <SlidersHorizontal
            className="text-gray-500 cursor-pointer"
            size={20}
          />
        </div>
      </div>

      {/* Search Input */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by title or reviewer/researcher name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-gray-100 rounded-xl px-4 py-2 text-sm outline-none border border-transparent focus:border-[#0038a8] focus:bg-white transition"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setSearchQuery(""); // reset search when switching tabs
            }}
            className={`px-6 py-2 rounded-full text-sm cursor-pointer font-medium transition-all ${
              activeTab === tab
                ? "bg-[#e5e7eb] text-gray-900"
                : "bg-transparent text-gray-500 hover:bg-gray-100"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* List Container */}
      <div className="space-y-4">
        {status === "loading" && <p>Loading assignments...</p>}

        {status === "succeeded" &&
          filteredItems?.map((item, index) => {
            const title = item.title || item.proposal?.title;
            const user = item.reviewer || item.researcher;
            const buttonColor =
              activeTab === "unassigned" ? "bg-[#eab308]" : "bg-[#0038a8]";

            // Determine the correct proposal ID
            const proposalId = item.proposal?._id || item._id;

            return (
              <div
                key={item._id || index}
                className="bg-white p-6 rounded-2xl shadow-sm flex justify-between items-center border border-gray-50"
              >
                <div className="flex flex-col gap-3">
                  <h3 className="text-lg font-semibold text-gray-800 max-w-2xl leading-tight">
                    {title}
                  </h3>

                  {user && (
                    <div className="flex items-center gap-2">
                      <img
                        src={user.photoUrl || "https://via.placeholder.com/30"}
                        alt="avatar"
                        className="w-6 h-6 rounded-full border border-gray-200"
                      />
                      <span className="text-sm text-gray-600 font-medium">
                        {user.fullName}
                      </span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() =>
                    navigate(
                      `/admin/dashboard/proposals/${proposalId}/details`,
                    )
                  }
                  className={`${buttonColor} cursor-pointer text-white px-8 py-2.5 rounded-full text-sm font-semibold transition-transform active:scale-95`}
                >
                  View Details
                </button>
              </div>
            );
          })}

        {status === "succeeded" && filteredItems?.length === 0 && (
          <div className="text-center py-20 text-gray-400 italic">
            No {activeTab} assignments found.
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignmentsPage;
