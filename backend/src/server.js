import compression from "compression";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import morgan from "morgan";
import { connectToDatabase } from "./config/db.js";
import { getUploadDirectory } from "./config/paths.js";
import { errorHandler, notFoundHandler } from "./middleware/error.js";
import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 5000);
const uploadDirectory = getUploadDirectory();

function normalizeOrigin(origin) {
  return origin?.trim().replace(/\/+$/, "");
}

function getAllowedOrigins() {
  const configuredOrigins = [
    ...(process.env.FRONTEND_URLS || "")
      .split(",")
      .map((origin) => normalizeOrigin(origin))
      .filter(Boolean),
    normalizeOrigin(process.env.FRONTEND_URL)
  ].filter(Boolean);

  if (configuredOrigins.length) {
    return [...new Set(configuredOrigins)];
  }

  return ["http://localhost:5173", "http://127.0.0.1:5173"];
}

const allowedOrigins = getAllowedOrigins();

if (process.env.TRUST_PROXY || process.env.NODE_ENV === "production") {
  app.set("trust proxy", process.env.TRUST_PROXY || 1);
}

app.use(
  cors({
    origin(origin, callback) {
      const normalizedOrigin = normalizeOrigin(origin);

      if (!normalizedOrigin || allowedOrigins.includes(normalizedOrigin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Origin is not allowed by CORS."));
    },
    credentials: true
  })
);
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(compression());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
// Express 5 makes req.query a getter-only property; sanitize in place instead of reassigning.
app.use((req, _res, next) => {
  [req.body, req.params, req.query].forEach((value) => {
    if (value) {
      mongoSanitize.sanitize(value);
    }
  });
  next();
});
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 200
  })
);

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.use("/uploads", express.static(uploadDirectory));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "Sri Palani Andavan Electronics API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/chatbot", chatRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

connectToDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
  });
