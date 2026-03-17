import express from "express";
import { protect, requireAdmin } from "../middleware/auth.js";
import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { User } from "../models/User.js";

const router = express.Router();

router.get("/analytics", protect, requireAdmin, async (req, res, next) => {
  try {
    const [totalOrders, totalProducts, totalCustomers, paidOrders, lowStockProducts, recentOrders] = await Promise.all([
      Order.countDocuments(),
      Product.countDocuments(),
      User.countDocuments({ role: "user" }),
      Order.find({ "payment.status": "paid" }),
      Product.find({ stockQuantity: { $lte: 5 } }).sort({ stockQuantity: 1 }).limit(8),
      Order.find().sort({ createdAt: -1 }).limit(6).populate("user", "name email")
    ]);

    const totalRevenue = paidOrders.reduce((sum, order) => sum + (order.totals?.total || 0), 0);

    res.json({
      metrics: {
        totalOrders,
        totalProducts,
        totalCustomers,
        totalRevenue
      },
      lowStockProducts,
      recentOrders
    });
  } catch (error) {
    next(error);
  }
});

router.get("/customers", protect, requireAdmin, async (req, res, next) => {
  try {
    const customers = await User.find({ role: "user" }).sort({ createdAt: -1 }).select("-password");
    res.json({ customers });
  } catch (error) {
    next(error);
  }
});

export default router;
