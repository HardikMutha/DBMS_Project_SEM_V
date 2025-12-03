import express from "express";
import { authenticateUser } from "../middleware/authenticateUser.js";
import { createBooking, getCampgroundAnalytics } from "../controllers/bookingController.js";
const router = express.Router();

router.post("/create-booking/:campgroundId", authenticateUser, createBooking);
router.get("/get-all-bookings", authenticateUser);
router.get("/campground/:campgroundId/analytics", authenticateUser, getCampgroundAnalytics);

export default router;
