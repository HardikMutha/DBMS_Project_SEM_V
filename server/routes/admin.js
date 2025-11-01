import express from "express";
import { authenticateAdmin } from "../middleware/authenticateUser.js";
import { getDBConnection } from "../db/config.js";

const router = express.Router();

// Admin dashboard stats route
router.get("/dashboard-stats", authenticateAdmin, async (req, res) => {
  const connection = await getDBConnection();
  if (!connection) {
    return res.status(500).json({ success: false, message: "Database connection error" });
  }
  try {
    await connection.beginTransaction();
    const [[{ userCount }]] = await connection.query("SELECT COUNT(*) AS userCount FROM Users");
    const [[{ campgroundCount }]] = await connection.query("SELECT COUNT(*) AS campgroundCount FROM Campground WHERE isApproved = 1");
    const [[{ bookingCount }]] = await connection.query("SELECT COUNT(*) AS bookingCount FROM Booking");
    const [[{ revenue }]] = await connection.query("SELECT SUM(amount) AS revenue FROM Booking");
    const [pendingCampgroundRequests] = await connection.query("SELECT u.username, cg.title FROM Users u JOIN Campground cg ON u.id = cg.ownerId JOIN Request r ON cg.id = r.campgroundId WHERE r.status = 'pending' ORDER BY r.id DESC");
    await connection.commit();
    return res.status(200).json({
      success: true,
      data: { userCount, campgroundCount, bookingCount, revenue: revenue || 0, pendingCampgroundRequests },
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return res.status(500).json({ success: false, message: "Error fetching dashboard stats" });
  } finally {
    connection.release();
  }
});

export default router;