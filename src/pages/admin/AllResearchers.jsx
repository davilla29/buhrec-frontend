import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MoreHorizontal, ChevronRight, X, Search } from "lucide-react";
import axios from "../../utils/axios";
import toast from "react-hot-toast";
import { getInitials } from "../../utils/initialsHelper";

const ResearcherModal = ({ researcher, onClose }) => {
  const navigate = useNavigate();
  if (!researcher) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-3xl w-full max-w-lg shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto no-scrollbar animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 cursor-pointer hover:bg-gray-100 rounded-full transition-colors z-10"
          aria-label="Close modal"
        >
          <X size={20} className="text-gray-500" />
        </button>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 mb-8 text-center sm:text-left">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center text-2xl sm:text-3xl overflow-hidden shrink-0 border-4 border-white shadow-md">
            {researcher.avatar ? (
              <img
                src={researcher.avatar}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              getInitials(researcher.fullName || researcher.name)
            )}
          </div>
          <div className="flex-1 min-w-0 pt-2 sm:pt-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate leading-tight">
              {researcher.name}
            </h2>
            <p className="text-gray-500 font-medium text-sm sm:text-base mt-1">
              {researcher.department}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 bg-gray-50 p-5 sm:p-6 rounded-2xl border border-gray-100">
          <div className="col-span-2 sm:col-span-1">
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">
              Title
            </p>
            <p className="font-bold text-gray-900 text-sm">
              {researcher.title || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">
              Level
            </p>
            <p className="font-bold text-gray-900 text-sm">
              {researcher.level || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">
              Institution
            </p>
            <p className="font-bold text-gray-900 text-sm truncate">
              {researcher.institution || "Babcock University"}
            </p>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-4">
            Statistics
          </h3>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="bg-[#F3F4F6] rounded-2xl p-5 flex-1 flex flex-row sm:flex-col justify-between sm:justify-center items-center text-left sm:text-center">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-wider leading-tight">
                Completed
                <span className="sm:block inline"> Proposals</span>
              </p>
              <p className="text-2xl sm:text-3xl font-black text-gray-900">
                {researcher.completed || 0}
              </p>
            </div>
            <div className="bg-[#F3F4F6] rounded-2xl p-5 flex-2 relative flex flex-row sm:flex-col justify-between sm:justify-center items-center sm:items-start group  hover:bg-gray-200 transition-colors">
              <div>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-wider mb-1 sm:mb-2 leading-tight">
                  Ongoing Proposal Status
                </p>
                <p className="text-lg sm:text-xl font-bold text-[#003B95] leading-tight capitalize">
                  {researcher.ongoingStatus || "None"}
                </p>
              </div>
              {/* <div className="sm:absolute sm:right-5 sm:top-1/2 sm:-translate-y-1/2 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <ChevronRight size={18} className="text-[#003B95]" />
              </div> */}
            </div>
          </div>
        </div>

        <div className="flex justify-center pt-2">
          <button
            onClick={() => {
              onClose();
              navigate(`/admin/dashboard/researchers/${researcher.id}/proposals`);
            }}
            className="w-full sm:w-auto cursor-pointer bg-[#003B95] text-white px-12 py-4 rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-900 transition-all shadow-lg active:scale-95"
          >
            View Proposals
          </button>
        </div>
      </div>
    </div>
  );
};

function AllResearchers() {
  const [researchers, setResearchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedResearcher, setSelectedResearcher] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchResearchers = async () => {
      try {
        const response = await axios.get("/admin/researchers");
        if (response.data.success) {
          setResearchers(response.data.data);
        }
      } catch (error) {
        toast.error("Failed to load researchers");
      } finally {
        setLoading(false);
      }
    };
    fetchResearchers();
  }, []);

  const filteredResearchers = useMemo(() => {
    if (!searchQuery) return researchers;
    return researchers.filter(
      (r) =>
        r.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.department?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [researchers, searchQuery]);

  return (
    <div className="p-4 md:p-8 min-h-screen max-w-5xl mx-auto">
      <header className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Registered Researchers
        </h1>
        <p className="text-gray-500 text-sm md:text-base font-medium mt-1">
          Here are all registered researchers!
        </p>
      </header>

      {/* Toolbar: Filters and Search */}
      <div className="flex flex-col-reverse md:flex-row justify-between items-stretch md:items-center gap-4 mb-8">
        {/* Horizontal Scrollable Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar whitespace-nowrap">
          {["Specialization", "Level", "Institution"].map((filter) => (
            <span
              key={filter}
              className="px-5 py-2 md:py-1.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full cursor-pointer hover:bg-gray-200 transition-colors"
            >
              {filter}
            </span>
          ))}
        </div>

        <div className="relative w-full md:w-auto shrink-0">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search researchers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-72 pl-10 pr-4 py-3 md:py-2.5 bg-gray-100 rounded-xl md:rounded-full text-sm focus:outline-none border border-transparent focus:bg-white focus:border-blue-500 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-[#003B95]"></div>
          <p className="text-gray-400 font-medium">Loading researchers...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          {filteredResearchers.map((researcher) => (
            <button
              key={researcher.id}
              onClick={() => setSelectedResearcher(researcher)}
              className="w-full cursor-pointer bg-white border border-gray-100 p-4 md:p-5 rounded-2xl flex items-center gap-4 hover:shadow-md hover:border-blue-100 transition-all text-left active:scale-[0.98]"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-lg overflow-hidden shrink-0 border border-blue-100">
                {researcher.avatar ? (
                  <img
                    src={researcher.avatar}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  researcher.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2) || "R"
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 text-base md:text-lg truncate">
                  {researcher.name}
                </p>
                <p className="text-gray-500 text-xs md:text-sm font-medium truncate mt-0.5">
                  {researcher.department}
                </p>
              </div>
              <div className="text-gray-300">
                <ChevronRight size={20} />
              </div>
            </button>
          ))}
          {filteredResearchers.length === 0 && (
            <div className="col-span-full text-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl py-16">
              <p className="text-gray-500 font-medium">No researchers found.</p>
              <p className="text-gray-400 text-sm mt-1">
                Try adjusting your search query.
              </p>
            </div>
          )}
        </div>
      )}

      {selectedResearcher && (
        <ResearcherModal
          researcher={selectedResearcher}
          onClose={() => setSelectedResearcher(null)}
        />
      )}
    </div>
  );
}

export default AllResearchers;
