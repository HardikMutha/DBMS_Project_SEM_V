import express from "express";
import { signupUser, loginUser, createAdmin, loginAdmin } from "../controllers/authController.js";
import { authenticateUser, verifyAdminSignup } from "../middleware/authenticateUser.js";
const router = express.Router();

router.post("/signup", signupUser);

router.post("/login", loginUser);

router.post("/admin-signup", verifyAdminSignup, createAdmin);
router.post("/admin-login", loginAdmin);

router.post("/verify-user", authenticateUser, (req, res) => {
  if (req?.user === undefined || !req.user) {
    return res.status(401).json({ success: false, message: "Not Allowed to access this route" });
  }
  return res.status(200).json({ success: true, data: req?.user });
});

export default router;
