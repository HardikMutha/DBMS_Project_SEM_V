import { getDBConnection } from "../db/config.js";
import { getBookingCount } from "../models/booking.js";
import {
  getAllCampgrounds,
  getCampgroundCount,
  getCampgroundRequestById,
  getPendingCampgroundRequests,
} from "../models/campground.js";
import { getImagesByCampgroundQuery } from "../models/images.js";
import { deleteUserQuery, getAllUsers, getUserById, getUserCount } from "../models/user.js";

export const getDashboardStats = async (req, res) => {
  const connection = await getDBConnection();
  if (!connection) {
    return res.status(500).json({ success: false, message: "Database connection error" });
  }
  try {
    await connection.beginTransaction();
    const userCount = await getUserCount(connection);
    const campgroundCount = await getCampgroundCount(connection);
    const bookingCount = await getBookingCount(connection);
    const pendingCampgroundRequests = await getPendingCampgroundRequests(connection);
    await connection.commit();
    return res.status(200).json({
      success: true,
      data: { userCount, campgroundCount, bookingCount, pendingCampgroundRequests },
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return res.status(500).json({ success: false, message: "Error fetching dashboard stats" });
  } finally {
    connection.release();
  }
};

export const userManagement = async (req, res) => {
  const connection = await getDBConnection();
  if (!connection) {
    return res.status(500).json({ success: false, message: "Database connection error" });
  }
  try {
    await connection.beginTransaction();
    const users = await getAllUsers(connection);
    await connection.commit();
    return res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error("Error fetching users:", error);
    await connection.rollback();
    return res.status(500).json({ success: false, message: "Error fetching users" });
  } finally {
    connection.release();
  }
};

export const deleteUser = async (req, res) => {
  const connection = await getDBConnection();
  if (!connection) {
    return res.status(500).json({ success: false, message: "Database Connection Errors" });
  }
  try {
    await connection.beginTransaction();
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ success: false, message: "No user id provided" });
    }
    const user = await getUserById(connection, userId);
    if (!user || user.role === "admin") {
      return res.status(401).json({ success: false, message: "Invalid User Id " });
    }

    const response = await deleteUserQuery(connection, userId);
    if (!response) throw new Error("Invalid Request");
    await connection.commit();

    return res.status(200).json({ success: true, message: "User Deleted Successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err?.message || "An Error Occurred" });
  } finally {
    connection.release();
  }
};

export const campgroundManagement = async (req, res) => {
  const connection = await getDBConnection();
  if (!connection) {
    return res.status(500).json({ success: false, message: "Database connection error" });
  }
  try {
    await connection.beginTransaction();
    const campgrounds = await getAllCampgrounds(connection);
    const finalResponse = [];
    campgrounds.forEach(async (cg) => {
      const image = await getImagesByCampgroundQuery(connection, { campgroundId: cg?.id });
      finalResponse.push({ ...cg, images: image.map((img) => img.imgUrl) });
    });
    await connection.commit();
    return res.status(200).json({ success: true, data: finalResponse });
  } catch (error) {
    console.error("Error fetching campgrounds:", error);
    return res.status(500).json({ success: false, message: "Error fetching campgrounds" });
  } finally {
    connection.release();
  }
};

export const getCampgroundRequest = async (req, res) => {
  const connection = await getDBConnection();
  if (!connection) {
    return res.status(500).json({ success: false, message: "Database connection error" });
  }
  try {
    const { campgroundId } = req.params;
    await connection.beginTransaction();
    const result = await getCampgroundRequestById(connection, campgroundId);
    if (result.length === 0) {
      return res.status(404).json({ success: false, message: "Campground request not found" });
    }
    return res.status(200).json({ success: true, data: result[0] });
  } catch (error) {
    console.error("Error fetching campground request:", error);
    return res.status(500).json({ success: false, message: "Error fetching campground request" });
  } finally {
    connection.release();
  }
};
