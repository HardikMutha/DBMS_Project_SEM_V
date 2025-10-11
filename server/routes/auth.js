import express from "express";
const router = express.Router();
import { signupUser, loginUser } from "../controllers/authController.js";
import { authenticateUser } from "../middleware/authenticateUser.js";

router.post("/signup", signupUser);

router.post("/login", loginUser);

router.post("/verify-user", authenticateUser, (req, res) => {
  if (req?.user === undefined) {
    return res.status(401).json({ success: false, message: "Not Allowed to access this route" });
  }
  return res.status(200).json({ success: true, data: req?.user });
});

export default router;
