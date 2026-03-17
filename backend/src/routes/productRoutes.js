import express from "express";
import mongoose from "mongoose";
import { protect, requireAdmin } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { Product } from "../models/Product.js";

const router = express.Router();

function mapUploadedImages(req) {
  return (req.files || []).map((file) => `/uploads/${file.filename}`);
}

function parseSpecifications(rawValue) {
  if (!rawValue) {
    return [];
  }

  if (Array.isArray(rawValue)) {
    return rawValue;
  }

  try {
    const parsed = JSON.parse(rawValue);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return String(rawValue)
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [label, ...rest] = line.split(":");
        return { label: label?.trim() || "Feature", value: rest.join(":").trim() || line };
      });
  }
}

function parseImageUrls(rawValue) {
  if (!rawValue) {
    return [];
  }

  if (Array.isArray(rawValue)) {
    return rawValue;
  }

  try {
    const parsed = JSON.parse(rawValue);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return String(rawValue)
      .split("\n")
      .map((url) => url.trim())
      .filter(Boolean);
  }
}

function applyProductPayload(product, payload, uploadedImages = []) {
  const {
    name,
    brand,
    category,
    description,
    shortDescription,
    price,
    discountPrice,
    warranty,
    stockQuantity,
    isFeatured,
    isOutOfStock,
    popularityScore,
    tags,
    specifications,
    imageUrls
  } = payload;

  if (name !== undefined) product.name = name;
  if (brand !== undefined) product.brand = brand;
  if (category !== undefined) product.category = category;
  if (description !== undefined) product.description = description;
  if (shortDescription !== undefined) product.shortDescription = shortDescription;
  if (price !== undefined) product.price = Number(price);
  if (discountPrice !== undefined && discountPrice !== "") product.discountPrice = Number(discountPrice);
  if (warranty !== undefined) product.warranty = warranty;
  if (stockQuantity !== undefined) product.stockQuantity = Number(stockQuantity);
  if (isFeatured !== undefined) product.isFeatured = String(isFeatured) === "true" || isFeatured === true;
  if (isOutOfStock !== undefined) product.isOutOfStock = String(isOutOfStock) === "true" || isOutOfStock === true;
  if (popularityScore !== undefined) product.popularityScore = Number(popularityScore);
  if (tags !== undefined) {
    product.tags = Array.isArray(tags)
      ? tags
      : String(tags)
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
  }

  const parsedSpecifications = parseSpecifications(specifications);
  if (parsedSpecifications.length) {
    product.specifications = parsedSpecifications;
  }

  const mergedImages = [...parseImageUrls(imageUrls), ...uploadedImages];
  if (mergedImages.length) {
    product.images = mergedImages;
  }
}

router.get("/", async (req, res, next) => {
  try {
    const { search = "", category, sort = "featured", featured, minPrice, maxPrice, brand } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } }
      ];
    }

    if (category && category !== "All") {
      query.category = category;
    }

    if (brand && brand !== "All") {
      query.brand = brand;
    }

    if (featured === "true") {
      query.isFeatured = true;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sortQuery = { isFeatured: -1, popularityScore: -1, createdAt: -1 };

    if (sort === "price-low") sortQuery = { discountPrice: 1, price: 1 };
    if (sort === "price-high") sortQuery = { discountPrice: -1, price: -1 };
    if (sort === "rating") sortQuery = { ratingAverage: -1, ratingCount: -1 };
    if (sort === "latest") sortQuery = { createdAt: -1 };
    if (sort === "popularity") sortQuery = { popularityScore: -1, ratingAverage: -1 };

    const products = await Product.find(query).sort(sortQuery);
    const categories = await Product.distinct("category");
    const brands = await Product.distinct("brand");

    res.json({
      products,
      filters: {
        categories,
        brands
      }
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ message: "Product not found." });
      return;
    }

    res.json({ product });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      res.status(404).json({ message: "Product not found." });
      return;
    }

    next(error);
  }
});

router.post("/", protect, requireAdmin, upload.array("images", 5), async (req, res, next) => {
  try {
    const requiredFields = ["name", "brand", "category", "description", "price", "warranty", "stockQuantity"];
    const missingField = requiredFields.find((field) => !req.body[field]);

    if (missingField) {
      res.status(400).json({ message: `Missing required field: ${missingField}` });
      return;
    }

    const product = new Product({
      name: req.body.name,
      brand: req.body.brand,
      category: req.body.category,
      description: req.body.description,
      shortDescription: req.body.shortDescription || "",
      price: Number(req.body.price),
      discountPrice: req.body.discountPrice ? Number(req.body.discountPrice) : undefined,
      warranty: req.body.warranty,
      stockQuantity: Number(req.body.stockQuantity)
    });

    applyProductPayload(product, req.body, mapUploadedImages(req));
    await product.save();

    res.status(201).json({
      message: "Product created successfully.",
      product
    });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", protect, requireAdmin, upload.array("images", 5), async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ message: "Product not found." });
      return;
    }

    applyProductPayload(product, req.body, mapUploadedImages(req));
    await product.save();

    res.json({
      message: "Product updated successfully.",
      product
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", protect, requireAdmin, async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ message: "Product not found." });
      return;
    }

    await product.deleteOne();
    res.json({ message: "Product deleted successfully." });
  } catch (error) {
    next(error);
  }
});

router.post("/:id/reviews", protect, async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404).json({ message: "Product not found." });
      return;
    }

    if (!rating || Number(rating) < 1 || Number(rating) > 5) {
      res.status(400).json({ message: "Rating must be between 1 and 5." });
      return;
    }

    const existingReview = product.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );

    if (existingReview) {
      existingReview.rating = Number(rating);
      existingReview.comment = comment;
      existingReview.name = req.user.name;
    } else {
      product.reviews.push({
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
      });
    }

    product.ratingCount = product.reviews.length;
    product.ratingAverage =
      product.reviews.reduce((total, review) => total + review.rating, 0) / product.reviews.length;

    await product.save();

    res.json({
      message: "Review submitted successfully.",
      product
    });
  } catch (error) {
    next(error);
  }
});

export default router;
