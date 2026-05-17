const jwt = require("jsonwebtoken");
const { env } = require("../config/env");
const User = require("../models/User");
const { ApiError } = require("../utils/apiError");

async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const bearerToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    const token = req.cookies?.token || bearerToken;

    if (!token) {
      throw new ApiError(401, "Authentication required");
    }

    const payload = jwt.verify(token, env.JWT_SECRET || "test-secret", {
      issuer: "mini-service-request-board-api",
      audience: "mini-service-request-board-client"
    });

    if (!payload.id) {
      throw new ApiError(401, "Invalid authentication token");
    }

    const user = await User.findById(payload.id);

    if (!user) {
      throw new ApiError(401, "Invalid authentication token");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error.statusCode ? error : new ApiError(401, "Invalid or expired authentication token"));
  }
}

module.exports = { requireAuth };
