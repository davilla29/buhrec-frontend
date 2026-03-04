import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";

const RESEND_INTERVAL = 180; // 3 minutes in seconds

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || localStorage.getItem("verifyEmail");

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Protect page if no email
  useEffect(() => {
    if (!email) {
      navigate("/login/researcher");
    } else {
      localStorage.setItem("verifyEmail", email);
    }
  }, [email, navigate]);

  // Restore countdown from localStorage
  useEffect(() => {
    const storedTime = localStorage.getItem("resendExpiry");

    if (storedTime) {
      const remaining = Math.floor((Number(storedTime) - Date.now()) / 1000);
      if (remaining > 0) {
        setCountdown(remaining);
      }
    }
  }, []);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          localStorage.removeItem("resendExpiry");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!code.trim()) {
      toast.error("Verification code is required");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("/auth/verify-email", {
        email,
        code,
      });

      if (res.data.success) {
        toast.success("Email verified successfully!");
        localStorage.removeItem("verifyEmail");
        navigate("/login/researcher");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;

    try {
      setResendLoading(true);

      const res = await axios.post("/auth/resend-verification-code", {
        email,
      });

      if (res.data.success) {
        toast.success(res.data.message);

        const expiryTime = Date.now() + RESEND_INTERVAL * 1000;
        localStorage.setItem("resendExpiry", expiryTime);

        setCountdown(RESEND_INTERVAL);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend code");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E5E7EB] flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Verify Your Email
        </h1>

        <p className="text-sm text-gray-600 mb-6">
          A verification code has been sent to:
          <span className="block font-semibold text-gray-900 mt-1 break-all">
            {email}
          </span>
        </p>

        <form onSubmit={handleVerify} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Enter Verification Code
            </label>

            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter 6-digit code"
              maxLength={6}
              className="w-full bg-[#F3F4F6] rounded-lg p-4 text-center tracking-widest text-lg font-semibold outline-none focus:ring-2 focus:ring-[#003B95]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer bg-[#003B95] text-white py-3 rounded-full font-semibold transition active:scale-95 disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? (
              <Loader className="animate-spin h-5 w-5" />
            ) : (
              "Verify Email"
            )}
          </button>
        </form>

        {/* ✅ Resend Section */}
        <div className="text-center mt-6">
          <button
            onClick={handleResend}
            disabled={countdown > 0 || resendLoading}
            className={`text-sm font-medium ${
              countdown > 0
                ? "text-gray-400 cursor-not-allowed"
                : "text-[#003B95] hover:underline cursor-pointer"
            }`}
          >
            {resendLoading ? (
              <Loader className="animate-spin h-4 w-4 inline" />
            ) : countdown > 0 ? (
              `Resend code in ${Math.floor(countdown / 60)}:${String(
                countdown % 60,
              ).padStart(2, "0")}`
            ) : (
              "Resend Verification Code"
            )}
          </button>
        </div>

        <div className="text-center mt-4">
          <button
            onClick={() => navigate("/login/researcher")}
            className="text-sm cursor-pointer text-gray-500 hover:underline"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
