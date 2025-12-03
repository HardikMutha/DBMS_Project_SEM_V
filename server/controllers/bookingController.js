import { getDBConnection } from "../db/config.js";
import { createBookingQuery, getBookingsByCampgroundQuery, getBookingsByUserId, deleteBookingById } from "../models/booking.js";
import { getCampgroundByIdQuery } from "../models/campground.js";
import { createBookingNotificationQuery } from "../models/notifications.js";
import { getLocationById } from "../models/location.js";
import { getImagesByCampgroundQuery } from "../models/images.js";
import { getCampgroundReviewsQuery } from "../models/review.js";

export const createBooking = async (req, res) => {
  const userId = req?.user?.id;
  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized to create a booking" });
  }
  const { campgroundId } = req.params;
  const { checkInDate, checkOutDate, amount, guestCount } = req?.body;
  const diffTime = new Date(checkOutDate) - new Date(checkInDate);
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  const amountToBePaid = diffDays * amount + diffDays * amount * 0.18;
  const connection = await getDBConnection();
  if (!connection) {
    return res.status(500).json({ message: "Database connection failed" });
  }
  try {
    await connection.beginTransaction();
    const campground = await getCampgroundByIdQuery(connection, { campgroundId });
    if (!campground) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: "Campground not found" });
    }
    if (campground?.ownerId === userId) {
      await connection.rollback();
      return res.status(409).json({ success: false, message: "Owners cannot book their own campgrounds" });
    }
    if (guestCount > campground?.capacity) {
      await connection.rollback();
      return res
        .status(400)
        .json({ success: false, message: `Guest count exceeds campground capacity of ${campground.capacity}` });
    }
    const result = await createBookingQuery(connection, {
      userId,
      campgroundId: campground?.id,
      checkInDate,
      checkOutDate,
      amount: amountToBePaid,
      guestCount: guestCount || 4,
    });

    const { newNotification } = await createBookingNotificationQuery(connection, {
      bookingId: result?.insertId,
      userId,
    });

    await connection.commit();
    return res.status(201).json({ success: true, data: { bookingInfo: result, newNotification } });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: err?.message || "Internal Server Error" });
  } finally {
    connection.release();
  }
};

const toNumber = (value) => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const formatBookings = (bookings) =>
  bookings.map((booking) => ({
    ...booking,
    checkInDate: booking.checkInDate ? new Date(booking.checkInDate) : null,
    checkOutDate: booking.checkOutDate ? new Date(booking.checkOutDate) : null,
    createdAt: booking.createdAt ? new Date(booking.createdAt) : null,
  }));

export const getCampgroundAnalytics = async (req, res) => {
  const userId = req?.user?.id;
  const { campgroundId } = req.params;

  if (!userId) {
    return res.status(401).json({ success: false, message: "Please sign in to view analytics" });
  }

  if (!campgroundId) {
    return res.status(400).json({ success: false, message: "Campground ID is required" });
  }

  const connection = await getDBConnection();
  if (!connection) {
    return res.status(500).json({ success: false, message: "Database connection failed" });
  }

  try {
    const campground = await getCampgroundByIdQuery(connection, { campgroundId });
    if (!campground) {
      return res.status(404).json({ success: false, message: "Campground not found" });
    }

    if (Number(campground.ownerId) !== Number(userId)) {
      return res.status(403).json({ success: false, message: "You do not have access to this campground" });
    }

    const [location, imagesData, bookingsRaw, reviews] = await Promise.all([
      campground?.locId ? getLocationById(connection, campground.locId) : null,
      getImagesByCampgroundQuery(connection, { campgroundId: campground.id }),
      getBookingsByCampgroundQuery(connection, { campgroundId: campground.id }),
      getCampgroundReviewsQuery(connection, { campgroundId: campground.id }),
    ]);

    const images = imagesData.map((image) => image?.imgUrl);
    const bookings = formatBookings(bookingsRaw);
    const now = new Date();

    const ongoingBookings = bookings.filter((booking) => {
      if (!booking.checkInDate || !booking.checkOutDate) return false;
      return booking.checkInDate <= now && booking.checkOutDate > now;
    });

    const upcomingBookings = bookings.filter((booking) => {
      if (!booking.checkInDate) return false;
      return booking.checkInDate > now;
    });

    const completedBookings = bookings.filter((booking) => {
      if (!booking.checkOutDate) return false;
      return booking.checkOutDate <= now;
    });

    const totalBookings = bookings.length;
    const revenueTotal = bookings.reduce((sum, booking) => sum + Number(booking.amount || 0), 0);
    const revenueUpcoming = upcomingBookings.reduce((sum, booking) => sum + Number(booking.amount || 0), 0);

    const stayDurations = bookings
      .map((booking) => {
        if (!booking.checkInDate || !booking.checkOutDate) return 0;
        return Math.max(0, (booking.checkOutDate - booking.checkInDate) / (1000 * 60 * 60 * 24));
      })
      .filter((nights) => nights > 0);

    const averageStayLength = stayDurations.length
      ? Number((stayDurations.reduce((sum, nights) => sum + nights, 0) / stayDurations.length).toFixed(1))
      : 0;

    const revenueByMonth = new Map();
    bookings.forEach((booking) => {
      if (!booking.createdAt) return;
      const year = booking.createdAt.getFullYear();
      const month = String(booking.createdAt.getMonth() + 1).padStart(2, "0");
      const key = `${year}-${month}`;
      revenueByMonth.set(key, (revenueByMonth.get(key) || 0) + Number(booking.amount || 0));
    });

    const revenueTrend = Array.from(revenueByMonth.entries())
      .sort(([a], [b]) => (a > b ? 1 : -1))
      .slice(-6)
      .map(([month, total]) => ({ month, total }));

    const totalReviewCount = reviews.length;
    const averageRating = totalReviewCount
      ? Number((reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / totalReviewCount).toFixed(1))
      : null;

    const firstCheckIn = bookings.reduce((earliest, booking) => {
      if (!booking.checkInDate) return earliest;
      return !earliest || booking.checkInDate < earliest ? booking.checkInDate : earliest;
    }, null);

    const lastCheckOut = bookings.reduce((latest, booking) => {
      if (!booking.checkOutDate) return latest;
      return !latest || booking.checkOutDate > latest ? booking.checkOutDate : latest;
    }, null);

    let utilizationRate = null;
    if (firstCheckIn && lastCheckOut) {
      const totalNightsBooked = stayDurations.reduce((sum, nights) => sum + nights, 0);
      const totalDaysRange = Math.max(1, (lastCheckOut - firstCheckIn) / (1000 * 60 * 60 * 24));
      const capacity = toNumber(campground.capacity) || 1;
      utilizationRate = Number(((totalNightsBooked / (totalDaysRange * capacity)) * 100).toFixed(1));
    }

    const uniqueGuests = new Set(bookings.map((booking) => booking.userId));
    const repeatGuests = uniqueGuests.size
      ? bookings.filter((booking, idx, arr) => arr.findIndex((b) => b.userId === booking.userId) !== idx).length
      : 0;

    const recentBookings = [...bookings].sort((a, b) => (a.createdAt && b.createdAt ? b.createdAt - a.createdAt : 0)).slice(0, 5);

    const analytics = {
      campground: {
        ...campground,
        place: location?.place ?? null,
        latitude: location?.latitude ?? null,
        longitude: location?.longitude ?? null,
        images,
      },
      stats: {
        totalBookings,
        upcomingBookings: upcomingBookings.length,
        ongoingBookings: ongoingBookings.length,
        completedBookings: completedBookings.length,
        revenueTotal: Number(revenueTotal.toFixed(2)),
        revenueUpcoming: Number(revenueUpcoming.toFixed(2)),
        averageStayLength,
        utilizationRate,
        averageRating,
        totalReviewCount,
        repeatGuests,
      },
      bookings: {
        ongoing: ongoingBookings,
        upcoming: upcomingBookings,
        completed: completedBookings.slice(-10),
      },
      revenueTrend,
      recentBookings,
    };

    return res.status(200).json({ success: true, data: analytics });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err?.message || "Internal Server Error" });
  } finally {
    connection.release();
  }
};

export const getUserBookings = async (req, res) => {
  const userId = req?.user?.id;
  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const connection = await getDBConnection();
  if (!connection) {
    return res.status(500).json({ success: false, message: "Database connection failed" });
  }

  try {
    await connection.beginTransaction();
    const rawBookings = await getBookingsByUserId(connection, { userId });
    const now = new Date();

    const bookingsWithStatus = rawBookings.map((booking) => {
      const checkIn = booking.check_in_date ? new Date(booking.check_in_date) : null;
      const checkOut = booking.check_out_date ? new Date(booking.check_out_date) : null;

      let status = "pending";
      if (checkIn && checkOut) {
        if (checkOut <= now) {
          status = "completed";
        } else if (checkIn > now) {
          status = "pending";
        } else {
          status = "confirmed";
        }
      }

      return {
        ...booking,
        status,
      };
    });

    await connection.commit();
    return res.status(200).json({ success: true, data: bookingsWithStatus });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    await connection.rollback();
    return res.status(500).json({ success: false, message: "Error fetching bookings" });
  } finally {
    connection.release();
  }
};

export const cancelUserBooking = async (req, res) => {
  const userId = req?.user?.id;
  const { bookingId } = req.params;

  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  if (!bookingId) {
    return res.status(400).json({ success: false, message: "Booking ID is required" });
  }

  const connection = await getDBConnection();
  if (!connection) {
    return res.status(500).json({ success: false, message: "Database connection failed" });
  }

  try {
    await connection.beginTransaction();
    
    // First verify the booking belongs to the user
    const userBookings = await getBookingsByUserId(connection, { userId });
    const booking = userBookings.find((b) => b.booking_id === Number(bookingId));
    
    if (!booking) {
      await connection.rollback();
      return res.status(403).json({ success: false, message: "You can only cancel your own bookings" });
    }

    const affectedRows = await deleteBookingById(connection, { bookingId });

    if (!affectedRows) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    await connection.commit();
    return res.status(200).json({ success: true, message: "Booking cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    await connection.rollback();
    return res.status(500).json({ success: false, message: "Error cancelling booking" });
  } finally {
    connection.release();
  }
};
