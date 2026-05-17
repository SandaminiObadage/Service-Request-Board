const { validationResult } = require("express-validator");

function validationHandler(req, res, next) {
  const result = validationResult(req);

  if (result.isEmpty()) {
    return next();
  }

  return res.status(422).json({
    success: false,
    message: "Validation failed",
    errors: result.array().map((error) => ({
      field: error.path,
      message: error.msg
    }))
  });
}

function errorHandler(error, req, res, next) {
  const statusCode = error.statusCode || 500;

  if (error.name === "CastError") {
    return res.status(400).json({ success: false, message: "Invalid resource id" });
  }

  if (error.code === 11000) {
    return res.status(409).json({ success: false, message: "Email already exists" });
  }

  if (error.name === "ValidationError") {
    return res.status(422).json({
      success: false,
      message: "Validation failed",
      errors: Object.values(error.errors).map((entry) => ({
        field: entry.path,
        message: entry.message
      }))
    });
  }

  return res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? "Something went wrong" : error.message
  });
}

module.exports = { validationHandler, errorHandler };
