import { getNotifications, updateNotification } from "../controllers/notificationController.js";
import express from "express";
import { authenticateUser } from "../middleware/authenticateUser.js";

const router = express.Router();

router.get("/", authenticateUser, getNotifications);
router.put("/update-viewed", authenticateUser, updateNotification);

export default router;