import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import useAuthContext from "../hooks/useAuthContext";
import campingBg from "/assets/camping-bg.jpg";
import BrowseCampgrounds from "../components/BrowseCampgrounds";

const Home = () => {
  const { state } = useAuthContext();
  const navigate = useNavigate();
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
      <nav className="bg-[#164E63] shadow-lg z-50">
        <div className="w-full px-6 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center">
              <img 
                src="/assets/cg-logo.png" 
                alt="CampGrounds Logo" 
                className="h-12 w-auto"
              />
            </Link>

            <div className="flex items-center gap-8" style={{ fontFamily: 'Cantarell, sans-serif', fontSize: '18.8px' }}>
              <Link to="/" className="text-white hover:text-cyan-300 transition-colors">
                Home
              </Link>
              
              <button className="relative text-white hover:text-cyan-300 transition-colors">
                Notifications
                {state?.isAuthenticated && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>

              {state?.isAuthenticated ? (
                <Link
                  to="/profile"
                  className="text-white hover:text-cyan-300 transition-colors"
                >
                  Profile
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="text-white hover:text-cyan-300 transition-colors"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div 
        className="flex-1 relative flex items-center justify-center px-6 min-h-screen"
        style={{
          background: `url('${campingBg}') center/cover no-repeat`,
          filter: showBrowse ? 'blur(8px)' : 'none',
          transition: 'filter 0.5s ease-in-out'
        }}
      >
        <div className="absolute inset-0 bg-opacity-30"></div>
        
        <div className="relative z-10 w-full max-w-3xl">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Campgrounds"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-8 py-6 bg-transparent border-2 border-white border-opacity-50 rounded-full text-white placeholder-white placeholder-opacity-90 text-xl focus:outline-none focus:border-opacity-70 transition-all"
              />
              <button
                type="submit"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-transparent border-2 border-white border-opacity-50 rounded-full flex items-center justify-center hover:border-opacity-70 transition-all"
              >
                <span className="text-2xl">🔍</span>
              </button>
            </div>
            <div className="w-full h-[3px] bg-white mt-4"></div>
          </form>

          {/* Browse Campgrounds Button */}
          <button
            onClick={handleBrowseClick}
            className="w-full px-8 py-6 mt-6 bg-transparent border-2 border-white border-opacity-50 rounded-full text-white text-xl hover:border-opacity-70 hover:bg-white hover:bg-opacity-10 transition-all"
          >
            Browse Campgrounds
          </button>
          <div className="w-full h-[3px] bg-white mt-4"></div>
        </div>
      </div>

      {/* Browse Campgrounds Overlay */}
      <div 
        className={`fixed inset-0 z-50 transition-all duration-500 ease-in-out ${
          showBrowse ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        style={{
          transform: showBrowse ? 'translateY(0)' : 'translateY(100%)',
        }}
      >
        <div className="absolute inset-0 bg-white">
          <div className="h-full overflow-y-auto">
            <div className="sticky top-0 bg-white shadow-md z-10 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Browse Campgrounds</h2>
              <button
                onClick={handleCloseBrowse}
                className="text-gray-600 hover:text-gray-800 text-3xl font-bold"
              >
                ×
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
