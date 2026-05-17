const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { ApiError } = require("../utils/apiError");
const { clearAuthCookie, setAuthCookie, signToken } = require("../utils/jwt");

async function register(req, res, next) {
  try {
    const { name, email, password, role = "homeowner" } = req.body;
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, passwordHash, role });
    const token = signToken(user);

    setAuthCookie(res, token);

    res.status(201).json({
      success: true,
      message: "Registered successfully",
      data: { user: user.toSafeJSON() }
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+passwordHash");

    if (!user) {
      throw new ApiError(401, "Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      throw new ApiError(401, "Invalid email or password");
    }

    const token = signToken(user);
    setAuthCookie(res, token);

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      data: { user: user.toSafeJSON() }
    });
  } catch (error) {
    next(error);
  }
}

async function me(req, res) {
  res.status(200).json({
    success: true,
    data: { user: req.user.toSafeJSON() }
  });
}

function logout(req, res) {
  clearAuthCookie(res);
  res.status(200).json({ success: true, message: "Logged out successfully" });
}

module.exports = { register, login, me, logout };
