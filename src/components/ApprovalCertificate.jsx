// import React from "react";
import BabcockLogo from "../assets/images/babcock_logo.png";
import ChairmanSignature from "../assets/images/chairman_signature.png";

const ApprovalCertificate = ({ proposal, dateStr }) => {
  // 1. Extract and filter valid researchers
  const researchersArray =
    proposal?.currentVersion?.formData?.researchers || [];
  const validResearchers = researchersArray.filter(
    (name) => name.trim() !== "",
  );

  const department =
    proposal?.department ||
    proposal?.currentVersion?.formData?.department ||
    "Software Engineering";
  const college =
    proposal?.college ||
    proposal?.currentVersion?.formData?.college ||
    "School of Computing";
  const appId = proposal?.applicationId || "BUH-XXXXXX";

  // Dynamically get the version number, defaulting to 1 if not found, and formatting to 1.0 style
  const rawVersion =
    proposal?.currentVersion?.versionNumber || proposal?.versionCount || 1;
  const versionDisplay = Number.isInteger(rawVersion)
    ? `${rawVersion}.0`
    : rawVersion;

  // Expiration date (usually 1 year from approval)
  const approvalDate = new Date(
    proposal?.assignedAt || proposal?.createdAt || new Date(),
  );
  const expirationDate = new Date(approvalDate);
  expirationDate.setFullYear(expirationDate.getFullYear() + 1);

  const formatDate = (d) => {
    if (!d || isNaN(d.getTime())) return "N/A";
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  return (
    // We wrap this in a container with a fixed aspect ratio for a clean PDF render
    <div className="flex justify-center w-full overflow-x-auto py-4 hide-scrollbar">
      <div
        id="certificate-content"
        className="bg-[#FFFAF0] w-200 h-262.5 p-12 shrink-0 flex flex-col items-center text-center relative border-12 border-white shadow-[0_0_15px_rgba(0,0,0,0.1)]"
        style={{
          backgroundColor: "#FCFBF9",
          fontFamily: "Arial, Helvetica, sans-serif",
          textRendering: "geometricPrecision",
        }}
      >
        {/* LOGO */}
        <div className="mb-8 mt-10">
          <img
            src={BabcockLogo}
            alt="Babcock University"
            className="h-24 object-contain"
          />
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Ethical Approval Certificate
        </h1>
        <p className="text-sm text-gray-500 italic mb-8">for</p>

        <h2 className="text-xl font-black text-gray-900 uppercase tracking-wide leading-relaxed max-w-2xl mb-8">
          {proposal?.title || "Untitled Proposal"}
        </h2>

        <div className="space-y-2 mb-16 flex flex-col items-center w-full">
          <p className="text-sm text-gray-600 font-semibold">
            ID: <span className="font-bold text-gray-900">{appId}</span>
          </p>
          <p className="text-sm text-gray-600 font-semibold pt-1">
            Researcher(s):
          </p>

          {/* UPDATED: Map through researchers to display them stacked vertically */}
          <div className="text-lg font-bold text-gray-900 max-w-2xl px-8 flex flex-col items-center gap-1.5 mt-1">
            {validResearchers.length > 0 ? (
              validResearchers.map((name, index) => (
                <span key={index} className="leading-snug">
                  {name}
                </span>
              ))
            ) : (
              <span className="leading-snug">
                {proposal?.researcher?.fullName || "Researcher Name"}
              </span>
            )}
          </div>
        </div>

        <p className="text-sm text-gray-700 max-w-xl mx-auto leading-relaxed mb-20 font-medium">
          The study has been reviewed and approved by the BUHREC, and we
          guarantee that it complies with relevant ethical guidelines.
        </p>

        {/* Footer / Signatures Area */}
        <div className="absolute bottom-20 left-0 w-full px-16 flex justify-between items-end">
          <div className="text-left">
            <p className="text-[13px] font-bold text-gray-800">
              Department: <span className="font-normal">{department}</span>
            </p>
            <p className="text-[13px] mt-2 font-bold text-gray-800">
              School: <span className="font-normal">{college}</span>
            </p>
          </div>

          <div className="flex flex-col items-center">
            <p className="text-[13px] font-bold text-gray-800 mb-2">
              Chairman Of BUHREC
            </p>
            {/* Signature Placeholder */}
            <img
              src={ChairmanSignature}
              alt="Chairman Signature"
              className="h-24 object-contain mix-blend-multiply"
            />
          </div>

          <div className="text-right">
            <p className="text-[13px] text-gray-600">
              Approved on:{" "}
              <span className="font-bold text-gray-800">
                {formatDate(approvalDate)}
              </span>
            </p>
            <p className="text-[13px] mt-2 text-gray-600">
              Expires on:{" "}
              <span className="font-bold text-gray-800">
                {formatDate(expirationDate)}
              </span>
            </p>
            <p className="text-[13px] mt-2 text-gray-600">
              Version approved:{" "}
              <span className="font-bold text-gray-800">{versionDisplay}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovalCertificate;
