import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import toast from "react-hot-toast";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import ApprovalCertificate from "../components/ApprovalCertificate";
import { Loader2 } from "lucide-react";

const ProposalDecision = () => {
  const { proposalId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchDecisionDetails = async () => {
      try {
        // Fetch BOTH the decision status AND the draft form data at the same time
        const [decisionRes, draftRes] = await Promise.all([
          axios.get(`/researcher/proposals/${proposalId}`),
          axios.get(`/researcher/proposals/${proposalId}/draft`),
        ]);

        let proposalData = decisionRes.data.proposal;

        // Force-inject the dynamic formData from the draft into the proposal object
        // so the Certificate component can read the Department, College, and Researchers
        if (draftRes.data.success && draftRes.data.draft?.formData) {
          proposalData = {
            ...proposalData,
            currentVersion: {
              ...(proposalData.currentVersion || {}),
              formData: draftRes.data.draft.formData,
            },
          };
        }

        setData(proposalData);
      } catch (err) {
        console.error("Error fetching details:", err);
        toast.error("Failed to load decision details");
      } finally {
        setLoading(false);
      }
    };

    fetchDecisionDetails();
  }, [proposalId]);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const element = document.getElementById("certificate-content");

      if (!element) {
        toast.error("Certificate not found.");
        return;
      }

      // Take a high-quality snapshot of the certificate div
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true, // Allows external images (like logos) to load
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");

      // Initialize PDF (Portrait, millimeters, A4 size)
      const pdf = new jsPDF("p", "mm", "a4");

      // Calculate dimensions to fit A4 page
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      // Add image to PDF and save
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${data.applicationId || "BUHREC"}_Certificate.pdf`);

      toast.success("Certificate downloaded!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-[#003B95] w-10 h-10" />
      </div>
    );
  }

  if (!data) return null;

  const isApproved = data.status?.toLowerCase() === "approved";
  const isRejected = data.status?.toLowerCase() === "rejected";

  // Colors based on status
  const themeColor = isApproved ? "text-[#003B95]" : "text-[#C1121F]";
  const buttonBg = isApproved
    ? "bg-[#003B95] hover:bg-blue-900"
    : "bg-[#C1121F] hover:bg-red-900";
  const headerText = isApproved
    ? "Your proposal was approved"
    : "Your proposal was rejected";

  // Format the date explicitly to match the "D/M/YYYY" mockup style
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const d = new Date(dateString);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  const dateStr = formatDate(data.assignedAt || data.createdAt);
  const reasonText = data.decisionReason || "No additional comment provided";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-2 font-sans">
      <div className="w-full max-w-4xl">
        {/* Header Section */}
        <div className="mb-24 mt-12 sm:mt-0 px-4">
          <h2 className={`text-xl font-bold ${themeColor} mb-2`}>
            {headerText}
          </h2>
          <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-2">
            {data.title}
          </h1>
          <p className="text-gray-500 font-medium">Assigned {dateStr}</p>
        </div>

        {/* Reason Section */}
        <div className="flex justify-center mb-24 px-4">
          <p className="text-gray-500 font-medium text-center max-w-2xl text-lg">
            {reasonText}
          </p>
        </div>

        {/* Conditional Certificate Rendering */}
        {isApproved && (
          <div className="mb-10 scale-50 sm:scale-75 md:scale-90 origin-top transform transition-all">
            {/* The actual certificate component */}
            <ApprovalCertificate proposal={data} dateStr={dateStr} />
          </div>
        )}

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center px-4 pb-12">
          <button
            onClick={() => navigate("/researcher/dashboard/my-proposals")}
            className={`w-full sm:w-auto px-8 py-3 rounded-full text-white font-medium transition-all cursor-pointer ${buttonBg}`}
          >
            Back to proposals
          </button>

          {isApproved && (
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="w-full sm:w-auto px-10 py-3 rounded-full bg-[#003B95] hover:bg-blue-900 text-white font-bold transition-all cursor-pointer shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {downloading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating PDF...
                </>
              ) : (
                "Download"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProposalDecision;
