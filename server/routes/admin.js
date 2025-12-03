import express from "express";
import { authenticateAdmin } from "../middleware/authenticateUser.js";
import {
  campgroundManagement,
  deleteUser,
  getCampgroundRequest,
  getDashboardStats,
  userManagement,
  bookingManagement,
  cancelBooking,
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/dashboard-stats", authenticateAdmin, getDashboardStats);

router.get("/users", authenticateAdmin, userManagement);
router.delete("/delete-user", authenticateAdmin, deleteUser);
router.get("/campgrounds", authenticateAdmin, campgroundManagement);
router.get("/get-campground-request/:campgroundId", authenticateAdmin, getCampgroundRequest);

router.get("/bookings", authenticateAdmin, bookingManagement);
router.post("/bookings/:bookingId/cancel", authenticateAdmin, cancelBooking);

export default router;
