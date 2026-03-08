import React from "react";
import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft, SearchX } from "lucide-react";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 py-24">
      <div className="text-center max-w-lg mx-auto">
        {/* Icon/Illustration Area */}
        <div className="flex justify-center mb-8">
          <div className="p-6 bg-blue-50 rounded-full inline-flex items-center justify-center">
            <SearchX className="w-20 h-20 text-[#003B95]" strokeWidth={1.5} />
          </div>
        </div>

        {/* Text Content */}
        <h1 className="text-9xl font-extrabold text-gray-900 tracking-tighter">
          404
        </h1>
        <h2 className="text-3xl font-bold text-gray-800 mt-6 tracking-tight">
          Page not found
        </h2>
        <p className="text-gray-600 mt-4 mb-10 text-lg leading-relaxed">
          Sorry, we couldn't find the page you're looking for. It might have
          been moved, deleted, or perhaps the URL is incorrect.
        </p>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-full sm:w-auto gap-2 px-8 py-3.5 border-2 border-gray-200 rounded-full font-semibold text-gray-700 hover:bg-gray-100 hover:border-gray-300 transition-all cursor-pointer"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>

          <button
            onClick={() => navigate("/")}
            className="flex items-center justify-center w-full sm:w-auto gap-2 px-8 py-3.5 bg-[#003B95] text-white rounded-full font-semibold hover:bg-blue-900 transition-all shadow-sm hover:shadow-md cursor-pointer"
          >
            <Home size={18} />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
