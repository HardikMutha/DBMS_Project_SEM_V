import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router";
import {
  ArrowLeft,
  ClipboardList,
  CalendarDays,
  Users,
  MapPin,
  DollarSign,
  Sparkles,
  Shield,
  Loader2,
  TrendingUp,
  CalendarClock,
  UserCheck,
  Clock3,
} from "lucide-react";
import Navbar from "../components/Navbar";
import useAuthContext from "../hooks/useAuthContext";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../../config";

const ManageCampground = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useAuthContext();

  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [saving, setSaving] = useState(false);
  const [updateMessage, setUpdateMessage] = useState(null);
  const [formValues, setFormValues] = useState({
    title: "",
    description: "",
    capacity: "",
    type: "",
    price: "",
    place: "",
    latitude: "",
    longitude: "",
  });

  const userId = state?.user?.id ? Number(state.user.id) : null;
  const isAuthenticated = Boolean(state?.isAuthenticated);
  const authLoading = Boolean(state?.isLoading);
  const token = state?.token || localStorage.getItem("token") || null;

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        if (!token) {
          throw new Error("Please sign in to manage this campground");
        }
        const response = await fetch(`${BACKEND_URL}/booking/campground/${id}/analytics`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          toast.error("Please sign in to manage this campground");
          navigate(`/login`, { replace: true });
          return;
        }

        if (response.status === 403) {
          toast.error("You do not have access to this campground");
          navigate(`/campground/${id}`, { replace: true });
          return;
        }

        if (!response.ok) {
          throw new Error("Unable to load campground analytics");
        }

        const data = await response.json();
        setAnalytics(data?.data || null);
      } catch (error) {
        console.error(error);
        toast.error(error?.message || "Failed to load analytics");
        navigate(`/campground/${id}`, { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [id, navigate, token]);

  const campground = analytics?.campground;

  useEffect(() => {
    if (!loading && !authLoading && campground) {
      const ownerId = campground?.ownerId ? Number(campground.ownerId) : null;
      if (!isAuthenticated || !userId || ownerId !== userId) {
        toast.error("You do not have permission to manage this campground");
        navigate(`/campground/${id}`, { replace: true });
      } else {
        setFormValues({
          title: campground.title || "",
          description: campground.description || "",
          capacity: campground.capacity || "",
          type: campground.type || "",
          price: campground.price || "",
          place: campground.place || "",
          latitude: campground.latitude ?? "",
          longitude: campground.longitude ?? "",
        });
      }
    }
  }, [authLoading, campground, id, isAuthenticated, loading, navigate, userId]);

  const stats = analytics?.stats;

  const quickFacts = useMemo(() => {
    if (!campground) return [];
    const facts = [
      campground.place ? { label: "Location", value: campground.place, icon: MapPin } : null,
      campground.capacity ? { label: "Capacity", value: `${campground.capacity} guests`, icon: Users } : null,
      campground.type ? { label: "Category", value: campground.type, icon: CalendarDays } : null,
      campground.price ? { label: "Nightly rate", value: formatCurrency(campground.price), icon: DollarSign } : null,
    ];
    return facts.filter(Boolean);
  }, [campground]);

  const ongoingBookings = analytics?.bookings?.ongoing || [];
  const upcomingBookings = analytics?.bookings?.upcoming || [];
  const completedBookings = analytics?.bookings?.completed || [];

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    setUpdateMessage(null);
  };

  const handleUpdateCampground = async (event) => {
    event.preventDefault();
    if (!token) {
      toast.error("Please sign in first");
      return;
    }

    setSaving(true);
    setUpdateMessage(null);

    try {
      const payload = {
        ...formValues,
        capacity: formValues.capacity ? Number(formValues.capacity) : null,
        price: formValues.price ? Number(formValues.price) : null,
        latitude: formValues.latitude === "" || formValues.latitude === null ? null : Number(formValues.latitude),
        longitude: formValues.longitude === "" || formValues.longitude === null ? null : Number(formValues.longitude),
      };

      const response = await fetch(`${BACKEND_URL}/campground/update-campground/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to update campground");
      }

      toast.success("Campground updated successfully");
      setUpdateMessage("Changes saved successfully");

      if (data?.data?.campground) {
        setAnalytics((prev) =>
          prev
            ? {
                ...prev,
                campground: {
                  ...prev.campground,
                  ...data.data.campground,
                },
              }
            : prev
        );
        setFormValues({
          title: data.data.campground.title || "",
          description: data.data.campground.description || "",
          capacity: data.data.campground.capacity || "",
          type: data.data.campground.type || "",
          price: data.data.campground.price || "",
          place: data.data.campground.place || "",
          latitude: data.data.campground.latitude ?? "",
          longitude: data.data.campground.longitude ?? "",
        });
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.message || "Update failed");
      setUpdateMessage(error?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar variant="solid" />
        <div className="flex min-h-screen items-center justify-center px-6 pb-24 pt-32">
          <div className="flex flex-col items-center gap-4 text-slate-600">
            <Loader2 className="h-12 w-12 animate-spin text-[#164E63]" />
            <p className="text-sm font-medium">Gathering your campground information...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!campground) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar variant="solid" />

      <div className="mx-auto max-w-6xl px-6 pb-20 pt-28">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-[#164E63] hover:text-[#164E63]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="space-y-10">
          <header className="overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-cyan-50 p-10 shadow-xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#164E63]/20 bg-[#164E63]/5 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-[#164E63]">
              Management
            </span>
            <h1 className="mt-4 text-3xl font-semibold text-slate-900">Manage {campground.title}</h1>
            <p className="mt-3 text-sm text-slate-600">
              Monitor booking activity, update essential details, and keep your listing in top shape for upcoming guests.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard
                icon={TrendingUp}
                label="Total revenue"
                value={`$ ${stats?.revenueTotal}`}
                accent="from-emerald-400/60 to-emerald-500/40"
              />
              <StatCard
                icon={CalendarClock}
                label="Upcoming bookings"
                value={stats?.upcomingBookings || 0}
                description={`${ongoingBookings.length} ongoing`}
                accent="from-sky-400/60 to-sky-500/40"
              />
              <StatCard
                icon={UserCheck}
                label="Guest satisfaction"
                value={stats?.averageRating ? `${stats.averageRating} / 5` : "No reviews"}
                description={`${stats?.totalReviewCount || 0} reviews`}
                accent="from-amber-400/60 to-amber-500/40"
              />
              <StatCard
                icon={Clock3}
                label="Average stay"
                value={stats?.averageStayLength ? `${stats.averageStayLength} nights` : "--"}
                description={stats?.utilizationRate ? `${stats.utilizationRate}% occupancy` : ""}
                accent="from-violet-400/60 to-violet-500/40"
              />
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {quickFacts.map((fact) => {
                const Icon = fact.icon;
                return (
                  <div key={fact.label} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white">
                      <Icon className="h-5 w-5 text-[#164E63]" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{fact.label}</p>
                      <p className="mt-1 text-sm font-medium text-slate-800">{fact.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </header>

          <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr),340px]">
            <div className="space-y-8">
              <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#164E63]/10">
                      <ClipboardList className="h-6 w-6 text-[#164E63]" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-slate-900">Booking pipeline</h2>
                      <p className="mt-2 text-sm text-slate-600">
                        Track ongoing stays, prepare for upcoming arrivals, and review past performance at a glance.
                      </p>
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <MiniMetric label="Ongoing" value={ongoingBookings.length} tone="emerald" />
                    <MiniMetric label="Upcoming" value={upcomingBookings.length} tone="sky" />
                    <MiniMetric label="Completed" value={completedBookings.length} tone="slate" />
                  </div>
                </div>

                <div className="mt-8 grid gap-6 lg:grid-cols-2">
                  <BookingPanel title="Ongoing stays" bookings={ongoingBookings} emptyLabel="No active stays right now" />
                  <BookingPanel title="Upcoming arrivals" bookings={upcomingBookings} emptyLabel="No arrivals scheduled" />
                </div>

                <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200">
                  <div className="bg-slate-50 px-6 py-4">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Recently completed stays</h3>
                  </div>
                  <div className="divide-y divide-slate-100 bg-white">
                    {completedBookings.length === 0 && (
                      <p className="px-6 py-4 text-sm text-slate-500">No completed bookings to show yet.</p>
                    )}
                    {completedBookings.slice(-5).map((booking) => (
                      <div key={booking.bookingId} className="flex flex-wrap items-center justify-between gap-4 px-6 py-4">
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{booking.username}</p>
                          <p className="text-xs text-slate-500">
                            {formatDate(booking.checkInDate)} → {formatDate(booking.checkOutDate)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs uppercase tracking-wide text-slate-400">Amount</span>
                          <span className="text-sm font-medium text-slate-800">{formatCurrency(booking.amount)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>

            <aside className="space-y-6">
              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
                <h3 className="text-sm font-semibold text-slate-900">Update listing details</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Keep your description, pricing, and location accurate to attract the right guests.
                </p>

                <form onSubmit={handleUpdateCampground} className="mt-6 space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formValues.title}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 shadow-inner focus:border-[#164E63] focus:outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Description</label>
                    <textarea
                      name="description"
                      value={formValues.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 shadow-inner focus:border-[#164E63] focus:outline-none"
                      placeholder="Highlight unique experiences, amenities, and nearby attractions"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Capacity</label>
                      <input
                        type="number"
                        min={1}
                        name="capacity"
                        value={formValues.capacity}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 shadow-inner focus:border-[#164E63] focus:outline-none"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Nightly price</label>
                      <input
                        type="number"
                        min={0}
                        step="0.01"
                        name="price"
                        value={formValues.price}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 shadow-inner focus:border-[#164E63] focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Category</label>
                    <input
                      type="text"
                      name="type"
                      value={formValues.type}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 shadow-inner focus:border-[#164E63] focus:outline-none"
                      placeholder="Tent camping, glamping, RV site..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Location label</label>
                    <input
                      type="text"
                      name="place"
                      value={formValues.place}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 shadow-inner focus:border-[#164E63] focus:outline-none"
                      placeholder="e.g., Misty Hills, Manali"
                    />
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500">
                    Coordinates are set during onboarding. Contact support if you need to adjust latitude or longitude.
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <div>
                        <p className="font-semibold text-slate-600">Latitude</p>
                        <p className="text-sm text-slate-700">{formValues.latitude || "Not set"}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-600">Longitude</p>
                        <p className="text-sm text-slate-700">{formValues.longitude || "Not set"}</p>
                      </div>
                    </div>
                  </div>

                  {updateMessage && (
                    <p className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500">
                      {updateMessage}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-[#164E63] px-4 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-[#0E7490] disabled:cursor-not-allowed disabled:opacity-70"
                    disabled={saving}
                  >
                    {saving ? "Saving changes..." : "Save changes"}
                  </button>
                </form>
              </section>

              <section className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 via-cyan-50 to-white p-6 shadow-xl">
                <h3 className="text-sm font-semibold text-slate-900">Quick actions</h3>
                <div className="mt-4 grid gap-3">
                  <Link
                    to={`/campground/${id}`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-[#164E63] hover:text-[#164E63]"
                  >
                    View public listing
                  </Link>
                  <Link
                    to={`/campground/${id}/book`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-[#164E63] hover:text-[#164E63]"
                  >
                    Preview booking flow
                  </Link>
                  <Link
                    to="/user/dashboard"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-[#164E63] hover:text-[#164E63]"
                  >
                    Open owner dashboard
                  </Link>
                </div>

                <div className="mt-6 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-500">
                  Tip: keep coordinates aligned with the public map shown on the listing page so guests arrive without hassle.
                </div>
              </section>
            </aside>
          </section>
        </div>
      </div>
    </div>
  );
};

const formatCurrency = (value) => {
  return value;
};

const formatDate = (dateString) => {
  if (!dateString) return "--";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "--";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
};

const StatCard = ({ icon: Icon, label, value, description, accent }) => (
  <div className="relative overflow-hidden rounded-2xl border border-white/40 bg-white/80 p-5 shadow-xl">
    <div className={`absolute inset-0 bg-gradient-to-br ${accent || "from-cyan-400/70 to-sky-400/60"} opacity-20`} />
    <div className="relative flex items-center gap-4">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/80 shadow-inner">
        <Icon className="h-5 w-5 text-[#164E63]" />
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
        <p className="text-lg font-semibold text-slate-900">{value}</p>
        {description ? <p className="text-xs text-slate-500">{description}</p> : null}
      </div>
    </div>
  </div>
);

const MiniMetric = ({ label, value, tone = "emerald" }) => (
  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
    <p
      className={`mt-2 text-lg font-semibold ${
        tone === "emerald" ? "text-emerald-600" : tone === "sky" ? "text-sky-600" : "text-slate-600"
      }`}
    >
      {value}
    </p>
  </div>
);

const BookingPanel = ({ title, bookings, emptyLabel }) => (
  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{title}</h3>
    <div className="mt-4 space-y-4">
      {bookings.length === 0 && <p className="text-sm text-slate-500">{emptyLabel}</p>}
      {bookings.map((booking) => (
        <div key={booking.bookingId} className="rounded-xl border border-white bg-white px-4 py-3 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-800">{booking.username || "Guest"}</p>
            <span className="text-xs font-medium text-slate-500">
              {formatDateRange(booking.checkInDate, booking.checkOutDate)}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
            <span>{booking.email || "--"}</span>
            <span>{formatCurrency(booking.amount)}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const formatDateRange = (checkIn, checkOut) => {
  const toLabel = (value) => {
    if (!value) return "--";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "--";
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  };
  return `${toLabel(checkIn)} → ${toLabel(checkOut)}`;
};

export default ManageCampground;
