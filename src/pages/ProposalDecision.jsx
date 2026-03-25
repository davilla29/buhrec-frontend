import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import toast from "react-hot-toast";
import html2canvas from "html2canvas-pro";
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
        const [decisionRes, draftRes] = await Promise.all([
          axios.get(`/researcher/proposals/${proposalId}`),
          axios.get(`/researcher/proposals/${proposalId}/draft`),
        ]);

        let proposalData = decisionRes.data.proposal;

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
        console.error(err);
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

      await document.fonts.ready;

      const element = document.getElementById("certificate-pdf");

      if (!element) {
        toast.error("Certificate not found.");
        return;
      }

      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        backgroundColor: "#ffffff",
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");

      const imgWidth = 210; // A4 width
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`${data.applicationId || "BUHREC"}_Certificate.pdf`);

      toast.success("Certificate downloaded!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate PDF.");
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

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const d = new Date(dateString);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  const dateStr = formatDate(data.assignedAt || data.createdAt);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-2 font-sans">
      <div className="w-full max-w-4xl">
        {/* HEADER */}
        <div className="mb-20 mt-12 px-4">
          <h2
            className={`text-xl font-bold mb-2 ${isApproved ? "text-[#003B95]" : "text-red-700"}`}
          >
            Your proposal was {isApproved ? "approved" : "rejected"}
          </h2>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {data.title}
          </h1>
          <p className="text-gray-500">Assigned {dateStr}</p>
        </div>

        {!isApproved && data.decisionReason && (
          <div className="mb-24 px-4">
            <p className="text-gray-600 text-lg leading-relaxed">
              {data.decisionReason}
            </p>
          </div>
        )}

        {isApproved && (
          <>
            <div className="mb-10 scale-50 sm:scale-75 md:scale-90 origin-top">
              <ApprovalCertificate proposal={data} />
            </div>

            {/* 🔥 HIDDEN FULL SIZE VERSION FOR PDF */}
            <div className="fixed top-0 left-2499.75">
              <div id="certificate-pdf">
                <ApprovalCertificate proposal={data} />
              </div>
            </div>
          </>
        )}

        {/* BUTTONS */}
        <div className="cursor-pointer flex gap-4 justify-center pb-12">
          <button
            onClick={() => navigate("/researcher/dashboard/my-proposals")}
            className={`px-8 py-3 rounded-full cursor-pointer text-white transition-colors ${
              isApproved
                ? "bg-gray-600 hover:bg-gray-700"
                : "bg-red-700 hover:bg-red-800"
            }`}
          >
            {isApproved ? "Back" : "Back to proposals"}
          </button>

          {isApproved && (
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="px-10 py-3 cursor-pointer rounded-full bg-[#003B95] text-white flex items-center gap-2"
            >
              {downloading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
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
