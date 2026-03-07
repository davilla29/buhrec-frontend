import React from "react";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full text-center">
        {/* Animated Icon Container */}
        <div className="relative inline-block mb-8">
          <div className="absolute inset-0 bg-red-100 rounded-full scale-150 opacity-20 animate-pulse"></div>
          <div className="relative bg-white p-6 rounded-full shadow-sm border border-gray-100">
            <ShieldAlert
              size={64}
              className="text-[#8b0000]"
              strokeWidth={1.5}
            />
          </div>
        </div>

        {/* Error Code & Message */}
        <h1 className="text-6xl font-black text-gray-200 mb-2">403</h1>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
        <p className="text-gray-600 mb-10 leading-relaxed">
          It looks like you don't have the necessary permissions to view this
          page. Please contact your administrator if you believe this is an
          error.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center justify-center gap-2 px-8 py-3 bg-[#003399] rounded-full text-sm font-semibold text-white hover:bg-[#002b85] transition-all shadow-md"
          >
            <Home size={18} />
            Return Home
          </button>
        </div>

        {/* Footer Note */}
        <p className="mt-12 text-xs text-gray-400 uppercase tracking-widest">
          Buhrec Security Protocol
        </p>
      </div>
    </div>
  );
}

export default Unauthorized;
