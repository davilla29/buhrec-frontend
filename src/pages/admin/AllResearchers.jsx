import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MoreHorizontal, ChevronRight, X, Search } from "lucide-react";
import axios from "../../utils/axios"; // Adjust path as needed
import toast from "react-hot-toast";

const ResearcherModal = ({ researcher, onClose }) => {
  const navigate = useNavigate();
  if (!researcher) return null;

  const initials =
    researcher.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2) || "R";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto no-scrollbar">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
        >
          <X size={20} className="text-gray-500" />
        </button>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 mb-8 text-center sm:text-left">
          <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center text-2xl overflow-hidden shrink-0 border-4 border-gray-50 shadow-sm">
            {researcher.avatar ? (
              <img
                src={researcher.avatar}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              initials
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold text-gray-900 truncate">
              {researcher.name}
            </h2>
            <p className="text-gray-500 font-medium text-sm mt-1">
              {researcher.department}
            </p>
          </div>
          <button className="absolute sm:static right-10 top-4 p-2 hover:bg-gray-100 rounded-full text-blue-600 hidden sm:block">
            <MoreHorizontal size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 bg-gray-50 p-6 rounded-2xl border border-gray-100">
          <div>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1.5">
              Title
            </p>
            <p className="font-bold text-gray-900 text-sm">
              {researcher.title || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1.5">
              Level
            </p>
            <p className="font-bold text-gray-900 text-sm">
              {researcher.level || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1.5">
              Institution
            </p>
            <p className="font-bold text-gray-900 text-sm truncate">
              {researcher.institution || "Babcock University"}
            </p>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4">
            Statistics
          </h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="bg-[#F3F4F6] rounded-2xl p-5 flex-1 flex flex-col justify-center items-center text-center">
              <p className="text-[9px] font-black text-gray-500 uppercase tracking-wider mb-2 leading-tight">
                Completed
                <br />
                Proposals
              </p>
              <p className="text-3xl font-black text-gray-900">
                {researcher.completed || 0}
              </p>
            </div>
            <div className="bg-[#F3F4F6] rounded-2xl p-5 flex-2 relative flex flex-col justify-center">
              <p className="text-[9px] font-black text-gray-500 uppercase tracking-wider mb-2 leading-tight">
                Ongoing Proposal Status
              </p>
              <p className="text-xl font-bold text-[#003B95] leading-tight pr-8 capitalize">
                {researcher.ongoingStatus}
              </p>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/50 flex items-center justify-center shadow-sm">
                <ChevronRight size={18} className="text-[#003B95]" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center pt-2">
          <button
            onClick={() => {
              onClose();
              navigate(`/admin/researchers/${researcher.id}/proposals`);
            }}
            className="w-full sm:w-auto bg-[#003B95] text-white px-12 py-3.5 rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-900 transition-all shadow-lg active:scale-95"
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
    <div className="p-4 sm:p-2 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Registered Researchers
          </h1>
          <p className="text-gray-500 text-sm font-medium">
            Here are all registered researchers!
          </p>
        </header>

        {/* Toolbar: Filters and Search */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex gap-2">
            {["Specialization", "Level", "Institution"].map((filter) => (
              <span
                key={filter}
                className="px-4 py-1.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full cursor-pointer hover:bg-gray-200 transition"
              >
                {filter}
              </span>
            ))}
          </div>

          <div className="relative w-full sm:w-auto">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search researchers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 pl-9 pr-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#003B95]/20"
            />
          </div>
        </div>

        {/* List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#003B95]"></div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredResearchers.map((researcher) => (
              <button
                key={researcher.id}
                onClick={() => setSelectedResearcher(researcher)}
                className="w-full bg-[#F3F4F6] p-4 rounded-2xl flex items-center gap-4 hover:shadow-sm transition-shadow text-left"
              >
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg overflow-hidden shrink-0">
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
                <div>
                  <p className="font-bold text-gray-900 text-base">
                    {researcher.name}
                  </p>
                  <p className="text-gray-600 text-sm font-medium">
                    {researcher.department}
                  </p>
                </div>
              </button>
            ))}
            {filteredResearchers.length === 0 && (
              <p className="text-center text-gray-500 py-10">
                No researchers found.
              </p>
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
    </div>
  );
}

export default AllResearchers;
