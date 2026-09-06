import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Get token from cookies
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    // 2. If no token
    if (!token) {
      return res.status(401).json({
        message: "Not authorized, no token found",
      });
    }

    // 3. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Find user from token
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    // 5. Move to next controller
    next();

  } catch (error) {
    return res.status(401).json({
      message: "Not authorized, token failed",
      error: error.message,
    });
  }
};