import express from "express";
import { registerUser, loginUser ,logoutUser,getMe,updateProfile,uploadAvatar} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout",logoutUser);

// Protected route (TESTING PURPOSE)
router.get("/profile", protect, (req, res) => {
  res.json({
    message: "Protected route accessed successfully",
    user: req.user,
  });
});

router.post("/me",protect,getMe);
router.put("/profile", protect, updateProfile);
router.post("/upload-avatar", protect, upload.single("avatar"), uploadAvatar);

export default router;