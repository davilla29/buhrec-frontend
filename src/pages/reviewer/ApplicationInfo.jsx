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
    <div className="min-h-screen bg-white flex flex-col p-4 sm:p-8 relative font-sans">
      {/* Responsive Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute cursor-pointer left-4 top-4 sm:left-8 sm:top-8 md:left-12 md:top-12 hover:scale-105 transition-transform bg-gray-50 hover:bg-gray-100 p-2 sm:p-2.5 rounded-full border border-gray-200 shadow-sm z-10"
      >
        <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8 text-gray-700" />
      </button>

      <div className="flex-1 flex flex-col items-center justify-center py-12 sm:py-4">
        <div className="text-center w-full max-w-4xl space-y-10 sm:space-y-12">
          {/* Header Area */}
          <header className="space-y-3 sm:space-y-4 px-2 mt-4 sm:mt-0">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              {data.proposal.title}
            </h1>
            <p className="text-[#003B95] font-bold text-sm sm:text-base md:text-lg uppercase tracking-wider">
              Application ID: {data.proposal.applicationId}
            </p>
          </header>

          {/* Details Card */}
          <section className="space-y-6 sm:space-y-8 bg-gray-50/60 p-6 sm:p-10 rounded-3xl border border-gray-100 shadow-sm mx-2">
            <div className="border-b border-gray-200 pb-6 sm:pb-8">
              <p className="text-gray-500 font-bold mb-2 text-xs sm:text-sm uppercase tracking-widest">
                Researcher Name(s)
              </p>
              <p className="text-[10px] sm:text-xs text-gray-400 mb-3 -mt-1">
                (Surname first, first name, middle name, matric number)
              </p>
              <div className="space-y-1">
                {info.researchers?.map((name, i) => (
                  <p
                    key={i}
                    className="text-lg sm:text-xl font-bold text-gray-900"
                  >
                    {name}
                  </p>
                ))}
              </div>
            </div>

            {/* Grid Layout: 1 col on mobile, 2 cols on desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              <div>
                <p className="text-gray-500 font-bold mb-1 uppercase text-[10px] sm:text-xs tracking-widest">
                  Institution
                </p>
                <p className="text-base sm:text-lg font-bold text-gray-800">
                  {info.institution || "Babcock University"}
                </p>
              </div>

              <div>
                <p className="text-gray-500 font-bold mb-1 uppercase text-[10px] sm:text-xs tracking-widest">
                  College/School
                </p>
                <p className="text-base sm:text-lg font-bold text-gray-800">
                  {info.college || "School of Computing"}
                </p>
              </div>

              <div>
                <p className="text-gray-500 font-bold mb-1 uppercase text-[10px] sm:text-xs tracking-widest">
                  Department
                </p>
                <p className="text-base sm:text-lg font-bold text-gray-800">
                  {info.department || "Computer Science"}
                </p>
              </div>

              <div>
                <p className="text-gray-500 font-bold mb-1 uppercase text-[10px] sm:text-xs tracking-widest">
                  Category
                </p>
                <p className="text-base sm:text-lg font-bold text-gray-800">
                  {info.category || "UG"}
                </p>
              </div>

              <div className="sm:col-span-2">
                <p className="text-gray-500 font-bold mb-1 uppercase text-[10px] sm:text-xs tracking-widest">
                  Supervisor
                </p>
                <p className="text-base sm:text-lg font-bold text-gray-800">
                  {info.supervisor || "Dr Falala David"}
                </p>
              </div>
            </div>
          </section>

          {/* Footer Action */}
          <footer className="pt-4 sm:pt-6 px-4">
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className={`font-bold cursor-pointer underline text-sm sm:text-base md:text-lg transition-colors ${
                isDownloading
                  ? "text-gray-400 cursor-not-allowed no-underline"
                  : "text-[#003B95] hover:text-blue-900"
              }`}
            >
              {isDownloading
                ? "Downloading..."
                : "Application letter for ethical clearance"}
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default ApplicationInfo;
