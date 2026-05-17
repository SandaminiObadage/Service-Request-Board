const express = require("express");
const { login, logout, me, register } = require("../controllers/authController");
const { requireAuth } = require("../middleware/auth");
const { validationHandler } = require("../middleware/errorHandler");
const { loginValidator, registerValidator } = require("../validators/authValidators");

const router = express.Router();

router.post("/register", registerValidator, validationHandler, register);
router.post("/login", loginValidator, validationHandler, login);
router.post("/logout", logout);
router.get("/me", requireAuth, me);

module.exports = router;
