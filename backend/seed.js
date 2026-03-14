const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Create admin user
    const admin = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: '123456',
      role: 'admin'
    });
    await admin.save();
    console.log('Admin user created');

    // Create sample products
    const products = [
      {
        name: 'Washing Machine',
        description: 'High-efficiency washing machine',
        price: 499.99,
        category: 'Appliances',
        brand: 'Brand A',
        stock: 10,
        features: ['Energy efficient', 'Large capacity']
      },
      {
        name: 'Refrigerator',
        description: 'Frost-free refrigerator',
        price: 799.99,
        category: 'Appliances',
        brand: 'Brand B',
        stock: 5,
        features: ['Smart cooling', 'LED lighting']
      },
      {
        name: 'Microwave Oven',
        description: 'Compact microwave oven',
        price: 149.99,
        category: 'Appliances',
        brand: 'Brand C',
        stock: 20,
        features: ['Quick heating', 'Easy controls']
      }
    ];

    await Product.insertMany(products);
    console.log('Sample products created');

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

connectDB().then(() => seedData());