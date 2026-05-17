require("dotenv").config();

const env = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
  MONGO_URI: process.env.MONGO_URI || "",
  JWT_SECRET: process.env.JWT_SECRET || "",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "2h",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000"
};

if (env.NODE_ENV !== "test" && !env.JWT_SECRET) {
  console.warn("Warning: JWT_SECRET is not set. Add it to your .env file before running locally.");
}

module.exports = { env };
