import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { BACKEND_URL } from "../../config";
import toast from "react-hot-toast";
import useAuthContext from "../hooks/useAuthContext";

const BrowseCampgrounds = ({ searchQuery = "" }) => {
  const [campgrounds, setCampgrounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const { state } = useAuthContext();
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
    if (!state?.isAuthenticated) {
      // Store the current location to redirect back after login
      sessionStorage.setItem('redirectAfterLogin', `/campground/${campgroundId}`);
      toast.error("Please sign in to view campground details");
      navigate("/login");
    } else {
      navigate(`/campground/${campgroundId}`);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block w-12 h-12 border-4 border-[#164E63] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Loading campgrounds...</p>
      </div>
    );
  }

  return (
    <div className="py-8 px-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {searchQuery && (
          <div className="mb-6">
            <p className="text-gray-600 text-lg">
              Search results for: <span className="font-semibold text-gray-800">"{searchQuery}"</span>
            </p>
          </div>
        )}

        {filteredCampgrounds.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600">
              {searchQuery 
                ? `No campgrounds found matching "${searchQuery}".` 
                : "No campgrounds available at the moment."}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredCampgrounds.map((campground) => (
              <div
                key={campground.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row"
              >
                {/* Image Section */}
                <div className="md:w-1/3 h-64 md:h-auto relative">
                  {campground.imageUrl ? (
                    <img
                      src={campground.imageUrl}
                      alt={campground.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-400 to-[#164E63] text-white text-6xl">
                      🏕️
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="md:w-2/3 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-2xl font-bold text-gray-900">{campground.title}</h3>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-[#164E63]">${campground.price}</p>
                        <p className="text-sm text-gray-600">per night</p>
                      </div>
                    </div>

                    {campground.place && (
                      <p className="text-gray-600 text-sm mb-3 flex items-center gap-2">
                        <span className="text-[#164E63]">📍</span>
                        <span className="font-medium">{campground.place}</span>
                      </p>
                    )}

                    <div className="flex items-center gap-1 mb-3">
                      <span className="text-yellow-500">⭐</span>
                      <span className="text-sm font-semibold text-gray-700">4.5</span>
                      <span className="text-sm text-gray-600">(120 reviews)</span>
                    </div>

                    <p className="text-gray-700 text-sm mb-4 leading-relaxed line-clamp-3">
                      {campground.description || "Experience nature at its finest in this beautiful campground location."}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleViewDetails(campground.id)}
                      className="flex-1 px-6 py-3 bg-[#164E63] text-white rounded-lg text-center font-semibold hover:bg-[#0E7490] transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseCampgrounds;
