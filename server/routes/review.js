import express from "express";
import { addReview, getAllCampgroundReviews, getAllUserReviews, getCampgroundRating } from "../controllers/reviewController.js";
import { authenticateUser } from "../middleware/authenticateUser.js";

const router = express.Router();

router.post("/create-review", authenticateUser, addReview);
router.get("/get-all-reviews/:campgroundId", getAllCampgroundReviews);
router.get("/get-all-user-reviews", authenticateUser, getAllUserReviews);
router.get("/get-average-rating/:campgroundId", getCampgroundRating);

export default router;
