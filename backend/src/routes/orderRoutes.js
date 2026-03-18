import crypto from "crypto";
import express from "express";
import Razorpay from "razorpay";
import { protect, requireAdmin } from "../middleware/auth.js";
import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";

const router = express.Router();

function getRazorpayCredentials() {
  const keyId = process.env.RAZORPAY_KEY_ID?.trim();
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();

  if (!keyId || !keySecret) {
    return null;
  }

  return { keyId, keySecret };
}

function getRazorpayClient() {
  const credentials = getRazorpayCredentials();

  if (!credentials) {
    return null;
  }

  return new Razorpay({
    key_id: credentials.keyId,
    key_secret: credentials.keySecret
  });
}

function isRazorpayAuthError(error) {
  return error?.statusCode === 401 && error?.error?.code === "BAD_REQUEST_ERROR";
}

async function buildOrderItems(cartItems) {
  const items = [];

  for (const item of cartItems) {
    const product = await Product.findById(item.productId || item._id);

    if (!product) {
      const error = new Error(`Product not found for item: ${item.name || item.productId}`);
      error.statusCode = 404;
      throw error;
    }

    const quantity = Number(item.quantity) || 1;
    const discountedPrice = product.discountPrice || product.price;

    items.push({
      product: product._id,
      name: product.name,
      image: product.images[0],
      quantity,
      unitPrice: product.price,
      discountedPrice
    });
  }

  return items;
}

function calculateTotals(items) {
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const discountedSubtotal = items.reduce((sum, item) => sum + item.discountedPrice * item.quantity, 0);
  const shipping = discountedSubtotal >= 15000 ? 0 : 499;
  const discount = subtotal - discountedSubtotal;

  return {
    subtotal,
    discount,
    shipping,
    total: discountedSubtotal + shipping
  };
}

router.post("/create", protect, async (req, res, next) => {
  try {
    const { cartItems, address } = req.body;

    if (!Array.isArray(cartItems) || !cartItems.length) {
      res.status(400).json({ message: "Cart items are required to create an order." });
      return;
    }

    if (!address?.fullName || !address?.phone || !address?.line1 || !address?.city || !address?.state || !address?.pincode) {
      res.status(400).json({ message: "Complete shipping address is required." });
      return;
    }

    const items = await buildOrderItems(cartItems);
    const totals = calculateTotals(items);
    const receipt = `spa-${Date.now()}`;
    const razorpay = getRazorpayClient();

    let gatewayOrder = {
      id: `demo_${Date.now()}`,
      amount: totals.total * 100,
      currency: "INR"
    };

    if (razorpay) {
      try {
        gatewayOrder = await razorpay.orders.create({
          amount: totals.total * 100,
          currency: "INR",
          receipt
        });
      } catch (error) {
        if (isRazorpayAuthError(error)) {
          const authError = new Error(
            "Razorpay authentication failed. Update RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET with an active matching API key pair from the same Razorpay mode."
          );
          authError.statusCode = 502;
          throw authError;
        }

        throw error;
      }
    }

    const razorpayCredentials = getRazorpayCredentials();

    const order = await Order.create({
      user: req.user._id,
      items,
      address,
      totals,
      payment: {
        amount: totals.total,
        currency: gatewayOrder.currency || "INR",
        razorpayOrderId: gatewayOrder.id
      }
    });

    res.status(201).json({
      orderId: order._id,
      razorpayOrder: gatewayOrder,
      keyId: razorpayCredentials?.keyId || "demo_key",
      totals
    });
  } catch (error) {
    next(error);
  }
});

router.post("/verify", protect, async (req, res, next) => {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      res.status(404).json({ message: "Order not found." });
      return;
    }

    let paymentVerified = false;
    const razorpayCredentials = getRazorpayCredentials();

    if (razorpayCredentials?.keySecret) {
      const generatedSignature = crypto
        .createHmac("sha256", razorpayCredentials.keySecret)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest("hex");

      paymentVerified = generatedSignature === razorpaySignature;
    } else {
      paymentVerified = String(razorpayOrderId).startsWith("demo_") && String(razorpayPaymentId).startsWith("pay_demo_");
    }

    if (!paymentVerified) {
      order.payment.status = "failed";
      await order.save();
      res.status(400).json({ message: "Payment verification failed." });
      return;
    }

    order.status = "confirmed";
    order.payment.status = "paid";
    order.payment.razorpayOrderId = razorpayOrderId;
    order.payment.razorpayPaymentId = razorpayPaymentId;
    order.payment.razorpaySignature = razorpaySignature;
    await order.save();

    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (!product) {
        continue;
      }

      product.stockQuantity = Math.max(0, product.stockQuantity - item.quantity);
      product.popularityScore += item.quantity;
      await product.save();
    }

    res.json({
      message: "Payment verified successfully.",
      order
    });
  } catch (error) {
    next(error);
  }
});

router.get("/mine", protect, async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (error) {
    next(error);
  }
});

router.get("/all", protect, requireAdmin, async (req, res, next) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("user", "name email phone");

    res.json({ orders });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id/status", protect, requireAdmin, async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ["confirmed", "processing", "shipped", "delivered", "cancelled"];

    if (!allowedStatuses.includes(status)) {
      res.status(400).json({ message: "Invalid order status." });
      return;
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404).json({ message: "Order not found." });
      return;
    }

    order.status = status;
    await order.save();

    res.json({
      message: "Order status updated successfully.",
      order
    });
  } catch (error) {
    next(error);
  }
});

export default router;
