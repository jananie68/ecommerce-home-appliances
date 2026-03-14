const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true
    },
    description: {
      type: String,
      required: true
    },
    shortDescription: {
      type: String,
      trim: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    originalPrice: {
      type: Number,
      min: 0
    },
    discountPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    subcategory: {
      type: String,
      trim: true
    },
    brand: {
      type: String,
      trim: true
    },
    images: [
      {
        type: String
      }
    ],
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    sku: {
      type: String,
      trim: true
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    numReviews: {
      type: Number,
      default: 0
    },
    reviews: [reviewSchema],
    features: [
      {
        type: String
      }
    ],
    tags: [
      {
        type: String,
        trim: true
      }
    ],
    shippingInfo: {
      freeDelivery: {
        type: Boolean,
        default: false
      },
      estimatedDays: {
        type: Number,
        default: 3
      }
    },
    isFeatured: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Product', productSchema);
