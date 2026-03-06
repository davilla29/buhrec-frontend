import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Search } from "lucide-react";
import axios from "axios";

function AdminProposalDetails() {
  const { proposalId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(
          `/admin/proposals/${proposalId}/details`,
        );
        if (response.data.success) setData(response.data.data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [proposalId]);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        Loading Proposal...
      </div>
    );
  if (!data)
    return (
      <div className="p-10 text-center text-red-500">
        Proposal details not found.
      </div>
    );

  const { proposal, latestVersion } = data;
  const content = latestVersion?.formData || {};

  return (
    <div className="flex flex-col h-screen bg-[#F3F4F6]">
      {/* Top Sticky Header */}
      <header className="bg-white px-8 py-5 flex items-center justify-between border-b sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-5">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 hover:bg-gray-100 rounded-lg"
          >
            <ChevronLeft size={24} className="text-gray-700" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900 truncate max-w-2xl uppercase tracking-tight">
              {proposal.title}
            </h1>
            <div className="flex gap-4 text-[11px] font-bold text-gray-500 mt-0.5">
              <span className="bg-gray-100 px-2 py-0.5 rounded uppercase tracking-widest">
                {proposal.status || "Unassigned"}
              </span>
              <span className="text-blue-700">
                APP ID: {proposal.applicationId}
              </span>
              <span className="text-blue-700">VERSION: LATEST</span>
            </div>
          </div>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <Search size={22} className="text-gray-600" />
        </button>
      </header>

      {/* Main Document Content */}
      <div className="flex-1 overflow-y-auto relative bg-[#D1D5DB] p-6 lg:p-12 scroll-smooth">
        <div className="max-w-4xl mx-auto bg-white shadow-2xl min-h-screen p-12 lg:p-20 rounded-sm">
          {/* Section: Introduction */}
          <section className="mb-16">
            <h2 className="text-xl font-bold uppercase mb-6 border-b-2 border-gray-800 pb-2">
              Introduction
            </h2>
            <h3 className="text-lg font-semibold mb-4">
              1.1 Background of the Study
            </h3>
            <p className="text-gray-700 leading-relaxed text-justify whitespace-pre-line">
              {content.backgroundOfStudy ||
                "No background information available for this proposal."}
            </p>
          </section>

          {/* Section: Chapter 1 */}
          <section className="mb-16">
            <h2 className="text-xl font-bold uppercase mb-6 border-b-2 border-gray-800 pb-2">
              Chapter 1
            </h2>
            <p className="text-gray-700 leading-relaxed text-justify whitespace-pre-line">
              {content.chapter1 ||
                "Content for Chapter 1 has not been provided."}
            </p>
          </section>

          {/* Section: References */}
          <section className="mb-16">
            <h2 className="text-xl font-bold uppercase mb-6 border-b-2 border-gray-800 pb-2">
              References
            </h2>
            <div className="bg-gray-50 p-6 rounded italic text-sm text-gray-600 space-y-2">
              {content.references
                ? content.references
                    .split("\n")
                    .map((ref, i) => <p key={i}>{ref}</p>)
                : "No references cited."}
            </div>
          </section>

          {/* Section: Appendices */}
          <section className="mb-8">
            <h2 className="text-xl font-bold uppercase mb-6 border-b-2 border-gray-800 pb-2">
              Appendices
            </h2>
            <p className="text-gray-700 italic">
              No appendix files attached to this version.
            </p>
          </section>
        </div>

        {/* Floating Action Bar */}
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex gap-4">
          <button
            onClick={() => navigate(`/admin/proposals/${proposalId}/assign`)}
            className="bg-[#003399] text-white px-10 py-3.5 rounded-full font-bold shadow-2xl hover:bg-[#002266] transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            Assign Reviewer
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminProposalDetails;
