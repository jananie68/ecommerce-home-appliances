import mongoose from "mongoose";

export async function connectToDatabase() {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error(
      "MONGO_URI or MONGODB_URI is missing. Update your backend environment before starting the server."
    );
  }

  mongoose.set("strictQuery", true);
  await mongoose.connect(mongoUri);
}
