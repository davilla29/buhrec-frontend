import React, { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import axios from "../../utils/axios"; // adjust path if needed

const Payments = () => {
  const [activeTab, setActiveTab] = useState("successful");
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

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

  // =========================
  // DATE FORMATTER
  // =========================
  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="p-2 min-h-screen">
      <div className="p-2">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-gray-800">
            Applicant Payments
          </h1>
        </div>

        {/* Tabs + Search */}
        <div className="flex items-center justify-between mb-6">
          {/* Tabs */}
          <div className="flex gap-3">
            <button
              onClick={() => setActiveTab("successful")}
              className={`px-4 py-1.5 cursor-pointer rounded-full text-sm font-medium transition ${
                activeTab === "successful"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              Successful
            </button>

            <button
              onClick={() => setActiveTab("pending")}
              className={`px-4 py-1.5 cursor-pointer rounded-full text-sm font-medium transition ${
                activeTab === "pending"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              Pending
            </button>
          </div>

          {/* Search + Filter Icon */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search for a payment using app. Id or name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 w-85 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-blue-700 text-white text-xs uppercase">
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Transaction ID</th>
                <th className="px-4 py-3">Application ID</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Level</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Payment Status</th>
                <th className="px-4 py-3">Payment Method</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-10 text-gray-400">
                    Loading payments...
                  </td>
                </tr>
              ) : filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-10 text-gray-400">
                    No payment records found
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment) => (
                  <tr
                    key={payment._id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3">{formatDate(payment.date)}</td>

                    <td className="px-4 py-3">{payment.transactionId}</td>

                    <td className="px-4 py-3 font-medium">
                      {payment.applicationId}
                    </td>

                    <td className="px-4 py-3">{payment.name}</td>

                    <td className="px-4 py-3">{payment.level}</td>

                    <td className="px-4 py-3">
                      ₦{payment.amount?.toLocaleString()}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          payment.status === "Successful"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {payment.status}
                      </span>
                    </td>

                    <td className="px-4 py-3">{payment.paymentMethod}</td>
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
