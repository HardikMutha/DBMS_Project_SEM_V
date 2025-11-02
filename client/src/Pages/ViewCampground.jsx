import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { BACKEND_URL } from "../../config";
import toast from "react-hot-toast";

const ViewCampground = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [campground, setCampground] = useState(null);
  const [ownerInfo, setOwnerInfo] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    fetchCampgroundDetails();
  }, [id]);

  const fetchCampgroundDetails = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/campground/get-campground/${id}`);
      if (!response.ok) {
        toast.error("Failed to fetch campground details");
        navigate("/");
        return;
      }
      const data = await response.json();
      setCampground(data?.data?.campground);
      setOwnerInfo(data?.data?.ownerInfo);
      setReviews(data?.data?.allReviews || []);
    } catch (err) {
      toast.error("Error loading campground details");
      console.error(err);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToFavorites = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BACKEND_URL}/campground/favourites/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ campgroundId: id }),
      });

      const data = await response.json();
      if (response.ok) {
        setIsFavorite(true);
        toast.success("Added to favorites!");
      } else {
        toast.error(data.message || "Failed to add to favorites");
      }
    } catch (err) {
      toast.error("Error adding to favorites");
      console.error(err);
    }
  };

  const handleRemoveFromFavorites = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BACKEND_URL}/campground/favourites/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ campgroundId: id }),
      });

      const data = await response.json();
      if (response.ok) {
        setIsFavorite(false);
        toast.success("Removed from favorites!");
      } else {
        toast.error(data.message || "Failed to remove from favorites");
      }
    } catch (err) {
      toast.error("Error removing from favorites");
      console.error(err);
    }
  };

  const calculateAverageRating = () => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-[#164E63] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading campground details...</p>
        </div>
      </div>
    );
  }

  if (!campground) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-xl text-gray-600">Campground not found</p>
          <Link to="/" className="mt-4 inline-block text-[#164E63] hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const images = campground.images || [];
  const averageRating = calculateAverageRating();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-700 hover:text-[#164E63] transition-colors"
          >
            <span className="text-2xl">←</span>
            <span className="font-medium">Back</span>
          </button>
          <Link to="/" className="text-[#164E63] font-semibold hover:underline">
            Home
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          {images.length > 0 ? (
            <div>
              <div className="relative h-[500px] bg-gray-900">
                <img src={images[selectedImage]?.imageUrl} alt={campground.title} className="w-full h-full object-cover" />
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all"
                    >
                      ←
                    </button>
                    <button
                      onClick={() => setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all"
                    >
                      →
                    </button>
                  </>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 p-4 overflow-x-auto bg-gray-50">
                  {images.map((image, index) => (
                    <button
                      key={image.imageId}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index ? "border-[#164E63] scale-105" : "border-transparent"
                      }`}
                    >
                      <img src={image.imageUrl} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="h-[500px] flex items-center justify-center bg-gradient-to-br from-cyan-400 to-[#164E63] text-white">
              <div className="text-center">
                <div className="text-9xl mb-4">🏕️</div>
                <p className="text-2xl font-semibold">{campground.title}</p>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">{campground.title}</h1>
                  <div className="flex items-center gap-4 text-gray-600">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500 text-xl">⭐</span>
                      <span className="font-semibold text-lg">{averageRating}</span>
                      <span className="text-sm">({reviews.length} reviews)</span>
                    </div>
                    {campground.place && (
                      <div className="flex items-center gap-1">
                        <span className="text-[#164E63]">📍</span>
                        <span className="font-medium">{campground.place}</span>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={isFavorite ? handleRemoveFromFavorites : handleAddToFavorites}
                  className={`p-3 rounded-full transition-all ${
                    isFavorite
                      ? "bg-red-100 text-red-600 hover:bg-red-200"
                      : "bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-red-600"
                  }`}
                  title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill={isFavorite ? "currentColor" : "none"}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
              </div>

              <div className="border-t pt-4 mt-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">About this campground</h2>
                <p className="text-gray-700 leading-relaxed">{campground.description}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="text-3xl mb-2">👥</div>
                  <div className="text-sm text-gray-600">Capacity</div>
                  <div className="font-semibold text-gray-900">{campground.capacity} people</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="text-3xl mb-2">🏕️</div>
                  <div className="text-sm text-gray-600">Type</div>
                  <div className="font-semibold text-gray-900 capitalize">{campground.type}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="text-3xl mb-2">💰</div>
                  <div className="text-sm text-gray-600">Price per night</div>
                  <div className="font-semibold text-gray-900">${campground.price}</div>
                </div>
              </div>
            </div>

            {(campground.latitude || campground.longitude) && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Location</h2>
                <div className="space-y-2 text-gray-700">
                  {campground.place && (
                    <p className="flex items-center gap-2">
                      <span className="font-semibold">Place:</span>
                      <span>{campground.place}</span>
                    </p>
                  )}
                  {campground.latitude && (
                    <p className="flex items-center gap-2">
                      <span className="font-semibold">Latitude:</span>
                      <span>{campground.latitude}</span>
                    </p>
                  )}
                  {campground.longitude && (
                    <p className="flex items-center gap-2">
                      <span className="font-semibold">Longitude:</span>
                      <span>{campground.longitude}</span>
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews ({reviews.length})</h2>
              {reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.reviewId} className="border-b pb-6 last:border-b-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">{review.username || "Anonymous"}</p>
                          <div className="flex items-center gap-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={i < review.rating ? "text-yellow-500" : "text-gray-300"}>
                                ⭐
                              </span>
                            ))}
                          </div>
                        </div>
                        {review.createdAt && (
                          <span className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                        )}
                      </div>
                      <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <div className="border-b pb-4 mb-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-[#164E63]">${campground.price}</span>
                  <span className="text-gray-600">/ night</span>
                </div>
              </div>

              <button
                onClick={() => setShowBookingModal(true)}
                className="w-full py-4 bg-[#164E63] text-white rounded-xl font-semibold text-lg hover:bg-[#0E7490] transition-colors shadow-lg hover:shadow-xl"
              >
                Book Now
              </button>

              {ownerInfo && (
                <div className="mt-6 pt-6 border-t">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Hosted by</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-[#164E63] rounded-full flex items-center justify-center text-white text-xl font-bold">
                      {ownerInfo.username?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{ownerInfo.username}</p>
                      <p className="text-sm text-gray-600">{ownerInfo.email}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 pt-6 border-t space-y-3">
                <div className="flex items-center gap-3 text-gray-700">
                  <span className="text-2xl">✓</span>
                  <span>Free cancellation before 48 hours</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <span className="text-2xl">✓</span>
                  <span>Instant booking confirmation</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <span className="text-2xl">✓</span>
                  <span>24/7 customer support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showBookingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 relative">
            <button
              onClick={() => setShowBookingModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Book Your Stay</h2>
            <p className="text-gray-600 mb-6">Booking functionality will be available soon. Please check back later!</p>
            <button
              onClick={() => setShowBookingModal(false)}
              className="w-full py-3 bg-[#164E63] text-white rounded-xl font-semibold hover:bg-[#0E7490] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewCampground;
