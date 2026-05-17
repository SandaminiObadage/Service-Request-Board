const jwt = require("jsonwebtoken");
const { env } = require("../config/env");

function signToken(user) {
  return jwt.sign(
    {
      id: user._id.toString(),
      role: user.role
    },
    env.JWT_SECRET || "test-secret",
    {
      expiresIn: env.JWT_EXPIRES_IN,
      issuer: "mini-service-request-board-api",
      audience: "mini-service-request-board-client"
    }
  );
}

function jwtExpiryToMs(value) {
  const match = String(value || "2h").trim().match(/^(\d+)([smhd])$/);

  if (!match) {
    return 2 * 60 * 60 * 1000;
  }

  const amount = Number(match[1]);
  const unit = match[2];
  const units = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000
  };

  return amount * units[unit];
}

function setAuthCookie(res, token) {
  res.cookie("token", token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
    maxAge: jwtExpiryToMs(env.JWT_EXPIRES_IN)
  });
}

function clearAuthCookie(res) {
  res.clearCookie("token", {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: env.NODE_ENV === "production" ? "none" : "lax",
    path: "/"
  });
}

module.exports = { signToken, setAuthCookie, clearAuthCookie };
