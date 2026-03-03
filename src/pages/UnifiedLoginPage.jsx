import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "../../utils/axios";
import { login } from "../../redux/auth/authSlice";

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
  const { role } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Validate role from URL
  const currentRole = ROLE_SETTINGS[role] ? role : "researcher";
  const settings = ROLE_SETTINGS[currentRole];

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      return;
    }

    try {
      setIsLoading(true);

      const res = await axios.post("/login", {
        email: formData.email,
        password: formData.password,
      });

      if (res.data.success) {
        const user = res.data.data;

        // Optional: prevent logging into wrong role page
        if (user.role !== currentRole) {
          setError(
            `This account belongs to ${user.role}. Please use the correct login page.`,
          );
          return;
        }

        dispatch(login(user));

        navigate(`/${user.role}/dashboard`);
      }
    } catch (err) {
      if (err.response) {
        const { message, needVerification } = err.response.data;

        if (needVerification) {
          navigate("/verify-email");
        } else {
          setError(message || "Login failed");
        }
      } else {
        setError("Network error. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E5E7EB] flex items-center justify-center p-4">
      <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-sm w-full max-w-md">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
          {settings.title}
        </h1>
        <p className="text-gray-600 mb-8 text-sm">Sign in to your account</p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-600 text-xs rounded-lg border border-red-200">
            {error}
          </div>
        )}

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
              id="show-pass"
              checked={showPassword}
              onChange={() => setShowPassword((prev) => !prev)}
              className="w-4 h-4"
            />
            <label
              htmlFor="show-pass"
              className="text-sm text-gray-600 cursor-pointer"
            >
              Show Password
            </label>
          </div>

          <div className="flex justify-center pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="text-white px-12 py-3 rounded-full font-semibold w-full sm:w-1/2 transition-all active:scale-95 disabled:opacity-50"
              style={{ backgroundColor: settings.color }}
            >
              {isLoading ? "Logging in..." : "Log in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UnifiedLoginPage;
