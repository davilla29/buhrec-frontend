import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import axios from "../../utils/axios";

function UnassignedAssignments() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUnassigned = async () => {
      try {
        const response = await axios.get(
          "/api/admin/assignments/list?filter=unassigned",
        );
        if (response.data.success) {
          setProposals(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching unassigned assignments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUnassigned();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-200 rounded-full transition-colors"
        >
          <ChevronLeft size={28} />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">
          Unassigned Assignments
        </h1>
      </div>

      {/* List Container */}
      <div className="max-w-5xl mx-auto flex flex-col gap-4">
        {loading ? (
          <p className="text-center py-10 text-gray-500">
            Loading assignments...
          </p>
        ) : proposals.length > 0 ? (
          proposals.map((proposal, index) => (
            <div
              key={proposal._id}
              className="bg-[#EEEEEE] rounded-xl p-6 flex items-center justify-between shadow-sm"
            >
              <h3 className="text-lg font-semibold text-gray-800 max-w-[70%] leading-tight">
                {proposal.title}
              </h3>

              <button
                onClick={() =>
                  navigate(`/admin/proposals/${proposal._id}/details`)
                }
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  index === proposals.length - 1
                    ? "bg-[#EAB308] text-white hover:bg-[#CA8A04]" // "Continue Review" style
                    : "bg-[#EAB308] text-white hover:bg-[#CA8A04]" // "View Details" style
                }`}
              >
                {index === proposals.length - 1
                  ? "Continue Review"
                  : "View Details"}
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed">
            <p className="text-gray-500">No unassigned assignments found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default UnassignedAssignments;
