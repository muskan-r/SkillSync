import express from "express";
import { suggestProjectIdeas, reviewProjectDescription } from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/suggest-projects", protect, suggestProjectIdeas);
router.post("/review-description", protect, reviewProjectDescription);

export default router;