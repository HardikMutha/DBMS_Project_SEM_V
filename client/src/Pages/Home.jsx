import Navbar from "../components/Navbar";
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import useAuthContext from "../hooks/useAuthContext";
import NotificationModal from "../components/NotificationModal";
import { BACKEND_URL } from "../../config";

import campingBg from "/assets/camping-bg.jpg";

const dummyNotifications = [
  {
    id: "sample-1",
    from: "CampGrounds Team",
    content: "Welcome to CampGrounds! Discover curated destinations and plan your next adventure.",
    createdAt: new Date().toISOString(),
    viewed: false,
  },
  {
    id: "sample-2",
    from: "Host Support",
    content: "Remember to complete your profile to unlock personalised recommendations.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    viewed: true,
  },
];

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [, setLoadingNotifications] = useState(false);
  const navigate = useNavigate();
  const { state } = useAuthContext();

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      navigate(`/campgrounds?search=${encodeURIComponent(trimmedQuery)}`);
    } else {
      navigate("/campgrounds");
    }
  };

  const handleBrowseClick = () => {
    navigate("/campgrounds");
  };

  const fetchNotifications = useCallback(async () => {
    if (!state?.isAuthenticated) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    setLoadingNotifications(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setNotifications(dummyNotifications);
        const unread = dummyNotifications.filter((notif) => !notif.viewed).length;
        setUnreadCount(unread);
        return;
      }

      const response = await fetch(`${BACKEND_URL}/api/notifications`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const fetchedNotifications = data.data || [];
          // If no notifications from API, use dummy data for testing
          if (fetchedNotifications.length === 0) {
            setNotifications(dummyNotifications);
            const unread = dummyNotifications.filter((notif) => !notif.viewed).length;
            setUnreadCount(unread);
          } else {
            setNotifications(fetchedNotifications);
            const unread = fetchedNotifications.filter((notif) => !notif.viewed).length;
            setUnreadCount(unread);
          }
        }
      } else {
        // Fallback to dummy data if API fails
        setNotifications(dummyNotifications);
        const unread = dummyNotifications.filter((notif) => !notif.viewed).length;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      // Use dummy data on error for testing
      setNotifications(dummyNotifications);
      const unread = dummyNotifications.filter((notif) => !notif.viewed).length;
      setUnreadCount(unread);
    } finally {
      setLoadingNotifications(false);
    }
  }, [state?.isAuthenticated]);

  useEffect(() => {
    fetchNotifications();
    // Optionally refresh notifications periodically
    const interval = setInterval(fetchNotifications, 30000); // Every 30 seconds
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const handleNotificationClick = () => {
    if (!state?.isAuthenticated) {
      return;
    }
    setShowNotificationModal(true);
    fetchNotifications();
  };

  const handleNotificationUpdate = (notificationId) => {
    // Update local state when notification is marked as read
    setNotifications((prev) => prev.map((notif) => (notif.id === notificationId ? { ...notif, viewed: true } : notif)));
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  return (
    <div className="h-screen flex flex-col relative">
      <Navbar variant="transparent" />
      <div
        className="flex-1 relative flex items-center justify-center px-6"
        style={{
          background: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.5)), url('${campingBg}') center/cover no-repeat fixed`,
        }}
      >
        <div className="relative z-10 w-full max-w-4xl text-center">
          <div className="mb-12 space-y-4">
            <h1
              className="text-6xl md:text-7xl font-bold text-white mb-4 drop-shadow-2xl"
              style={{ fontFamily: "Cantarell, sans-serif" }}
            >
              Find Your Perfect
              <span className="block text-cyan-300">Camping Spot</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto drop-shadow-lg">
              Discover amazing campgrounds, connect with nature, and create unforgettable memories
            </p>
          </div>

          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative group">
              <input
                type="text"
                placeholder="Search for campgrounds, locations, or activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-8 py-5 pr-20 bg-white/95 backdrop-blur-md border-2 border-transparent rounded-2xl text-gray-800 placeholder-gray-500 text-lg focus:outline-none focus:border-cyan-400 focus:bg-white shadow-2xl transition-all duration-300 group-hover:shadow-cyan-400/20"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-gradient-to-r from-cyan-500 to-[#164E63] rounded-xl flex items-center justify-center hover:scale-105 transition-all duration-300 shadow-lg"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>
          </form>

          {state?.isAuthenticated && (
            <div className="mb-10 flex justify-center">
              <button
                type="button"
                onClick={handleNotificationClick}
                className="inline-flex items-center gap-3 rounded-full bg-white/15 px-6 py-3 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/25"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-400 text-xs font-bold text-slate-900">
                  {Math.min(unreadCount, 9)}
                </span>
                <span>{unreadCount === 1 ? "Unread Notification" : "Unread Notifications"}</span>
              </button>
            </div>
          )}

          <button
            onClick={handleBrowseClick}
            className="group relative inline-flex items-center gap-3 px-10 py-4 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white text-lg font-semibold rounded-2xl transition-all duration-300 border-2 border-white/30 hover:border-cyan-300 shadow-2xl hover:shadow-cyan-400/30 hover:scale-105"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
            <span>Browse All Campgrounds</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
              <div className="text-4xl mb-3">🏕️</div>
              <h3 className="text-xl font-bold text-white mb-2">Verified Locations</h3>
              <p className="text-white/80 text-sm">Explore handpicked, verified camping destinations</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
              <div className="text-4xl mb-3">⭐</div>
              <h3 className="text-xl font-bold text-white mb-2">Trusted Reviews</h3>
              <p className="text-white/80 text-sm">Read authentic reviews from fellow campers</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="text-xl font-bold text-white mb-2">Easy Booking</h3>
              <p className="text-white/80 text-sm">Book your perfect spot in just a few clicks</p>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Modal */}
      <NotificationModal
        isOpen={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
        notifications={notifications}
        userId={state?.user?.id}
        onNotificationUpdate={handleNotificationUpdate}
      />
    </div>
  );
};

export default Home;
