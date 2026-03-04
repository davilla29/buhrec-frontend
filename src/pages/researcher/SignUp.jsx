import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import toast from "react-hot-toast";

function SignUp() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    dateOfBirth: "",
    institution: "",
    occupation: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Prevent future dates
  const today = new Date().toISOString().split("T")[0];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    // remove error when typing
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // ✅ Validation
  const validate = () => {
    let newErrors = {};

    if (!form.fullName.trim()) newErrors.fullName = "Full name is required";

    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
      newErrors.email = "Invalid email format";

    if (!form.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";

    if (!form.institution.trim())
      newErrors.institution = "Institution is required";

    if (!form.occupation.trim())
      newErrors.occupation = "Occupation is required";

    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsLoading(true);

      const res = await axios.post("/auth/researcher/register", form);

      if (res.data.success) {
        toast.success("Registration Successful");

        navigate("/verify-email", {
          state: { email: form.email },
        });
      }
    } catch (err) {
      if (err.response?.data?.message) {
        setErrors({ email: err.response.data.message });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E5E7EB] flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">
          Researcher Sign Up
        </h1>
        <p className="text-gray-600 mb-6 text-sm">
          Create a researcher account
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              className={`w-full bg-gray-100 rounded-lg px-4 py-3 outline-none focus:ring-2 ${
                errors.fullName ? "ring-2 ring-red-500" : "focus:ring-blue-500"
              }`}
            />
            {errors.fullName && (
              <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className={`w-full bg-gray-100 rounded-lg px-4 py-3 outline-none focus:ring-2 ${
                errors.email ? "ring-2 ring-red-500" : "focus:ring-blue-500"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={form.dateOfBirth}
              onChange={handleChange}
              max={today} // ✅ disables future date
              className={`w-full bg-gray-100 rounded-lg px-4 py-3 outline-none focus:ring-2 ${
                errors.dateOfBirth
                  ? "ring-2 ring-red-500"
                  : "focus:ring-blue-500"
              }`}
            />
            {errors.dateOfBirth && (
              <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>
            )}
          </div>

          {/* Institution */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Institution
            </label>
            <input
              name="institution"
              value={form.institution}
              onChange={handleChange}
              className={`w-full bg-gray-100 rounded-lg px-4 py-3 outline-none focus:ring-2 ${
                errors.institution
                  ? "ring-2 ring-red-500"
                  : "focus:ring-blue-500"
              }`}
            />
            {errors.institution && (
              <p className="text-red-500 text-xs mt-1">{errors.institution}</p>
            )}
          </div>

          {/* Occupation */}
          <div>
            <label className="block text-sm font-medium mb-1">Occupation</label>
            <input
              name="occupation"
              value={form.occupation}
              onChange={handleChange}
              className={`w-full bg-gray-100 rounded-lg px-4 py-3 outline-none focus:ring-2 ${
                errors.occupation
                  ? "ring-2 ring-red-500"
                  : "focus:ring-blue-500"
              }`}
            />
            {errors.occupation && (
              <p className="text-red-500 text-xs mt-1">{errors.occupation}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              className={`w-full bg-gray-100 rounded-lg px-4 py-3 outline-none focus:ring-2 ${
                errors.password ? "ring-2 ring-red-500" : "focus:ring-blue-500"
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Show Password */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
              className="w-4 h-4"
              style={{ accentColor: "#003B95" }}
            />
            <label className="text-sm text-gray-600 cursor-pointer">
              Show Password
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#003B95] hover:bg-blue-900 text-white py-3 rounded-full font-semibold transition active:scale-95 disabled:opacity-50"
          >
            {isLoading ? "Creating account..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
