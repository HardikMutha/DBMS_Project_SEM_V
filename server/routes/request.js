import { authenticateAdmin } from "../middleware/authenticateUser.js";
import { approveCampgroundRequest, getAllRequests, rejectCampgroundRequest } from "../controllers/requestController.js";

import express from "express";

const router = express.Router();

router.get("/get-all-requests", authenticateAdmin, getAllRequests);
router.post("/approve-request/:requestId", authenticateAdmin, approveCampgroundRequest);
router.post("/reject-request/:requestId", authenticateAdmin, rejectCampgroundRequest);

export default router;
