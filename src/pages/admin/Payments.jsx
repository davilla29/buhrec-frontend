import React, { useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import axios from "../../utils/axios"; // adjust path if needed

const Payments = () => {
  const [activeTab, setActiveTab] = useState("successful");
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false); // ← new state for search toggle

  // =========================
  // FETCH PAYMENTS
  // =========================
  const fetchPayments = async (filter) => {
    try {
      setLoading(true);
      const res = await axios.get(`/admin/payments/list?filter=${filter}`);

      if (res.data.success) {
        setPayments(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch payments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments(activeTab);
  }, [activeTab]);

  // =========================
  // FRONTEND SEARCH LOGIC
  // =========================
  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const searchValue = search.toLowerCase();

      return (
        payment.applicationId?.toLowerCase().includes(searchValue) ||
        payment.name?.toLowerCase().includes(searchValue)
      );
    });
  }, [payments, search]);

  // Handle Search Toggle
  const handleToggleSearch = () => {
    setIsSearchOpen((prev) => !prev);
    if (isSearchOpen) {
      setSearch(""); // Clear search when closing
    }
  };

  // =========================
  // DATE FORMATTER
  // =========================
  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="p-4 md:p-6 min-h-screen max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Applicant Payments
        </h1>

        {/* Toggle Search Button */}
        <button
          onClick={handleToggleSearch}
          className="p-2 -mr-2 cursor-pointer hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center"
          aria-label="Toggle search"
        >
          {isSearchOpen ? (
            <X className="text-gray-800" size={22} />
          ) : (
            <Search
              className="text-gray-500 hover:text-gray-800 transition-colors"
              size={22}
            />
          )}
        </button>
      </div>

      {/* Conditionally Rendered Search Input */}
      {isSearchOpen && (
        <div className="mb-6 animate-in slide-in-from-top-2 fade-in duration-200">
          <input
            type="text"
            autoFocus
            placeholder="Search by Application ID or Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-100 rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-blue-500 focus:bg-white focus:shadow-sm transition-all"
          />
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar sm:overflow-visible">
        <button
          onClick={() => {
            setActiveTab("successful");
            setSearch("");
            setIsSearchOpen(false);
          }}
          className={`px-5 py-2 cursor-pointer rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
            activeTab === "successful"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
          }`}
        >
          Successful
        </button>

        <button
          onClick={() => {
            setActiveTab("pending");
            setSearch("");
            setIsSearchOpen(false);
          }}
          className={`px-5 py-2 cursor-pointer rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
            activeTab === "pending"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
          }`}
        >
          Pending
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          {/* Added whitespace-nowrap to prevent columns from crushing together on mobile */}
          <table className="w-full text-sm text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-blue-700 text-white text-xs uppercase tracking-wider">
                <th className="px-5 py-4 font-semibold">Date</th>
                <th className="px-5 py-4 font-semibold">Transaction ID</th>
                <th className="px-5 py-4 font-semibold">Application ID</th>
                <th className="px-5 py-4 font-semibold">Name</th>
                <th className="px-5 py-4 font-semibold">Level</th>
                <th className="px-5 py-4 font-semibold">Amount</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 font-semibold">Method</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-16">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
                      <p className="text-gray-400">Loading payments...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredPayments.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="text-center py-16 text-gray-400 italic bg-gray-50"
                  >
                    No payment records found.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment) => (
                  <tr
                    key={payment._id}
                    className="hover:bg-blue-50/50 transition-colors"
                  >
                    <td className="px-5 py-4 text-gray-600">
                      {formatDate(payment.date)}
                    </td>
                    <td className="px-5 py-4 text-gray-600 font-mono text-xs">
                      {payment.transactionId}
                    </td>
                    <td className="px-5 py-4 font-semibold text-gray-800">
                      {payment.applicationId}
                    </td>
                    <td className="px-5 py-4 text-gray-800">{payment.name}</td>
                    <td className="px-5 py-4 text-gray-600">{payment.level}</td>
                    <td className="px-5 py-4 font-medium text-gray-900">
                      ₦{payment.amount?.toLocaleString()}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${
                          payment.status?.toLowerCase() === "successful"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      {payment.paymentMethod}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Payments;
