import express from "express";
import { authenticateUser } from "../middleware/authenticateUser.js";
import { createCampground } from "../controllers/campgroundController.js";

const router = express.Router();

router.post("/create-campground", authenticateUser, createCampground);

export default router;
