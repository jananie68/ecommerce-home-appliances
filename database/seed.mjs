import fs from "fs";
import { createRequire } from "module";
import { connectToDatabase } from "../backend/src/config/db.js";
import { Order } from "../backend/src/models/Order.js";
import { Product } from "../backend/src/models/Product.js";
import { User } from "../backend/src/models/User.js";
import { sampleProducts } from "./sample-data/products.mjs";

const requireFromBackend = createRequire(new URL("../backend/package.json", import.meta.url));
const mongoose = requireFromBackend("mongoose");

const envPath = new URL("../backend/.env", import.meta.url);

if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, "utf8");

  envFile
    .split(/\r?\n/)
    .filter((line) => line && !line.trim().startsWith("#") && line.includes("="))
    .forEach((line) => {
      const separatorIndex = line.indexOf("=");
      const key = line.slice(0, separatorIndex).trim();
      const value = line.slice(separatorIndex + 1).trim();

      if (!process.env[key]) {
        process.env[key] = value;
      }
    });
}

async function seed() {
  await connectToDatabase();

  await Promise.all([Order.deleteMany({}), Product.deleteMany({}), User.deleteMany({})]);

  const admin = await User.create({
    name: process.env.ADMIN_NAME || "Sri Palani Admin",
    email: process.env.ADMIN_EMAIL || "admin@sripalaniandavan.com",
    password: process.env.ADMIN_PASSWORD || "Admin@12345",
    phone: "9876543210",
    role: "admin"
  });

  const demoCustomer = await User.create({
    name: "Deepa Kumar",
    email: "customer@sripalaniandavan.com",
    password: "Customer@123",
    phone: "9123456780",
    role: "user",
    addressBook: [
      {
        fullName: "Deepa Kumar",
        phone: "9123456780",
        line1: "12, Anna Salai",
        city: "Coimbatore",
        state: "Tamil Nadu",
        pincode: "641001",
        landmark: "Near Town Hall"
      }
    ]
  });

  const createdProducts = await Product.insertMany(
    sampleProducts.map((product) => ({
      ...product,
      slug: product.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
    }))
  );

  createdProducts[0].reviews.push({
    user: demoCustomer._id,
    name: demoCustomer.name,
    rating: 5,
    comment: "Excellent cooling and spacious layout. Delivery and installation were smooth."
  });
  createdProducts[0].ratingAverage = 5;
  createdProducts[0].ratingCount = 1;
  await createdProducts[0].save();

  console.log(`Seed complete. Admin: ${admin.email}, Products: ${createdProducts.length}`);
}

seed()
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
