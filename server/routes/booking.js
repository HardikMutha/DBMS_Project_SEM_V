import express from "express";
import { authenticateUser } from "../middleware/authenticateUser.js";
const router = express.Router();

router.post("/create-booking", authenticateUser);

export default router;
