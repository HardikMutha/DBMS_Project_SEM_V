import React from "react";
import { Link } from "react-router";
import useAuthContext from "../hooks/useAuthContext";

const Navbar = ({ variant = "transparent", notificationCount = 0, onNotificationClick }) => {
  const { state } = useAuthContext();

  const isTransparent = variant === "transparent";

  const navClasses = isTransparent
    ? "absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-[2px] border-b border-white/5"
    : "bg-[#164E63] shadow-lg";

  const logoHeightClass = isTransparent ? "h-14" : "h-12";

  const profileInitial = state?.user?.username?.charAt(0).toUpperCase() || "U";
  const displayNotificationCount = Math.min(notificationCount, 9);
  const showNotificationBadge = state?.isAuthenticated && notificationCount > 0;

  return (
    <nav className={navClasses}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between text-md">
          <Link to="/" className="flex items-center group">
            <img
              src="/assets/cg-logo.png"
              alt="CampGrounds Logo"
              className={`${logoHeightClass} w-auto transition-transform duration-300 group-hover:scale-105 drop-shadow-md`}
            />
          </Link>
          <div className="flex items-center gap-6 md:gap-8" style={{ fontFamily: "Cantarell, sans-serif" }}>
            <Link
              to="/"
              className="text-white font-extrabold hover:text-cyan-400 transition-colors duration-300 relative group px-2 py-1 tracking-wide"
            >
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300 rounded-full"></span>
            </Link>

            {state?.isAuthenticated && state?.role === "admin" && (
              <Link
                to="/admin/dashboard"
                className="text-white font-extrabold hover:text-cyan-400 transition-colors duration-300 relative group px-2 py-1 tracking-wide"
              >
                Dashboard
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300 rounded-full"></span>
              </Link>
            )}

            {state?.isAuthenticated && (
              <button
                type="button"
                onClick={onNotificationClick}
                className="relative text-white font-medium hover:text-cyan-400 transition-colors duration-300 px-2 py-1 group text-md tracking-wide flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <span className="hidden sm:inline">Notifications</span>
                {showNotificationBadge && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-transparent">
                    {displayNotificationCount}
                  </span>
                )}
              </button>
            )}

            {state?.isAuthenticated && state?.role === "user" && (
              <Link
                to="/user/createcg"
                className="text-white font-medium hover:text-cyan-400 transition-colors duration-300 relative group px-2 py-1 text-md tracking-wide flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="hidden sm:inline">Create</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300 rounded-full"></span>
              </Link>
            )}

            {state?.isAuthenticated ? (
              <Link
                to={state?.role === "user" ? "/user/dashboard" : "/admin/dashboard"}
                className={`flex items-center gap-3 rounded-full border border-white/20 pl-1 pr-4 py-1 font-medium text-white transition-all duration-300 group hover:border-cyan-400/50 ${
                  isTransparent ? "bg-white/10 backdrop-blur-md hover:bg-white/20" : "bg-white/10 hover:bg-white/20"
                }`}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-[#164E63] text-md font-bold shadow-lg group-hover:scale-105 transition-transform">
                  {profileInitial}
                </div>
                <span className="text-md tracking-wide">Profile</span>
              </Link>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="text-white hover:text-cyan-300 font-extrabold transition-colors duration-300 text-md tracking-wide hidden sm:block"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="rounded-full bg-white text-[#164E63] px-6 py-2.5 font-extrabold text-md transition-all duration-300 hover:bg-cyan-50 hover:shadow-lg hover:shadow-cyan-500/20 active:scale-95"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
