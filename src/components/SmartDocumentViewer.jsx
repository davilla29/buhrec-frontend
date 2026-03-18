// import React, { useState, useEffect } from "react";
// import { Document, Page, pdfjs } from "react-pdf";
// import { Download, AlertCircle, FileText, Loader2 } from "lucide-react";

// // Fix: Use a template literal to ensure the worker version ALWAYS matches your package version
// pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// function SmartDocumentViewer({ url }) {
//   const [numPages, setNumPages] = useState(null);
//   const [pdfError, setPdfError] = useState(false);

//   // Reset error state if the URL changes
//   useEffect(() => {
//     setPdfError(false);
//     setNumPages(null);
//   }, [url]);

//   if (!url) return null;

//   const extension = url.split(".").pop().toLowerCase();

//   // --- REUSABLE DOWNLOAD FALLBACK COMPONENT ---
//   const DownloadFallback = ({
//     title = "Preview Unavailable",
//     message = "We can't show a preview of this file right now.",
//   }) => (
//     <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-gray-200 shadow-sm w-full max-w-lg mx-auto my-10">
//       <div className="bg-blue-50 p-4 rounded-full mb-4">
//         <FileText size={40} className="text-[#003399]" />
//       </div>
//       <h3 className="text-gray-900 font-bold text-lg mb-2">{title}</h3>
//       <p className="text-gray-500 text-sm text-center mb-6 leading-relaxed">
//         {message} <br /> Please download the file to view it on your device.
//       </p>
//       <a
//         href={url}
//         download
//         target="_blank"
//         rel="noopener noreferrer"
//         className="flex items-center gap-2 bg-[#003399] hover:bg-[#002266] text-white px-8 py-3 rounded-full font-bold transition-all shadow-md active:scale-95"
//       >
//         <Download size={20} />
//         Download Document
//       </a>
//     </div>
//   );

//   // --- PDF VIEWING LOGIC ---
//   if (extension === "pdf") {
//     return (
//       <div className="w-full h-full bg-gray-100 overflow-auto custom-scrollbar">
//         {!pdfError ? (
//           <div className="flex flex-col items-center py-8">
//             <Document
//               file={url}
//               onLoadSuccess={({ numPages }) => setNumPages(numPages)}
//               onLoadError={(err) => {
//                 console.error("PDF.js Render Error:", err);
//                 setPdfError(true);
//               }}
//               loading={
//                 <div className="flex flex-col items-center justify-center py-24">
//                   <Loader2
//                     className="animate-spin text-[#003399] mb-4"
//                     size={40}
//                   />
//                   <p className="text-gray-500 font-medium">
//                     Rendering PDF Pages...
//                   </p>
//                 </div>
//               }
//             >
//               {Array.from(new Array(numPages), (_, index) => (
//                 <div
//                   key={index}
//                   className="mb-10 shadow-2xl border border-gray-300 bg-white"
//                 >
//                   <Page
//                     pageNumber={index + 1}
//                     width={Math.min(window.innerWidth * 0.9, 850)}
//                     renderTextLayer={false}
//                     renderAnnotationLayer={false}
//                   />
//                 </div>
//               ))}
//             </Document>
//           </div>
//         ) : (
//           <div className="p-6">
//             <DownloadFallback
//               title="PDF Rendering Failed"
//               message="This could be due to a connection issue or a security restriction from the host."
//             />
//           </div>
//         )}
//       </div>
//     );
//   }

//   // --- OFFICE DOCUMENTS (Word, Excel, PPT) ---
//   if (["doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(extension)) {
//     const officeUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`;
//     return (
//       <div className="relative w-full h-full flex flex-col bg-white">
//         <iframe
//           src={officeUrl}
//           className="flex-1 w-full h-full border-none"
//           title="Office Viewer"
//         />
//         <div className="absolute bottom-6 right-6">
//           <a
//             href={url}
//             download
//             className="flex items-center gap-2 bg-white/90 backdrop-blur border shadow-lg px-4 py-2 rounded-lg text-sm font-bold text-gray-700 hover:bg-white transition-colors"
//           >
//             <Download size={16} /> Download Original
//           </a>
//         </div>
//       </div>
//     );
//   }

//   // --- IMAGES ---
//   if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension)) {
//     return (
//       <div className="flex flex-col items-center justify-center h-full bg-white p-6">
//         <div className="relative group max-h-[85%]">
//           <img
//             src={url}
//             alt="Proposal Preview"
//             className="max-h-full w-auto object-contain rounded-lg shadow-lg border border-gray-100"
//           />
//         </div>
//         <a
//           href={url}
//           download
//           className="mt-8 flex items-center gap-2 text-[#003399] font-bold hover:underline"
//         >
//           <Download size={20} /> Download Image
//         </a>
//       </div>
//     );
//   }

//   // --- DEFAULT FALLBACK ---
//   return (
//     <div className="h-full flex items-center justify-center bg-gray-50">
//       <DownloadFallback />
//     </div>
//   );
// }

// export default SmartDocumentViewer;

import React, { useState, useEffect, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Download, FileText, Loader2 } from "lucide-react";

// IMPORTANT: These CSS imports are required for the text layer to align over the PDF canvas!
// ✅ CORRECT (Newer react-pdf versions)
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

// Use a template literal to ensure the worker version ALWAYS matches your package version
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function SmartDocumentViewer({ url, searchText = "" }) {
  const [numPages, setNumPages] = useState(null);
  const [pdfError, setPdfError] = useState(false);

  // Reset error state if the URL changes
  useEffect(() => {
    setPdfError(false);
    setNumPages(null);
  }, [url]);

  // --- HIGHLIGHT MATCHING TEXT ---
  const textRenderer = useCallback(
    (textItem) => {
      if (!searchText || !searchText.trim()) return textItem.str;

      const regex = new RegExp(`(${searchText})`, "gi");
      const parts = textItem.str.split(regex);

      return parts.map((part, index) =>
        part.toLowerCase() === searchText.toLowerCase() ? (
          // We make the text transparent so it aligns with the canvas, but give it a yellow background
          <mark
            key={index}
            className="bg-yellow-300 text-transparent bg-opacity-60"
          >
            {part}
          </mark>
        ) : (
          part
        ),
      );
    },
    [searchText],
  );

  if (!url) return null;

  const extension = url.split(".").pop().toLowerCase();

  // --- REUSABLE DOWNLOAD FALLBACK COMPONENT ---
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
        {message} <br /> Please download the file to view it on your device.
      </p>
      <a
        href={url}
        download
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 bg-[#003399] hover:bg-[#002266] text-white px-8 py-3 rounded-full font-bold transition-all shadow-md active:scale-95"
      >
        <Download size={20} />
        Download Document
      </a>
    </div>
  );

  // --- PDF VIEWING LOGIC ---
  if (extension === "pdf") {
    return (
      <div className="w-full h-full bg-gray-100 overflow-auto custom-scrollbar">
        {!pdfError ? (
          <div className="flex flex-col items-center py-8">
            <Document
              file={url}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              onLoadError={(err) => {
                console.error("PDF.js Render Error:", err);
                setPdfError(true);
              }}
              loading={
                <div className="flex flex-col items-center justify-center py-24">
                  <Loader2
                    className="animate-spin text-[#003399] mb-4"
                    size={40}
                  />
                  <p className="text-gray-500 font-medium">
                    Rendering PDF Pages...
                  </p>
                </div>
              }
            >
              {Array.from(new Array(numPages), (_, index) => (
                <div
                  key={index}
                  className="mb-10 shadow-2xl border border-gray-300 bg-white relative"
                >
                  <Page
                    pageNumber={index + 1}
                    width={Math.min(window.innerWidth * 0.9, 850)}
                    renderTextLayer={true} // Enabled Text Layer for searching
                    customTextRenderer={textRenderer} // Injected highlighting logic
                    renderAnnotationLayer={false}
                  />
                </div>
              ))}
            </Document>
          </div>
        ) : (
          <div className="p-6">
            <DownloadFallback
              title="PDF Rendering Failed"
              message="This could be due to a connection issue or a security restriction from the host."
            />
          </div>
        )}
      </div>
    );
  }

  // --- OFFICE DOCUMENTS (Word, Excel, PPT) ---
  if (["doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(extension)) {
    const officeUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`;
    return (
      <div className="relative w-full h-full flex flex-col bg-white">
        {searchText && (
          <div className="bg-amber-50 p-2 text-center text-xs text-amber-700 font-medium">
            Search functionality is only supported natively for PDF documents.
          </div>
        )}
        <iframe
          src={officeUrl}
          className="flex-1 w-full h-full border-none"
          title="Office Viewer"
        />
        <div className="absolute bottom-6 right-6">
          <a
            href={url}
            download
            className="flex items-center gap-2 bg-white/90 backdrop-blur border shadow-lg px-4 py-2 rounded-lg text-sm font-bold text-gray-700 hover:bg-white transition-colors"
          >
            <Download size={16} /> Download Original
          </a>
        </div>
      </div>
    );
  }

  // --- IMAGES ---
  if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension)) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-white p-6 relative">
        {searchText && (
          <div className="absolute top-0 left-0 right-0 bg-amber-50 p-2 text-center text-xs text-amber-700 font-medium">
            Search functionality is not supported for images.
          </div>
        )}
        <div className="relative group max-h-[85%]">
          <img
            src={url}
            alt="Proposal Preview"
            className="max-h-full w-auto object-contain rounded-lg shadow-lg border border-gray-100"
          />
        </div>
        <a
          href={url}
          download
          className="mt-8 flex items-center gap-2 text-[#003399] font-bold hover:underline"
        >
          <Download size={20} /> Download Image
        </a>
      </div>
    );
  }

  // --- DEFAULT FALLBACK ---
  return (
    <div className="h-full flex items-center justify-center bg-gray-50">
      <DownloadFallback />
    </div>
  );
}

export default SmartDocumentViewer;