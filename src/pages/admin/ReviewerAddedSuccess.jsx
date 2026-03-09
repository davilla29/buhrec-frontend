import { useNavigate } from "react-router-dom";

function ReviewerAddedSuccess() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen font-sans p-4 bg-gray-50/30">
      <div className="flex flex-col items-center max-w-md px-4 sm:px-6 text-center animate-in zoom-in-95 fade-in duration-300 ease-out">
        {/* Success Icon */}
        <div className="mb-6 md:mb-8 text-[#003399]">
          <svg
            className="w-24 h-24 md:w-32 md:h-32 lg:w-35 lg:h-35"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer Circle */}
            <circle
              cx="50"
              cy="50"
              r="48"
              stroke="currentColor"
              strokeWidth="3"
            />
            {/* Checkmark */}
            <path
              d="M30 52L43 65L70 38"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Heading */}
        <h1 className="text-2xl md:text-3xl lg:text-[32px] font-bold text-gray-900 mb-6 md:mb-8 tracking-tight leading-snug">
          Reviewer successfully added
        </h1>

        {/* Action Button */}
        <button
          className="w-full sm:w-auto bg-[#003399] cursor-pointer hover:bg-[#002b85] text-white px-10 py-3.5 sm:py-3 rounded-full text-sm font-semibold transition-all active:scale-95 shadow-md shadow-blue-900/20"
          onClick={() => navigate("/admin/dashboard/reviewers")}
        >
          Back to Reviewers
        </button>
      </div>
    </div>
  );
}

export default ReviewerAddedSuccess;
