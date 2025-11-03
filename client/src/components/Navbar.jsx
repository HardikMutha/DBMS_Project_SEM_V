import React from "react";
import { Link } from "react-router";
import useAuthContext from "../hooks/useAuthContext";

const Navbar = ({ variant = "transparent", notificationCount = 0, onNotificationClick }) => {
  const { state } = useAuthContext();

  const isTransparent = variant === "transparent";
  const navClasses = isTransparent
    ? "absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/60 to-transparent backdrop-blur-sm"
    : "bg-[#164E63] shadow-lg";
  const logoHeightClass = isTransparent ? "h-14" : "h-12";
  const linkGapClass = isTransparent ? "gap-6" : "gap-8";
  const profileInitial = state?.user?.username?.charAt(0).toUpperCase() || "U";
  const displayNotificationCount = Math.min(notificationCount, 9);
  const showNotificationBadge = state?.isAuthenticated && notificationCount > 0;

  return (
    <nav className={navClasses}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center group">
            <img
              src="/assets/cg-logo.png"
              alt="CampGrounds Logo"
              className={`${logoHeightClass} w-auto transition-transform group-hover:scale-105`}
            />
          </Link>

          <div className={`flex items-center ${linkGapClass}`} style={{ fontFamily: "Cantarell, sans-serif" }}>
            <Link
              to={state?.isAuthenticated && state?.role === "user" ? "/" : "/admin/dashboard"}
              className="text-white font-medium hover:text-cyan-300 transition-all duration-300 relative group px-2 py-1"
            >
              {state?.isAuthenticated && state?.role === "user" ? "Home" : "Dashboard"}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-300 group-hover:w-full transition-all duration-300"></span>
            </Link>

            <button
              type="button"
              onClick={state?.isAuthenticated ? onNotificationClick : undefined}
              disabled={!state?.isAuthenticated || !onNotificationClick}
              className={`relative text-white font-medium transition-all duration-300 px-2 py-1 group ${
                state?.isAuthenticated && onNotificationClick
                  ? "hover:text-cyan-300"
                  : "opacity-70 cursor-not-allowed"
              }`}
            >
              <span className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                Notifications
              </span>
              {showNotificationBadge && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white shadow-lg">
                  {displayNotificationCount}
                </span>
              )}
            </button>

            {state?.isAuthenticated && state?.role === "user" ? (
              <Link
                to="/user/createcg"
                className="text-white font-medium hover:text-cyan-300 transition-all duration-300 relative group px-2 py-1"
              >
                <span className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create
                </span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-300 group-hover:w-full transition-all duration-300"></span>
              </Link>
            ) : null}

            {state?.isAuthenticated ? (
              <Link
                to={state?.role === "user" ? "/user/dashboard" : "/admin/dashboard"}
                className={`flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 font-medium text-white transition-all duration-300 ${
                  isTransparent ? "bg-white/10 backdrop-blur-md hover:bg-white/20" : "bg-white/10 hover:bg-white/20"
                }`}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-[#164E63] text-sm font-bold">
                  {profileInitial}
                </div>
                <span>Profile</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="rounded-full border border-white/20 bg-white/10 px-6 py-2 font-semibold text-white transition-all duration-300 hover:bg-white/20"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
