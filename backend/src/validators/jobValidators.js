const { body, param, query } = require("express-validator");
const { categories, statuses } = require("../models/JobRequest");

const humanNamePattern = /^[\p{L}\p{M}\s'.-]+$/u;
const locationPattern = /^[\p{L}\p{M}\p{N}\s,.'#/-]+$/u;

const mongoIdParam = [param("id").isMongoId().withMessage("Invalid job id")];

const listJobsValidator = [
  query("category").optional().isIn(categories).withMessage(`Category must be one of: ${categories.join(", ")}`),
  query("status").optional().isIn(statuses).withMessage(`Status must be one of: ${statuses.join(", ")}`),
  query("keyword").optional().trim().isLength({ max: 80 }).withMessage("Keyword is too long")
];

const createJobValidator = [
  body("title").trim().isLength({ min: 3, max: 120 }).withMessage("Title must be between 3 and 120 characters"),
  body("description")
    .trim()
    .isLength({ min: 10, max: 1200 })
    .withMessage("Description must be between 10 and 1200 characters"),
  body("category").isIn(categories).withMessage(`Category must be one of: ${categories.join(", ")}`),
  body("location")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 120 })
    .withMessage("Location is too long")
    .matches(locationPattern)
    .withMessage("Location contains unsupported characters"),
  body("contactName")
    .trim()
    .isLength({ min: 2, max: 80 })
    .withMessage("Contact name must be between 2 and 80 characters")
    .matches(humanNamePattern)
    .withMessage("Contact name contains unsupported characters"),
  body("contactEmail").trim().isEmail({ allow_utf8_local_part: true }).withMessage("Please provide a valid contact email").normalizeEmail()
];

const updateJobStatusValidator = [
  ...mongoIdParam,
  body("status").isIn(statuses).withMessage(`Status must be one of: ${statuses.join(", ")}`)
];

const updateJobValidator = [...mongoIdParam, ...createJobValidator];

const requestJobValidator = [
  ...mongoIdParam,
  body("message").optional({ checkFalsy: true }).trim().isLength({ max: 500 }).withMessage("Message must be 500 characters or fewer")
];

const requestIdParam = [param("requestId").isMongoId().withMessage("Invalid request id")];
const decideJobRequestValidator = [
  ...mongoIdParam,
  ...requestIdParam,
  body("decision").isIn(["accept", "decline"]).withMessage("Decision must be accept or decline")
];

module.exports = {
  mongoIdParam,
  listJobsValidator,
  createJobValidator,
  updateJobValidator,
  updateJobStatusValidator,
  requestJobValidator,
  requestIdParam,
  decideJobRequestValidator
};
