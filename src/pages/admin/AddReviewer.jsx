// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "../../utils/axios";
// import toast from "react-hot-toast";
// import { ChevronLeft } from "lucide-react";

// function AddReviewer() {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//     institution: "",
//     title: "",
//     specialization: "",
//     yearsOfExperience: "",
//   });
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     const data = new FormData();
//     Object.keys(formData).forEach((key) => data.append(key, formData[key]));
//     if (file) data.append("photo", file);

//     try {
//       const res = await axios.post("/admin/reviewers/add", data);
//       if (res.data.success) {
//         toast.success("Reviewer created successfully!");
//         navigate("/admin/dashboard/reviewers/add/success");
//       }
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen  p-1">
//       <button
//         onClick={() => navigate(-1)}
//         className="mt-1 p-1 cursor-pointer hover:bg-gray-200 rounded-full transition-colors"
//       >
//         <ChevronLeft size={28} className="text-gray-800" />
//       </button>

//       <form onSubmit={handleSubmit} className="max-w-3xl mx-auto w-full">
//         <div className="flex justify-between items-center mb-2">
//           <h1 className="text-2xl font-bold">Add Reviewer</h1>
//           <button
//             type="submit"
//             disabled={loading}
//             className="bg-[#002B7F] text-white px-8 py-2 rounded-full text-sm font-medium disabled:opacity-50"
//           >
//             {loading ? "Processing..." : "Create Reviewer"}
//           </button>
//         </div>

//         <div className="flex flex-col items-center mb-8">
//           <label className="cursor-pointer group relative">
//             <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden border-2 border-transparent group-hover:border-blue-500">
//               {file ? (
//                 <img
//                   src={URL.createObjectURL(file)}
//                   className="w-full h-full object-cover"
//                 />
//               ) : (
//                 <span className="text-2xl">📷</span>
//               )}
//             </div>
//             <input
//               type="file"
//               className="hidden"
//               onChange={(e) => setFile(e.target.files[0])}
//               accept="image/*"
//             />
//           </label>
//         </div>

//         <div className="space-y-6">
//           <div>
//             <label className="text-xs font-semibold text-gray-600 block mb-1">
//               Reviewer Name
//             </label>
//             <input
//               name="fullName"
//               value={formData.fullName}
//               onChange={handleChange}
//               required
//               className="w-full bg-gray-100 p-3 rounded-md outline-none focus:ring-1 ring-blue-500"
//             />
//           </div>

//           <div>
//             <label className="text-xs font-semibold text-gray-600 block mb-1">
//               Institution
//             </label>
//             <input
//               name="institution"
//               value={formData.institution}
//               onChange={handleChange}
//               required
//               className="w-full bg-gray-100 p-3 rounded-md outline-none"
//             />
//           </div>

//           <div>
//             <label className="text-xs font-semibold text-gray-600 block mb-1">
//               Email
//             </label>
//             <input
//               name="email"
//               type="email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//               className="w-full bg-gray-100 p-3 rounded-md outline-none"
//             />
//           </div>

//           <div className="grid grid-cols-2 gap-6">
//             <div>
//               <label className="text-xs font-semibold text-gray-600 block mb-1">
//                 Reviewer Title
//               </label>
//               <input
//                 name="title"
//                 value={formData.title}
//                 onChange={handleChange}
//                 placeholder="e.g. Prof."
//                 className="w-full bg-gray-100 p-3 rounded-md outline-none"
//               />
//             </div>
//             <div>
//               <label className="text-xs font-semibold text-gray-600 block mb-1">
//                 Specialization
//               </label>
//               <select
//                 name="specialization"
//                 value={formData.specialization}
//                 onChange={handleChange}
//                 required
//                 className="w-full bg-gray-100 p-3 rounded-md outline-none appearance-none"
//               >
//                 <option value="">Select Specialization</option>
//                 <option value="Public Health & Epidemiology">
//                   Public Health & Epidemiology
//                 </option>
//                 <option value="Clinical Research">Clinical Research</option>
//               </select>
//             </div>
//           </div>

//           <div className="w-1/2">
//             <label className="text-xs font-semibold text-gray-600 block mb-1">
//               Years of Experience
//             </label>
//             <input
//               name="yearsOfExperience"
//               type="number"
//               value={formData.yearsOfExperience}
//               onChange={handleChange}
//               required
//               className="w-full bg-gray-100 p-3 rounded-md outline-none"
//             />
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// }

// export default AddReviewer;

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
    <div className="min-h-screen p-4">
      <button
        onClick={() => navigate(-1)}
        className="mt-1 p-1 cursor-pointer hover:bg-gray-200 rounded-full transition-colors"
      >
        <ChevronLeft size={28} className="text-gray-800" />
      </button>

      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto w-full mt-4 space-y-6"
      >
        {/* Header + Submit */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Add Reviewer</h1>
          <button
            type="submit"
            disabled={loading}
            className="bg-[#002B7F] cursor-pointer text-white px-8 py-2 rounded-full text-sm font-medium disabled:opacity-50"
          >
            {loading ? "Processing..." : "Create Reviewer"}
          </button>
        </div>

        {/* Photo Upload */}
        <div className="flex flex-col items-center mb-6">
          <label className="cursor-pointer group relative">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden border-2 border-transparent group-hover:border-blue-500">
              {file ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl">📷</span>
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
        <div className="space-y-6">
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">
              Reviewer Name
            </label>
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full bg-gray-100 p-3 rounded-md outline-none focus:ring-1 ring-blue-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">
              Institution
            </label>
            <input
              name="institution"
              value={formData.institution}
              onChange={handleChange}
              required
              className="w-full bg-gray-100 p-3 rounded-md outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full bg-gray-100 p-3 rounded-md outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">
                Reviewer Title
              </label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Prof."
                className="w-full bg-gray-100 p-3 rounded-md outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">
                Specialization
              </label>
              <select
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                required
                className="w-full bg-gray-100 cursor-pointer p-3 rounded-md outline-none appearance-none"
              >
                <option value="">Select Specialization</option>
                <option value="Public Health & Epidemiology">
                  Public Health & Epidemiology
                </option>
                <option value="Clinical Research">Clinical Research</option>
              </select>
            </div>
          </div>

          <div className="w-1/2">
            <label className="text-xs font-semibold text-gray-600 block mb-1">
              Years of Experience
            </label>
            <input
              name="yearsOfExperience"
              type="number"
              value={formData.yearsOfExperience}
              onChange={handleChange}
              required
              className="w-full bg-gray-100 p-3 rounded-md outline-none"
            />
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddReviewer;