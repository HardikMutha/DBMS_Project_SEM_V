import express from "express";
import { authenticateAdmin } from "../middleware/authenticateUser.js";
import { campgroundManagement, getCampgroundRequest, getDashboardStats, userManagement } from "../controllers/adminController.js";

const router = express.Router();

// Admin dashboard stats route
router.get("/dashboard-stats", authenticateAdmin, getDashboardStats);

// Management Routes
router.get("/users", authenticateAdmin, userManagement);
router.get("/campgrounds", authenticateAdmin, campgroundManagement);
router.get("/get-campground-request/:campgroundId", authenticateAdmin, getCampgroundRequest);

export default router;