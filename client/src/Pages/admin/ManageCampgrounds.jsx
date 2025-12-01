/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import useAuthContext from "../../hooks/useAuthContext";
import { BACKEND_URL } from "../../../config";
import toast from "react-hot-toast";
import AdminNavbar from "../../components/AdminNavbar";

const ManageCampgrounds = () => {
  const { state } = useAuthContext();
  const navigate = useNavigate();
  const [campgrounds, setCampgrounds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCampground, setSelectedCampground] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCampgrounds();
  }, []);

  const fetchCampgrounds = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/admin/campgrounds`, {
        headers: {
          Authorization: `Bearer ${state.token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        const approvedCampgrounds = (data.data || []).filter((cg) => cg.isApproved);
        setCampgrounds(approvedCampgrounds);
      }
    } catch (error) {
      console.error("Error fetching campgrounds:", error);
      toast.error("Failed to load campgrounds");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCampground = async (campgroundId) => {
    toast.error("Delete functionality not implemented yet");
  };

  const getFilteredCampgrounds = () => {
    let filtered = campgrounds;

    if (searchTerm) {
      filtered = filtered.filter(
        (cg) =>
          cg.title?.toLowerCase().includes(searchTerm.toLowerCase()) || cg.type?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredCampgrounds = getFilteredCampgrounds();
  const totalCampgrounds = campgrounds.length;

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-slate-950 font-sans"
      style={{
        backgroundImage: "url('/assets/camping-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />
      <div className="pointer-events-none absolute -top-48 left-10 h-96 w-96 rounded-full bg-emerald-400/25 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-160px] right-[-40px] h-[420px] w-[420px] rounded-full bg-cyan-500/25 blur-3xl" />

      <AdminNavbar title="Campground Management" />

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div className="relative group">
            <div className="absolute inset-0 rounded-2xl border border-white/10 bg-white/5 opacity-80 blur-md transition-opacity group-hover:opacity-100" />
            <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-slate-950/75 shadow-xl backdrop-blur-xl p-5 flex items-center justify-between">
              <div>
                <p className="text-white/60 text-xs font-semibold uppercase tracking-wider">Total Approved Campgrounds</p>
                <p className="text-3xl font-bold text-white mt-1">{totalCampgrounds}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 border border-green-400/30 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 rounded-2xl border border-white/10 bg-white/5 opacity-80 blur-md transition-opacity group-hover:opacity-100" />
            <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-slate-950/75 shadow-xl backdrop-blur-xl p-5 flex items-center justify-between">
              <div>
                <p className="text-white/60 text-xs font-semibold uppercase tracking-wider">Avg Rating</p>
                <p className="text-3xl font-bold text-white mt-1">0.0</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/20 border border-yellow-400/30 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 rounded-3xl border border-white/10 bg-white/5 opacity-80 blur-lg" />
          <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-slate-950/75 shadow-2xl backdrop-blur-xl">
            <div className="border-b border-white/10 px-6 py-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3 w-full">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Search campgrounds..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                    />
                    <svg
                      className="w-4 h-4 text-white/40 absolute left-3.5 top-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>

                  <button
                    onClick={fetchCampgrounds}
                    className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                    title="Refresh List"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  </button>

                  <button
                    onClick={() => navigate("/user/createcg")}
                    className="px-4 py-2.5 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 rounded-xl font-medium transition-colors hover:bg-emerald-500/30 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Campground
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                </div>
              ) : filteredCampgrounds.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                  </div>
                  <p className="text-white/50 text-base">No campgrounds found matching your criteria.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCampgrounds.map((campground) => (
                    <div
                      key={campground.campgroundId}
                      className="relative group rounded-2xl border border-white/10 bg-slate-900/50 overflow-hidden hover:border-white/20 transition-all"
                    >
                      <div className="h-48 bg-slate-800 relative">
                        {campground.images?.[0] ? (
                          <img src={campground.images[0]} alt={campground.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg className="w-16 h-16 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        )}
                        <div className="absolute top-3 right-3">
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-300 border border-green-500/30">
                            APPROVED
                          </span>
                        </div>
                      </div>

                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-white mb-1">{campground.title}</h3>
                        <div className="flex items-center text-sm text-white/50 mb-3">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          {campground.type || "Unknown Type"}
                        </div>

                        <p className="text-sm text-white/60 mb-4 line-clamp-2">
                          {campground.description || "No description available"}
                        </p>

                        <div className="flex items-center justify-between pt-3 border-t border-white/10">
                          <span className="text-lg font-bold text-white">${campground.price || 0}/night</span>

                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setSelectedCampground(campground);
                                setShowModal(true);
                              }}
                              className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                            </button>

                            <button
                              onClick={() => handleDeleteCampground(campground.id)}
                              className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {filteredCampgrounds.length > 0 && (
              <div className="border-t border-white/10 px-6 py-4 flex items-center justify-between">
                <span className="text-sm text-white/50">
                  Showing <span className="text-white font-medium">{filteredCampgrounds.length}</span> of{" "}
                  <span className="text-white font-medium">{totalCampgrounds}</span> campgrounds
                </span>
              </div>
            )}
          </div>
        </div>
      </main>

      {showModal && selectedCampground && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="fixed inset-0 z-10 bg-black/50" onClick={() => setShowModal(false)} aria-hidden="true"></div>

          <div className="fixed inset-0 z-20 flex items-center justify-center p-4">
            <div className="relative bg-slate-800 border border-white/20 rounded-2xl text-left overflow-hidden shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Campground Details</h3>
                <button onClick={() => setShowModal(false)} className="text-white/40 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6 space-y-4">
                {selectedCampground.images?.[0] && (
                  <img
                    src={selectedCampground.images[0]}
                    alt={selectedCampground.title}
                    className="w-full h-64 object-cover rounded-xl"
                  />
                )}

                <div>
                  <h4 className="text-2xl font-bold text-white mb-2">{selectedCampground.title}</h4>
                  <div className="flex items-center gap-4 text-sm text-white/50 mb-4">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {selectedCampground.type || "Unknown Type"}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-300 border border-green-500/30">
                      APPROVED
                    </span>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4">
                  <h5 className="text-xs font-semibold text-white/40 uppercase mb-2">Description</h5>
                  <p className="text-white/70">{selectedCampground.description || "No description available"}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
                  <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                    <label className="block text-xs font-semibold text-white/40 uppercase mb-1">Price</label>
                    <p className="text-xl font-bold text-white">${selectedCampground.price}/night</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                    <label className="block text-xs font-semibold text-white/40 uppercase mb-1">Capacity</label>
                    <p className="text-xl font-bold text-white">{selectedCampground.capacity || 0} guests</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCampgrounds;
