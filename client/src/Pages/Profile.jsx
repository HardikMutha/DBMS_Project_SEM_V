import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import useAuthContext from "../hooks/useAuthContext";

const Profile = () => {
  const { state, dispatch } = useAuthContext();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("info");

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch({ type: "LOGOUT" });
    navigate("/");
  };

  if (!state?.isAuthenticated) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-[#164E63] shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center">
              <img 
                src="/assets/cg-logo.png" 
                alt="CampGrounds Logo" 
                className="h-12 w-auto"
              />
            </Link>

            <div className="flex items-center gap-8" style={{ fontFamily: 'Cantarell, sans-serif', fontSize: '15.8px' }}>
              <Link to="/" className="text-white hover:text-cyan-300 transition-colors">
                Home
              </Link>
              <button className="relative text-white hover:text-cyan-300 transition-colors">
                Notifications
                {state?.isAuthenticated && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
              <Link to={`/${state.role}/dashboard`} className="text-cyan-300 font-semibold">
                Profile
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Profile Content */}
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-[#164E63] rounded-full flex items-center justify-center text-white text-4xl font-bold">
              {state.user?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{state.user?.username}</h1>
              <p className="text-gray-600 mb-2">{state.user?.email}</p>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                state.role === 'admin' 
                  ? 'bg-purple-100 text-purple-700' 
                  : 'bg-green-100 text-green-700'
              }`}>
                {state.role?.toUpperCase()}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("info")}
              className={`flex-1 px-6 py-4 text-center font-semibold transition-colors ${
                activeTab === "info"
                  ? "bg-[#164E63] text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Personal Information
            </button>
            <button
              onClick={() => setActiveTab("bookings")}
              className={`flex-1 px-6 py-4 text-center font-semibold transition-colors ${
                activeTab === "bookings"
                  ? "bg-[#164E63] text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              My Bookings
            </button>
            <button
              onClick={() => setActiveTab("favorites")}
              className={`flex-1 px-6 py-4 text-center font-semibold transition-colors ${
                activeTab === "favorites"
                  ? "bg-[#164E63] text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Favorites
            </button>
          </div>

          <div className="p-8">
            {activeTab === "info" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
                    <input
                      type="text"
                      value={state.user?.username}
                      readOnly
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={state.user?.email}
                      readOnly
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
                    <input
                      type="text"
                      value={state.user?.role}
                      readOnly
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 capitalize"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Member Since</label>
                    <input
                      type="text"
                      value={new Date().toLocaleDateString()}
                      readOnly
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "bookings" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">My Bookings</h2>
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">📅</div>
                  <p className="text-xl text-gray-600 mb-4">No bookings yet</p>
                  <p className="text-gray-500 mb-6">Start exploring campgrounds and book your first adventure!</p>
                  <Link
                    to="/"
                    className="inline-block px-8 py-3 bg-[#164E63] text-white rounded-lg font-semibold hover:bg-[#0E7490] transition-colors"
                  >
                    Browse Campgrounds
                  </Link>
                </div>
              </div>
            )}

            {activeTab === "favorites" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Favorite Campgrounds</h2>
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">❤️</div>
                  <p className="text-xl text-gray-600 mb-4">No favorites yet</p>
                  <p className="text-gray-500 mb-6">Add campgrounds to your favorites to find them easily later!</p>
                  <Link
                    to="/"
                    className="inline-block px-8 py-3 bg-[#164E63] text-white rounded-lg font-semibold hover:bg-[#0E7490] transition-colors"
                  >
                    Browse Campgrounds
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
