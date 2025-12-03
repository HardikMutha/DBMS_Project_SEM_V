import { getDBConnection } from "../db/config.js";
import {
  createReviewQuery,
  getCampgroundReviewsQuery,
  getUserReviewsQuery,
  getCampgroundAverageRatingQuery,
} from "../models/review.js";

import { getBookingsByUserIdCampgroundIdQuery } from "../models/booking.js";

export const addReview = async (req, res) => {
  const connection = await getDBConnection();
  if (!connection) {
    return res.status(500).json({ success: false, message: "DB Connection Error" });
  }
  const { campgroundId, content, rating } = req?.body;
  try {
    await connection.beginTransaction();
    const userId = req.user?.id;
    const hasBooking = await getBookingsByUserIdCampgroundIdQuery(connection, { userId, campgroundId });
    if (!hasBooking || hasBooking.length === 0) {
      return res.status(403).json({ success: false, message: "You need to have a booking to add a review" });
    }
    const currDate = new Date();

    if (currDate.toISOString() < hasBooking[0].checkOutDate)
      return res.status(403).json({ success: false, message: "You can add a review after checkout" });

    const result = await createReviewQuery(connection, { userId, campgroundId, content, rating });
    await connection.commit();
    return res.status(201).json({ success: true, message: "Review Added Successfully" });
  } catch (error) {
    connection.rollback();
    console.error(error?.message);
    return res.status(500).json({ success: false, message: error?.message || "Internal Server Error" });
  } finally {
    connection.release();
  }
};

export const getAllCampgroundReviews = async (req, res) => {
  const connection = await getDBConnection();
  if (!connection) {
    return res.status(500).json({ success: false, message: "DB Connection Error" });
  }
  const { campgroundId } = req?.params;
  try {
    await connection.beginTransaction();
    const data = await getCampgroundReviewsQuery(connection, { campgroundId: campgroundId });
    await connection.commit();
    return res.status(200).json({ success: true, data });
  } catch (error) {
    connection.rollback();
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  } finally {
    connection.release();
  }
};

export const getAllUserReviews = async (req, res) => {
  const connection = await getDBConnection();
  if (!connection) {
    return res.status(500).json({ success: false, message: "DB Connection Error" });
  }
  try {
    await connection.beginTransaction();
    const data = await getUserReviewsQuery(connection, { userId: req?.user?.id });
    console.log(data);
    await connection.commit();
    return res.status(200).json({ success: true, data });
  } catch (error) {
    connection.rollback();
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  } finally {
    connection.release();
  }
};

export const getCampgroundRating = async (req, res) => {
  const connection = await getDBConnection();
  if (!connection) {
    return res.status(500).json({ success: false, message: "DB Connection Error" });
  }
  const { campgroundId } = req?.params;
  try {
    await connection.beginTransaction();
    const data = await getCampgroundAverageRatingQuery(connection, campgroundId);
    console.log(data);
    await connection.commit();
    return res.status(200).json({ success: true, data });
  } catch (error) {
    connection.rollback();
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  } finally {
    connection.release();
  }
};
