import { getDBConnection } from "../db/config.js";
import { createBookingQuery } from "../models/booking.js";
import { getCampgroundByIdQuery } from "../models/campground.js";
import { createBookingNotificationQuery } from "../models/notifications.js";

export const createBooking = async (req, res) => {
  const userId = req?.user?.id;
  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized to create a booking" });
  }
  const { campgroundId } = req.params;
  const { checkInDate, checkOutDate, amount } = req?.body;
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
      return res.status(404).json({ success: false, message: "Campground not found" });
    }
    if (campground?.ownerId === userId) {
      return res.status(409).json({ success: false, message: "Owners cannot book their own campgrounds" });
    }
    const result = await createBookingQuery(connection, {
      userId,
      campgroundId: campground?.id,
      checkInDate,
      checkOutDate,
      amount: amountToBePaid,
    });

    const { newNotification, bookingNotification } = await createBookingNotificationQuery(connection, {
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
