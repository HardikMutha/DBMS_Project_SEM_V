import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { MapPin, Users, Tent, DollarSign, Share2, Heart, ArrowLeft, Star, Check, Navigation, Clock, Shield } from "lucide-react";
import { BACKEND_URL } from "../../config";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import useAuthContext from "../hooks/useAuthContext";

const ViewCampground = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [campground, setCampground] = useState(null);
  const [ownerInfo, setOwnerInfo] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const { state } = useAuthContext();

  const fetchCampgroundDetails = useCallback(async () => {
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
  }, [id, navigate]);

  useEffect(() => {
    fetchCampgroundDetails();
  }, [fetchCampgroundDetails]);

  const handleAddToFavorites = async () => {
    try {
      const token = state?.token;
      if (!token) {
        toast.error("Please sign in to save this campground");
        navigate("/login");
        return;
      }
      const response = await fetch(`${BACKEND_URL}/campground/favourites/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ campgroundId: id }),
      });

      const data = await response.json();
      console.log(data);
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
      const token = state?.token;
      if (!token) {
        toast.error("Please sign in to manage your favorites");
        navigate("/login");
        return;
      }
      const response = await fetch(`${BACKEND_URL}/campground/favourites/remove`, {
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

  const handleShareCampground = async () => {
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    const shareData = {
      title: campground?.title || "CampGrounds",
      text: `Check out ${campground?.title || "this campground"} on CampGrounds!`,
      url: shareUrl,
    };

    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share(shareData);
        return;
      }

      if (typeof navigator !== "undefined" && navigator.clipboard && shareUrl) {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied to clipboard");
        return;
      }

      throw new Error("Share not supported");
    } catch (error) {
      if (error?.name !== "AbortError") {
        toast.error("Unable to share this campground right now");
      }
    }
  };

  const calculateAverageRating = () => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const resolveImageUrl = (source) => {
    if (!source) return null;
    let raw = source;

    if (typeof source === "object") {
      raw = source?.imageUrl || source?.url || source?.src || source?.path || null;
    }

    if (!raw) return null;

    if (/^(https?:|data:)/i.test(raw)) {
      return raw;
    }

    const normalized = raw.startsWith("/") ? raw : `/${raw}`;
    return `${BACKEND_URL}${normalized}`;
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

  const images = campground?.images || [];
  const averageRating = calculateAverageRating();
  const heroImage = resolveImageUrl(images[selectedImage]);
  const thumbnailImages = images.map((image) => resolveImageUrl(image));
  const hasHeroImage = Boolean(heroImage);
  const displayRating = averageRating > 0 ? averageRating : "New";
  const hasReviews = reviews.length > 0;

  const quickFacts = [
    campground.place ? { label: "Location", value: campground.place, icon: MapPin } : null,
    campground.capacity ? { label: "Capacity", value: `${campground.capacity} guests`, icon: Users } : null,
    campground.type ? { label: "Type", value: campground.type, icon: Tent } : null,
    campground.price ? { label: "Price", value: `${campground.price}/night`, icon: DollarSign } : null,
  ].filter(Boolean);

  const isOwner = state?.user?.id && campground?.ownerId && Number(state.user.id) === Number(campground.ownerId);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar variant="solid" />

      <div className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <section className="relative">
            <div className="relative overflow-hidden rounded-3xl bg-slate-900 shadow-2xl">
              {hasHeroImage ? (
                <img src={heroImage} alt={campground.title} className="h-[420px] w-full object-cover" />
              ) : (
                <div className="flex h-[420px] w-full flex-col items-center justify-center bg-gradient-to-br from-cyan-500 via-[#164E63] to-slate-900 text-white">
                  <Tent className="h-20 w-20 mb-4" strokeWidth={1.5} />
                  <p className="text-xl font-semibold">Images coming soon</p>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-slate-950/75" />

              <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-10">
                <div className="flex items-start justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2.5 text-sm font-medium text-white backdrop-blur-md transition hover:bg-white/25"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back</span>
                  </button>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleShareCampground}
                      className="inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2.5 text-sm font-medium text-white backdrop-blur-md transition hover:bg-white/25"
                    >
                      <Share2 className="h-4 w-4" />
                      <span className="hidden sm:inline">Share</span>
                    </button>
                    <button
                      type="button"
                      onClick={isFavorite ? handleRemoveFromFavorites : handleAddToFavorites}
                      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium backdrop-blur-md transition ${
                        isFavorite ? "bg-red-500/90 text-white hover:bg-red-500" : "bg-white/15 text-white hover:bg-white/25"
                      }`}
                      title={isFavorite ? "Remove from favorites" : "Save to favorites"}
                    >
                      <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
                      <span className="hidden sm:inline">{isFavorite ? "Saved" : "Save"}</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">Campground</p>
                      <h1 className="mt-2 text-4xl font-semibold text-white md:text-5xl">{campground.title}</h1>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2.5 backdrop-blur-md">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-semibold text-white">{displayRating}</span>
                      <span className="text-sm text-white/70">{hasReviews ? `(${reviews.length})` : "(New)"}</span>
                    </div>
                  </div>

                  {quickFacts.length > 0 && (
                    <div className="flex flex-wrap gap-3">
                      {quickFacts.map((fact) => {
                        const Icon = fact.icon;
                        return (
                          <div
                            key={fact.label}
                            className="flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2.5 text-sm text-white backdrop-blur-md"
                          >
                            <Icon className="h-4 w-4" />
                            <span className="font-medium">{fact.value}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {thumbnailImages.length > 1 && (
            <div className="mt-5 flex gap-3 overflow-x-auto pb-1">
              {thumbnailImages.map((thumbnail, index) => (
                <button
                  key={images[index]?.imageId || index}
                  type="button"
                  onClick={() => setSelectedImage(index)}
                  className={`relative flex h-24 w-32 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
                    selectedImage === index
                      ? "border-[#164E63] ring-2 ring-cyan-300/50"
                      : "border-transparent hover:border-slate-300"
                  }`}
                >
                  {thumbnail ? (
                    <img src={thumbnail} alt={`Preview ${index + 1}`} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-slate-200 text-sm text-slate-500">
                      No preview
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr),380px]">
            <div className="space-y-8">
              <section className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-900/5 p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#164E63]/10">
                    <Navigation className="h-5 w-5 text-[#164E63]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">Overview</h2>
                    <p className="mt-1 text-sm text-slate-500">Essential details about this campground</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <p className="text-base leading-relaxed text-slate-600">
                    {campground.description ||
                      "This campsite is currently gathering more details. Check back soon for a full description or reach out to the host for specifics about amenities, nearby attractions, and seasonal highlights."}
                  </p>

                  {quickFacts.length > 0 && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {quickFacts.map((fact) => {
                        const Icon = fact.icon;
                        return (
                          <div
                            key={fact.label}
                            className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4"
                          >
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
                              <Icon className="h-4 w-4 text-[#164E63]" />
                            </div>
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{fact.label}</p>
                              <p className="mt-1 text-sm font-medium text-slate-800">{fact.value}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </section>

              {(campground.place || campground.latitude || campground.longitude) && (
                <section className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-900/5 p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#164E63]/10">
                      <MapPin className="h-5 w-5 text-[#164E63]" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-slate-900">Location & Access</h2>
                      <p className="mt-1 text-sm text-slate-500">Coordinates and navigation details</p>
                    </div>
                  </div>

                  <div className="space-y-5 text-sm text-slate-600">
                    <div className="grid gap-4 sm:grid-cols-2">
                      {campground.place && (
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Place</p>
                          <p className="mt-2 text-base font-medium text-slate-800">{campground.place}</p>
                        </div>
                      )}
                      {campground.latitude && (
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Latitude</p>
                          <p className="mt-2 text-base font-medium text-slate-800">{campground.latitude}</p>
                        </div>
                      )}
                      {campground.longitude && (
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Longitude</p>
                          <p className="mt-2 text-base font-medium text-slate-800">{campground.longitude}</p>
                        </div>
                      )}
                    </div>

                    <p className="leading-relaxed">
                      Use the coordinates above to pin the site in your preferred maps app. We recommend arriving before dusk to
                      settle in comfortably and review any on-site guidelines.
                    </p>
                  </div>
                </section>
              )}

              <section className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-900/5 p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#164E63]/10">
                    <Star className="h-5 w-5 text-[#164E63]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">Guest Reviews</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {hasReviews ? "Experiences shared by previous guests" : "Be the first to share your experience"}
                    </p>
                  </div>
                </div>

                <div>
                  {hasReviews ? (
                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <div
                          key={review.reviewId}
                          className="rounded-xl border border-slate-200 p-5 transition hover:border-slate-300"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-[#164E63] text-sm font-semibold text-white">
                                {(review.username || "Guest").charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-slate-900">{review.username || "Guest"}</p>
                                {review.createdAt && (
                                  <p className="text-xs text-slate-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-slate-300 fill-slate-300"
                                  }`}
                                />
                              ))}
                              <span className="ml-1 text-xs font-semibold text-slate-500">{review.rating}/5</span>
                            </div>
                          </div>
                          <p className="mt-4 text-sm leading-relaxed text-slate-600">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
                      <Star className="h-8 w-8 mx-auto mb-3 text-slate-400" />
                      <p className="font-medium">No reviews yet</p>
                      <p className="mt-2">Be the first to visit and share your experience!</p>
                    </div>
                  )}
                </div>
              </section>
            </div>

            <aside className="space-y-6 lg:sticky lg:top-28 h-fit">
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Starting at</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-semibold text-[#164E63]">${campground.price}</span>
                      <span className="text-sm text-slate-500">/ night</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                    <Shield className="h-3.5 w-3.5" />
                    Verified
                  </div>
                </div>

                {isOwner ? (
                  <button
                    type="button"
                    onClick={() => navigate(`/campground/${id}/manage`)}
                    className="mt-6 w-full rounded-xl border border-[#164E63] px-6 py-3.5 text-base font-semibold text-[#164E63] shadow-sm transition hover:bg-[#164E63]/10"
                  >
                    Manage this campground
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => navigate(`/campground/${id}/book`)}
                    className="mt-6 w-full rounded-xl bg-[#164E63] px-6 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-[#0E7490]"
                  >
                    Book this campsite
                  </button>
                )}

                <button
                  type="button"
                  onClick={isFavorite ? handleRemoveFromFavorites : handleAddToFavorites}
                  className="mt-3 w-full rounded-xl border border-slate-200 px-6 py-3 text-sm font-medium text-slate-600 transition hover:border-[#164E63] hover:text-[#164E63]"
                >
                  {isFavorite ? "Remove from saved" : "Save for later"}
                </button>

                <div className="mt-6 space-y-3 text-sm text-slate-600">
                  <div className="flex items-start gap-2.5">
                    <Check className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>Flexible cancellation up to 48 hours before check-in</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>Charged only after host confirmation</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>Secure payments and instant notifications</span>
                  </div>
                </div>
              </div>

              {ownerInfo && (
                <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-[#164E63] text-xl font-bold text-white">
                      {ownerInfo.username?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Hosted by {ownerInfo.username}</p>
                      <p className="text-xs text-slate-500">{ownerInfo.email}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-slate-600">
                    Your host is here to make your experience seamless. Reach out ahead of arrival for special requests or to
                    confirm check-in details.
                  </p>
                </div>
              )}

              <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-cyan-50 p-6 shadow-sm ring-1 ring-slate-900/5">
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="h-5 w-5 text-[#164E63]" />
                  <h3 className="text-sm font-semibold text-slate-900">Need assistance?</h3>
                </div>
                <p className="text-sm leading-relaxed text-slate-600">
                  Our support team is available 24/7 to help with route planning, weather updates, and trip preparation.
                </p>
                <Link
                  to="/campgrounds"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#164E63] hover:text-[#0E7490] transition"
                >
                  Explore more campgrounds
                  <span>→</span>
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCampground;
