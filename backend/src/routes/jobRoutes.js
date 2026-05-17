const express = require("express");
const {
  createJob,
  decideJobRequest,
  deleteJob,
  getJobById,
  getJobs,
  requestJob,
  updateJob,
  updateJobStatus
} = require("../controllers/jobController");
const { requireAuth } = require("../middleware/auth");
const { validationHandler } = require("../middleware/errorHandler");
const {
  createJobValidator,
  decideJobRequestValidator,
  listJobsValidator,
  mongoIdParam,
  requestJobValidator,
  updateJobValidator,
  updateJobStatusValidator
} = require("../validators/jobValidators");

const router = express.Router();

router.get("/", listJobsValidator, validationHandler, getJobs);
router.get("/:id", mongoIdParam, validationHandler, getJobById);
router.post("/", requireAuth, createJobValidator, validationHandler, createJob);
router.put("/:id", requireAuth, updateJobValidator, validationHandler, updateJob);
router.patch("/:id", requireAuth, updateJobStatusValidator, validationHandler, updateJobStatus);
router.post("/:id/requests", requireAuth, requestJobValidator, validationHandler, requestJob);
router.patch("/:id/requests/:requestId", requireAuth, decideJobRequestValidator, validationHandler, decideJobRequest);
router.delete("/:id", requireAuth, mongoIdParam, validationHandler, deleteJob);

module.exports = router;
