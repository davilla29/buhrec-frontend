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

  const validateResearcher = (index, value) => {
    const errors = [...researcherErrors];

    if (!RESEARCHER_REGEX.test(value.trim())) {
      errors[index] = "Format must be: Surname Firstname Middlename 21/1234";
    } else {
      errors[index] = "";
    }

    setResearcherErrors(errors);
  };

  const [files, setFiles] = useState({
    applicationLetter: null,
    proposalDocument: null,
    turnItInReport: null,
  });

  // Fetch draft
  // useEffect(() => {
  //   const fetchDraft = async () => {
  //     try {
  //       const res = await axios.get(
  //         `/researcher/proposals/${proposalId}/draft`,
  //       );
  //       if (res.data.success) {
  //         setFormData({
  //           ...formData,
  //           ...res.data.draft.formData,
  //         });
  //       }
  //     } catch (err) {
  //       toast.error("Failed to load draft");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchDraft();
  // }, [proposalId]);

  useEffect(() => {
    const fetchDraft = async () => {
      try {
        const res = await axios.get(
          `/researcher/proposals/${proposalId}/draft`,
        );

        if (res.data.success) {
          const draft = res.data.draft;

          // Set form data
          setFormData((prev) => ({
            ...prev,
            ...draft.formData,
          }));

          // Convert documents array → files object
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
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleResearcherChange = (index, value) => {
    const updated = [...formData.researchers];
    updated[index] = value;

    handleChange("researchers", updated);

    validateResearcher(index, value);
  };

  const addResearcher = () => {
    handleChange("researchers", [...formData.researchers, ""]);
  };

  const removeResearcher = (index) => {
    const updated = formData.researchers.filter((_, i) => i !== index);
    handleChange("researchers", updated);
  };

  const handleFileChange = (key, file) => {
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
    setFiles((prev) => ({
      ...prev,
      [key]: null,
    }));
  };

  const handleSaveDraft = async () => {
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

      toast.success("Draft saved successfully", {
        id: loadingToast,
      });
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
        <Loader className="animate-spin" />
      </div>
    );
  }

  const renderUpload = (label, key) => {
    const file = files[key];

    return (
      <div className="flex flex-col gap-2">
        <label className="font-semibold text-sm text-gray-700">{label}</label>

        {!file ? (
          <label className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-700 hover:bg-blue-50 transition">
            <Upload className="w-6 h-6 text-gray-400 mb-2" />

            <span className="text-sm text-gray-500">
              Click to upload document
            </span>

            <input
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={(e) => handleFileChange(key, e.target.files[0])}
            />
          </label>
        ) : (
          <div className="flex items-center justify-between bg-gray-100 p-4 rounded-xl border">
            <div className="flex items-center gap-3">
              <FileText className="text-blue-700" size={20} />

              <span className="text-sm font-medium text-gray-700">
                {file.name}
              </span>
            </div>

            <div className="flex items-center justify-between bg-gray-100 p-4 rounded-xl border">
              <div className="flex items-center gap-3">
                <FileText className="text-blue-700" size={20} />

                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-gray-700 hover:underline"
                >
                  {file.name}
                </a>
              </div>

              <div className="flex items-center gap-4">
                <label className="text-blue-700 text-sm ml-3 cursor-pointer hover:underline">
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
                  className="text-red-500 cursor-pointer hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen ">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowModal(true)}
            className="p-2 hover:bg-gray-200 cursor-pointer rounded-full"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-xl font-bold">Edit Draft</h1>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSaveDraft}
            className="px-6 py-2 cursor-pointer rounded-full bg-[#003B95] text-white font-semibold hover:bg-blue-900"
          >
            Save Draft
          </button>

          <button
            onClick={() =>
              navigate(`/researcher/dashboard/proposals/${proposalId}/payment`)
            }
            className="px-6 py-2 rounded-full cursor-pointer bg-green-600 text-white font-semibold hover:bg-green-700"
          >
            Proceed to Payment
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white p-8 rounded-2xl shadow-sm max-w-3xl space-y-6">
        {/* Project Name */}
        <div>
          <label className="font-semibold text-sm">Project Name</label>
          <input
            value={formData.projectName}
            onChange={(e) => handleChange("projectName", e.target.value)}
            className="w-full mt-2 bg-[#E5E7EB] rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#003B95]"
          />
        </div>

        {/* Researchers */}
        <div>
          <label className="font-semibold text-sm">Researcher Name</label>{" "}
          (Surname first, first name, middle name, matric number)
          {formData.researchers.map((name, index) => (
            <div key={index} className="mt-2">
              <div className="flex gap-2">
                <input
                  value={name}
                  placeholder="Adeyemi John Michael 21/1234"
                  onChange={(e) =>
                    handleResearcherChange(index, e.target.value)
                  }
                  className={`flex-1 rounded-xl px-4 py-3 bg-[#E5E7EB] border 
          ${researcherErrors[index] ? "border-red-500" : "border-transparent"}`}
                />

                {formData.researchers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeResearcher(index)}
                    className="p-2 cursor-pointer bg-red-500 text-white rounded-full"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {researcherErrors[index] && (
                <p className="text-xs text-red-500 mt-1">
                  {researcherErrors[index]}
                </p>
              )}
            </div>
          ))}
          <br />
          <button
            type="button"
            onClick={addResearcher}
            className="cursor-pointer text-sm text-[#003B95] font-semibold"
          >
            + Add Researcher
          </button>
        </div>

        {/* Institution */}
        <div>
          <label className="font-semibold text-sm">Institution</label>
          <input
            placeholder="Institution"
            value={formData.institution}
            onChange={(e) => handleChange("institution", e.target.value)}
            className="w-full bg-[#E5E7EB] rounded-xl px-4 py-3"
          />
        </div>

        {/* College */}
        <div>
          <label className="font-semibold text-sm">College/School</label>
          <input
            placeholder="College"
            value={formData.college}
            onChange={(e) => handleChange("college", e.target.value)}
            className="w-full bg-[#E5E7EB] rounded-xl px-4 py-3"
          />
        </div>

        {/* Department */}
        <div>
          <label className="font-semibold text-sm">Department</label>
          <input
            placeholder="Department"
            value={formData.department}
            onChange={(e) => handleChange("department", e.target.value)}
            className="w-full bg-[#E5E7EB] rounded-xl px-4 py-3"
          />
        </div>
        {/* Category */}
        <div>
          <label className="font-semibold text-sm">Category</label>
          <div className="flex gap-4 mt-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => handleChange("category", cat)}
                className={`px-4 py-2 cursor-pointer rounded-full border ${
                  formData.category === cat
                    ? "bg-[#003B95] text-white"
                    : "bg-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Supervisor */}
        <div>
          <label className="font-semibold text-sm">Supervisor Name</label>
          <input
            placeholder="Supervisor Name"
            value={formData.supervisor}
            onChange={(e) => handleChange("supervisor", e.target.value)}
            className="w-full bg-[#E5E7EB] rounded-xl px-4 py-3"
          />
        </div>

        {/* Supervisor Email */}
        <div>
          <label className="font-semibold text-sm">Supervisor Email</label>
          <input
            type="email"
            placeholder="Supervisor Email"
            value={formData.supervisorEmail}
            onChange={(e) => handleChange("supervisorEmail", e.target.value)}
            className="w-full bg-[#E5E7EB] rounded-xl px-4 py-3"
          />
        </div>

        {/* File Uploads */}
        <div className="space-y-6 pt-4">
          {renderUpload(
            "Application letter for ethical clearance",
            "applicationLetter",
          )}
          {renderUpload("Proposal Document", "proposalDocument")}
          {renderUpload("Turn-It-In Report", "turnItInReport")}
        </div>
      </div>

      {/* Leave Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
          <div className="bg-white p-8 rounded-2xl w-96 text-center relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4"
            >
              <X size={16} />
            </button>

            <h3 className="font-bold mb-6">
              Save your progress before leaving?
            </h3>

            <div className="flex gap-4">
              <button
                onClick={() => navigate("/researcher/dashboard/my-proposals")}
                className="flex-1 cursor-pointer py-3 rounded-full bg-red-600 text-white"
              >
                Discard
              </button>

              <button
                onClick={handleSaveDraft}
                disabled={saving}
                className="flex-1 cursor-pointer py-3 rounded-full bg-[#003B95] text-white"
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
