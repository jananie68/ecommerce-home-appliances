import mongoose from "mongoose";

function slugify(value = "") {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const specificationSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true
    },
    value: {
      type: String,
      required: true,
      trim: true
    }
  },
  { _id: false }
);

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    name: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    comment: {
      type: String,
      trim: true,
      maxlength: 800
    }
  },
  {
    timestamps: true
  }
);

const productSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    brand: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
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
    discountPrice: {
      type: Number,
      min: 0
    },
    warranty: {
      type: String,
      required: true,
      trim: true
    },
    stockQuantity: {
      type: Number,
      required: true,
      min: 0
    },
    images: {
      type: [String],
      default: []
    },
    specifications: {
      type: [specificationSchema],
      default: []
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    isOutOfStock: {
      type: Boolean,
      default: false
    },
    popularityScore: {
      type: Number,
      default: 0
    },
    reviews: {
      type: [reviewSchema],
      default: []
    },
    ratingAverage: {
      type: Number,
      default: 0
    },
    ratingCount: {
      type: Number,
      default: 0
    },
    tags: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

productSchema.pre("save", function syncStock(next) {
  if (this.name && (!this.slug || this.isModified("name"))) {
    this.slug = slugify(this.name);
  }
  this.isOutOfStock = this.stockQuantity <= 0;
  next();
});

export const Product = mongoose.model("Product", productSchema);
