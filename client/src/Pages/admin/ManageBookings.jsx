import React, { useState, useEffect } from "react";
import useAuthContext from "../../hooks/useAuthContext";
import { BACKEND_URL } from "../../../config";
import toast from "react-hot-toast";
import campingBg from "/assets/camping-bg.jpg";
import AdminNavbar from "../../components/AdminNavbar";

const ManageBookings = () => {
  const { state } = useAuthContext();
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/admin/bookings`, {
        headers: {
          Authorization: `Bearer ${state.token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setBookings(data.data || []);
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
      const response = await fetch(`${BACKEND_URL}/admin/bookings/${bookingId}/cancel`, {
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

  const filteredBookings = bookings.filter((booking) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      booking.user_name?.toLowerCase().includes(term) ||
      booking.campground_name?.toLowerCase().includes(term) ||
      booking.booking_id?.toString().includes(searchTerm);

    const matchesStatus = filterStatus === "all" || booking.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

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

  const totalRevenue = bookings.reduce(
    (sum, booking) =>
      booking.status === "confirmed" || booking.status === "completed" ? sum + (parseFloat(booking.total_price) || 0) : sum,
    0,
  );

  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter((b) => b.status === "confirmed").length;
  const pendingBookings = bookings.filter((b) => b.status === "pending").length;

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-slate-950 font-sans"
      style={{
        background: `url('${campingBg}') center/cover no-repeat fixed`,
      }}
    >
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />
      <div className="pointer-events-none absolute -top-48 left-10 h-96 w-96 rounded-full bg-emerald-400/25 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-160px] right-[-40px] h-[420px] w-[420px] rounded-full bg-cyan-500/25 blur-3xl" />

      <AdminNavbar title="Booking Management" />

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
          <div className="relative group">
            <div className="absolute inset-0 rounded-2xl border border-white/10 bg-white/5 opacity-80 blur-md transition-opacity group-hover:opacity-100" />
            <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-slate-950/75 shadow-xl backdrop-blur-xl p-5 flex items-center justify-between">
              <div>
                <p className="text-white/60 text-xs font-semibold uppercase tracking-wider">Total Bookings</p>
                <p className="text-3xl font-bold text-white mt-1">{totalBookings}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 border border-blue-400/30 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 rounded-2xl border border-white/10 bg-white/5 opacity-80 blur-md transition-opacity group-hover:opacity-100" />
            <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-slate-950/75 shadow-xl backdrop-blur-xl p-5 flex items-center justify-between">
              <div>
                <p className="text-white/60 text-xs font-semibold uppercase tracking-wider">Confirmed</p>
                <p className="text-3xl font-bold text-white mt-1">{confirmedBookings}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-500/20 border border-emerald-400/30 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

          <div className="relative group">
            <div className="absolute inset-0 rounded-2xl border border-white/10 bg-white/5 opacity-80 blur-md transition-opacity group-hover:opacity-100" />
            <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-slate-950/75 shadow-xl backdrop-blur-xl p-5 flex items-center justify-between">
              <div>
                <p className="text-white/60 text-xs font-semibold uppercase tracking-wider">Pending</p>
                <p className="text-3xl font-bold text-white mt-1">{pendingBookings}</p>
              </div>
              <div className="w-12 h-12 bg-amber-500/20 border border-amber-400/30 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

          <div className="relative group">
            <div className="absolute inset-0 rounded-2xl border border-white/10 bg-white/5 opacity-80 blur-md transition-opacity group-hover:opacity-100" />
            <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-slate-950/75 shadow-xl backdrop-blur-xl p-5 flex items-center justify-between">
              <div>
                <p className="text-white/60 text-xs font-semibold uppercase tracking-wider">Revenue</p>
                <p className="text-3xl font-bold text-white mt-1">${totalRevenue.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-500/20 border border-emerald-400/30 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
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
                <div className="relative flex-1 max-w-md">
                  <input
                    type="text"
                    placeholder="Search bookings by ID, user, or campground..."
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

                <div className="flex items-center gap-3">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent cursor-pointer [&>option]:bg-slate-900"
                  >
                    <option value="all">All Status</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="pending">Pending</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="completed">Completed</option>
                  </select>

                  <button
                    onClick={fetchBookings}
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
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                </div>
              ) : filteredBookings.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                  <p className="text-white/50 text-base">No bookings found matching your criteria.</p>
                </div>
              ) : (
                <table className="min-w-full text-left">
                  <thead className="bg-white/5 border-b border-white/5 text-xs uppercase text-white/50 font-semibold tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Booking</th>
                      <th className="px-6 py-4">Guest</th>
                      <th className="px-6 py-4">Campground</th>
                      <th className="px-6 py-4">Dates</th>
                      <th className="px-6 py-4">Guests</th>
                      <th className="px-6 py-4">Total</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredBookings.map((booking) => (
                      <tr key={booking.booking_id} className="hover:bg-white/5 transition-colors group">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-white">#{booking.booking_id}</div>
                          <div className="text-xs text-white/50">
                            {booking.created_at ? new Date(booking.created_at).toLocaleString() : "Created: N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-white">{booking.user_name || "Unknown"}</div>
                          <div className="text-xs text-white/50">{booking.user_email || ""}</div>
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
                          {booking.number_of_guests || booking.number_of_guests === 0
                            ? booking.number_of_guests
                            : "N/A"}
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
                            {booking.status !== "cancelled" && booking.status !== "completed" && (
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
              )}
            </div>

            {filteredBookings.length > 0 && !isLoading && (
              <div className="border-t border-white/10 px-6 py-4 flex items-center justify-between">
                <span className="text-sm text-white/50">
                  Showing <span className="text-white font-medium">{filteredBookings.length}</span> of{" "}
                  <span className="text-white font-medium">{totalBookings}</span> bookings
                </span>
                <div className="flex gap-2">
                  <button
                    className="px-3 py-1 border border-white/10 rounded-lg bg-white/5 text-sm text-white/50 cursor-not-allowed"
                    disabled
                  >
                    Previous
                  </button>
                  <button className="px-3 py-1 border border-white/10 rounded-lg bg-white/10 text-sm text-white font-medium cursor-default">
                    1
                  </button>
                  <button
                    className="px-3 py-1 border border-white/10 rounded-lg bg-white/5 text-sm text-white/50 cursor-not-allowed"
                    disabled
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {showModal && selectedBooking && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="booking-modal-title" role="dialog" aria-modal="true">
          <div className="fixed inset-0 z-10 bg-black/50" onClick={() => setShowModal(false)} aria-hidden="true"></div>

          <div className="fixed inset-0 z-20 flex items-center justify-center p-4">
            <div className="relative bg-slate-800 border border-white/20 rounded-2xl text-left overflow-hidden shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white" id="booking-modal-title">
                    Booking Details
                  </h3>
                  <p className="text-xs text-white/60 mt-1">
                    Booking #{selectedBooking.booking_id} •{" "}
                    {selectedBooking.created_at ? new Date(selectedBooking.created_at).toLocaleString() : "Created: N/A"}
                  </p>
                </div>
                <button onClick={() => setShowModal(false)} className="text-white/40 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div>
                    <h4 className="text-base font-semibold text-white">{selectedBooking.campground_name}</h4>
                    <p className="text-xs text-white/60">{selectedBooking.campground_location}</p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyles(
                      selectedBooking.status,
                    )}`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {selectedBooking.status?.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <h5 className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-2">Guest Information</h5>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-white">{selectedBooking.user_name}</p>
                      <p className="text-sm text-white/70">{selectedBooking.user_email}</p>
                      <p className="text-sm text-white/70">
                        {selectedBooking.number_of_guests || selectedBooking.number_of_guests === 0
                          ? selectedBooking.number_of_guests
                          : "N/A"}{" "}
                        guests
                      </p>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-2">Stay Details</h5>
                    <div className="space-y-1 text-sm text-white/80">
                      <p>
                        <span className="text-white/50">Check-in:</span>{" "}
                        {selectedBooking.check_in_date
                          ? new Date(selectedBooking.check_in_date).toLocaleDateString()
                          : "N/A"}
                      </p>
                      <p>
                        <span className="text-white/50">Check-out:</span>{" "}
                        {selectedBooking.check_out_date
                          ? new Date(selectedBooking.check_out_date).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between text-lg">
                    <span className="font-medium text-white">Total Amount</span>
                    <span className="font-bold text-white">${parseFloat(selectedBooking.total_price || 0).toFixed(2)}</span>
                  </div>
                </div>

                {selectedBooking.status !== "cancelled" && selectedBooking.status !== "completed" && (
                  <div className="pt-4 border-t border-white/10">
                    <button
                      onClick={() => {
                        setShowModal(false);
                        handleCancelBooking(selectedBooking.booking_id);
                      }}
                      className="w-full px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 rounded-xl font-medium transition-colors"
                    >
                      Cancel This Booking
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBookings;
