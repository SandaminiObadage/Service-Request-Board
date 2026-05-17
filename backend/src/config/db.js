const mongoose = require("mongoose");
const { env } = require("./env");

async function connectDB(uri = env.MONGO_URI) {
  if (!uri) {
    throw new Error("MONGO_URI is required");
  }

  mongoose.set("strictQuery", true);
  await mongoose.connect(uri);
  console.log("MongoDB connected");
}

async function disconnectDB() {
  await mongoose.connection.close();
}

module.exports = { connectDB, disconnectDB };
