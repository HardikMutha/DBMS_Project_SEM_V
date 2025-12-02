import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router";
import Navbar from "../components/Navbar";
import AllCampgrounds from "../components/AllCampgrounds";
import NotificationModal from "../components/NotificationModal";
import useAuthContext from "../hooks/useAuthContext";
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

const BrowseCampgrounds = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useAuthContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [, setLoadingNotifications] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryValue = params.get("search") || "";
    setSearchTerm(queryValue);
  }, [location.search]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedQuery = searchTerm.trim();
    if (trimmedQuery) {
      navigate(`/campgrounds?search=${encodeURIComponent(trimmedQuery)}`);
    } else {
      navigate("/campgrounds");
    }
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

      const response = await fetch(`${BACKEND_URL}/notifications`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);

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
    <div className="relative min-h-screen bg-slate-950 text-white">
      <Navbar variant="transparent" notificationCount={unreadCount} onNotificationClick={handleNotificationClick} />

      <main className="pt-28 pb-16">
        <section
          className="relative flex items-center justify-center px-6 py-20"
          style={{
            background: `linear-gradient(rgba(15, 23, 42, 0.72), rgba(15, 23, 42, 0.86)), url('${campingBg}') center/cover no-repeat`,
          }}
        >
          <div className="absolute inset-0 bg-slate-950/50" />
          <div className="relative z-10 w-full max-w-4xl text-center space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-white/70">
              Explore
            </div>
            <h1 className="text-4xl sm:text-5xl font-semibold leading-tight">
              Browse curated campgrounds tailored to every adventure
            </h1>
            <p className="text-base text-white/80 max-w-2xl mx-auto">
              Filter by location or vibe to uncover new destinations, compare amenities, and dive into details with ease.
            </p>

            <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
              <div className="relative group">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search campgrounds, places or experiences..."
                  className="w-full rounded-2xl border border-white/15 bg-white/10 px-6 py-4 text-white placeholder-white/50 shadow-xl transition focus:border-cyan-300 focus:bg-slate-900/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-[#164E63] text-white shadow-lg transition hover:scale-105"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
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
          </div>
        </section>

        <section className="relative bg-gray-50">
          <div className="absolute inset-x-0 -top-16 flex justify-center px-6">
            <div className="w-full max-w-5xl rounded-3xl border border-white/20 bg-white/80 p-6 shadow-2xl backdrop-blur-xl">
              <div className="grid gap-6 md:grid-cols-3">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-600">Highlights</p>
                  <p className="mt-3 text-slate-700 text-sm">
                    Save and revisit favorites, check availability in real-time, and plan with dynamic recommendations.
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-600">Filters</p>
                  <p className="mt-3 text-slate-700 text-sm">
                    Refine your search by location, nightly price, and campsite amenities to uncover the perfect stay.
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-600">Insights</p>
                  <p className="mt-3 text-slate-700 text-sm">
                    Access authentic reviews, high-resolution imagery, and curated guides for every listing.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-24">
            <AllCampgrounds searchQuery={searchTerm} />
          </div>
        </section>
      </main>

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

export default BrowseCampgrounds;
