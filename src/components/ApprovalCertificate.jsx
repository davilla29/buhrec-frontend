import React from "react";

const ApprovalCertificate = ({ proposal, dateStr }) => {
  // Fallbacks in case some data isn't populated
  const researcherName = proposal?.researcher?.fullName || "Researcher Name";
  const department = proposal?.department || "Software Engineering";
  const college = proposal?.college || "School of Computing";
  const appId = proposal?.applicationId || "BUH-XXXXXX";

  // Expiration date (usually 1 year from approval)
  const approvalDate = new Date(proposal.assignedAt || proposal.createdAt);
  const expirationDate = new Date(approvalDate);
  expirationDate.setFullYear(expirationDate.getFullYear() + 1);

  const formatDate = (d) =>
    `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;

  return (
    // We wrap this in a container with a fixed aspect ratio for a clean PDF render
    <div className="flex justify-center w-full overflow-x-auto py-4 hide-scrollbar">
      <div
        id="certificate-content"
        className="bg-[#FFFAF0] w-200 h-262.5 p-12 shrink-0 flex flex-col items-center text-center relative border-12 border-white shadow-[0_0_15px_rgba(0,0,0,0.1)]"
        style={{
          // Subtle paper texture background color
          backgroundColor: "#FCFBF9",
        }}
      >
        {/* LOGO */}
        <div className="mb-8 mt-10">
          {/* REPLACE THIS SRC WITH YOUR ACTUAL BABCOCK LOGO URL */}
          <img
            src="/babcock-logo.png"
            alt="Babcock University"
            className="h-24 object-contain"
          />
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Ethical Approval Certificate
        </h1>
        <p className="text-sm text-gray-500 italic mb-8">for</p>

        <h2 className="text-xl font-black text-gray-900 uppercase tracking-wide leading-relaxed max-w-2xl mb-8">
          {proposal.title}
        </h2>

        <div className="space-y-2 mb-16">
          <p className="text-sm text-gray-600 font-semibold">
            ID: <span className="font-bold text-gray-900">{appId}</span>
          </p>
          <p className="text-sm text-gray-600 font-semibold">Researcher(s):</p>
          <p className="text-lg font-bold text-gray-900">{researcherName}</p>
        </div>

        <p className="text-sm text-gray-700 max-w-xl mx-auto leading-relaxed mb-20 font-medium">
          The study has been reviewed and approved by the BUHREC, and we
          guarantee that it complies with relevant ethical guidelines.
        </p>

        {/* Footer / Signatures Area */}
        <div className="absolute bottom-20 left-0 w-full px-16 flex justify-between items-end">
          <div className="text-left">
            <p className="text-xs font-bold text-gray-800">
              Department: <span className="font-normal">{department}</span>
            </p>
            <p className="text-xs font-bold text-gray-800">
              School: <span className="font-normal">{college}</span>
            </p>
          </div>

          <div className="flex flex-col items-center">
            <p className="text-xs font-bold text-gray-800 mb-2">
              Chairman Of BUHREC
            </p>
            {/* Signature Placeholder */}
            <div className="font-['Brush_Script_MT',cursive] text-4xl text-gray-800 -rotate-3 mb-1 border-b border-gray-400 px-4">
              Adebayo
            </div>
          </div>

          <div className="text-right">
            <p className="text-[10px] text-gray-600">
              Approved on:{" "}
              <span className="font-bold text-gray-800">
                {formatDate(approvalDate)}
              </span>
            </p>
            <p className="text-[10px] text-gray-600">
              Expires on:{" "}
              <span className="font-bold text-gray-800">
                {formatDate(expirationDate)}
              </span>
            </p>
            <p className="text-[10px] text-gray-600">Version approved: 1.0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovalCertificate;
