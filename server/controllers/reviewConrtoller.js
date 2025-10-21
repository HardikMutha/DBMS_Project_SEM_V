import { getDBConnection } from "../db/config.js";
import { createReview, getCampgroundReviews, getUserReviews, getCampgroundAverageRating } from "../models/review.js";

// Need to add constaint once booking is done :
//    only users who had booked the campground can write review
export const addReview = async (req, res) => {
  const connection = await getDBConnection();
  if (!connection) {
    return res.status(500).json({ success: false, message: "DB Connection Error" });
  }
  const { campgroundId, content, rating } = req?.body;
  try {
    await connection.beginTransaction();
    const result = await createReview(connection, { userId: req?.user?.id, campgroundId, content, rating });
    console.log(result);
    // can send notification to owner
    await connection.commit();
    return res.status(201).json({ success: true, message: "Added review" });
  } catch (error) {
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
    const data = await getCampgroundReviews(connection, campgroundId);
    console.log(data);
    await connection.commit();
    return res.status(200).json({ success: true, data });
  } catch (error) {
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
    const data = await getUserReviews(connection, req?.user?.id);
    console.log(data);
    await connection.commit();
    return res.status(200).json({ success: true, data });
  } catch (error) {
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
    const data = await getCampgroundAverageRating(connection, campgroundId);
    console.log(data);
    await connection.commit();
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  } finally {
    connection.release();
  }
};
