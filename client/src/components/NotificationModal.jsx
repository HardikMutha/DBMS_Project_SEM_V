import React, { useState } from "react";
import { BACKEND_URL } from "../../config";

const NotificationModal = ({ isOpen, onClose, notifications = [], userId, onNotificationUpdate }) => {
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [viewedNotifications, setViewedNotifications] = useState(new Set());

  if (!isOpen) return null;

  const handleNotificationClick = async (notification) => {
    setSelectedNotification(notification);

    // Only update viewed status if not already viewed
    if (!notification.viewed && !viewedNotifications.has(notification.id) && notification.id) {
      setUpdating(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${BACKEND_URL}/api/notifications/update-viewed`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ notificationId: notification.id }),
        });

        if (response.ok) {
          // Mark as viewed in local state
          setViewedNotifications((prev) => new Set([...prev, notification.id]));
          // Notify parent component if callback provided
          if (onNotificationUpdate) {
            onNotificationUpdate(notification.id);
          }
        }
      } catch (error) {
        console.error("Error updating notification status:", error);
      } finally {
        setUpdating(false);
      }
    }
  };

  // Helper to check if notification is viewed (either from prop or local state)
  const isViewed = (notification) => {
    return notification.viewed || viewedNotifications.has(notification.id);
  };

  const truncateText = (text, maxLength = 60) => {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-[65vw] h-[80vh] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-cyan-500/20 flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Close Button - Floating Top Right */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-cyan-300 hover:text-cyan-200 transition-colors duration-200 p-2 hover:bg-cyan-900/30 rounded-lg bg-gray-900/80 backdrop-blur-sm"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Main Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar - Notification List */}
          <div className="w-2/5 border-r border-cyan-500/20 bg-gray-900/50 overflow-y-auto">
            <div className="p-4 space-y-2">
              {notifications.length === 0 ? (
                <div className="text-center py-8 text-cyan-600/60">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mx-auto mb-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  <p>No notifications</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`cursor-pointer rounded-lg p-4 border transition-all duration-200 ${
                      selectedNotification?.id === notification.id
                        ? "bg-gradient-to-r from-cyan-900/50 to-blue-900/50 border-cyan-500/50 shadow-lg shadow-cyan-500/20"
                        : isViewed(notification)
                        ? "bg-gray-800/40 border-cyan-700/30 hover:bg-gray-800/60 hover:border-cyan-700/50"
                        : "bg-gradient-to-r from-cyan-950/60 to-blue-950/60 border-cyan-600/40 hover:bg-gradient-to-r hover:from-cyan-900/60 hover:to-blue-900/60 hover:border-cyan-500/50 shadow-md shadow-cyan-900/20"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Unread Indicator */}
                      {!isViewed(notification) && (
                        <div className="mt-1.5 w-2 h-2 rounded-full bg-cyan-400 flex-shrink-0"></div>
                      )}
                      <div className="flex-1 min-w-0">
                        {/* From Field */}
                        {notification.from && (
                          <div
                            className={`text-xs font-semibold mb-1 ${
                              isViewed(notification) ? "text-cyan-500/70" : "text-cyan-400"
                            }`}
                          >
                            From: {notification.from}
                          </div>
                        )}

                        {/* Content Preview */}
                        <p
                          className={`text-sm leading-relaxed ${
                            isViewed(notification)
                              ? "text-gray-300/70 line-through decoration-gray-600/50"
                              : "text-cyan-100 font-medium"
                          }`}
                        >
                          {truncateText(notification.content)}
                        </p>

                        {/* Timestamp */}
                        {notification.createdAt && (
                          <p className="text-xs mt-2 text-cyan-700/50">
                            {formatDate(notification.createdAt)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Side - Full Notification Content */}
          <div className="flex-1 bg-gray-900/30 overflow-y-auto">
            {selectedNotification ? (
              <div className="p-8">
                <div className="max-w-3xl mx-auto">
                  {/* Header Section */}
                  <div className="mb-6 pb-4 border-b border-cyan-500/20">
                    {selectedNotification.from && (
                      <div className="mb-3">
                        <span className="text-xs font-semibold text-cyan-600 uppercase tracking-wider">From</span>
                        <p className="text-lg font-semibold text-cyan-300 mt-1">{selectedNotification.from}</p>
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      {!isViewed(selectedNotification) && (
                        <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 text-xs font-semibold rounded-full border border-cyan-500/40">
                          NEW
                        </span>
                      )}
                      {selectedNotification.createdAt && (
                        <span className="text-sm text-cyan-600/60">
                          {formatDate(selectedNotification.createdAt)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="mb-6">
                    <span className="text-xs font-semibold text-cyan-600 uppercase tracking-wider mb-2 block">
                      Message
                    </span>
                    <div className="mt-3 p-6 bg-gray-800/40 rounded-lg border border-cyan-700/30">
                      <p
                        className={`text-base leading-relaxed whitespace-pre-wrap ${
                          isViewed(selectedNotification) ? "text-gray-300" : "text-cyan-50"
                        }`}
                      >
                        {selectedNotification.content}
                      </p>
                    </div>
                  </div>

                  {/* Additional Info Section */}
                  {selectedNotification.metadata && (
                    <div className="mt-6 p-4 bg-gray-800/30 rounded-lg border border-cyan-700/20">
                      <span className="text-xs font-semibold text-cyan-600 uppercase tracking-wider mb-3 block">
                        Additional Information
                      </span>
                      <div className="space-y-2">
                        {Object.entries(selectedNotification.metadata).map(([key, value]) => (
                          <div key={key} className="flex gap-4">
                            <span className="text-cyan-500/70 font-medium min-w-[120px] capitalize">
                              {key.replace(/([A-Z])/g, " $1").trim()}:
                            </span>
                            <span className="text-gray-300">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {updating && (
                    <div className="mt-4 text-center">
                      <span className="text-sm text-cyan-500/60">Marking as read...</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center text-cyan-600/40">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 mx-auto mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  <p className="text-lg">Select a notification to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;

