import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import useAuthContext from "../hooks/useAuthContext";
import AllCampgrounds from "../components/AllCampgrounds";
import campingBg from "/assets/camping-bg.jpg";

const BrowseCampgroundsPage = () => {
  const { state } = useAuthContext();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

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

  return (
    <div className="relative min-h-screen bg-slate-950 text-white">
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
    </div>
  );
};

export default BrowseCampgroundsPage;
