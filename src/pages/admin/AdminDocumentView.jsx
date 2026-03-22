import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../utils/axios";
import SmartDocumentViewer from "../../components/SmartDocumentViewer";
import { FileText, Loader2 } from "lucide-react";

const formatDocType = (type) => {
  if (!type) return "Document";
  return type
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
};

function AdminDocumentView() {
  const { proposalId, docType } = useParams();
  const [loading, setLoading] = useState(true);
  const [docUrl, setDocUrl] = useState(null);
  const [proposalTitle, setProposalTitle] = useState("");

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const res = await axios.get(`/admin/proposals/${proposalId}/details`);
        if (res.data.success) {
          const { data } = res.data;
          setProposalTitle(data.proposal.title);

          // Find the requested document type from the latest version
          const requestedDoc = data.latestVersion?.documents?.find(
            (doc) => doc.type === docType,
          );

          if (requestedDoc?.url) {
            let url = requestedDoc.url;
            if (url.startsWith("//")) {
              url = `https:${url}`;
            }
            setDocUrl(url);
          }
        }
      } catch (err) {
        console.error("Failed to load document details", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [proposalId, docType]);

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-[#003B95] mb-4" />
        <p className="text-gray-600 font-medium">
          Loading {formatDocType(docType)}...
        </p>
      </div>
    );
  }

  if (!docUrl) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
        <FileText className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Document Not Found
        </h2>
        <p className="text-gray-500 max-w-md">
          The requested {formatDocType(docType)} is missing or hasn't been
          uploaded for this proposal version.
        </p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100 font-sans overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-blue-50 p-2 rounded-lg">
            <FileText className="text-[#003B95] w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-tight">
              {formatDocType(docType)}
            </h1>
            <p className="text-xs font-medium text-gray-500 truncate max-w-md lg:max-w-2xl uppercase">
              {proposalTitle}
            </p>
          </div>
        </div>

        <button
          onClick={() => window.close()}
          className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-full transition-colors cursor-pointer"
        >
          Close Tab
        </button>
      </header>

      {/* Document Viewer Area */}
      <main className="flex-1 w-full bg-gray-50 overflow-hidden relative">
        <SmartDocumentViewer url={docUrl} />
      </main>
    </div>
  );
}

export default AdminDocumentView;
