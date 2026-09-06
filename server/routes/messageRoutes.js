import express from "express";
import { getProjectMessages } from "../controllers/messageController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:projectId", protect, getProjectMessages);

export default router;