import express from "express";
import { authenticateUser } from "../middleware/authenticateUser.js";
import { createCampground, getCampgroundById } from "../controllers/campgroundController.js";

const router = express.Router();

router.post("/create-campground", authenticateUser, createCampground);
router.get("/get-campground/:id", getCampgroundById);

export default router;
