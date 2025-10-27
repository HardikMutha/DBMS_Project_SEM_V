import React, { useState } from "react";
import { Link } from "react-router";
import useAuthContext from "../hooks/useAuthContext";
import campingBg from "/assets/camping-bg.jpg";
import BrowseCampgrounds from "../components/BrowseCampgrounds";

const Home = () => {
  const { state } = useAuthContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [showBrowse, setShowBrowse] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowBrowse(true);
    }
  };

  const handleBrowseClick = () => {
    setSearchQuery("");
    setShowBrowse(true);
  };

  const handleCloseBrowse = () => {
    setShowBrowse(false);
    setSearchQuery("");
  };

  return (
    <div className="h-screen flex flex-col relative">
      {/* Modern Navigation Bar */}
      <nav className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/60 to-transparent backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center group">
              <img
                src="/assets/cg-logo.png"
                alt="CampGrounds Logo"
                className="h-14 w-auto transition-transform group-hover:scale-105"
              />
            </Link>

            <div className="flex items-center gap-6" style={{ fontFamily: "Cantarell, sans-serif" }}>
              <Link
                to="/"
                className="text-white font-medium hover:text-cyan-300 transition-all duration-300 relative group px-2 py-1"
              >
                Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-300 group-hover:w-full transition-all duration-300"></span>
              </Link>

              <button className="relative text-white font-medium hover:text-cyan-300 transition-all duration-300 px-2 py-1 group">
                <span className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
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
                  Notifications
                </span>
                {state?.isAuthenticated && (
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
                )}
              </button>

              {state?.isAuthenticated ? (
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
                  to="/profile"
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white font-medium px-4 py-2 rounded-full transition-all duration-300 border border-white/20"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-[#164E63] rounded-full flex items-center justify-center text-sm font-bold">
                    {state?.user?.username?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <span>Profile</span>
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white font-semibold px-6 py-2 rounded-full transition-all duration-300 border border-white/20"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Background */}
      <div
        className="flex-1 relative flex items-center justify-center px-6"
        style={{
          background: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.5)), url('${campingBg}') center/cover no-repeat fixed`,
          filter: showBrowse ? "blur(8px)" : "none",
          transition: "filter 0.5s ease-in-out",
        }}
      >
        <div className="relative z-10 w-full max-w-4xl text-center">
          {/* Hero Text */}
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

          {/* Search Bar */}
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

          {/* Browse Button */}
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

          {/* Feature Cards */}
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

      {/* Browse Campgrounds Overlay */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-500 ease-in-out ${
          showBrowse ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        style={{
          transform: showBrowse ? "translateY(0)" : "translateY(100%)",
        }}
      >
        <div className="absolute inset-0 bg-white">
          <div className="h-full overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-[#164E63] to-cyan-600 shadow-xl z-10 px-6 py-5 flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-white">Browse Campgrounds</h2>
                <p className="text-cyan-100 text-sm mt-1">Discover your next adventure</p>
              </div>
              <button
                onClick={handleCloseBrowse}
                className="text-white hover:bg-white/20 rounded-full p-2 transition-all duration-300 hover:rotate-90"
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <BrowseCampgrounds searchQuery={searchQuery} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
