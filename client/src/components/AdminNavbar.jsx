import React from "react";
import { useNavigate } from "react-router";
import useAuthContext from "../hooks/useAuthContext";

const AdminNavbar = ({ title = "Admin Panel", showBackButton = true, backPath = "/admin/dashboard" }) => {
  const { state, dispatch } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch({ type: "LOGOUT" });
    navigate("/login");
  };

  return (
    <div className="z-10 border-b border-white/10 backdrop-blur-md shadow-lg sticky top-0">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            {showBackButton && (
              <button
                onClick={() => navigate(backPath)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 transition-all shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70 mb-1">
                Module
              </span>
              <h1 className="text-xl font-semibold text-white">{title}</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-white">{state.user?.username}</p>
              <p className="text-xs text-white/70">{state.user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl border border-white/15 bg-white/5 text-white text-sm font-medium hover:border-white/25 hover:bg-white/10 transition-all shadow-lg"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNavbar;
