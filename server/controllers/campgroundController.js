import { createCampgroundQuery, getCampgroundByIdQuery } from "../models/campground.js";
import { createLocationQuery } from "../models/location.js";
import { createRequestQuery } from "../models/request.js";
import { getDBConnection } from "../db/config.js";

export const createCampground = async (req, res) => {
  const connection = await getDBConnection();
  if (!connection) {
    return res.status(500).json({ success: false, message: "DB Connection Error" });
  }
  const { title, description, capacity, type, latitude, longitude, place, price } = req?.body;
  try {
    await connection.beginTransaction();
    const newLocation = await createLocationQuery(connection, { place, longitude, latitude });
    const newCampground = await createCampgroundQuery(connection, {
      title,
      description,
      capacity,
      type,
      locId: newLocation?.insertId,
      ownerId: req?.user?.id,
      price,
    });
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
    const campground = await getCampgroundByIdQuery(connection, id);
    if (!campground) {
      return res.status(404).json({ success: false, message: "Campground not found" });
    }
    return res.status(200).json({ success: true, data: campground });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: err?.message || "An Error Occurred" });
  } finally {
    connection.release();
  }
};
