const express = require('express');
const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Category = require('../models/Category');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
router.get('/users', protect, admin, async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
router.delete('/users/:id', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      await user.deleteOne();
      res.json({ message: 'User removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
  }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private/Admin
router.get('/orders', protect, admin, async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'id name');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get all products
// @route   GET /api/admin/products
// @access  Private/Admin
router.get('/products', protect, admin, async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/users/:id', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.role = req.body.role || user.role;
    user.phone = req.body.phone || user.phone;

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/categories', protect, admin, async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/analytics', protect, admin, async (req, res) => {
  try {
    const [users, orders, products, categories] = await Promise.all([
      User.find({}),
      Order.find({}),
      Product.find({}),
      Category.find({})
    ]);

    const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    const lowStockProducts = products.filter((product) => product.stock <= 10);
    const topSellingProducts = products
      .map((product) => {
        const sold = orders.reduce((sum, order) => {
          const item = order.orderItems.find(
            (orderItem) => orderItem.product.toString() === product._id.toString()
          );
          return sum + (item ? item.qty : 0);
        }, 0);

        return {
          _id: product._id,
          name: product.name,
          sold,
          stock: product.stock
        };
      })
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 5);

    const salesByStatus = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});

    res.json({
      overview: {
        totalRevenue,
        totalUsers: users.length,
        totalOrders: orders.length,
        totalProducts: products.length,
        totalCategories: categories.length
      },
      lowStockProducts,
      topSellingProducts,
      salesByStatus,
      recentOrders: orders.sort((a, b) => b.createdAt - a.createdAt).slice(0, 8)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
