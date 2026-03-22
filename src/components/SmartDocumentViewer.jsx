import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Download, FileText, Loader2 } from "lucide-react";

// Ensure worker version matches
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const SmartDocumentViewer = forwardRef(({ url, searchText }, ref) => {
  const [numPages, setNumPages] = useState(null);
  const [pdfError, setPdfError] = useState(false);

  const containerRef = useRef(null);
  const matchesRef = useRef([]);

  // Reset when URL changes
  useEffect(() => {
    setPdfError(false);
    setNumPages(null);
    matchesRef.current = [];
  }, [url]);

  // Highlight search matches
  const highlightText = () => {
    if (!searchText || !containerRef.current) return;

    const textLayers = containerRef.current.querySelectorAll(
      ".react-pdf__Page__textContent span",
    );

    matchesRef.current = [];

    textLayers.forEach((span) => {
      const text = span.textContent;
      if (!text) return;

      const regex = new RegExp(`(${searchText})`, "gi");

      if (regex.test(text)) {
        const newHTML = text.replace(
          regex,
          `<mark style="background-color: yellow;">$1</mark>`,
        );
        span.innerHTML = newHTML;
        matchesRef.current.push(span);
      } else {
        span.innerHTML = text; // reset
      }
    });
  };

  // Run highlight when search changes
  useEffect(() => {
    const timeout = setTimeout(() => {
      highlightText();
    }, 300); // wait for render

    return () => clearTimeout(timeout);
  }, [searchText, numPages]);

  // Expose jumpToFirstMatch to parent
  useImperativeHandle(ref, () => ({
    jumpToFirstMatch() {
      if (matchesRef.current.length > 0) {
        matchesRef.current[0].scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    },
  }));

  if (!url) return null;

  const extension = url.split(".").pop().toLowerCase();

  // --- DOWNLOAD FALLBACK ---
  const DownloadFallback = ({
    title = "Preview Unavailable",
    message = "We can't show a preview of this file right now.",
  }) => (
    <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-gray-200 shadow-sm w-full max-w-lg mx-auto my-10">
      <div className="bg-blue-50 p-4 rounded-full mb-4">
        <FileText size={40} className="text-[#003399]" />
      </div>
      <h3 className="text-gray-900 font-bold text-lg mb-2">{title}</h3>
      <p className="text-gray-500 text-sm text-center mb-6 leading-relaxed">
        {message} <br /> Please download the file to view it.
      </p>
      <a
        href={url}
        download
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 bg-[#003399] hover:bg-[#002266] text-white px-8 py-3 rounded-full font-bold"
      >
        <Download size={20} />
        Download Document
      </a>
    </div>
  );

  // --- PDF VIEW ---
  if (extension === "pdf") {
    return (
      <div
        ref={containerRef}
        className="w-full h-full bg-gray-100 overflow-auto"
      >
        {!pdfError ? (
          <div className="flex flex-col items-center py-8">
            <Document
              file={url}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              onLoadError={(err) => {
                console.error("PDF error:", err);
                setPdfError(true);
              }}
              loading={
                <div className="flex flex-col items-center justify-center py-24">
                  <Loader2
                    className="animate-spin text-[#003399] mb-4"
                    size={40}
                  />
                  <p className="text-gray-500">Rendering PDF...</p>
                </div>
              }
            >
              {Array.from(new Array(numPages), (_, index) => (
                <div key={index} className="mb-10 shadow-xl ">
                  <Page
                    pageNumber={index + 1}
                    width={Math.min(window.innerWidth * 0.9, 850)}
                    renderTextLayer={true}
                    renderAnnotationLayer={false}
                  />
                </div>
              ))}
            </Document>
          </div>
        ) : (
          <DownloadFallback
            title="PDF Rendering Failed"
            message="Could not render PDF preview."
          />
        )}
      </div>
    );
  }

  // --- OFFICE DOCS ---
  if (["doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(extension)) {
    const officeUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
      url,
    )}`;
    return (
      <iframe
        src={officeUrl}
        className="w-full h-full border-none"
        title="Office Viewer"
      />
    );
  }

  // --- IMAGES ---
  if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension)) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-white p-6">
        <img src={url} alt="Preview" className="max-h-full object-contain" />
      </div>
    );
  }

  return <DownloadFallback />;
});

export default SmartDocumentViewer;
