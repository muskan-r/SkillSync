import User from "../models/User.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

const isProduction = process.env.NODE_ENV === "production";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // 4. Generate token
    const token = generateToken(user._id);

    // 5. Send cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // 6. Response
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // 3. Generate token
    const token = generateToken(user._id);

    // 4. Send cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // 5. Response
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "strict",
      expires: new Date(0),
    });

    res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const getMe = async (req, res) => {
  try {
    res.status(200).json({
      message: "User fetched successfully",
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        bio: req.user.bio,
        skills: req.user.skills,
        avatar: req.user.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const { name, bio, skills } = req.body;

    // Update fields if provided
    if (name) user.name = name;
    if (bio) user.bio = bio;
    if (skills) user.skills = skills;

    const updatedUser = await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        bio: updatedUser.bio,
        skills: updatedUser.skills,
      },
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const user = await User.findById(req.user.id);
    user.avatar = req.file.path; // Cloudinary URL
    await user.save();

    res.status(200).json({
      message: "Avatar uploaded successfully",
      avatar: user.avatar,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};