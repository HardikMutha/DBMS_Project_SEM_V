import {
  addToFavouritesQuery,
  createCampgroundQuery,
  getCampgroundByIdQuery,
  getOwnerInfoQuery,
  removeFromFavouritesQuery,
  getAllApprovedCampgroundsQuery,
  updateCampgroundDetailsQuery,
} from "../models/campground.js";
import { getCampgroundReviewsQuery } from "../models/review.js";
import { createLocationQuery, getLocationById, updateLocationQuery } from "../models/location.js";
import { addImagesQuery, getImagesByCampgroundQuery } from "../models/images.js";
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
      await addImagesQuery(connection, { imageUrl: file?.location, campgroundId: newCampground?.insertId });
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
    const allReviews = await getCampgroundReviewsQuery(connection, { campgroundId: campground?.id });
    const imagesData = await getImagesByCampgroundQuery(connection, { campgroundId: campground?.id });
    const images = imagesData.map((image) => image?.imgUrl);
    const location = campground?.locId ? await getLocationById(connection, campground.locId) : null;
    const campgroundPayload = {
      ...campground,
      place: location?.place ?? null,
      latitude: location?.latitude ?? null,
      longitude: location?.longitude ?? null,
      images,
    };

    return res.status(200).json({ success: true, data: { campground: campgroundPayload, ownerInfo, allReviews } });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: err?.message || "An Error Occurred" });
  } finally {
    connection.release();
  }
};

export const updateCampgroundDetails = async (req, res) => {
  const { id } = req.params;
  const userId = req?.user?.id;

  if (!userId) {
    return res.status(401).json({ success: false, message: "Please sign in to manage campgrounds" });
  }

  if (!id) {
    return res.status(400).json({ success: false, message: "Campground ID is required" });
  }

  const { title, description, capacity, type, price, place, latitude, longitude } = req.body || {};

  const connection = await getDBConnection();
  if (!connection) {
    return res.status(500).json({ success: false, message: "DB Connection Error" });
  }

  try {
    await connection.beginTransaction();

    const campground = await getCampgroundByIdQuery(connection, { campgroundId: id });
    if (!campground) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: "Campground not found" });
    }

    if (Number(campground.ownerId) !== Number(userId)) {
      await connection.rollback();
      return res.status(403).json({ success: false, message: "You are not authorized to update this campground" });
    }

    const updatedFields = {
      title: title ?? campground.title,
      description: description ?? campground.description,
      capacity: capacity ?? campground.capacity,
      type: type ?? campground.type,
      price: price ?? campground.price,
    };

    if (!updatedFields.title || !updatedFields.capacity || !updatedFields.price) {
      await connection.rollback();
      return res.status(400).json({ success: false, message: "Title, capacity, and price are required" });
    }

    await updateCampgroundDetailsQuery(connection, {
      campgroundId: id,
      ...updatedFields,
    });

    const locationFieldsProvided = [place, latitude, longitude].some((value) => value !== undefined);

    if (locationFieldsProvided) {
      if (campground.locId) {
        const existingLocation = await getLocationById(connection, campground.locId);

        const existingLatitude = existingLocation?.latitude;
        const existingLongitude = existingLocation?.longitude;
        const numericExistingLatitude =
          existingLatitude !== null && existingLatitude !== undefined ? Number(existingLatitude) : null;
        const numericExistingLongitude =
          existingLongitude !== null && existingLongitude !== undefined ? Number(existingLongitude) : null;
        const wantsLatitudeUpdate = latitude !== undefined && latitude !== null && latitude !== "";
        const wantsLongitudeUpdate = longitude !== undefined && longitude !== null && longitude !== "";

        if (wantsLatitudeUpdate || wantsLongitudeUpdate) {
          const requestedLatitude = wantsLatitudeUpdate ? Number.parseFloat(latitude) : numericExistingLatitude;
          const requestedLongitude = wantsLongitudeUpdate ? Number.parseFloat(longitude) : numericExistingLongitude;

          if (
            (numericExistingLatitude !== null &&
              !Number.isNaN(numericExistingLatitude) &&
              requestedLatitude !== numericExistingLatitude) ||
            (numericExistingLongitude !== null &&
              !Number.isNaN(numericExistingLongitude) &&
              requestedLongitude !== numericExistingLongitude)
          ) {
            await connection.rollback();
            return res.status(400).json({
              success: false,
              message: "Updating coordinates is not allowed. Please contact support for assistance.",
            });
          }
        }

        const nextPlace = place !== undefined ? place : existingLocation?.place ?? "";

        await updateLocationQuery(connection, {
          locationId: campground.locId,
          place: nextPlace,
        });
      } else {
        const hasAllLocationValues =
          place !== undefined && latitude !== undefined && longitude !== undefined && latitude !== null && longitude !== null;

        if (hasAllLocationValues) {
          const parsedLatitude = Number.parseFloat(latitude);
          const parsedLongitude = Number.parseFloat(longitude);

          if (
            Number.isNaN(parsedLatitude) ||
            Number.isNaN(parsedLongitude) ||
            parsedLatitude < -90 ||
            parsedLatitude > 90 ||
            parsedLongitude < -180 ||
            parsedLongitude > 180
          ) {
            await connection.rollback();
            return res.status(400).json({ success: false, message: "Invalid latitude or longitude" });
          }

          const newLocation = await createLocationQuery(connection, {
            place,
            latitude: parsedLatitude,
            longitude: parsedLongitude,
          });
          await connection.query(`UPDATE Campground SET locId = ? WHERE id = ?`, [newLocation?.insertId, id]);
        } else if (place !== undefined) {
          await connection.rollback();
          return res.status(400).json({ success: false, message: "Coordinates are required when adding a location" });
        }
      }
    }

    await connection.commit();

    const updatedCampground = await getCampgroundByIdQuery(connection, { campgroundId: id });
    const updatedLocation = updatedCampground?.locId ? await getLocationById(connection, updatedCampground.locId) : null;

    return res.status(200).json({
      success: true,
      message: "Campground updated successfully",
      data: {
        campground: {
          ...updatedCampground,
          place: updatedLocation?.place ?? null,
          latitude: updatedLocation?.latitude ?? null,
          longitude: updatedLocation?.longitude ?? null,
        },
      },
    });
  } catch (err) {
    await connection.rollback();
    console.log(err);
    return res.status(500).json({ success: false, message: err?.message || "Internal Server Error" });
  } finally {
    connection.release();
  }
};

export const deleteCampground = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ success: false, message: "Campground id Not provided" });
  }
  return res.status(200).json({ success: true, message: "GG" });
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
    const campground = await getCampgroundByIdQuery(connection, { campgroundId });
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
    const campground = await getCampgroundByIdQuery(connection, { campgroundId });
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

export const getAllApprovedCampgrounds = async (req, res) => {
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
