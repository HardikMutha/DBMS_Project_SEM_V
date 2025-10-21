import { getDBConnection } from "../db/config.js";
import { createBookingQuery } from "../models/booking.js";
import { getCampgroundByIdQuery } from "../models/campground.js";

export const createBooking = async (req, res) => {
  const userId = req?.user?.id;
  const { campgroundId, checkInDate, checkOutDate, amount } = req?.body;
  const diffTime = checkOutDate - checkInDate;
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  const amountToBePaid = diffDays * amount + diffDays * amount * 0.18;
  const connection = await getDBConnection();
  if (!connection) {
    return res.status(500).json({ message: "Database connection failed" });
  }
  try {
    await connection.beginTransaction();
    const campground = await getCampgroundByIdQuery(connection, campgroundId);
    if (!campground) {
      return res.status(404).json({ success: false, message: "Campground not found" });
    }
    const result = await createBookingQuery(connection, {
      userId,
      campgroundId: campground?.id,
      checkInDate,
      checkOutDate,
      amountToBePaid,
    });
    await connection.commit();
    return res.status(201).json({ success: true, data: result });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: err?.message || "Internal Server Error" });
  } finally {
    connection.release();
  }
};
