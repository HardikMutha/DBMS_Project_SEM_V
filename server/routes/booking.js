import express from "express";
import { authenticateUser } from "../middleware/authenticateUser.js";
import { createBooking } from "../controllers/bookingController.js";
const router = express.Router();

router.post("/create-booking/:campgroundId", authenticateUser, createBooking);

export default router;
