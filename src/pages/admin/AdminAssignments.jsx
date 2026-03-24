import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAssignments } from "../../redux/assignment/assignmentSlice";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AssignmentsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("assigned");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
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

  // Handle Search Toggle
  const handleToggleSearch = () => {
    setIsSearchOpen((prev) => !prev);
    if (isSearchOpen) {
      setSearchQuery("");
    }
  };

  return (
    <div className="p-4 md:p-6 min-h-screen max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Assignments
        </h1>
        <div className="flex gap-3 md:gap-4 items-center">
          {/* Toggle Search Button */}
          <button
            onClick={handleToggleSearch}
            className="p-2 -mr-2 cursor-pointer hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center"
          >
            {isSearchOpen ? (
              <X className="text-gray-800" size={22} />
            ) : (
              <Search
                className="text-gray-500 hover:text-gray-800 transition-colors"
                size={22}
              />
            )}
          </button>
        </div>
      </div>

      {/* Conditionally Rendered Search Input */}
      {isSearchOpen && (
        <div className="mb-6 animate-in slide-in-from-top-2 fade-in duration-200">
          <input
            type="text"
            autoFocus
            placeholder="Search by title or reviewer/researcher name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-100 rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-[#0038a8] focus:bg-white focus:shadow-sm transition-all"
          />
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar sm:overflow-visible">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setSearchQuery("");
              setIsSearchOpen(false);
            }}
            className={`px-5 py-2 rounded-full text-sm cursor-pointer font-semibold transition-all whitespace-nowrap ${
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
        {status === "loading" && (
          <div className="flex flex-col items-center py-20 text-gray-400">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-[#0038a8] rounded-full animate-spin mb-4" />
            <p>Loading assignments...</p>
          </div>
        )}

        {status === "succeeded" &&
          filteredItems?.map((item, index) => {
            const title = item.title || item.proposal?.title;
            const user = item.reviewer || item.researcher;
            const buttonColor =
              activeTab === "unassigned" ? "bg-[#eab308]" : "bg-[#0038a8]";

            const proposalId = item.proposal?._id || item._id;

            return (
              <div
                key={item._id || index}
                className="bg-white p-5 md:p-6 rounded-2xl shadow-sm flex flex-col md:flex-row md:justify-between md:items-center border border-gray-100 gap-4"
              >
                <div className="flex flex-col gap-3">
                  <h3 className="text-base md:text-lg font-bold text-gray-800 max-w-2xl leading-tight">
                    {title}
                  </h3>

                  {user && (
                    <div className="flex items-center gap-2">
                      {/* Avatar Logic: Image or First Letter */}
                      {user.photoUrl ? (
                        <img
                          src={user.photoUrl}
                          alt={`${user.fullName} avatar`}
                          className="w-7 h-7 rounded-full border border-gray-200 object-cover"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-[#e5e7eb] text-gray-700 font-bold flex items-center justify-center text-xs border border-gray-200 uppercase">
                          {user.fullName ? user.fullName.charAt(0) : "?"}
                        </div>
                      )}

                      <span className="text-sm text-gray-600 font-medium">
                        {user.fullName || "Unknown User"}
                      </span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() =>
                    navigate(`/admin/dashboard/proposals/${proposalId}/details`)
                  }
                  className={`${buttonColor} w-full md:w-auto cursor-pointer text-white px-8 py-2.5 rounded-full text-sm font-semibold transition-transform active:scale-95`}
                >
                  View Details
                </button>
              </div>
            );
          })}

        {status === "succeeded" && filteredItems?.length === 0 && (
          <div className="text-center py-20 text-gray-400 italic bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            No {activeTab} assignments found.
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignmentsPage;
