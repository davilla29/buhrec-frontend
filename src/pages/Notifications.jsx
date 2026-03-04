import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import axios from "../utils/axios";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get("/notifications");
        setNotifications(res.data.data);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Format date to match your UI (DD/MM/YYYY)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB"); // Results in DD/MM/YYYY
  };

  return (
    <div className="min-h-screen p-4 md:p-2">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="flex items-start gap-8 mb-10">
          <button
            onClick={() => navigate(-1)}
            className="mt-1 p-1 cursor-pointer hover:bg-gray-200 rounded-full transition-colors"
          >
            <ChevronLeft size={28} className="text-gray-800" />
          </button>

          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Your Notifications
            </h1>
            {/* <p className="text-gray-500 text-sm">
              The following proposals have changes effected by the researchers.
            </p> */}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-10 text-gray-400">
              Loading notifications...
            </div>
          ) : notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification._id}
                className="bg-[#EEEEEE] hover:bg-gray-200 transition-colors cursor-pointer rounded-xl p-6 shadow-sm border border-transparent"
              >
                <div className="flex flex-col gap-1">
                  <h3 className="text-[#003B95] font-semibold text-[15px] leading-relaxed">
                    {notification.message ||
                      `A new assignment ${notification.title} has been submitted`}
                  </h3>
                  <span className="text-[#003B95] text-[11px] font-medium opacity-80">
                    {formatDate(notification.createdAt)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl p-12 text-center border-2 border-dashed border-gray-200">
              <p className="text-gray-400">No notifications yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
