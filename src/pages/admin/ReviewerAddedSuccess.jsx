import { useNavigate } from "react-router-dom";

function ReviewerAddedSuccess() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen font-sans">
      <div className="flex flex-col items-center max-w-md px-6 text-center">
        {/* Success Icon */}
        <div className="mb-8">
          <svg
            width="140"
            height="140"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer Circle */}
            <circle cx="50" cy="50" r="48" stroke="#003399" strokeWidth="3" />
            {/* Checkmark */}
            <path
              d="M30 52L43 65L70 38"
              stroke="#003399"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Heading */}
        <h1 className="text-[32px] font-bold text-black mb-6 tracking-tight">
          Reviewer successfully added
        </h1>

        {/* Action Button */}
        <button
          className="bg-[#003399] cursor-pointer hover:bg-[#002b85] text-white px-8 py-2.5 rounded-full text-sm font-medium transition-colors"
          onClick={() => navigate("/admin/dashboard/reviewers")}
        >
          Back to Reviewers
        </button>
      </div>
    </div>
  );
}

export default ReviewerAddedSuccess;
