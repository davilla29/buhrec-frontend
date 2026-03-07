// import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import toast from "react-hot-toast";
import { ChevronLeft, Loader2, FileUp } from "lucide-react";

const SubmitRevision = () => {
  const { proposalId } = useParams();
  const navigate = useNavigate();
  
  // State for data and uploads
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Fetch Dynamic Proposal Metadata
  useEffect(() => {
    const fetchProposal = async () => {
      try {
        // Reusing your listVersions endpoint to get core proposal info
        const res = await axios.get(`/researcher/proposals/${proposalId}/versions`);
        setProposal(res.data.proposal);
      } catch (err) {
        toast.error("Could not load proposal details");
      } finally {
        setLoading(false);
      }
    };
    fetchProposal();
  }, [proposalId]);

  // 2. Handle Dynamic Upload
  const handleSubmit = async () => {
    if (!file) return toast.error("Please attach your updated proposal document");

    const formData = new FormData();
    formData.append("proposalDocument", file); // Key matches uploadProposalDocs middleware
    formData.append("changeNote", `Revision for Version ${proposal.versionCount + 1}`); 

    try {
      setIsSubmitting(true);
      // Hits ResearcherController.submitUpdatedVersion
      await axios.post(`/researcher/proposals/${proposalId}/versions`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      toast.success("Proposal updated successfully!");
      navigate(`/researcher/dashboard/proposals/${proposalId}/success`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-white flex flex-col p-12">
      <button onClick={() => navigate(-1)} className="mb-12 hover:text-blue-700 transition-colors">
        <ChevronLeft size={32} />
      </button>

      <div className="max-w-3xl mx-auto w-full text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 uppercase tracking-tight">
          {proposal?.title}
        </h1>
        <p className="text-gray-500 font-medium mb-12">
          Application ID: {proposal?.applicationId}
        </p>

        <div className="bg-[#f4f4f4] border-2 border-dashed border-gray-300 rounded-3xl py-24 px-10 mb-10 flex flex-col items-center">
          <label className="cursor-pointer group flex flex-col items-center">
            <input 
                type="file" 
                className="hidden" 
                accept=".doc,.docx"
                onChange={(e) => setFile(e.target.files[0])} 
            />
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                <FileUp className="text-blue-700" size={28} />
            </div>
            <span className="text-lg font-bold text-gray-800 group-hover:text-[#003399]">
              {file ? file.name : "Attach your proposal"}
            </span>
            <p className="text-xs text-gray-400 mt-2">Ensure your proposal is in .doc or .docx format</p>
          </label>
        </div>

        <button 
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-16 py-3.5 bg-[#003399] text-white rounded-full font-bold uppercase tracking-widest text-sm hover:bg-blue-900 transition-all shadow-lg active:scale-95 disabled:bg-gray-400"
        >
          {isSubmitting ? "Submitting..." : "Submit Proposal"}
        </button>
      </div>
    </div>
  );
};

export default SubmitRevision;