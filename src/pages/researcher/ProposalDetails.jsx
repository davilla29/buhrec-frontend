import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../utils/axios"; // Adjust path as needed
import { ChevronLeft, FileText, PlusCircle } from "lucide-react";

const ProposalDetails = () => {
  const { proposalId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        // Using listVersions to get the latest version number
        const res = await axios.get(
          `/researcher/proposals/${proposalId}/versions`,
        );
        const latestVersion = res.data.proposal.versionCount;

        // Fetching comments for that version
        const commentRes = await axios.get(
          `/researcher/proposals/${proposalId}/versions/${latestVersion}/comments`,
        );
        setData({
          proposal: res.data.proposal,
          version: commentRes.data.version,
          comments: commentRes.data.comments,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [proposalId]);

  if (loading)
    return <div className="p-10 text-center">Loading details...</div>;

  const sections = [
    "Information",
    "Chapter 1",
    "Chapter 2",
    "Chapter 3",
    "References",
    "Appendices",
  ];

  return (
    <div className="min-h-screen p-2">
      {/* Header Area */}
      <div className="max-w-6xl mx-auto flex justify-between items-start mb-10">
        <button
          onClick={() => navigate(-1)}
          className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 transition"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="flex-1 px-10 text-center md:text-left">
          <h1 className="text-xl font-bold text-gray-900 leading-tight uppercase max-w-2xl">
            {data.proposal.title}
          </h1>
          <div className="flex gap-6 mt-2 text-sm text-gray-500 font-medium">
            <span>
              Assigned:{" "}
              {new Date(data.proposal.assignedAt).toLocaleDateString()}
            </span>
            <span>Application ID: {data.proposal.applicationId}</span>
          </div>
        </div>
        <div className="text-blue-700 font-bold">Version: Latest</div>
      </div>

      <div className="max-w-6xl mx-auto flex gap-12">
        {/* Sidebar Navigation */}
        <div className="w-48 flex flex-col gap-3">
          <button
            onClick={() =>
              navigate(
                `/researcher/dashboard/proposals/${proposalId}/submit-revision`,
              )
            }
            className="mt-12 cursor-pointer px-4 py-2 bg-[#003399] hover:bg-blue-900 text-white rounded-full text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
          >
            Attach new document
          </button>
        </div>

        {/* Main Comments List */}
        <div className="flex-1 space-y-4">
          {data.comments.map((comment, idx) => (
            <div
              key={idx}
              className="bg-[#EAEAEA] p-6 rounded-xl flex gap-4 border border-gray-100"
            >
              <img
                src="/avatar-placeholder.png"
                alt="Reviewer"
                className="w-10 h-10 rounded-full bg-gray-300"
              />
              <div>
                <h4 className="font-bold text-sm text-gray-900">
                  {comment.reviewer?.fullName}
                </h4>
                <p className="text-gray-700 text-sm mt-2">{comment.comment}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Comment Counter */}
        <div className="w-32 flex items-center justify-center">
          <h2 className="text-2xl font-bold text-gray-900 text-center">
            {data.comments.length} comments
          </h2>
        </div>
      </div>
    </div>
  );
};

export default ProposalDetails;
