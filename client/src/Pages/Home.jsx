import Navbar from "../components/Navbar";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";

import campingBg from "/assets/camping-bg.jpg";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.openBrowse) {
      setSearchQuery("");
    }
  }, [location]);

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

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Fixed background layer */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: `linear-gradient(rgba(15, 23, 42, 0.6), rgba(15, 23, 42, 0.7)), url('${campingBg}') center/cover no-repeat`,
        }}
      />

      <Navbar variant="transparent" />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-8 sm:pb-12 lg:pb-16">
        <div className="relative z-10 w-full max-w-6xl mx-auto">
          {/* Hero Text */}
          <div className="text-center mb-8 sm:mb-10 lg:mb-12">
            <h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 tracking-tight drop-shadow-lg"
              style={{ fontFamily: "Cantarell, sans-serif" }}
            >
              Find Your Perfect
              <span className="block text-cyan-400 mt-1 sm:mt-2">Camping Experience</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-200 max-w-2xl mx-auto font-light leading-relaxed drop-shadow-md px-2">
              Discover amazing campgrounds, connect with nature, and create unforgettable memories with verified hosts.
            </p>
          </div>

          {/* Search Section */}
          <div className="w-full max-w-3xl mx-auto mb-10 sm:mb-12 lg:mb-16 px-2">
            <form onSubmit={handleSearch} className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 sm:pl-6 flex items-center pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 group-focus-within:text-cyan-500 transition-colors duration-300"
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
              </div>
              <input
                type="text"
                placeholder="Search campgrounds, locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 sm:pl-16 pr-24 sm:pr-32 md:pr-36 py-3.5 sm:py-4 md:py-5 bg-white/95 backdrop-blur-md border-0 rounded-full text-gray-900 placeholder-gray-500 text-sm sm:text-base md:text-lg focus:outline-none focus:ring-4 focus:ring-cyan-500/30 shadow-xl transition-all duration-300"
              />
              <button
                type="submit"
                className="absolute right-1.5 sm:right-2 top-1.5 sm:top-2 bottom-1.5 sm:bottom-2 px-4 sm:px-6 md:px-8 bg-[#164E63] hover:bg-[#113a4b] text-white rounded-full font-medium text-sm sm:text-base transition-colors duration-300 shadow-md flex items-center justify-center"
              >
                Search
              </button>
            </form>

            <div className="mt-4 sm:mt-6 text-center">
              <button
                onClick={handleBrowseClick}
                className="inline-flex items-center gap-2 text-white/90 hover:text-white font-medium text-sm sm:text-base transition-colors duration-300 border-b border-transparent hover:border-cyan-400 pb-0.5 group"
              >
                <span>Browse all available campgrounds</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-5xl mx-auto px-2">
            <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 sm:p-8 border border-white/10 hover:border-cyan-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-900/20 group text-left">
              <div className="bg-white/10 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-cyan-500/20 transition-colors duration-300">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Verified Locations</h3>
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                Explore handpicked, verified camping destinations ensuring safety and quality.
              </p>
            </div>

            <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 sm:p-8 border border-white/10 hover:border-cyan-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-900/20 group text-left">
              <div className="bg-white/10 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-cyan-500/20 transition-colors duration-300">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Trusted Reviews</h3>
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                Read authentic experiences from fellow campers to help you choose the perfect spot.
              </p>
            </div>

            <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 sm:p-8 border border-white/10 hover:border-cyan-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-900/20 group text-left sm:col-span-2 lg:col-span-1">
              <div className="bg-white/10 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-cyan-500/20 transition-colors duration-300">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Easy Booking</h3>
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                Secure your spot in just a few clicks with our seamless booking system.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
