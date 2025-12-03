import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router";
import { CalendarDays, ArrowLeft, Loader2, MapPin, Users, DollarSign, Shield, Check } from "lucide-react";
import Navbar from "../components/Navbar";
import useAuthContext from "../hooks/useAuthContext";
import { BACKEND_URL } from "../../config";
import toast from "react-hot-toast";

const formatDateForInput = (date) => {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return "";
  }
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const parseDateInput = (value) => {
  if (!value) {
    return null;
  }
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) {
    return null;
  }
  return new Date(year, month - 1, day);
};

const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const calculateNights = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) {
    return 0;
  }
  const start = parseDateInput(checkIn);
  const end = parseDateInput(checkOut);
  if (!start || !end) {
    return 0;
  }
  const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
  return diff > 0 ? diff : 0;
};

const formatCurrency = (value) => {
  const numericValue = Number.isFinite(value) ? value : 0;
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(numericValue);
};

const CampgroundBooking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useAuthContext();

  const [loading, setLoading] = useState(true);
  const [campground, setCampground] = useState(null);
  const [bookingForm, setBookingForm] = useState({ checkInDate: "", checkOutDate: "", guestCount: 1 });
  const [bookingError, setBookingError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAuthenticated = Boolean(state?.isAuthenticated);
  const userId = state?.user?.id ? Number(state.user.id) : null;

  const nightlyRate = useMemo(() => {
    return campground?.price ? Number(campground.price) : 0;
  }, [campground?.price]);

  const nights = useMemo(() => calculateNights(bookingForm.checkInDate, bookingForm.checkOutDate), [bookingForm]);
  const subtotal = useMemo(() => nights * nightlyRate, [nightlyRate, nights]);
  const tax = useMemo(() => subtotal * 0.18, [subtotal]);
  const total = useMemo(() => subtotal + tax, [subtotal, tax]);

  const minCheckInDate = useMemo(() => formatDateForInput(addDays(new Date(), 1)), []);
  const minCheckOutDate = useMemo(() => {
    const parsedCheckIn = parseDateInput(bookingForm.checkInDate);
    return formatDateForInput(addDays(parsedCheckIn || new Date(), 1));
  }, [bookingForm.checkInDate]);

  const isOwner = Boolean(userId && campground?.ownerId && Number(campground.ownerId) === userId);
  const canSubmitBooking = isAuthenticated && !isOwner && nights > 0 && !isSubmitting;

  useEffect(() => {
    const fetchCampground = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/campground/get-campground/${id}`);
        if (!response.ok) {
          throw new Error("Unable to load campground details");
        }
        const data = await response.json();
        if (!data?.data?.campground) {
          throw new Error("Campground not found");
        }
        setCampground(data.data.campground);
      } catch (error) {
        console.error(error);
        toast.error(error?.message || "Failed to load campground");
        navigate(`/campground/${id}`, { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchCampground();
  }, [id, navigate]);

  useEffect(() => {
    if (campground) {
      const today = new Date();
      const defaultCheckIn = formatDateForInput(addDays(today, 1));
      const defaultCheckOut = formatDateForInput(addDays(today, 2));
      setBookingForm({ checkInDate: defaultCheckIn, checkOutDate: defaultCheckOut, guestCount: 1 });
      setBookingError("");
    }
  }, [campground]);

  const handleDateChange = (field) => (event) => {
    const value = event.target.value;
    setBookingForm((prev) => {
      const nextState = { ...prev, [field]: value };
      if (field === "checkInDate" && value) {
        const newCheckIn = parseDateInput(value);
        const currentCheckout = parseDateInput(prev.checkOutDate);
        if (newCheckIn && currentCheckout && currentCheckout <= newCheckIn) {
          nextState.checkOutDate = formatDateForInput(addDays(newCheckIn, 1));
        }
      }
      return nextState;
    });
    setBookingError("");
  };

  const handleGuestCountChange = (event) => {
    const value = Math.max(1, Math.min(Number(event.target.value) || 1, campground?.capacity || 10));
    setBookingForm((prev) => ({ ...prev, guestCount: value }));
    setBookingError("");
  };

  const handleBookingSubmit = async (event) => {
    event.preventDefault();

    if (!isAuthenticated) {
      toast.error("Please sign in to complete your booking");
      navigate("/login", { state: { from: `/campground/${id}/book` } });
      return;
    }

    if (isOwner) {
      toast.error("You cannot book your own campground");
      return;
    }

    if (!bookingForm.checkInDate || !bookingForm.checkOutDate) {
      setBookingError("Select both check-in and check-out dates to continue.");
      return;
    }

    if (nights <= 0) {
      setBookingError("Check-out date must be at least one day after check-in.");
      return;
    }

    if (bookingForm.guestCount < 1) {
      setBookingError("At least 1 guest is required.");
      return;
    }

    if (campground?.capacity && bookingForm.guestCount > campground.capacity) {
      setBookingError(`Guest count cannot exceed the campground capacity of ${campground.capacity}.`);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please sign in to complete your booking");
      navigate("/login", { state: { from: `/campground/${id}/book` } });
      return;
    }

    setIsSubmitting(true);
    setBookingError("");

    try {
      const response = await fetch(`${BACKEND_URL}/booking/create-booking/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          checkInDate: bookingForm.checkInDate,
          checkOutDate: bookingForm.checkOutDate,
          amount: nightlyRate,
          guestCount: bookingForm.guestCount,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || "Unable to complete the booking. Please try again.");
      }

      toast.success(`Booking requested. Estimated total ${formatCurrency(total)}.`);
      navigate(`/campground/${id}`, { replace: true });
    } catch (error) {
      console.error(error);
      const message = error?.message || "Unable to complete the booking right now.";
      setBookingError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar variant="solid" />
        <div className="flex min-h-screen items-center justify-center px-6 pb-24 pt-32">
          <div className="flex flex-col items-center gap-4 text-slate-600">
            <Loader2 className="h-12 w-12 animate-spin text-[#164E63]" />
            <p className="text-sm font-medium">Preparing your booking experience...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!campground) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar variant="solid" />
        <div className="flex min-h-screen items-center justify-center px-6 pb-24 pt-32">
          <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-xl">
            <h2 className="text-xl font-semibold text-slate-900">Campground not found</h2>
            <p className="mt-3 text-sm text-slate-600">
              The campground you are trying to book may have been removed or is temporarily unavailable.
            </p>
            <Link
              to="/campgrounds"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#164E63] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0E7490]"
            >
              Browse other campgrounds
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const quickFacts = [
    campground.place ? { label: "Location", value: campground.place, icon: MapPin } : null,
    campground.capacity ? { label: "Capacity", value: `${campground.capacity} guests`, icon: Users } : null,
    campground.type ? { label: "Type", value: campground.type, icon: CalendarDays } : null,
    nightlyRate ? { label: "Nightly rate", value: formatCurrency(nightlyRate), icon: DollarSign } : null,
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar variant="solid" />

      <div className="mx-auto max-w-5xl px-6 pb-20 pt-28">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-[#164E63] hover:text-[#164E63]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr),360px]">
          <div className="space-y-8">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#164E63]/20 bg-[#164E63]/5 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-[#164E63]">
                Booking
              </span>
              <h1 className="mt-4 text-3xl font-semibold text-slate-900">Book {campground.title}</h1>
              <p className="mt-3 text-sm text-slate-600">
                Secure your stay by selecting your travel dates and submitting a booking request. We will notify you as soon as
                the host confirms.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
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
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
              <h2 className="text-xl font-semibold text-slate-900">Reservation details</h2>
              <p className="mt-2 text-sm text-slate-600">
                Choose your preferred check-in and check-out dates. We recommend arriving before dusk to get settled comfortably.
              </p>

              {isOwner ? (
                <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-700">
                  You are the owner of this campground. Manage your listing instead of creating a booking request.
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => navigate(`/campground/${id}/manage`)}
                      className="inline-flex items-center gap-2 rounded-xl border border-amber-300 bg-white px-4 py-2 text-sm font-semibold text-amber-700 transition hover:border-[#164E63] hover:text-[#164E63]"
                    >
                      Manage this campground
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate(`/campground/${id}`)}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-[#164E63] hover:text-[#164E63]"
                    >
                      View public listing
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="mt-6 space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="flex flex-col gap-2 text-sm font-medium text-slate-600">
                      <span>Check-in</span>
                      <input
                        type="date"
                        value={bookingForm.checkInDate}
                        min={minCheckInDate}
                        onChange={handleDateChange("checkInDate")}
                        className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 transition focus:border-[#164E63] focus:outline-none focus:ring-2 focus:ring-[#164E63]/20"
                      />
                    </label>
                    <label className="flex flex-col gap-2 text-sm font-medium text-slate-600">
                      <span>Check-out</span>
                      <input
                        type="date"
                        value={bookingForm.checkOutDate}
                        min={minCheckOutDate}
                        onChange={handleDateChange("checkOutDate")}
                        className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 transition focus:border-[#164E63] focus:outline-none focus:ring-2 focus:ring-[#164E63]/20"
                      />
                    </label>
                  </div>

                  <label className="flex flex-col gap-2 text-sm font-medium text-slate-600">
                    <span className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Number of Guests
                      {campground?.capacity && (
                        <span className="text-xs font-normal text-slate-400">(Max: {campground.capacity})</span>
                      )}
                    </span>
                    <input
                      type="number"
                      value={bookingForm.guestCount}
                      min={1}
                      max={campground?.capacity || 10}
                      onChange={handleGuestCountChange}
                      className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 transition focus:border-[#164E63] focus:outline-none focus:ring-2 focus:ring-[#164E63]/20"
                      placeholder="Enter number of guests"
                    />
                  </label>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    {nights > 0 ? (
                      <div className="space-y-3 text-sm text-slate-600">
                        <div className="flex items-center justify-between">
                          <span>Stay duration</span>
                          <span className="font-semibold text-slate-900">{nights === 1 ? "1 night" : `${nights} nights`}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Guests</span>
                          <span className="font-medium text-slate-900">
                            {bookingForm.guestCount} {bookingForm.guestCount === 1 ? "guest" : "guests"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Nightly rate</span>
                          <span className="font-medium text-slate-900">{formatCurrency(nightlyRate)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Subtotal</span>
                          <span className="font-medium text-slate-900">{formatCurrency(subtotal)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Tax (18%)</span>
                          <span className="font-medium text-slate-900">{formatCurrency(tax)}</span>
                        </div>
                        <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-base font-semibold text-slate-900">
                          <span>Total due</span>
                          <span>{formatCurrency(total)}</span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500">Select valid travel dates to review the estimated cost.</p>
                    )}
                  </div>

                  {bookingError && (
                    <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                      {bookingError}
                    </div>
                  )}

                  {!isAuthenticated && (
                    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-500">
                      Sign in to submit your booking request and receive updates from the host.
                    </div>
                  )}

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Link
                      to={`/campground/${id}`}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-6 py-3 text-sm font-medium text-slate-600 transition hover:border-[#164E63] hover:text-[#164E63]"
                    >
                      View listing
                    </Link>
                    <button
                      type="submit"
                      disabled={!canSubmitBooking}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#164E63] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0E7490] disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                      {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
                      {isSubmitting
                        ? "Processing"
                        : nights > 0
                        ? `Confirm booking (${formatCurrency(total)})`
                        : "Confirm booking"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#164E63]/10">
                  <Shield className="h-5 w-5 text-[#164E63]" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Secure request</h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Your booking request is sent to the host and only charged once confirmed. You can cancel for free within 48
                    hours before check-in.
                  </p>
                </div>
              </div>
              <div className="mt-5 space-y-3 text-sm text-slate-600">
                <div className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 text-emerald-600" />
                  <span>Receive real-time notifications on approval status.</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 text-emerald-600" />
                  <span>Dedicated support for itinerary planning and weather updates.</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 text-emerald-600" />
                  <span>Flexible payment—charged only after confirmation.</span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 via-cyan-50 to-white p-6 shadow-xl">
              <h3 className="text-sm font-semibold text-slate-900">Need assistance?</h3>
              <p className="mt-2 text-sm text-slate-600">
                Our concierge can help with transport arrangements, equipment rentals, and special requests before your stay.
              </p>
              <Link
                to="/campgrounds"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#164E63] transition hover:text-[#0E7490]"
              >
                Explore more campgrounds
                <span>→</span>
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CampgroundBooking;
