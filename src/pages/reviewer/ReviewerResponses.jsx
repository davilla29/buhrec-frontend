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
        // Ensure this route matches your backend router (e.g., /api/reviewer/responses)
        const res = await axios.get("/reviewer/responses");

        if (res.data.success) {
          // KEY CHANGE: Accessing 'res.data.responses' to match your backend method
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

  const handleContinueReview = (proposalId) => {
    toast.success("Opening proposal...");
    navigate(`/reviewer/review/${proposalId}`);
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
    <div className="max-w-5xl mx-auto p-8 bg-white min-h-screen">
      <header className="mb-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Your Responses
        </h1>
        <p className="text-gray-500 text-sm">
          The following proposals have changes effected by the researchers
        </p>
      </header>

      <div className="flex flex-col gap-5">
        {responses.length > 0 ? (
          responses.map((proposal) => (
            <div
              key={proposal._id}
              className="flex items-center justify-between p-7 bg-[#f4f4f4] rounded-xl transition-all duration-200"
            >
              <div className="flex-1 pr-6">
                <div className="flex items-center gap-2 mb-2">
                  {/* Subtle pulsing dot to indicate new update */}
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#003399]"></span>
                  </span>
                  <span className="text-[11px] font-bold text-[#003399] uppercase tracking-wide">
                    Changes Effected By Researcher
                  </span>
                </div>
                <h2 className="text-lg font-bold text-gray-900 leading-snug max-w-2xl">
                  {proposal.title}
                </h2>
              </div>

              <button
                onClick={() => handleContinueReview(proposal._id)}
                className="flex items-center justify-center px-8 py-2 bg-[#003399] text-white rounded-full text-sm font-semibold hover:bg-blue-900 transition-colors shadow-sm whitespace-nowrap"
              >
                Continue Review
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-24 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <h3 className="text-gray-900 font-bold text-lg">All caught up!</h3>
            <p className="text-gray-500 mt-2 text-sm">
              No new researcher responses found at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewerResponses;
