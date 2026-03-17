import mongoose from "mongoose";

export async function connectToDatabase() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is missing. Update backend/.env before starting the server.");
  }

  mongoose.set("strictQuery", true);
  await mongoose.connect(mongoUri);
}
