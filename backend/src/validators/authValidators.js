const { body } = require("express-validator");

const humanNamePattern = /^[\p{L}\p{M}\s'.-]+$/u;

const registerValidator = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 80 })
    .withMessage("Name must be between 2 and 80 characters")
    .matches(humanNamePattern)
    .withMessage("Name contains unsupported characters"),
  body("email").trim().isEmail({ allow_utf8_local_part: true }).withMessage("Please provide a valid email").normalizeEmail(),
  body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
  body("role").optional().isIn(["homeowner", "tradesperson"]).withMessage("Role must be homeowner or tradesperson")
];

const loginValidator = [
  body("email").trim().isEmail({ allow_utf8_local_part: true }).withMessage("Please provide a valid email").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required")
];

module.exports = { registerValidator, loginValidator };
