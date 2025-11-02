import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import useAuthContext from "../../hooks/useAuthContext";
import { BACKEND_URL } from "../../../config";
import Navbar from "../../components/Navbar";
import toast from "react-hot-toast";

const ManageCampgrounds = () => {
  const { state, dispatch } = useAuthContext();
  const navigate = useNavigate();
  const [campgrounds, setCampgrounds] = useState([]);
  const [activeTab, setActiveTab] = useState("all"); // all, pending, approved
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCampground, setSelectedCampground] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchCampgrounds();
  }, []);

  const fetchCampgrounds = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/admin/campgrounds`, {
        headers: {
          Authorization: `Bearer ${state.token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setCampgrounds(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching campgrounds:", error);
      toast.error("Failed to load campgrounds");
    }
  };

  const handleApproveCampground = async (campgroundId) => {
    try {
      const request = await fetch(`${BACKEND_URL}/admin/get-campground-request/${campgroundId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${state.token}`,
        },
      });
      const temp = await request.json();
      const requestId = temp.data[0].id;
      const res = await fetch(`${BACKEND_URL}/requests/approve-request/${requestId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${state?.token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Campground approved successfully");
        fetchCampgrounds();
      } else {
        toast.error(data.message || "Failed to approve campground");
      }
    } catch (error) {
      console.error("Error approving campground:", error);
      toast.error("Failed to approve campground");
    }
  };

  const handleRejectCampground = async (campgroundId) => {
    // to be implemented along with backend
  };

  const handleDeleteCampground = async (campgroundId) => {
    // to be implemented along with backend
  };

  const getFilteredCampgrounds = () => {
    let filtered = campgrounds;

    if (activeTab === "pending") {
      filtered = campgrounds.filter((cg) => !cg.isApproved);
    } else if (activeTab === "approved") {
      filtered = campgrounds.filter((cg) => cg.isApproved);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (cg) =>
          cg.title?.toLowerCase().includes(searchTerm.toLowerCase()) || cg.type?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredCampgrounds = getFilteredCampgrounds();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar variant="solid" />
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Total Campgrounds</p>
                <p className="text-3xl font-semibold text-gray-900 mt-2">{campgrounds.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Pending Approval</p>
                <p className="text-3xl font-semibold text-gray-900 mt-2">{campgrounds.filter((cg) => !cg.isApproved).length}</p>
              </div>
              <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Approved</p>
                <p className="text-3xl font-semibold text-gray-900 mt-2">{campgrounds.filter((cg) => cg.isApproved).length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Avg Rating</p>
                <p className="text-3xl font-semibold text-gray-900 mt-2">0.0</p>
              </div>
              <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === "all" ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  All Campgrounds
                </button>
                <button
                  onClick={() => setActiveTab("pending")}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === "pending" ? "bg-amber-50 text-amber-700" : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Pending ({campgrounds.filter((cg) => !cg.isApproved).length})
                </button>
                <button
                  onClick={() => setActiveTab("approved")}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === "approved" ? "bg-green-50 text-green-700" : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Approved ({campgrounds.filter((cg) => cg.isApproved).length})
                </button>
              </div>
            </div>

            <div className="px-6 pb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1 max-w-lg">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search campgrounds by name or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <svg
                    className="w-5 h-5 text-gray-400 absolute left-3 top-2.5"
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
              </div>

              <button
                onClick={() => navigate("/user/createcg")}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Campground
              </button>
            </div>
          </div>

          <div className="p-6">
            {filteredCampgrounds.length === 0 ? (
              <div className="text-center py-20">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                <p className="text-gray-500 text-lg mb-2">No campgrounds found</p>
                <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCampgrounds.map((campground) => (
                  <div
                    key={campground.campgroundId}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="h-48 bg-gray-200 relative">
                      {campground.imgUrl ? (
                        <img src={campground.imgUrl} alt={campground.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            campground.isApproved ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {campground.isApproved ? "APPROVED" : "PENDING"}
                        </span>
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{campground.title}</h3>
                      <div className="flex items-center text-sm text-gray-500 mb-3">
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

                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {campground.description || "No description available"}
                      </p>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                        <span className="text-lg font-bold text-gray-900">${campground.price || 0}/night</span>

                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedCampground(campground);
                              setShowModal(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
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

                          {!campground.isApproved && (
                            <>
                              <button
                                onClick={() => handleApproveCampground(campground.campgroundId)}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Approve"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleRejectCampground(campground.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Reject"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </>
                          )}

                          <button
                            onClick={() => handleDeleteCampground(campground.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
        </div>
      </div>

      {showModal && selectedCampground && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Campground Details</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-4">
              {selectedCampground.image_url && (
                <img
                  src={selectedCampground.image_url}
                  alt={selectedCampground.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              )}

              <div>
                <h4 className="text-2xl font-bold text-gray-900 mb-2">{selectedCampground.title}</h4>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
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
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      selectedCampground.isApproved ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {selectedCampground.isApproved ? "APPROVED" : "PENDING"}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h5 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Description</h5>
                <p className="text-gray-700">{selectedCampground.description || "No description available"}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-gray-200 pt-4">
                <div>
                  <h5 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Price</h5>
                  <p className="text-2xl font-bold text-gray-900">${selectedCampground.price}/night</p>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Capacity</h5>
                  <p className="text-2xl font-bold text-gray-900">{selectedCampground.capacity || 0} guests</p>
                </div>
              </div>

              {!selectedCampground.isApproved && (
                <div className="pt-4 border-t border-gray-200 flex gap-3">
                  <button
                    onClick={() => {
                      handleApproveCampground(selectedCampground.id);
                      setShowModal(false);
                    }}
                    className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Approve Campground
                  </button>
                  <button
                    onClick={() => {
                      handleRejectCampground(selectedCampground.id);
                      setShowModal(false);
                    }}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCampgrounds;
