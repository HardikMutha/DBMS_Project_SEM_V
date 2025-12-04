import express from "express";
import { authenticateAdmin, authenticateUser } from "../middleware/authenticateUser.js";
import {
  addCampgroundToFavourite,
  createCampground,
  getCampgroundById,
  removeCampgroundFromFavourites,
  getAllApprovedCampgrounds,
  updateCampgroundDetails,
  deleteCampground,
  getAvailableCapacity,
  getUserOwnedCampgrounds,
  getFavouriteCampground,
} from "../controllers/campgroundController.js";
import { upload } from "../config/s3config.js";

const router = express.Router();

// Ik writing a middleware in routes is bad practice, but this works and It'll take time to figure out a workaround

router.post(
  "/create-campground",
  authenticateUser,
  (req, res, next) => {
    upload.array("images", 10)(req, res, (err) => {
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({ success: false, message: "File too large (max 5MB per image)" });
        }
        if (err.code === "LIMIT_UNEXPECTED_FILE") {
          return res.status(400).json({ success: false, message: "Too many files (max 10 allowed)" });
        }
        return res.status(500).json({ success: false, message: "Image upload failed" });
      }
      return next();
    });
  },
  createCampground
);
router.get("/get-campground/:id", getCampgroundById);
router.get("/get-all-campgrounds", getAllApprovedCampgrounds);
router.put("/update-campground/:id", authenticateUser, updateCampgroundDetails);
router.delete("/delete-campground/:id", authenticateAdmin, deleteCampground);
router.get("/favourites/get/:id", authenticateUser, getFavouriteCampground);
router.post("/favourites/add", authenticateUser, addCampgroundToFavourite);
router.delete("/favourites/remove", authenticateUser, removeCampgroundFromFavourites);
router.post("/get-available-capacity/:campgroundId", authenticateUser, getAvailableCapacity);
router.get("/user-campgrounds", authenticateUser, getUserOwnedCampgrounds);

router.post("/upload", upload.array("images", 10), (req, res) => {
  console.log(req.files);
  return res.status(201).json({ success: true, message: "Response" });
});

export default router;
