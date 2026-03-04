import React from "react";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

function DashboardNotFound() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen  px-4 text-center">
      {/* 404 Text Illustration */}
      <div className="text-9xl font-extrabold text-blue-800 mb-6 ">404</div>

      {/* Message */}
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Oops! Page Not Found
      </h1>
      <p className="text-gray-500 mb-6 max-w-md">
        The page you’re looking for doesn’t exist, or you may have typed the
        wrong URL.
      </p>

      {/* Action Button */}
      <button
        onClick={() => navigate(`/${user.role}/dashboard`)}
        className="inline-flex cursor-pointer items-center gap-2 px-6 py-3 rounded-full bg-blue-800 text-white font-semibold shadow-lg hover:bg-blue-900 transition-all"
      >
        <Home className="w-5 h-5" />
        Go Back to Dashboard
      </button>
    </div>
  );
}

export default DashboardNotFound;
