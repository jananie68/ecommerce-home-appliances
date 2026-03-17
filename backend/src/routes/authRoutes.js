import express from "express";
import jwt from "jsonwebtoken";
import { protect } from "../middleware/auth.js";
import { User } from "../models/User.js";

const router = express.Router();

function signToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d"
  });
}

function sanitizeUser(user) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    wishlist: user.wishlist,
    addressBook: user.addressBook,
    createdAt: user.createdAt
  };
}

router.post("/signup", async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ message: "Name, email, and password are required." });
      return;
    }

    if (password.length < 8) {
      res.status(400).json({ message: "Password must be at least 8 characters." });
      return;
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(409).json({ message: "An account with this email already exists." });
      return;
    }

    const user = await User.create({
      name,
      email,
      password,
      phone
    });

    const token = signToken(user._id.toString());
    res.status(201).json({
      token,
      user: sanitizeUser(user)
    });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required." });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({ message: "Invalid email or password." });
      return;
    }

    const token = signToken(user._id.toString());
    res.json({
      token,
      user: sanitizeUser(user)
    });
  } catch (error) {
    next(error);
  }
});

router.get("/me", protect, async (req, res) => {
  res.json({
    user: sanitizeUser(req.user)
  });
});

router.put("/profile", protect, async (req, res, next) => {
  try {
    const { name, phone, addressBook } = req.body;

    if (name) {
      req.user.name = name;
    }

    if (phone) {
      req.user.phone = phone;
    }

    if (Array.isArray(addressBook)) {
      req.user.addressBook = addressBook;
    }

    await req.user.save();

    res.json({
      message: "Profile updated successfully.",
      user: sanitizeUser(req.user)
    });
  } catch (error) {
    next(error);
  }
});

export default router;
