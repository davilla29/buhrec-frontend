import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Camera, Eye, EyeOff } from "lucide-react";
import axios from "../../utils/axios";
import toast from "react-hot-toast";

const INPUT_CLS =
  "w-full bg-[#F3F4F6] rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-[#003B95] transition-all placeholder:text-gray-400";

const MIN_PASSWORD_LEN = 6;

const ReviewerSettings = () => {
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [reviewerData, setReviewerData] = useState(null);

  const [form, setForm] = useState({
    fullName: "",
    title: "",
    specialization: "",
    institution: "",
    yearsOfExperience: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  // Password change state
  const [pw, setPw] = useState({ current: "", newPw: "", confirm: "" });
  const [pwLoading, setPwLoading] = useState(false);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

  // Fetch initial profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/reviewer/profile");
        if (res.data.success) {
          const r = res.data.data;
          setReviewerData(r);
          setForm({
            fullName: r.fullName || "",
            title: r.title || "",
            specialization: r.specialization || "",
            institution: r.institution || "",
            yearsOfExperience: r.yearsOfExperience ?? "",
          });
          setAvatarPreview(r.photoUrl || null);
        }
      } catch (err) {
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ── Profile picture handler ─────────────────────────────────────────────
  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2 MB");
      return;
    }

    setSelectedFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  // ── Save profile handler ────────────────────────────────────────────────
  const handleSave = async () => {
    try {
      setSaving(true);

      // Use FormData to handle both text and file upload
      const formData = new FormData();
      formData.append("fullName", form.fullName);
      formData.append("title", form.title);
      formData.append("specialization", form.specialization);
      formData.append("institution", form.institution);
      formData.append("yearsOfExperience", form.yearsOfExperience);

      if (selectedFile) {
        formData.append("photo", selectedFile); // Ensure your multer expects 'photo'
      }

      const res = await axios.put("/reviewer/profile", formData);

      if (res.data.success) {
        toast.success("Profile updated successfully!");

        // Clear file selection after successful upload
        setSelectedFile(null);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  // ── Change password handler ─────────────────────────────────────────────
  const handlePasswordChange = async () => {
    if (!pw.current || !pw.newPw || !pw.confirm) {
      toast.error("Please fill in all password fields");
      return;
    }
    if (pw.newPw.length < MIN_PASSWORD_LEN) {
      toast.error(
        `New password must be at least ${MIN_PASSWORD_LEN} characters`,
      );
      return;
    }
    if (pw.newPw !== pw.confirm) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      setPwLoading(true);
      const res = await axios.put("/reviewer/password", {
        currentPassword: pw.current,
        newPassword: pw.newPw,
      });

      if (res.data.success) {
        toast.success("Password changed successfully!");
        setPw({ current: "", newPw: "", confirm: "" });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Password change failed");
    } finally {
      setPwLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#003B95]"></div>
      </div>
    );
  }

  if (!reviewerData) {
    return (
      <div className="p-8 bg-white min-h-screen text-center pt-20">
        <p className="text-gray-500 text-lg font-bold mb-4">
          Reviewer profile not found
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 bg-blue-100 text-blue-800 rounded-full font-bold"
        >
          Go Back
        </button>
      </div>
    );
  }

  const initials =
    form.fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "RV";

  return (
    <div className="min-h-screen p-2 sm:p-1">
      <div className="max-w-4xl mx-auto  p-4 sm:p-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors shrink-0"
            >
              <ArrowLeft size={22} className="text-gray-900" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full sm:w-auto flex cursor-pointer  items-center justify-center gap-2 bg-[#003B95] hover:bg-blue-900 disabled:bg-blue-300 text-white px-8 py-2.5 rounded-full font-bold text-sm transition-all active:scale-95 shadow-md"
          >
            {saving ? (
              <div className="animate-spin h-4 w-4 border-b-2 border-white rounded-full"></div>
            ) : (
              <Save size={16} />
            )}
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </div>

        {/* ── Avatar with camera overlay ────────────────────────────────────── */}
        <div className="flex justify-center mb-10">
          <div
            className="relative group cursor-pointer"
            onClick={() => fileRef.current?.click()}
          >
            <div className="w-28 h-28 rounded-full bg-[#003B95]/10 flex items-center justify-center text-[#003B95] font-bold text-4xl border-4 border-white shadow-lg overflow-hidden transition-transform group-hover:scale-105">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                initials
              )}
            </div>
            <button
              type="button"
              className="absolute bottom-0 right-0 w-9 h-9 bg-[#003B95] rounded-full flex items-center justify-center border-2 border-white shadow-md hover:bg-blue-900 transition-colors"
            >
              <Camera size={16} className="text-white" />
            </button>
            <input
              ref={fileRef}
              name="photo"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />
          </div>
        </div>

        {/* ── Form Fields ─────────────────────────────────────────────────── */}
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
              Email (Unchangeable)
            </label>
            <input
              className={`${INPUT_CLS} opacity-60 cursor-not-allowed`}
              value={reviewerData.email}
              disabled
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
              Full Name
            </label>
            <input
              name="fullName"
              className={INPUT_CLS}
              value={form.fullName}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-5">
            <div className="flex-1">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                Title / Prefix
              </label>
              <input
                name="title"
                className={INPUT_CLS}
                value={form.title}
                onChange={handleInputChange}
                placeholder="e.g. Prof, Dr, Mr"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                Years of Experience
              </label>
              <input
                name="yearsOfExperience"
                type="number"
                min="0"
                className={INPUT_CLS}
                value={form.yearsOfExperience}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
              Specialization
            </label>
            <select
              name="specialization"
              className={INPUT_CLS}
              value={form.specialization}
              onChange={handleInputChange}
            >
              <option value="" disabled>
                Select Specialization
              </option>
              <option value="Public Health & Epidemiology">
                Public Health & Epidemiology
              </option>
              <option value="Clinical Research">Clinical Research</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
              Institution
            </label>
            <input
              name="institution"
              className={INPUT_CLS}
              value={form.institution}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* ── Change Password Section ───────────────────────────────────────── */}
        <div className="mt-12 pt-10 border-t border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Security Settings
          </h2>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPw ? "text" : "password"}
                  className={INPUT_CLS}
                  value={pw.current}
                  onChange={(e) => setPw({ ...pw, current: e.target.value })}
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPw(!showCurrentPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#003B95] transition-colors"
                >
                  {showCurrentPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-5">
              <div className="flex-1">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPw ? "text" : "password"}
                    className={INPUT_CLS}
                    value={pw.newPw}
                    onChange={(e) => setPw({ ...pw, newPw: e.target.value })}
                    placeholder="Min 6 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPw(!showNewPw)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#003B95] transition-colors"
                  >
                    {showNewPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  className={INPUT_CLS}
                  value={pw.confirm}
                  onChange={(e) => setPw({ ...pw, confirm: e.target.value })}
                  placeholder="Re-enter new password"
                />
              </div>
            </div>

            <button
              onClick={handlePasswordChange}
              disabled={pwLoading}
              className="mt-2 w-full cursor-pointer sm:w-auto bg-gray-900 hover:bg-black text-white px-8 py-3 rounded-full font-bold text-sm transition-all active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {pwLoading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewerSettings;
