const express = require('express');
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (_req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'));
  }
};

const upload = multer({ storage, fileFilter });

const applyProductFilters = (queryParams) => {
  const query = {};

  if (queryParams.category) {
    query.category = queryParams.category;
  }

  if (queryParams.minPrice || queryParams.maxPrice) {
    query.price = {};
    if (queryParams.minPrice) {
      query.price.$gte = Number(queryParams.minPrice);
    }
    if (queryParams.maxPrice) {
      query.price.$lte = Number(queryParams.maxPrice);
    }
  }

  if (queryParams.rating) {
    query.rating = { $gte: Number(queryParams.rating) };
  }

  if (queryParams.search) {
    query.$or = [
      { name: { $regex: queryParams.search, $options: 'i' } },
      { description: { $regex: queryParams.search, $options: 'i' } },
      { brand: { $regex: queryParams.search, $options: 'i' } }
    ];
  }

  return query;
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const sortMap = {
      featured: { isFeatured: -1, createdAt: -1 },
      newest: { createdAt: -1 },
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      rating: { rating: -1, numReviews: -1 }
    };
    const products = await Product.find(applyProductFilters(req.query)).sort(
      sortMap[req.query.sort] || sortMap.featured
    );
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/featured/list', async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true }).sort({ rating: -1, createdAt: -1 }).limit(8);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
router.get('/:id/related', async (req, res) => {
  try {
    const current = await Product.findById(req.params.id);
    if (!current) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const related = await Product.find({
      _id: { $ne: current._id },
      category: current.category
    })
      .sort({ rating: -1, createdAt: -1 })
      .limit(4);

    res.json(related);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:id/reviews', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Product already reviewed' });
    }

    product.reviews.push({
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment
    });

    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length;

    await product.save();

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
router.post('/', protect, admin, upload.single('image'), async (req, res) => {
  try {
    const uploadedImagePath = req.file ? `/uploads/${req.file.filename}` : null;
    const product = new Product({
      name: req.body.name,
      slug: req.body.slug,
      description: req.body.description,
      shortDescription: req.body.shortDescription,
      price: req.body.price,
      originalPrice: req.body.originalPrice,
      discountPercentage: req.body.discountPercentage,
      category: req.body.category,
      subcategory: req.body.subcategory,
      brand: req.body.brand,
      images: uploadedImagePath ? [uploadedImagePath] : (req.body.images ? JSON.parse(req.body.images) : []),
      stock: req.body.stock,
      sku: req.body.sku,
      features: req.body.features ? JSON.parse(req.body.features) : [],
      tags: req.body.tags ? JSON.parse(req.body.tags) : [],
      shippingInfo: req.body.shippingInfo ? JSON.parse(req.body.shippingInfo) : undefined,
      isFeatured: req.body.isFeatured === 'true' || req.body.isFeatured === true
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
router.put('/:id', protect, admin, upload.single('image'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      const uploadedImagePath = req.file ? `/uploads/${req.file.filename}` : null;
      product.name = req.body.name || product.name;
      product.slug = req.body.slug || product.slug;
      product.description = req.body.description || product.description;
      product.shortDescription = req.body.shortDescription || product.shortDescription;
      product.price = req.body.price ?? product.price;
      product.originalPrice = req.body.originalPrice ?? product.originalPrice;
      product.discountPercentage = req.body.discountPercentage ?? product.discountPercentage;
      product.category = req.body.category || product.category;
      product.subcategory = req.body.subcategory || product.subcategory;
      product.brand = req.body.brand || product.brand;
      product.images = uploadedImagePath
        ? [uploadedImagePath]
        : (req.body.images ? JSON.parse(req.body.images) : product.images);
      product.stock = req.body.stock ?? product.stock;
      product.sku = req.body.sku || product.sku;
      product.features = req.body.features ? JSON.parse(req.body.features) : product.features;
      product.tags = req.body.tags ? JSON.parse(req.body.tags) : product.tags;
      product.shippingInfo = req.body.shippingInfo ? JSON.parse(req.body.shippingInfo) : product.shippingInfo;
      product.isFeatured =
        req.body.isFeatured !== undefined
          ? req.body.isFeatured === 'true' || req.body.isFeatured === true
          : product.isFeatured;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
