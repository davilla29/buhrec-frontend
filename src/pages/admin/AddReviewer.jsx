import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import toast from "react-hot-toast";
import { ChevronLeft } from "lucide-react";

function AddReviewer() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    institution: "",
    title: "",
    specialization: "",
    yearsOfExperience: "",
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      if (file) data.append("photo", file); // matches multer field name

      const res = await axios.post("/admin/add-reviewer", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        toast.success(res.data.message || "Reviewer created successfully!");
        navigate("/admin/dashboard/reviewers/add/success");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="p-2 -ml-2 mb-2 cursor-pointer hover:bg-gray-200 rounded-full transition-colors inline-flex"
        aria-label="Go back"
      >
        <ChevronLeft size={24} className="text-gray-800 md:w-7 md:h-7" />
      </button>

      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto w-full mt-2 space-y-6 md:space-y-8"
      >
        {/* Header + Submit */}
        <div className="flex flex-row justify-between items-center gap-4">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
            Add Reviewer
          </h1>
          <button
            type="submit"
            disabled={loading}
            className="bg-[#002B7F] cursor-pointer text-white px-6 py-2.5 md:px-8 md:py-3 rounded-full text-xs md:text-sm font-medium disabled:opacity-50 transition-all active:scale-95 hover:bg-blue-900 whitespace-nowrap"
          >
            {loading ? "Processing..." : "Create Reviewer"}
          </button>
        </div>

        {/* Photo Upload */}
        <div className="flex flex-col items-center mb-6">
          <label className="cursor-pointer group relative">
            <div className="w-24 h-24 md:w-28 md:h-28 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300 group-hover:border-blue-500 transition-colors shadow-sm">
              {file ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center">
                  <span className="text-2xl md:text-3xl mb-1">📷</span>
                  <span className="text-[10px] text-gray-400 font-medium">
                    Upload
                  </span>
                </div>
              )}
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </label>
        </div>

        {/* Form Fields */}
        <div className="space-y-5 md:space-y-6 bg-white p-5 md:p-8 rounded-2xl shadow-sm border border-gray-50">
          <div>
            <label className="text-xs md:text-sm font-semibold text-gray-700 block mb-1.5">
              Reviewer Name
            </label>
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full bg-gray-50 border border-gray-200 p-3 md:p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-[#002B7F]/20 focus:border-[#002B7F] transition-all"
            />
          </div>

          <div>
            <label className="text-xs md:text-sm font-semibold text-gray-700 block mb-1.5">
              Institution
            </label>
            <input
              name="institution"
              value={formData.institution}
              onChange={handleChange}
              required
              className="w-full bg-gray-50 border border-gray-200 p-3 md:p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-[#002B7F]/20 focus:border-[#002B7F] transition-all"
            />
          </div>

          <div>
            <label className="text-xs md:text-sm font-semibold text-gray-700 block mb-1.5">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full bg-gray-50 border border-gray-200 p-3 md:p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-[#002B7F]/20 focus:border-[#002B7F] transition-all"
            />
          </div>

          {/* Grid changes from 1 column on mobile to 2 on tablet/desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
            <div>
              <label className="text-xs md:text-sm font-semibold text-gray-700 block mb-1.5">
                Reviewer Title
              </label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Prof."
                className="w-full bg-gray-50 border border-gray-200 p-3 md:p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-[#002B7F]/20 focus:border-[#002B7F] transition-all"
              />
            </div>
            <div>
              <label className="text-xs md:text-sm font-semibold text-gray-700 block mb-1.5">
                Specialization
              </label>

              <select
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                required
                className="w-full bg-gray-50 border border-gray-200 cursor-pointer p-3 md:p-3.5 rounded-xl outline-none appearance-none focus:ring-2 focus:ring-[#002B7F]/20 focus:border-[#002B7F] transition-all"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundPosition: "right 1rem center",
                  backgroundSize: "1.2em 1.2em",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <option value="">Select Specialization</option>
                <option value="Public Health & Epidemiology">
                  Public Health & Epidemiology
                </option>
                <option value="Clinical Research">Clinical Research</option>
              </select>
            </div>
          </div>

          {/* Changed w-1/2 to w-full sm:w-1/2 */}
          <div className="w-full sm:w-1/2">
            <label className="text-xs md:text-sm font-semibold text-gray-700 block mb-1.5">
              Years of Experience
            </label>
            <input
              name="yearsOfExperience"
              type="number"
              value={formData.yearsOfExperience}
              onChange={handleChange}
              required
              min="0"
              className="w-full bg-gray-50 border border-gray-200 p-3 md:p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-[#002B7F]/20 focus:border-[#002B7F] transition-all"
            />
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddReviewer;
