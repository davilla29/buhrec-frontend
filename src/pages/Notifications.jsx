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
    <div className="min-h-screen p-4 md:p-3">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center gap-3 md:gap-6 mb-6 md:mb-10">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 cursor-pointer hover:bg-gray-200 rounded-full transition-colors shrink-0"
            aria-label="Go back"
          >
            <ChevronLeft size={28} className="text-gray-800 md:w-7 md:h-7" />
          </button>

          <div>
            <h1 className="text-xl md:text-3xl font-bold text-gray-900 leading-tight">
              Your Notifications
            </h1>
            <p className="hidden md:block text-gray-500 text-sm mt-1">
              Stay updated with the latest changes and submissions.
            </p>
            {/* <p className="text-gray-500 text-sm">
              The following proposals have changes effected by the researchers.
            </p> */}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3 md:space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="w-8 h-8 border-4 border-gray-200 border-t-[#003B95] rounded-full animate-spin" />
              <p className="text-gray-400 animate-pulse">
                Loading notifications...
              </p>
            </div>
          ) : notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification._id}
                className="bg-[#EEEEEE] hover:bg-gray-200 transition-colors cursor-pointer rounded-xl p-6 shadow-sm border border-transparent"
              >
                <div className="flex flex-col gap-1">
                  <h3 className="text-[#003B95] font-semibold text-sm md:text-[15px] leading-snug">
                    {notification.message ||
                      `A new assignment ${notification.title} has been submitted`}
                  </h3>
                  <span className="text-[#003B95] text-[10px] md:text-[11px] font-bold opacity-70 uppercase tracking-wider">
                    {formatDate(notification.createdAt)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-2xl p-10 md:p-16 text-center border-2 border-dashed border-gray-200">
              <div className="mb-4 flex justify-center">
                <div className="p-4 bg-gray-50 rounded-full">
                  <svg
                    width="40"
                    height="40"
                    className="text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-gray-500 font-medium">No notifications yet.</p>
              <p className="text-gray-400 text-sm">
                We'll let you know when something happens!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
