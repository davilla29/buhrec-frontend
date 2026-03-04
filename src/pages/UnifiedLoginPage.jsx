import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "../utils/axios";
import toast from "react-hot-toast";
import { loginSuccess, setLoading } from "../redux/auth/authSlice";
import { Loader } from "lucide-react";

const ROLE_SETTINGS = {
  admin: {
    title: "Administrator Login",
    color: "#003B95",
  },
  reviewer: {
    title: "Reviewer Login",
    color: "#003B95",
  },
  researcher: {
    title: "Researcher Login",
    color: "#003B95",
  },
};

const UnifiedLoginPage = () => {
  const { role } = useParams(); // get role from URL
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentRole = ROLE_SETTINGS[role] ? role : "researcher";
  const settings = ROLE_SETTINGS[currentRole];

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoadingLocal] = useState(false); // local loading state
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Email and password are required");
      return;
    }

    try {
      setIsLoadingLocal(true);
      dispatch(setLoading(true));

      // Dynamic login endpoint based on role
      const res = await axios.post(`/auth/login/${currentRole}`, {
        email: formData.email,
        password: formData.password,
      });

      if (res.data.success) {
        const user = res.data.data;

        // Update Redux state
        dispatch(loginSuccess(user));

        // Redirect to role-specific dashboard
        navigate(`/${currentRole}/dashboard`);
      }
    } catch (err) {
      if (err.response) {
        const { message, needVerification } = err.response.data;

        if (needVerification) {
          // navigate("/verify-email");
          toast.error(message);
        } else {
          toast.error(message || "Login failed");
        }
      } else {
        toast.error("Network error. Please try again.");
      }
    } finally {
      setIsLoadingLocal(false);
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-screen bg-[#E5E7EB] flex items-center justify-center p-4">
      <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-sm w-full max-w-md">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
          {settings.title}
        </h1>

        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full bg-[#F3F4F6] rounded-lg p-4 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full bg-[#F3F4F6] rounded-lg p-4 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword((prev) => !prev)}
              className="w-4 h-4"
            />
            <label className="text-sm text-gray-600 cursor-pointer">
              Show Password
            </label>
          </div>

          <div className="flex justify-center pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center text-white cursor-pointer px-12 py-3 rounded-full font-semibold w-full sm:w-1/2 transition-all active:scale-95 disabled:opacity-50"
              style={{ backgroundColor: settings.color }}
            >
              {isLoading ? (
                <Loader className="animate-spin h-5 w-5 text-white" />
              ) : (
                "Log in"
              )}
            </button>
          </div>
          {/* Only show for researcher */}
          {currentRole === "researcher" && (
            <div className="text-center pt-4">
              <p className="text-sm text-gray-600">
                Don’t have an account?{" "}
                <span
                  onClick={() => navigate("/researcher/register")}
                  className="font-semibold text-blue-600 cursor-pointer hover:underline"
                >
                  Create Account
                </span>
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default UnifiedLoginPage;
