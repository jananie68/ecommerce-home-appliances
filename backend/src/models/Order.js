import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    line1: {
      type: String,
      required: true
    },
    line2: String,
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      required: true
    },
    landmark: String
  },
  { _id: false }
);

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    name: {
      type: String,
      required: true
    },
    image: String,
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    unitPrice: {
      type: Number,
      required: true
    },
    discountedPrice: {
      type: Number,
      required: true
    }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    items: {
      type: [orderItemSchema],
      required: true
    },
    address: {
      type: addressSchema,
      required: true
    },
    totals: {
      subtotal: Number,
      discount: Number,
      shipping: Number,
      total: Number
    },
    status: {
      type: String,
      enum: ["pending-payment", "confirmed", "processing", "shipped", "delivered", "cancelled"],
      default: "pending-payment"
    },
    payment: {
      provider: {
        type: String,
        default: "razorpay"
      },
      amount: Number,
      currency: {
        type: String,
        default: "INR"
      },
      status: {
        type: String,
        enum: ["created", "paid", "failed"],
        default: "created"
      },
      razorpayOrderId: String,
      razorpayPaymentId: String,
      razorpaySignature: String
    }
  },
  {
    timestamps: true
  }
);

export const Order = mongoose.model("Order", orderSchema);
