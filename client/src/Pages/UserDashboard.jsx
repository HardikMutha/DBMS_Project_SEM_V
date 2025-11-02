import React from "react";
import { useNavigate, Link } from "react-router";
import useAuthContext from "../hooks/useAuthContext";
import campingBg from "/assets/camping-bg.jpg";
import Navbar from "../components/Navbar";

const UserDashboard = () => {
  const { state, dispatch } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch({ type: "LOGOUT" });
    navigate("/login");
  };

  return (
    <>
      <Navbar variant="transparent" />
      <div
        className="relative min-h-screen overflow-hidden bg-slate-950 py-10"
        style={{
          background: `url('${campingBg}') center/cover no-repeat fixed`,
        }}
      >
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />
        <div className="pointer-events-none absolute -top-48 left-10 h-96 w-96 rounded-full bg-emerald-400/25 blur-3xl" />
        <div className="pointer-events-none absolute bottom-[-160px] right-[-40px] h-[420px] w-[420px] rounded-full bg-cyan-500/25 blur-3xl" />

        <div className="relative z-10 min-h-screen px-6 py-16">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-white/70 mb-4">
                    Your Space
                  </span>
                  <h1 className="text-4xl sm:text-5xl font-semibold text-white">User Dashboard</h1>
                  <p className="mt-3 text-base text-white/80">Manage your camping adventures and explore new destinations.</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-6 py-3 rounded-2xl border border-white/15 bg-white/5 text-white text-sm font-semibold hover:border-white/25 hover:bg-white/10 transition-all shadow-lg"
                >
                  Logout
                </button>
              </div>
            </div>

            <div className="relative mb-12">
              <div className="absolute inset-0 rounded-3xl border border-white/10 bg-white/5 opacity-80 blur-lg" />
              <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-slate-950/75 shadow-2xl backdrop-blur-xl">
                <div className="pointer-events-none absolute inset-x-10 -top-32 h-64 rounded-full bg-gradient-to-br from-cyan-400/40 via-emerald-400/30 to-transparent blur-3xl" />
                <div className="relative px-8 py-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/30 bg-gradient-to-br from-cyan-400 to-emerald-400 text-2xl font-bold text-slate-900">
                      {state.user?.username?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold text-white">Welcome back, {state.user?.username}!</h3>
                      <p className="text-sm text-white/60 mt-1">Ready for your next adventure?</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/60 mb-2">Email</p>
                      <p className="text-white font-medium">{state.user?.email}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/60 mb-2">Account Type</p>
                      <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/60 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-white shadow-lg shadow-cyan-500/20">
                        USER
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-semibold text-white mb-2">Quick Actions</h2>
              <p className="text-white/70 mb-8">Everything you need at your fingertips</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Link to="/" state={{ openBrowse: true }} className="relative group cursor-pointer">
                  <div className="absolute inset-0 rounded-3xl border border-white/10 bg-white/5 opacity-80 blur-lg group-hover:opacity-100 transition-opacity" />
                  <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-slate-950/75 shadow-xl backdrop-blur-xl hover:border-cyan-400/50 transition-all p-6">
                    <div className="text-4xl mb-4">🏕️</div>
                    <h3 className="text-lg font-semibold text-white mb-2">Browse Campgrounds</h3>
                    <p className="text-sm text-white/70">Explore available camping locations</p>
                  </div>
                </Link>

                <Link to="/" className="relative group cursor-pointer">
                  <div className="absolute inset-0 rounded-3xl border border-white/10 bg-white/5 opacity-80 blur-lg group-hover:opacity-100 transition-opacity" />
                  <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-slate-950/75 shadow-xl backdrop-blur-xl hover:border-emerald-400/50 transition-all p-6">
                    <div className="text-4xl mb-4">🏠</div>
                    <h3 className="text-lg font-semibold text-white mb-2">Home</h3>
                    <p className="text-sm text-white/70">Return to homepage</p>
                  </div>
                </Link>

                <div className="relative group cursor-pointer">
                  <div className="absolute inset-0 rounded-3xl border border-white/10 bg-white/5 opacity-80 blur-lg group-hover:opacity-100 transition-opacity" />
                  <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-slate-950/75 shadow-xl backdrop-blur-xl hover:border-cyan-400/50 transition-all p-6">
                    <div className="text-4xl mb-4">⭐</div>
                    <h3 className="text-lg font-semibold text-white mb-2">Write Reviews</h3>
                    <p className="text-sm text-white/70">Share your camping experiences</p>
                  </div>
                </div>

                <Link to="/profile" className="relative group cursor-pointer">
                  <div className="absolute inset-0 rounded-3xl border border-white/10 bg-white/5 opacity-80 blur-lg group-hover:opacity-100 transition-opacity" />
                  <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-slate-950/75 shadow-xl backdrop-blur-xl hover:border-emerald-400/50 transition-all p-6">
                    <div className="text-4xl mb-4">⚙️</div>
                    <h3 className="text-lg font-semibold text-white mb-2">Profile Settings</h3>
                    <p className="text-sm text-white/70">Update your account information</p>
                  </div>
                </Link>
              </div>
            </div>

            <div className="mt-16">
              <h2 className="text-3xl font-semibold text-white mb-2">My Bookings</h2>
              <p className="text-white/70 mb-8">Track your camping adventures</p>

              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
                  Current Booking
                </h3>
                <div className="relative">
                  <div className="absolute inset-0 rounded-3xl border border-white/10 bg-white/5 opacity-80 blur-lg" />
                  <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-slate-950/75 shadow-2xl backdrop-blur-xl">
                    <div className="pointer-events-none absolute inset-x-10 -top-32 h-64 rounded-full bg-gradient-to-br from-green-400/40 via-emerald-400/30 to-transparent blur-3xl" />
                    <div className="relative p-8 text-center">
                      <div className="text-5xl mb-4 opacity-50">📅</div>
                      <p className="text-white/70">No active booking at the moment</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Booking History</h3>
                <div className="relative">
                  <div className="absolute inset-0 rounded-3xl border border-white/10 bg-white/5 opacity-80 blur-lg" />
                  <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-slate-950/75 shadow-2xl backdrop-blur-xl">
                    <div className="pointer-events-none absolute inset-x-10 -top-32 h-64 rounded-full bg-gradient-to-br from-cyan-400/40 via-blue-400/30 to-transparent blur-3xl" />
                    <div className="relative p-12 text-center">
                      <div className="text-6xl mb-6 opacity-50">🏕️</div>
                      <p className="text-xl text-white/90 mb-3 font-semibold">No booking history yet</p>
                      <p className="text-white/60 mb-8 max-w-md mx-auto">
                        Start your camping journey by booking your first adventure!
                      </p>
                      <Link
                        to="/"
                        state={{ openBrowse: true }}
                        className="inline-block px-8 py-3.5 rounded-2xl border border-white/15 bg-white/5 text-white text-sm font-semibold hover:border-cyan-400/50 hover:bg-white/10 transition-all shadow-lg"
                      >
                        Browse Campgrounds
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDashboard;
