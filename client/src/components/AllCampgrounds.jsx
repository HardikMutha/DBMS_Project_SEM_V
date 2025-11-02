import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { BACKEND_URL } from "../../config";
import toast from "react-hot-toast";

const AllCampgrounds = ({ searchQuery = "" }) => {
  const [campgrounds, setCampgrounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCampgrounds();
  }, []);

  const fetchCampgrounds = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/campground/get-all-campgrounds`);
      if (!response.ok) {
        toast.error("Failed to fetch campgrounds");
        return;
      }
      const data = await response.json();
      setCampgrounds(data?.data || []);
    } catch (err) {
      toast.error("Error loading campgrounds");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCampgrounds = campgrounds.filter((camp) => {
    if (!searchQuery) return true;
    return (
      camp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      camp.place?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      camp.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleViewDetails = (campgroundId) => {
    navigate(`/campground/${campgroundId}`);
  };

  if (loading) {
    return (
      <div className="py-20">
        <div className="mx-auto flex max-w-4xl flex-col gap-6 rounded-3xl border border-slate-200/70 bg-white/70 p-10 text-center shadow-xl backdrop-blur">
          <div className="mx-auto grid w-full gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="rounded-3xl border border-slate-200/60 bg-white/80 p-4 shadow-lg backdrop-blur-sm">
                <div className="h-40 animate-pulse rounded-2xl bg-gradient-to-br from-slate-200 via-slate-100 to-white" />
                <div className="mt-4 h-3 w-3/4 animate-pulse rounded-full bg-slate-200" />
                <div className="mt-2 h-3 w-1/2 animate-pulse rounded-full bg-slate-200" />
              </div>
            ))}
          </div>
          <p className="text-base font-medium text-slate-600">Loading curated campgrounds for your next escape…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 px-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        {filteredCampgrounds.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-6 rounded-3xl border border-slate-200/70 bg-white/80 p-16 text-center shadow-xl backdrop-blur">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-rose-400/40 to-transparent text-3xl">
              🌲
            </div>
            <div className="space-y-2">
              <p className="text-xl font-semibold text-slate-800">
                {searchQuery ? `No campgrounds found matching “${searchQuery}”.` : "No campgrounds available right now."}
              </p>
              <p className="text-sm text-slate-600">
                Try broadening your search or check back later as new destinations get added regularly.
              </p>
            </div>
            <button
              onClick={() => navigate("/campgrounds")}
              className="inline-flex items-center gap-2 rounded-full border border-slate-300/70 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-cyan-400 hover:text-cyan-600"
            >
              Reset filters
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredCampgrounds.map((campground) => (
              <div
                key={campground.id}
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-200/70 bg-white/70 shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-cyan-200/50"
                style={{ height: "540px" }}
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  {campground.imageUrl ? (
                    <img
                      src={campground.imageUrl}
                      alt={campground.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cyan-400 to-[#164E63] text-6xl text-white">
                      🏕️
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/10 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
                  <div className="absolute bottom-4 left-4 flex items-center gap-3 text-sm text-white opacity-0 transition duration-300 group-hover:opacity-100">
                    <span className="rounded-full border border-white/50 bg-white/20 px-3 py-1">
                      {campground.place || "Unknown locale"}
                    </span>
                    <span className="rounded-full border border-white/50 bg-white/20 px-3 py-1">
                      {campground.price ? `$${campground.price}/night` : "Contact host"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col justify-between p-6">
                  <div className="space-y-4 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-xl font-semibold text-slate-900 line-clamp-2">{campground.title}</h3>
                      <div className="text-right text-sm flex-shrink-0">
                        <p className="text-lg font-semibold text-[#0F766E]">{campground.price ? `$${campground.price}` : "—"}</p>
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">per night</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-500">
                      <span className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/80 px-3 py-1">
                        <span className="text-[#164E63]">📍</span>
                        <span className="truncate max-w-[140px]">{campground.place || "Location coming soon"}</span>
                      </span>
                      <span className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/80 px-3 py-1 whitespace-nowrap">
                        ⭐ 4.5 · 120 reviews
                      </span>
                    </div>

                    <p className="text-sm leading-relaxed text-slate-600 line-clamp-3">
                      {campground.description ||
                        "Experience nature at its finest with expansive views, curated amenities, and mindful design."}
                    </p>
                  </div>

                  <button
                    onClick={() => handleViewDetails(campground.id)}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-[#164E63] px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:from-cyan-400 hover:to-[#155E75]"
                  >
                    View details
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllCampgrounds;
