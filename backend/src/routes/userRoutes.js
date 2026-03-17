import express from "express";
import { protect } from "../middleware/auth.js";
import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { User } from "../models/User.js";

const router = express.Router();

router.get("/dashboard", protect, async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(5);
    const wishlistProducts = await Product.find({ _id: { $in: req.user.wishlist } });

    res.json({
      profile: req.user,
      stats: {
        totalOrders: await Order.countDocuments({ user: req.user._id }),
        wishlistCount: req.user.wishlist.length,
        savedAddresses: req.user.addressBook.length
      },
      recentOrders: orders,
      wishlistProducts
    });
  } catch (error) {
    next(error);
  }
});

router.get("/wishlist", protect, async (req, res, next) => {
  try {
    const products = await Product.find({ _id: { $in: req.user.wishlist } });
    res.json({ products });
  } catch (error) {
    next(error);
  }
});

router.post("/wishlist/:productId", protect, async (req, res, next) => {
  try {
    const { productId } = req.params;
    const existingIndex = req.user.wishlist.findIndex((id) => id.toString() === productId);

    if (existingIndex >= 0) {
      req.user.wishlist.splice(existingIndex, 1);
    } else {
      const product = await Product.findById(productId);
      if (!product) {
        res.status(404).json({ message: "Product not found." });
        return;
      }

      req.user.wishlist.push(productId);
    }

    await req.user.save();
    const freshUser = await User.findById(req.user._id).select("-password");

    res.json({
      message: "Wishlist updated successfully.",
      wishlist: freshUser.wishlist
    });
  } catch (error) {
    next(error);
  }
});

export default router;
