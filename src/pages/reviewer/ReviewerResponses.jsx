import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import toast from "react-hot-toast";
import { PlayCircle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ReviewerResponses = () => {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/reviewer/responses");

        if (res.data.success) {
          setResponses(res.data.responses);
        } else {
          toast.error(res.data.message || "Failed to load responses");
        }
      } catch (err) {
        console.error("Failed to load responses", err);
        toast.error(err.response?.data?.message || "Server connection error");
      } finally {
        setLoading(false);
      }
    };

    fetchResponses();
  }, []);

  const handleContinueReview = (assignmentId) => {
    toast.success("Opening proposal...");
    // Using the standard assignment review route
    navigate(`/reviewer/dashboard/assignments/${assignmentId}/review`);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-2" />
        <p className="text-gray-500 font-medium text-sm">
          Fetching researcher updates...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-5 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="mb-6 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
            Your Responses
          </h1>
          <p className="text-gray-500 text-sm">
            The following proposals have changes effected by the researchers.
          </p>
        </header>

        {/* Responses List */}
        <div className="flex flex-col gap-4">
          {responses.length > 0 ? (
            responses.map((proposal) => (
              <div
                key={proposal._id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 sm:p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 gap-4 sm:gap-6"
              >
                <div className="flex-1 w-full">
                  <div className="flex items-center gap-2.5 mb-2">
                    {/* Subtle pulsing dot to indicate new update */}
                    <span className="relative flex h-2.5 w-2.5 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#003B95]"></span>
                    </span>
                    <span className="text-[10px] sm:text-xs font-bold text-[#003B95] uppercase tracking-wider">
                      Changes Effected By Researcher
                    </span>
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-gray-900 leading-snug max-w-2xl">
                    {proposal.title}
                  </h2>
                </div>

                <button
                  onClick={() => handleContinueReview(proposal.assignmentId)}
                  className="w-full sm:w-auto flex items-center justify-center px-6 sm:px-8 py-2.5 sm:py-2 bg-[#003B95] text-white rounded-full text-sm font-bold hover:bg-blue-900 transition-colors shadow-sm whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Continue Review
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
              <h3 className="text-gray-900 font-bold text-lg">
                All caught up!
              </h3>
              <p className="text-gray-500 mt-2 text-sm">
                No new researcher responses found at the moment.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewerResponses;
