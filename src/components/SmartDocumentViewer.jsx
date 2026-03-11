import { Document, Page, pdfjs } from "react-pdf";
import { useState } from "react";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function SmartDocumentViewer({ url }) {
  const [numPages, setNumPages] = useState(null);

  if (!url) return null;

  const extension = url.split(".").pop().toLowerCase();

  // PDF Viewer
  if (extension === "pdf") {
    return (
      <div className="overflow-auto h-full flex justify-center">
        <Document
          file={url}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        >
          {Array.from(new Array(numPages), (_, index) => (
            <Page key={index} pageNumber={index + 1} width={900} />
          ))}
        </Document>
      </div>
    );
  }

  // Office documents
  if (["doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(extension)) {
    const officeUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
      url,
    )}`;

    return (
      <iframe src={officeUrl} className="w-full h-full" title="Office Viewer" />
    );
  }

  // Images
  if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension)) {
    return (
      <div className="flex justify-center">
        <img src={url} alt="preview" className="max-h-[75vh] object-contain" />
      </div>
    );
  }

  // Fallback
  return (
    <div className="text-center py-10">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline"
      >
        Download Document
      </a>
    </div>
  );
}

export default SmartDocumentViewer;
