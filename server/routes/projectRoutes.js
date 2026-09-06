import express from "express";
import {
  createProject,
  getProjects,
  getMyProjects,
  getProjectById,
  updateProject,
  deleteProject,
  requestToJoinProject,
  getProjectRequests,
  acceptJoinRequest,
  rejectJoinRequest,
  leaveProject,
  removeMember,
  uploadProjectImage,
  removeProjectImage,
} from "../controllers/projectController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/", protect, createProject);
router.put("/:id/upload-image", protect, upload.single("image"), uploadProjectImage);
router.delete("/:id/remove-image", protect, removeProjectImage);

// Get all projects
router.get("/", protect, getProjects);

// Get my projects
router.get("/my-projects", protect, getMyProjects);

// Collaboration routes
router.post("/:id/request", protect, requestToJoinProject);
router.get("/:id/requests", protect, getProjectRequests);
router.put("/request/:requestId/accept", protect, acceptJoinRequest);
router.put("/request/:requestId/reject", protect, rejectJoinRequest);
router.put("/:id/leave", protect, leaveProject);
router.delete("/:id/members/:memberId/remove", protect, removeMember);

// Project CRUD by ID
router.get("/:id", protect, getProjectById);
router.put("/:id", protect, updateProject);
router.delete("/:id", protect, deleteProject);

export default router;