import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import useAuthContext from "../hooks/useAuthContext";
import { BACKEND_URL } from "../../config";
import toast from "react-hot-toast";
import campingBg from "/assets/camping-bg.jpg";
import Navbar from "../components/Navbar";

const UserDashboard = () => {
  const { state, dispatch } = useAuthContext();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/booking/user-bookings`, {
        headers: {
          Authorization: `Bearer ${state.token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setBookings(data.data || []);
      } else {
        toast.error(data.message || "Failed to load bookings");
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to load bookings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      const response = await fetch(`${BACKEND_URL}/booking/cancel/${bookingId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${state.token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Booking cancelled successfully");
        fetchBookings();
      } else {
        toast.error(data.message || "Failed to cancel booking");
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error("Failed to cancel booking");
    }
  };

  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "bg-emerald-500/10 text-emerald-300 border-emerald-500/30";
      case "pending":
        return "bg-amber-500/10 text-amber-300 border-amber-500/30";
      case "cancelled":
        return "bg-red-500/10 text-red-300 border-red-500/30";
      case "completed":
        return "bg-blue-500/10 text-blue-300 border-blue-500/30";
      default:
        return "bg-slate-500/10 text-slate-300 border-slate-500/30";
    }
  };

  const currentBookings = bookings.filter((b) => b.status === "pending" || b.status === "confirmed");
  const bookingHistory = bookings.filter((b) => b.status === "completed" || b.status === "cancelled");

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch({ type: "LOGOUT" });
    navigate("/login");
  };

  return (
    <>
      <Navbar variant="transparent" />
      <div
        className="relative min-h-screen overflow-hidden bg-slate-950 py-10"
        style={{
          background: `url('${campingBg}') center/cover no-repeat fixed`,
        }}
      >
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />
        <div className="pointer-events-none absolute -top-48 left-10 h-96 w-96 rounded-full bg-emerald-400/25 blur-3xl" />
        <div className="pointer-events-none absolute bottom-[-160px] right-[-40px] h-[420px] w-[420px] rounded-full bg-cyan-500/25 blur-3xl" />

        <div className="relative z-10 min-h-screen px-6 py-16">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-white/70 mb-4">
                    Your Space
                  </span>
                  <h1 className="text-4xl sm:text-5xl font-semibold text-white">User Dashboard</h1>
                  <p className="mt-3 text-base text-white/80">Manage your camping adventures and explore new destinations.</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-6 py-3 rounded-2xl border border-white/15 bg-white/5 text-white text-sm font-semibold hover:border-white/25 hover:bg-white/10 transition-all shadow-lg"
                >
                  Logout
                </button>
              </div>
            </div>

            <div className="relative mb-12">
              <div className="absolute inset-0 rounded-3xl border border-white/10 bg-white/5 opacity-80 blur-lg" />
              <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-slate-950/75 shadow-2xl backdrop-blur-xl">
                <div className="pointer-events-none absolute inset-x-10 -top-32 h-64 rounded-full bg-gradient-to-br from-cyan-400/40 via-emerald-400/30 to-transparent blur-3xl" />
                <div className="relative px-8 py-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/30 bg-gradient-to-br from-cyan-400 to-emerald-400 text-2xl font-bold text-slate-900">
                      {state.user?.username?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold text-white">Welcome back, {state.user?.username}!</h3>
                      <p className="text-sm text-white/60 mt-1">Ready for your next adventure?</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/60 mb-2">Email</p>
                      <p className="text-white font-medium">{state.user?.email}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/60 mb-2">Account Type</p>
                      <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/60 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-white shadow-lg shadow-cyan-500/20">
                        USER
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-semibold text-white mb-2">Quick Actions</h2>
              <p className="text-white/70 mb-8">Everything you need at your fingertips</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Link to="/" state={{ openBrowse: true }} className="relative group cursor-pointer">
                  <div className="absolute inset-0 rounded-3xl border border-white/10 bg-white/5 opacity-80 blur-lg group-hover:opacity-100 transition-opacity" />
                  <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-slate-950/75 shadow-xl backdrop-blur-xl hover:border-cyan-400/50 transition-all p-6">
                    <div className="text-4xl mb-4">🏕️</div>
                    <h3 className="text-lg font-semibold text-white mb-2">Browse Campgrounds</h3>
                    <p className="text-sm text-white/70">Explore available camping locations</p>
                  </div>
                </Link>

                <Link to="/" className="relative group cursor-pointer">
                  <div className="absolute inset-0 rounded-3xl border border-white/10 bg-white/5 opacity-80 blur-lg group-hover:opacity-100 transition-opacity" />
                  <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-slate-950/75 shadow-xl backdrop-blur-xl hover:border-emerald-400/50 transition-all p-6">
                    <div className="text-4xl mb-4">🏠</div>
                    <h3 className="text-lg font-semibold text-white mb-2">Home</h3>
                    <p className="text-sm text-white/70">Return to homepage</p>
                  </div>
                </Link>

                <div className="relative group cursor-pointer">
                  <div className="absolute inset-0 rounded-3xl border border-white/10 bg-white/5 opacity-80 blur-lg group-hover:opacity-100 transition-opacity" />
                  <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-slate-950/75 shadow-xl backdrop-blur-xl hover:border-cyan-400/50 transition-all p-6">
                    <div className="text-4xl mb-4">⭐</div>
                    <h3 className="text-lg font-semibold text-white mb-2">Write Reviews</h3>
                    <p className="text-sm text-white/70">Share your camping experiences</p>
                  </div>
                </div>

                <Link to="/profile" className="relative group cursor-pointer">
                  <div className="absolute inset-0 rounded-3xl border border-white/10 bg-white/5 opacity-80 blur-lg group-hover:opacity-100 transition-opacity" />
                  <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-slate-950/75 shadow-xl backdrop-blur-xl hover:border-emerald-400/50 transition-all p-6">
                    <div className="text-4xl mb-4">⚙️</div>
                    <h3 className="text-lg font-semibold text-white mb-2">Profile Settings</h3>
                    <p className="text-sm text-white/70">Update your account information</p>
                  </div>
                </Link>
              </div>
            </div>

            <div className="mt-16">
              <h2 className="text-3xl font-semibold text-white mb-2">My Bookings</h2>
              <p className="text-white/70 mb-8">Track your camping adventures</p>

              {/* Current Bookings Section */}
              <div className="mb-12">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
                  Current Bookings
                </h3>
                <div className="relative">
                  <div className="absolute inset-0 rounded-3xl border border-white/10 bg-white/5 opacity-80 blur-lg" />
                  <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-slate-950/75 shadow-2xl backdrop-blur-xl">
                    {isLoading ? (
                      <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                      </div>
                    ) : currentBookings.length === 0 ? (
                      <div className="relative p-12 text-center">
                        <div className="text-5xl mb-4 opacity-50">📅</div>
                        <p className="text-white/70">No active bookings at the moment</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-left">
                          <thead className="bg-white/5 border-b border-white/5 text-xs uppercase text-white/50 font-semibold tracking-wider">
                            <tr>
                              <th className="px-6 py-4">Booking</th>
                              <th className="px-6 py-4">Campground</th>
                              <th className="px-6 py-4">Dates</th>
                              <th className="px-6 py-4">Guests</th>
                              <th className="px-6 py-4">Total</th>
                              <th className="px-6 py-4">Status</th>
                              <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {currentBookings.map((booking) => (
                              <tr key={booking.booking_id} className="hover:bg-white/5 transition-colors group">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-white">#{booking.booking_id}</div>
                                  <div className="text-xs text-white/50">
                                    {booking.created_at ? new Date(booking.created_at).toLocaleDateString() : "N/A"}
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="text-sm font-medium text-white">{booking.campground_name || "Unknown"}</div>
                                  <div className="text-xs text-white/50">{booking.campground_location || ""}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">
                                  <div>
                                    {booking.check_in_date ? new Date(booking.check_in_date).toLocaleDateString() : "N/A"}{" "}
                                    <span className="text-white/40">to</span>{" "}
                                    {booking.check_out_date ? new Date(booking.check_out_date).toLocaleDateString() : "N/A"}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">
                                  {booking.number_of_guests || booking.number_of_guests === 0 ? booking.number_of_guests : "N/A"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-semibold text-white">
                                    ${parseFloat(booking.total_price || 0).toFixed(2)}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span
                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyles(
                                      booking.status,
                                    )}`}
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                    {booking.status?.toUpperCase() || "UNKNOWN"}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <div className="flex items-center justify-end gap-3">
                                    <button
                                      onClick={() => {
                                        setSelectedBooking(booking);
                                        setShowModal(true);
                                      }}
                                      className="text-blue-400 hover:text-blue-300 p-2 hover:bg-blue-500/20 rounded-lg transition-colors"
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
                                    {booking.status !== "cancelled" && (
                                      <button
                                        onClick={() => handleCancelBooking(booking.booking_id)}
                                        className="text-red-400 hover:text-red-300 p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                                        title="Cancel Booking"
                                      >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Booking History Section */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Booking History</h3>
                <div className="relative">
                  <div className="absolute inset-0 rounded-3xl border border-white/10 bg-white/5 opacity-80 blur-lg" />
                  <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-slate-950/75 shadow-2xl backdrop-blur-xl">
                    {isLoading ? (
                      <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                      </div>
                    ) : bookingHistory.length === 0 ? (
                      <div className="relative p-12 text-center">
                        <div className="text-6xl mb-6 opacity-50">🏕️</div>
                        <p className="text-xl text-white/90 mb-3 font-semibold">No booking history yet</p>
                        <p className="text-white/60 mb-8 max-w-md mx-auto">
                          Start your camping journey by booking your first adventure!
                        </p>
                        <Link
                          to="/"
                          state={{ openBrowse: true }}
                          className="inline-block px-8 py-3.5 rounded-2xl border border-white/15 bg-white/5 text-white text-sm font-semibold hover:border-cyan-400/50 hover:bg-white/10 transition-all shadow-lg"
                        >
                          Browse Campgrounds
                        </Link>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-left">
                          <thead className="bg-white/5 border-b border-white/5 text-xs uppercase text-white/50 font-semibold tracking-wider">
                            <tr>
                              <th className="px-6 py-4">Booking</th>
                              <th className="px-6 py-4">Campground</th>
                              <th className="px-6 py-4">Dates</th>
                              <th className="px-6 py-4">Guests</th>
                              <th className="px-6 py-4">Total</th>
                              <th className="px-6 py-4">Status</th>
                              <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {bookingHistory.map((booking) => (
                              <tr key={booking.booking_id} className="hover:bg-white/5 transition-colors group">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-white">#{booking.booking_id}</div>
                                  <div className="text-xs text-white/50">
                                    {booking.created_at ? new Date(booking.created_at).toLocaleDateString() : "N/A"}
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="text-sm font-medium text-white">{booking.campground_name || "Unknown"}</div>
                                  <div className="text-xs text-white/50">{booking.campground_location || ""}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">
                                  <div>
                                    {booking.check_in_date ? new Date(booking.check_in_date).toLocaleDateString() : "N/A"}{" "}
                                    <span className="text-white/40">to</span>{" "}
                                    {booking.check_out_date ? new Date(booking.check_out_date).toLocaleDateString() : "N/A"}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">
                                  {booking.number_of_guests || booking.number_of_guests === 0 ? booking.number_of_guests : "N/A"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-semibold text-white">
                                    ${parseFloat(booking.total_price || 0).toFixed(2)}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span
                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyles(
                                      booking.status,
                                    )}`}
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                    {booking.status?.toUpperCase() || "UNKNOWN"}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <button
                                    onClick={() => {
                                      setSelectedBooking(booking);
                                      setShowModal(true);
                                    }}
                                    className="text-blue-400 hover:text-blue-300 p-2 hover:bg-blue-500/20 rounded-lg transition-colors"
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
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Details Modal */}
      {showModal && selectedBooking && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="fixed inset-0 z-10 bg-black/50" onClick={() => setShowModal(false)} aria-hidden="true"></div>

          <div className="fixed inset-0 z-20 flex items-center justify-center p-4">
            <div className="relative bg-slate-800 border border-white/20 rounded-2xl text-left overflow-hidden shadow-2xl w-full max-w-md">
              <div className="px-6 py-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg leading-6 font-medium text-white" id="modal-title">
                    Booking Details
                  </h3>
                  <button onClick={() => setShowModal(false)} className="text-white/40 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="h-16 w-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    #{selectedBooking.booking_id}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white">{selectedBooking.campground_name}</h4>
                    <p className="text-white/50 text-sm">{selectedBooking.campground_location || "Location not available"}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                      <label className="block text-xs font-semibold text-white/40 uppercase mb-1">Status</label>
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border ${getStatusStyles(
                          selectedBooking.status,
                        )}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {selectedBooking.status?.toUpperCase() || "UNKNOWN"}
                      </span>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                      <label className="block text-xs font-semibold text-white/40 uppercase mb-1">Booking ID</label>
                      <p className="text-sm font-medium text-white font-mono">#{selectedBooking.booking_id}</p>
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                    <label className="block text-xs font-semibold text-white/40 uppercase mb-1">Check-in Date</label>
                    <p className="text-sm font-medium text-white">
                      {selectedBooking.check_in_date ? new Date(selectedBooking.check_in_date).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                    <label className="block text-xs font-semibold text-white/40 uppercase mb-1">Check-out Date</label>
                    <p className="text-sm font-medium text-white">
                      {selectedBooking.check_out_date ? new Date(selectedBooking.check_out_date).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                      <label className="block text-xs font-semibold text-white/40 uppercase mb-1">Guests</label>
                      <p className="text-sm font-medium text-white">
                        {selectedBooking.number_of_guests || selectedBooking.number_of_guests === 0
                          ? selectedBooking.number_of_guests
                          : "N/A"}
                      </p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                      <label className="block text-xs font-semibold text-white/40 uppercase mb-1">Total Amount</label>
                      <p className="text-sm font-medium text-white">${parseFloat(selectedBooking.total_price || 0).toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                    <label className="block text-xs font-semibold text-white/40 uppercase mb-1">Booked On</label>
                    <p className="text-sm font-medium text-white">
                      {selectedBooking.created_at ? new Date(selectedBooking.created_at).toLocaleString() : "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 px-6 py-4 flex flex-row-reverse gap-3">
                {selectedBooking.status !== "cancelled" && selectedBooking.status !== "completed" && (
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-xl border border-transparent shadow-sm px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 border-red-500/30 text-base font-medium focus:outline-none sm:w-auto sm:text-sm transition-all"
                    onClick={() => {
                      setShowModal(false);
                      handleCancelBooking(selectedBooking.booking_id);
                    }}
                  >
                    Cancel Booking
                  </button>
                )}
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-xl border border-white/10 shadow-sm px-4 py-2 bg-white/5 text-base font-medium text-white hover:bg-white/10 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm transition-all"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserDashboard;
