import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import { ChevronLeft } from "lucide-react";
import toast from "react-hot-toast";

const ApplicationInfo = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    axios
      .get(`/reviewer/assignments/${assignmentId}/proposal`)
      .then((res) => setData(res.data))
      .catch(() => navigate(-1));
  }, [assignmentId]);

  if (!data) return null;

  const info = data.version.formData;

  // Find the specific application letter document from your schema's documents array
  const documents = data.version.documents || [];
  const appLetter = documents.find((doc) => doc.type === "applicationLetter");

  const handleDownload = async () => {
    if (!appLetter || !appLetter.url) {
      toast.error("Application letter not available for download.");
      return;
    }

    try {
      setIsDownloading(true);

      // Fetch the file as a blob to force download
      const response = await fetch(appLetter.url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      // Use the filename saved in your database, or fallback to a default
      link.setAttribute(
        "download",
        appLetter.filename ||
          `Application_Letter_${data.proposal.applicationId}`,
      );

      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error downloading file:", error);
      window.open(appLetter.url, "_blank");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 relative font-sans">
      <button
        onClick={() => navigate(-1)}
        className="absolute cursor-pointer left-12 top-12 hover:scale-110 transition-transform"
      >
        <ChevronLeft size={40} />
      </button>

      <div className="text-center max-w-4xl space-y-12">
        <header className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900 leading-tight">
            {data.proposal.title}
          </h1>
          <p className="text-blue-600 font-medium text-lg uppercase tracking-wider">
            Application ID: {data.proposal.applicationId}
          </p>
        </header>

        <section className="space-y-8">
          <div>
            <p className="text-gray-500 font-medium mb-1">
              Researcher name(s) (Surname first, first name, middle name, matric
              number)
            </p>
            {info.researchers?.map((name, i) => (
              <p key={i} className="text-xl font-semibold text-gray-800">
                {name}
              </p>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-8">
            <div>
              <p className="text-gray-500 font-medium mb-1 uppercase text-sm tracking-widest">
                Institution
              </p>
              <p className="text-xl font-semibold text-gray-800">
                {info.institution || "Babcock University"}
              </p>
            </div>

            <div>
              <p className="text-gray-500 font-medium mb-1 uppercase text-sm tracking-widest">
                College/School
              </p>
              <p className="text-xl font-semibold text-gray-800">
                {info.college || "School of Computing"}
              </p>
            </div>

            <div>
              <p className="text-gray-500 font-medium mb-1 uppercase text-sm tracking-widest">
                Department
              </p>
              <p className="text-xl font-semibold text-gray-800">
                {info.department || "Computer Science"}
              </p>
            </div>

            <div>
              <p className="text-gray-500 font-medium mb-1 uppercase text-sm tracking-widest">
                Category
              </p>
              <p className="text-xl font-semibold text-gray-800">
                {info.category || "UG"}
              </p>
            </div>

            <div>
              <p className="text-gray-500 font-medium mb-1 uppercase text-sm tracking-widest">
                Supervisor
              </p>
              <p className="text-xl font-semibold text-gray-800">
                {info.supervisor || "Dr Falala David"}
              </p>
            </div>
          </div>
        </section>

        <footer className="pt-8">
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className={`font-bold cursor-pointer underline text-lg transition-colors ${
              isDownloading
                ? "text-gray-400 cursor-not-allowed"
                : "text-blue-600 hover:text-blue-800"
            }`}
          >
            {isDownloading
              ? "Downloading..."
              : "Application letter for ethical clearance"}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ApplicationInfo;
