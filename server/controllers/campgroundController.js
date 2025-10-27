import {
  addToFavouritesQuery,
  createCampgroundQuery,
  getCampgroundByIdQuery,
  getOwnerInfoQuery,
  removeFromFavouritesQuery,
  getAllApprovedCampgroundsQuery,
} from "../models/campground.js";
import { getCampgroundReviews } from "../models/review.js";
import { createLocationQuery } from "../models/location.js";
import { addImagesQuery } from "../models/images.js";
import { createRequestQuery } from "../models/request.js";
import { getDBConnection } from "../db/config.js";

export const createCampground = async (req, res) => {
  const connection = await getDBConnection();
  if (!connection) {
    return res.status(500).json({ success: false, message: "DB Connection Error" });
  }
  const { title, description, capacity, type, latitude, longitude, place, price } = req?.body;
  const updateLongitude = parseFloat(longitude);
  const updateLatitude = parseFloat(latitude);
  if (!req.files || !req?.files.length) {
    return res.status(400).json({ success: false, message: "Images not provided" });
  }
  try {
    await connection.beginTransaction();
    const newLocation = await createLocationQuery(connection, { place, longitude: updateLongitude, latitude: updateLatitude });
    const newCampground = await createCampgroundQuery(connection, {
      title,
      description,
      capacity,
      type,
      locId: newLocation?.insertId,
      ownerId: req?.user?.id,
      price,
    });
    for (const file of req?.files) {
      await addImagesQuery(connection, file?.location, newCampground?.insertId);
    }
    await createRequestQuery(connection, { requestedBy: req?.user?.id, campgroundId: newCampground?.insertId });
    await connection.commit();
    return res.status(201).json({ success: true, data: newCampground });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: err?.message || "An Error Occurred" });
  } finally {
    connection.release();
  }
};

export const getCampgroundById = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ success: false, message: "Campground ID is required" });
  }
  const connection = await getDBConnection();
  if (!connection) {
    return res.status(500).json({ success: false, message: "DB Connection Error" });
  }
  try {
    const campground = await getCampgroundByIdQuery(connection, { campgroundId: id });
    if (!campground) {
      return res.status(404).json({ success: false, message: "Campground not found" });
    }
    const ownerInfo = await getOwnerInfoQuery(connection, { campgroundId: campground?.id });
    const allReviews = await getCampgroundReviews(connection, { campgroundId: campground?.id });
    return res.status(200).json({ success: true, data: { campground, ownerInfo, allReviews } });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: err?.message || "An Error Occurred" });
  } finally {
    connection.release();
  }
};

export const addCampgroundToFavourite = async (req, res) => {
  const userId = req?.user?.id;
  const { campgroundId } = req.body;
  if (!userId) {
    return res.status(401).json({ success: false, message: "Please Login to use Favourites" });
  }
  if (!campgroundId) {
    return res.status(400).json({ success: false, message: "Campground ID not provided" });
  }
  const connection = await getDBConnection();
  if (!connection) {
    return res.status(500).json({ success: false, message: "DB Connection Error" });
  }
  try {
    const campground = await getCampgroundByIdQuery(connection, campgroundId);
    if (!campground || !campground?.isApproved) {
      return res.status(404).json({ success: false, message: "Campground not found" });
    }
    const updateFavourites = await addToFavouritesQuery(connection, { userId, campgroundId });
    return res.status(200).json({ success: true, data: { updateFavourites } });
  } catch (err) {
    if (err?.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ success: false, message: "Already in Favourites" });
    }
    console.log(err);
    return res.status(500).json({ success: false, message: err?.message || "Internal Server Error" });
  } finally {
    connection.release();
  }
};

export const removeCampgroundFromFavourites = async (req, res) => {
  const userId = req?.user?.id;
  const { campgroundId } = req.body;
  if (!userId) {
    return res.status(401).json({ success: false, message: "Please Login to use Favourites" });
  }
  if (!campgroundId) {
    return res.status(400).json({ success: false, message: "Campground ID not provided" });
  }
  const connection = await getDBConnection();
  if (!connection) {
    return res.status(500).json({ success: false, message: "DB Connection Error" });
  }
  try {
    const campground = await getCampgroundByIdQuery(connection, campgroundId);
    if (!campground || !campground?.isApproved) {
      return res.status(404).json({ success: false, message: "Campground not found" });
    }
    const updateFavourites = await removeFromFavouritesQuery(connection, { userId, campgroundId });
    return res.status(200).json({ success: true, data: { updateFavourites } });
  } catch (err) {
    if (err?.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ success: false, message: "Already in Favourites" });
    }
    console.log(err);
    return res.status(500).json({ success: false, message: err?.message || "Internal Server Error" });
  } finally {
    connection.release();
  }
};

export const getAllCampgrounds = async (req, res) => {
  const connection = await getDBConnection();
  if (!connection) {
    return res.status(500).json({ success: false, message: "DB Connection Error" });
  }
  try {
    const campgrounds = await getAllApprovedCampgroundsQuery(connection);
    return res.status(200).json({ success: true, data: campgrounds });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: err?.message || "An Error Occurred" });
  } finally {
    connection.release();
  }
};
