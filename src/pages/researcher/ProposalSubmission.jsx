// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import axios from "../../utils/axios";
// import toast from "react-hot-toast";
// import { ArrowLeft, X, Loader, Upload, FileText, Trash2 } from "lucide-react";

// const CATEGORIES = ["UG", "PG", "Independent/Masters", "PhD", "International"];

// const ALLOWED_FILE_TYPES = [
//   "application/pdf",
//   "application/msword",
//   "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
// ];

// const MAX_FILE_SIZE = 10 * 1024 * 1024;
// const RESEARCHER_REGEX = /^[A-Za-z]+ [A-Za-z]+ [A-Za-z]+ \d{2}\/\d{4}$/;

// const ProposalSubmission = () => {
//   const navigate = useNavigate();
//   const { proposalId } = useParams();

//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [status, setStatus] = useState("");

//   const [researcherErrors, setResearcherErrors] = useState([]);

//   const [formData, setFormData] = useState({
//     projectName: "",
//     researchers: [""],
//     institution: "",
//     college: "",
//     department: "",
//     category: "",
//     supervisor: "",
//     supervisorEmail: "",
//   });

//   const [files, setFiles] = useState({
//     applicationLetter: null,
//     proposalDocument: null,
//     turnItInReport: null,
//   });

//   const isPaid = status !== "Draft";

//   useEffect(() => {
//     const fetchDraft = async () => {
//       try {
//         const res = await axios.get(
//           `/researcher/proposals/${proposalId}/draft`,
//         );

//         if (res.data.success) {
//           const draft = res.data.draft;

//           setStatus(res.data.status);

//           setFormData((prev) => ({
//             ...prev,
//             ...draft.formData,
//           }));

//           const loadedFiles = {
//             applicationLetter: null,
//             proposalDocument: null,
//             turnItInReport: null,
//           };

//           draft.documents?.forEach((doc) => {
//             loadedFiles[doc.type] = {
//               name: doc.filename,
//               url: doc.url,
//               publicId: doc.publicId,
//               existing: true,
//             };
//           });

//           setFiles(loadedFiles);
//         }
//       } catch (err) {
//         toast.error("Failed to load draft");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDraft();
//   }, [proposalId]);

//   const handleChange = (key, value) => {
//     if (isPaid) return;
//     setFormData((prev) => ({ ...prev, [key]: value }));
//   };

//   const validateResearcher = (index, value) => {
//     const errors = [...researcherErrors];

//     if (!RESEARCHER_REGEX.test(value.trim())) {
//       errors[index] = "Format must be: Surname Firstname Middlename 21/1234";
//     } else {
//       errors[index] = "";
//     }

//     setResearcherErrors(errors);
//   };

//   const handleResearcherChange = (index, value) => {
//     if (isPaid) return;

//     const updated = [...formData.researchers];
//     updated[index] = value;

//     handleChange("researchers", updated);
//     validateResearcher(index, value);
//   };

//   const addResearcher = () => {
//     if (isPaid) return;
//     handleChange("researchers", [...formData.researchers, ""]);
//   };

//   const removeResearcher = (index) => {
//     if (isPaid) return;
//     const updated = formData.researchers.filter((_, i) => i !== index);
//     handleChange("researchers", updated);
//   };

//   const handleFileChange = (key, file) => {
//     if (isPaid) return;
//     if (!file) return;

//     if (!ALLOWED_FILE_TYPES.includes(file.type)) {
//       toast.error("Only PDF, DOC, or DOCX files are allowed.");
//       return;
//     }

//     if (file.size > MAX_FILE_SIZE) {
//       toast.error("File size must be less than 10MB");
//       return;
//     }

//     setFiles((prev) => ({
//       ...prev,
//       [key]: {
//         name: file.name,
//         file,
//         existing: false,
//       },
//     }));
//   };

//   const removeFile = (key) => {
//     if (isPaid) return;

//     setFiles((prev) => ({
//       ...prev,
//       [key]: null,
//     }));
//   };

//   const handleSaveDraft = async () => {
//     if (isPaid) return;

//     try {
//       setSaving(true);
//       const loadingToast = toast.loading("Saving draft...");

//       const payload = new FormData();
//       payload.append("formData", JSON.stringify(formData));

//       if (files.applicationLetter?.file)
//         payload.append("applicationLetter", files.applicationLetter.file);

//       if (files.proposalDocument?.file)
//         payload.append("proposalDocument", files.proposalDocument.file);

//       if (files.turnItInReport?.file)
//         payload.append("turnItInReport", files.turnItInReport.file);

//       await axios.patch(`/researcher/proposals/${proposalId}/draft`, payload);

//       toast.success("Draft saved successfully", { id: loadingToast });

//       navigate("/researcher/dashboard/my-proposals");
//       setShowModal(false);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to save draft");
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="h-screen flex items-center justify-center">
//         <Loader className="animate-spin" />
//       </div>
//     );
//   }

//   const renderUpload = (label, key) => {
//     const file = files[key];

//     return (
//       <div className="flex flex-col gap-2">
//         <label className="font-semibold text-sm text-gray-700">{label}</label>

//         {!file ? (
//           <label
//             className={`flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 rounded-xl
//             ${
//               isPaid
//                 ? "cursor-not-allowed opacity-60"
//                 : "cursor-pointer hover:border-blue-700 hover:bg-blue-50 transition"
//             }`}
//           >
//             <Upload className="w-6 h-6 text-gray-400 mb-2" />

//             <span className="text-sm text-gray-500">
//               Click to upload document
//             </span>

//             {!isPaid && (
//               <input
//                 type="file"
//                 accept=".pdf,.doc,.docx"
//                 className="hidden"
//                 onChange={(e) => handleFileChange(key, e.target.files[0])}
//               />
//             )}
//           </label>
//         ) : (
//           <div className="flex items-center justify-between bg-gray-100 p-4 rounded-xl border">
//             <div className="flex items-center gap-3">
//               <FileText className="text-blue-700" size={20} />

//               <a
//                 href={file.url}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-sm font-medium text-gray-700 hover:underline"
//               >
//                 {file.name}
//               </a>
//             </div>

//             {!isPaid && (
//               <div className="flex items-center gap-4">
//                 <label className="text-blue-700 text-sm cursor-pointer hover:underline">
//                   Replace
//                   <input
//                     type="file"
//                     accept=".pdf,.doc,.docx"
//                     className="hidden"
//                     onChange={(e) => handleFileChange(key, e.target.files[0])}
//                   />
//                 </label>

//                 <button
//                   type="button"
//                   onClick={() => removeFile(key)}
//                   className="text-red-500 cursor-pointer hover:text-red-700"
//                 >
//                   <Trash2 size={18} />
//                 </button>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen">
//       <div className="flex justify-between items-center mb-8">
//         <div className="flex items-center gap-4">
//           <button
//             onClick={() =>
//               isPaid
//                 ? navigate("/researcher/dashboard/my-proposals")
//                 : setShowModal(true)
//             }
//             className="p-2 hover:bg-gray-200 cursor-pointer rounded-full"
//           >
//             <ArrowLeft size={18} />
//           </button>

//           <div>
//             <h1 className="text-xl font-bold">Edit Draft</h1>

//             {isPaid && (
//               <p className="text-sm text-green-600 font-medium">
//                 This proposal has been paid for and can no longer be edited.
//               </p>
//             )}
//           </div>
//         </div>

//         <div className="flex gap-3">
//           <button
//             onClick={handleSaveDraft}
//             disabled={isPaid}
//             className={`px-6 py-2 rounded-full font-semibold text-white
//             ${
//               isPaid
//                 ? "bg-gray-400 cursor-not-allowed"
//                 : "bg-[#003B95] hover:bg-blue-900 cursor-pointer"
//             }`}
//           >
//             Save Draft
//           </button>

//           {!isPaid && (
//             <button
//               onClick={() =>
//                 navigate(
//                   `/researcher/dashboard/proposals/${proposalId}/payment`,
//                 )
//               }
//               className="px-6 py-2 rounded-full cursor-pointer bg-green-600 text-white font-semibold hover:bg-green-700"
//             >
//               Proceed to Payment
//             </button>
//           )}
//         </div>
//       </div>

//       <div className="bg-white p-8 rounded-2xl shadow-sm max-w-3xl space-y-6">
//         <div>
//           <label className="font-semibold text-sm">Project Name</label>
//           <input
//             disabled={isPaid}
//             value={formData.projectName}
//             onChange={(e) => handleChange("projectName", e.target.value)}
//             className="w-full mt-2 bg-[#E5E7EB] rounded-xl px-4 py-3"
//           />
//         </div>

//         <div>
//           <label className="font-semibold text-sm">Researcher Name</label>

//           {formData.researchers.map((name, index) => (
//             <div key={index} className="mt-2">
//               <div className="flex gap-2">
//                 <input
//                   disabled={isPaid}
//                   value={name}
//                   placeholder="Adeyemi John Michael 21/1234"
//                   onChange={(e) =>
//                     handleResearcherChange(index, e.target.value)
//                   }
//                   className={`flex-1 rounded-xl px-4 py-3 bg-[#E5E7EB] ${
//                     researcherErrors[index] ? "border-2 border-red-500" : ""
//                   }`}
//                 />

//                 {!isPaid && formData.researchers.length > 1 && (
//                   <button
//                     type="button"
//                     onClick={() => removeResearcher(index)}
//                     className="p-2 cursor-pointer bg-red-500 text-white rounded-full"
//                   >
//                     <X size={14} />
//                   </button>
//                 )}
//               </div>
//               {researcherErrors[index] && (
//                 <p className="text-red-500 text-xs mt-1 ml-1 font-medium">
//                   {researcherErrors[index]}
//                 </p>
//               )}
//             </div>
//           ))}

//           {!isPaid && (
//             <button
//               type="button"
//               onClick={addResearcher}
//               className="cursor-pointer text-sm text-[#003B95] font-semibold mt-2"
//             >
//               + Add Researcher
//             </button>
//           )}
//         </div>

//         <div>
//           <label className="font-semibold text-sm">Institution</label>
//           <input
//             disabled={isPaid}
//             value={formData.institution}
//             onChange={(e) => handleChange("institution", e.target.value)}
//             className="w-full bg-[#E5E7EB] rounded-xl px-4 py-3"
//           />
//         </div>

//         <div>
//           <label className="font-semibold text-sm">College/School</label>
//           <input
//             disabled={isPaid}
//             value={formData.college}
//             onChange={(e) => handleChange("college", e.target.value)}
//             className="w-full bg-[#E5E7EB] rounded-xl px-4 py-3"
//           />
//         </div>

//         <div>
//           <label className="font-semibold text-sm">Department</label>
//           <input
//             disabled={isPaid}
//             value={formData.department}
//             onChange={(e) => handleChange("department", e.target.value)}
//             className="w-full bg-[#E5E7EB] rounded-xl px-4 py-3"
//           />
//         </div>

//         <div>
//           <label className="font-semibold text-sm">Category</label>
//           <div className="flex gap-4 mt-2 flex-wrap">
//             {CATEGORIES.map((cat) => (
//               <button
//                 key={cat}
//                 disabled={isPaid}
//                 onClick={() => handleChange("category", cat)}
//                 className={`px-4 py-2 rounded-full border ${
//                   formData.category === cat
//                     ? "bg-[#003B95] text-white"
//                     : "bg-white"
//                 } ${
//                   isPaid ? "cursor-not-allowed opacity-60" : "cursor-pointer"
//                 }`}
//               >
//                 {cat}
//               </button>
//             ))}
//           </div>
//         </div>

//         <div>
//           <label className="font-semibold text-sm">Supervisor Name</label>
//           <input
//             disabled={isPaid}
//             value={formData.supervisor}
//             onChange={(e) => handleChange("supervisor", e.target.value)}
//             className="w-full bg-[#E5E7EB] rounded-xl px-4 py-3"
//           />
//         </div>

//         <div>
//           <label className="font-semibold text-sm">Supervisor Email</label>
//           <input
//             disabled={isPaid}
//             type="email"
//             value={formData.supervisorEmail}
//             onChange={(e) => handleChange("supervisorEmail", e.target.value)}
//             className="w-full bg-[#E5E7EB] rounded-xl px-4 py-3"
//           />
//         </div>

//         <div className="space-y-6 pt-4">
//           {renderUpload(
//             "Application letter for ethical clearance",
//             "applicationLetter",
//           )}
//           {renderUpload("Proposal Document", "proposalDocument")}
//           {renderUpload("Turn-It-In Report", "turnItInReport")}
//         </div>
//       </div>

//       {showModal && !isPaid && (
//         <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
//           <div className="bg-white p-8 rounded-2xl w-96 text-center relative">
//             <button
//               onClick={() => setShowModal(false)}
//               className="absolute top-4 right-4"
//             >
//               <X size={16} />
//             </button>

//             <h3 className="font-bold mb-6">
//               Save your progress before leaving?
//             </h3>

//             <div className="flex gap-4">
//               <button
//                 onClick={() => navigate("/researcher/dashboard/my-proposals")}
//                 className="flex-1 cursor-pointer py-3 rounded-full bg-red-600 text-white"
//               >
//                 Discard
//               </button>

//               <button
//                 onClick={handleSaveDraft}
//                 disabled={saving}
//                 className="flex-1 cursor-pointer py-3 rounded-full bg-[#003B95] text-white"
//               >
//                 {saving ? "Saving..." : "Save Draft"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProposalSubmission;

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../utils/axios";
import toast from "react-hot-toast";
import { ArrowLeft, X, Loader, Upload, FileText, Trash2 } from "lucide-react";

const CATEGORIES = ["UG", "PG", "Independent/Masters", "PhD", "International"];

const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const RESEARCHER_REGEX = /^[A-Za-z]+ [A-Za-z]+ [A-Za-z]+ \d{2}\/\d{4}$/;

const ProposalSubmission = () => {
  const navigate = useNavigate();
  const { proposalId } = useParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState("");

  const [researcherErrors, setResearcherErrors] = useState([]);

  const [formData, setFormData] = useState({
    projectName: "",
    researchers: [""],
    institution: "",
    college: "",
    department: "",
    category: "",
    supervisor: "",
    supervisorEmail: "",
  });

  const [files, setFiles] = useState({
    applicationLetter: null,
    proposalDocument: null,
    turnItInReport: null,
  });

  const isPaid = status !== "Draft";

  useEffect(() => {
    const fetchDraft = async () => {
      try {
        const res = await axios.get(
          `/researcher/proposals/${proposalId}/draft`,
        );

        if (res.data.success) {
          const draft = res.data.draft;

          setStatus(res.data.status);

          setFormData((prev) => ({
            ...prev,
            ...draft.formData,
          }));

          const loadedFiles = {
            applicationLetter: null,
            proposalDocument: null,
            turnItInReport: null,
          };

          draft.documents?.forEach((doc) => {
            loadedFiles[doc.type] = {
              name: doc.filename,
              url: doc.url,
              publicId: doc.publicId,
              existing: true,
            };
          });

          setFiles(loadedFiles);
        }
      } catch (err) {
        toast.error("Failed to load draft");
      } finally {
        setLoading(false);
      }
    };

    fetchDraft();
  }, [proposalId]);

  const handleChange = (key, value) => {
    if (isPaid) return;
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const validateResearcher = (index, value) => {
    const errors = [...researcherErrors];

    if (!RESEARCHER_REGEX.test(value.trim())) {
      errors[index] = "Format must be: Surname Firstname Middlename 21/1234";
    } else {
      errors[index] = "";
    }

    setResearcherErrors(errors);
  };

  const handleResearcherChange = (index, value) => {
    if (isPaid) return;

    const updated = [...formData.researchers];
    updated[index] = value;

    handleChange("researchers", updated);
    validateResearcher(index, value);
  };

  const addResearcher = () => {
    if (isPaid) return;
    handleChange("researchers", [...formData.researchers, ""]);
  };

  const removeResearcher = (index) => {
    if (isPaid) return;
    const updated = formData.researchers.filter((_, i) => i !== index);
    handleChange("researchers", updated);
  };

  const handleFileChange = (key, file) => {
    if (isPaid) return;
    if (!file) return;

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast.error("Only PDF, DOC, or DOCX files are allowed.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size must be less than 10MB");
      return;
    }

    setFiles((prev) => ({
      ...prev,
      [key]: {
        name: file.name,
        file,
        existing: false,
      },
    }));
  };

  const removeFile = (key) => {
    if (isPaid) return;

    setFiles((prev) => ({
      ...prev,
      [key]: null,
    }));
  };

  const handleSaveDraft = async () => {
    if (isPaid) return;

    try {
      setSaving(true);
      const loadingToast = toast.loading("Saving draft...");

      const payload = new FormData();
      payload.append("formData", JSON.stringify(formData));

      if (files.applicationLetter?.file)
        payload.append("applicationLetter", files.applicationLetter.file);

      if (files.proposalDocument?.file)
        payload.append("proposalDocument", files.proposalDocument.file);

      if (files.turnItInReport?.file)
        payload.append("turnItInReport", files.turnItInReport.file);

      await axios.patch(`/researcher/proposals/${proposalId}/draft`, payload);

      toast.success("Draft saved successfully", { id: loadingToast });

      navigate("/researcher/dashboard/my-proposals");
      setShowModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save draft");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader className="animate-spin text-blue-800 w-10 h-10" />
      </div>
    );
  }

  const renderUpload = (label, key) => {
    const file = files[key];

    return (
      <div className="flex flex-col gap-2">
        <label className="font-semibold text-sm text-gray-700">{label}</label>

        {!file ? (
          <label
            className={`flex flex-col items-center justify-center w-full p-6 sm:p-8 border-2 border-dashed border-gray-300 rounded-2xl
            ${
              isPaid
                ? "cursor-not-allowed opacity-60"
                : "cursor-pointer hover:border-blue-700 hover:bg-blue-50 transition-colors"
            }`}
          >
            <Upload className="w-6 h-6 md:w-8 md:h-8 text-gray-400 mb-3" />

            <span className="text-sm font-medium text-gray-500 text-center">
              Click to upload document
            </span>
            <span className="text-xs text-gray-400 mt-1">
              PDF, DOC, DOCX (Max 10MB)
            </span>

            {!isPaid && (
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={(e) => handleFileChange(key, e.target.files[0])}
              />
            )}
          </label>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-200 gap-4">
            {/* Truncated File Name */}
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 shrink-0 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center">
                <FileText size={20} />
              </div>

              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-gray-800 hover:text-blue-700 hover:underline truncate"
              >
                {file.name}
              </a>
            </div>

            {/* Actions */}
            {!isPaid && (
              <div className="flex items-center gap-4 shrink-0 sm:border-l sm:pl-4 border-gray-200">
                <label className="text-blue-700 text-sm font-semibold cursor-pointer hover:underline transition-colors active:scale-95">
                  Replace
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) => handleFileChange(key, e.target.files[0])}
                  />
                </label>

                <button
                  type="button"
                  onClick={() => removeFile(key)}
                  className="text-red-500 cursor-pointer hover:text-red-700 transition-colors bg-red-50 p-2 rounded-full active:scale-95"
                  aria-label="Remove file"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen p-3 mt-6 sm:mt-0 md:p-6 lg:p-2 max-w-4xl mx-auto">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-5">
        {/* Title & Back Button */}
        <div className="flex items-center gap-3 md:gap-4">
          <button
            onClick={() =>
              isPaid
                ? navigate("/researcher/dashboard/my-proposals")
                : setShowModal(true)
            }
            className="p-2 md:p-2.5 bg-gray-100 hover:bg-gray-200 cursor-pointer rounded-full transition-colors active:scale-95 shrink-0"
            aria-label="Go back"
          >
            <ArrowLeft size={20} className="text-gray-800" />
          </button>

          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
              Edit Draft
            </h1>
            {isPaid && (
              <p className="text-xs md:text-sm text-green-600 font-medium mt-0.5">
                Paid proposal. Cannot be edited.
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button
            onClick={handleSaveDraft}
            disabled={isPaid}
            className={`w-full sm:w-auto px-6 py-3 md:py-2.5 rounded-full font-semibold text-white transition-all active:scale-95 shadow-sm
            ${
              isPaid
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#003B95] hover:bg-blue-900 cursor-pointer"
            }`}
          >
            Save Draft
          </button>

          {!isPaid && (
            <button
              onClick={() =>
                navigate(
                  `/researcher/dashboard/proposals/${proposalId}/payment`,
                )
              }
              className="w-full sm:w-auto px-6 py-3 md:py-2.5 rounded-full cursor-pointer bg-green-600 text-white font-semibold hover:bg-green-700 transition-all active:scale-95 shadow-sm"
            >
              Proceed to Payment
            </button>
          )}
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-white p-5 sm:p-8 md:p-10 rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 space-y-6 md:space-y-8">
        {/* Project Name */}
        <div>
          <label className="font-semibold text-sm text-gray-700 mb-2 block">
            Project Name
          </label>
          <input
            disabled={isPaid}
            value={formData.projectName}
            onChange={(e) => handleChange("projectName", e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-[#003B95]/20 focus:border-[#003B95] transition-all text-sm sm:text-base"
          />
        </div>

        {/* Researchers */}
        <div>
          <label className="font-semibold text-sm text-gray-700 mb-2 block">
            Researcher Name
          </label>

          {formData.researchers.map((name, index) => (
            <div key={index} className="mb-3">
              <div className="flex items-center gap-2 md:gap-3">
                <input
                  disabled={isPaid}
                  value={name}
                  placeholder="Adeyemi John Michael 21/1234"
                  onChange={(e) =>
                    handleResearcherChange(index, e.target.value)
                  }
                  className={`flex-1 w-full rounded-xl px-4 py-3.5 bg-gray-50 border outline-none focus:ring-2 focus:ring-[#003B95]/20 focus:border-[#003B95] transition-all text-sm sm:text-base ${
                    researcherErrors[index]
                      ? "border-red-400 focus:border-red-400 focus:ring-red-400/20"
                      : "border-gray-200"
                  }`}
                />

                {!isPaid && formData.researchers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeResearcher(index)}
                    className="p-3 md:p-3.5 cursor-pointer bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors active:scale-95 shrink-0"
                    aria-label="Remove researcher"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
              {researcherErrors[index] && (
                <p className="text-red-500 text-xs mt-1.5 ml-2 font-medium">
                  {researcherErrors[index]}
                </p>
              )}
            </div>
          ))}

          {!isPaid && (
            <button
              type="button"
              onClick={addResearcher}
              className="cursor-pointer text-sm text-[#003B95] font-bold mt-2 hover:underline active:scale-95"
            >
              + Add Researcher
            </button>
          )}
        </div>

        {/* Grid Inputs (Institution, College, Dept) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-5 md:gap-6">
          <div>
            <label className="font-semibold text-sm text-gray-700 mb-2 block">
              Institution
            </label>
            <input
              disabled={isPaid}
              value={formData.institution}
              onChange={(e) => handleChange("institution", e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-[#003B95]/20 focus:border-[#003B95] transition-all text-sm sm:text-base"
            />
          </div>

          <div>
            <label className="font-semibold text-sm text-gray-700 mb-2 block">
              College/School
            </label>
            <input
              disabled={isPaid}
              value={formData.college}
              onChange={(e) => handleChange("college", e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-[#003B95]/20 focus:border-[#003B95] transition-all text-sm sm:text-base"
            />
          </div>

          <div className="sm:col-span-2 lg:col-span-1">
            <label className="font-semibold text-sm text-gray-700 mb-2 block">
              Department
            </label>
            <input
              disabled={isPaid}
              value={formData.department}
              onChange={(e) => handleChange("department", e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-[#003B95]/20 focus:border-[#003B95] transition-all text-sm sm:text-base"
            />
          </div>
        </div>

        {/* Categories */}
        <div>
          <label className="font-semibold text-sm text-gray-700 mb-3 block">
            Category
          </label>
          <div className="flex gap-3 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                disabled={isPaid}
                onClick={() => handleChange("category", cat)}
                className={`px-5 py-2.5 rounded-full border text-sm font-medium transition-all active:scale-95 shadow-sm ${
                  formData.category === cat
                    ? "bg-[#003B95] border-[#003B95] text-white"
                    : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                } ${
                  isPaid ? "cursor-not-allowed opacity-60" : "cursor-pointer"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Supervisor Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
          <div>
            <label className="font-semibold text-sm text-gray-700 mb-2 block">
              Supervisor Name
            </label>
            <input
              disabled={isPaid}
              value={formData.supervisor}
              onChange={(e) => handleChange("supervisor", e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-[#003B95]/20 focus:border-[#003B95] transition-all text-sm sm:text-base"
            />
          </div>

          <div>
            <label className="font-semibold text-sm text-gray-700 mb-2 block">
              Supervisor Email
            </label>
            <input
              disabled={isPaid}
              type="email"
              value={formData.supervisorEmail}
              onChange={(e) => handleChange("supervisorEmail", e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-[#003B95]/20 focus:border-[#003B95] transition-all text-sm sm:text-base"
            />
          </div>
        </div>

        {/* File Uploads */}
        <div className="space-y-6 md:space-y-8 pt-6 border-t border-gray-100">
          {renderUpload(
            "Application letter for ethical clearance",
            "applicationLetter",
          )}
          {renderUpload("Proposal Document", "proposalDocument")}
          {renderUpload("Turn-It-In Report", "turnItInReport")}
        </div>
      </div>

      {/* Save Draft Warning Modal */}
      {showModal && !isPaid && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 sm:p-8 rounded-3xl w-full max-w-sm text-center relative animate-in zoom-in-95 duration-200 shadow-2xl">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X size={20} className="text-gray-500" />
            </button>

            <h3 className="text-xl font-bold mb-2 text-gray-900 pr-4">
              Unsaved Changes
            </h3>
            <p className="text-gray-500 text-sm mb-8">
              Do you want to save your progress before leaving?
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate("/researcher/dashboard/my-proposals")}
                className="w-full flex-1 cursor-pointer py-3.5 sm:py-3 rounded-full bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-colors active:scale-95"
              >
                Discard
              </button>

              <button
                onClick={handleSaveDraft}
                disabled={saving}
                className="w-full flex-1 cursor-pointer py-3.5 sm:py-3 rounded-full bg-[#003B95] text-white font-bold hover:bg-blue-900 transition-colors active:scale-95 shadow-md shadow-blue-900/20"
              >
                {saving ? "Saving..." : "Save Draft"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProposalSubmission;