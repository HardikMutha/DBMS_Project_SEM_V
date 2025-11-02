import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import useAuthContext from "../hooks/useAuthContext";
import Navbar from "../components/Navbar";
import campingBg from "/assets/camping-bg.jpg";

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
      <Navbar variant="solid" />

      {/* Profile Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16">
        {/* Profile Header */}
        <div className="relative mb-12">
          <div className="absolute inset-0 rounded-3xl border border-white/10 bg-white/5 opacity-80 blur-lg" />
          <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-slate-950/75 shadow-2xl backdrop-blur-xl">
            <div className="pointer-events-none absolute inset-x-10 -top-32 h-64 rounded-full bg-gradient-to-br from-cyan-400/40 via-emerald-400/30 to-transparent blur-3xl" />
            <div className="relative px-8 py-10">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex h-24 w-24 items-center justify-center rounded-full border border-white/30 bg-gradient-to-br from-cyan-400 to-emerald-400 text-4xl font-bold text-slate-900">
                  {state.user?.username?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl md:text-4xl font-semibold text-white mb-2">{state.user?.username}</h1>
                  <p className="text-white/70 mb-3">{state.user?.email}</p>
                  <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/60 bg-cyan-400/10 px-3 py-1.5 text-xs font-semibold text-white shadow-lg shadow-cyan-500/20">
                    {state.role?.toUpperCase()}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-6 py-3 rounded-2xl border border-white/15 bg-white/5 text-white text-sm font-semibold hover:border-white/25 hover:bg-white/10 transition-all shadow-lg"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="relative">
          <div className="absolute inset-0 rounded-3xl border border-white/10 bg-white/5 opacity-80 blur-lg" />
          <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-slate-950/75 shadow-2xl backdrop-blur-xl">
            <div className="flex flex-col md:flex-row border-b border-white/10">
              <button
                onClick={() => setActiveTab("info")}
                className={`flex-1 px-6 py-5 text-center font-semibold transition-all ${
                  activeTab === "info"
                    ? "bg-white/10 text-white border-b-2 md:border-b-0 md:border-r border-cyan-400/60"
                    : "text-white/70 hover:bg-white/5 hover:text-white border-b md:border-b-0 md:border-r border-white/10"
                }`}
              >
                Personal Information
              </button>
              <button
                onClick={() => setActiveTab("bookings")}
                className={`flex-1 px-6 py-5 text-center font-semibold transition-all ${
                  activeTab === "bookings"
                    ? "bg-white/10 text-white border-b-2 md:border-b-0 border-cyan-400/60"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                My Bookings
              </button>
            </div>

            <div className="p-8">
              {activeTab === "info" && (
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-2">Personal Information</h2>
                  <p className="text-white/60 mb-8">View your account details</p>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-[0.24em] text-white/60 mb-3">
                        Username
                      </label>
                      <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
                        <p className="text-white font-medium">{state.user?.username}</p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-[0.24em] text-white/60 mb-3">Email</label>
                      <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
                        <p className="text-white font-medium">{state.user?.email}</p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-[0.24em] text-white/60 mb-3">Role</label>
                      <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
                        <p className="text-white font-medium capitalize">{state.user?.role}</p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-[0.24em] text-white/60 mb-3">
                        Member Since
                      </label>
                      <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
                        <p className="text-white font-medium">{new Date().toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "bookings" && (
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-2">My Bookings</h2>
                  <p className="text-white/60 mb-8">Manage your reservations</p>
                  <div className="text-center py-20">
                    <div className="text-6xl mb-6 opacity-50">📅</div>
                    <p className="text-xl text-white/90 mb-3 font-semibold">No bookings yet</p>
                    <p className="text-white/60 mb-8 max-w-md mx-auto">
                      Start exploring campgrounds and book your first adventure!
                    </p>
                    <Link
                      to="/"
                      className="inline-block px-8 py-3.5 rounded-2xl border border-white/15 bg-white/5 text-white text-sm font-semibold hover:border-cyan-400/50 hover:bg-white/10 transition-all shadow-lg"
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
    </div>
  );
};

export default Profile;
