const { JobRequest } = require("../models/JobRequest");
const { ApiError } = require("../utils/apiError");

const populateJob = [
  { path: "createdBy", select: "name email role" },
  { path: "assignedTo", select: "name email role" },
  { path: "requests.tradesperson", select: "name email role" }
];

function isSameId(left, right) {
  return left?.toString() === right?.toString();
}

function requireRole(user, role) {
  if (user.role !== role) {
    throw new ApiError(403, `Only ${role}s can perform this action`);
  }
}

function requireOwner(job, user) {
  if (!isSameId(job.createdBy?._id || job.createdBy, user._id)) {
    throw new ApiError(403, "Only the homeowner who created this job can perform this action");
  }
}

async function getJobs(req, res, next) {
  try {
    const { category, status, keyword } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (status) filter.status = status;
    if (keyword) {
      const search = new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      filter.$or = [{ title: search }, { description: search }];
    }

    const jobs = await JobRequest.find(filter)
      .select("title description category location status createdAt")
      .sort({ createdAt: -1 })
      .limit(60)
      .lean();

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: { jobs }
    });
  } catch (error) {
    next(error);
  }
}

async function getJobById(req, res, next) {
  try {
    const job = await JobRequest.findById(req.params.id).populate(populateJob);

    if (!job) {
      throw new ApiError(404, "Job request not found");
    }

    res.status(200).json({ success: true, data: { job } });
  } catch (error) {
    next(error);
  }
}

async function createJob(req, res, next) {
  try {
    requireRole(req.user, "homeowner");

    const job = await JobRequest.create({
      ...req.body,
      createdBy: req.user._id
    });
    await job.populate(populateJob);

    res.status(201).json({
      success: true,
      message: "Job request created",
      data: { job }
    });
  } catch (error) {
    next(error);
  }
}

async function updateJob(req, res, next) {
  try {
    const job = await JobRequest.findById(req.params.id);

    if (!job) {
      throw new ApiError(404, "Job request not found");
    }

    requireRole(req.user, "homeowner");
    requireOwner(job, req.user);

    if (job.assignedTo) {
      throw new ApiError(409, "Assigned jobs cannot be edited");
    }

    const fields = ["title", "description", "category", "location", "contactName", "contactEmail"];
    fields.forEach((field) => {
      job[field] = req.body[field];
    });

    await job.save();
    await job.populate(populateJob);

    res.status(200).json({
      success: true,
      message: "Job request updated",
      data: { job }
    });
  } catch (error) {
    next(error);
  }
}

async function updateJobStatus(req, res, next) {
  try {
    const job = await JobRequest.findById(req.params.id);

    if (!job) {
      throw new ApiError(404, "Job request not found");
    }

    if (!job.assignedTo || !isSameId(job.assignedTo, req.user._id)) {
      throw new ApiError(403, "Only the assigned tradesperson can update job status");
    }

    job.status = req.body.status;
    await job.save();
    await job.populate(populateJob);

    res.status(200).json({
      success: true,
      message: "Job status updated",
      data: { job }
    });
  } catch (error) {
    next(error);
  }
}

async function deleteJob(req, res, next) {
  try {
    const job = await JobRequest.findById(req.params.id);

    if (!job) {
      throw new ApiError(404, "Job request not found");
    }

    requireRole(req.user, "homeowner");
    requireOwner(job, req.user);

    await job.deleteOne();

    res.status(200).json({
      success: true,
      message: "Job request deleted"
    });
  } catch (error) {
    next(error);
  }
}

async function requestJob(req, res, next) {
  try {
    requireRole(req.user, "tradesperson");

    const job = await JobRequest.findById(req.params.id);

    if (!job) {
      throw new ApiError(404, "Job request not found");
    }

    if (job.assignedTo || job.status !== "Open") {
      throw new ApiError(409, "This job is no longer accepting requests");
    }

    const existingRequest = job.requests.find((request) => isSameId(request.tradesperson, req.user._id));

    if (existingRequest) {
      throw new ApiError(409, "You have already requested this job");
    }

    job.requests.push({
      tradesperson: req.user._id,
      message: req.body.message || ""
    });

    await job.save();
    await job.populate(populateJob);

    res.status(201).json({
      success: true,
      message: "Job request sent to homeowner",
      data: { job }
    });
  } catch (error) {
    next(error);
  }
}

async function decideJobRequest(req, res, next) {
  try {
    const { decision } = req.body;
    const job = await JobRequest.findById(req.params.id);

    if (!job) {
      throw new ApiError(404, "Job request not found");
    }

    requireRole(req.user, "homeowner");
    requireOwner(job, req.user);

    if (job.assignedTo) {
      throw new ApiError(409, "This job has already been assigned");
    }

    const selectedRequest = job.requests.id(req.params.requestId);

    if (!selectedRequest) {
      throw new ApiError(404, "Tradesperson request not found");
    }

    if (decision === "accept") {
      selectedRequest.status = "Accepted";
      job.assignedTo = selectedRequest.tradesperson;
      job.status = "In Progress";
      job.requests.forEach((request) => {
        if (!isSameId(request._id, selectedRequest._id) && request.status === "Pending") {
          request.status = "Declined";
        }
      });
    } else {
      selectedRequest.status = "Declined";
    }

    await job.save();
    await job.populate(populateJob);

    res.status(200).json({
      success: true,
      message: decision === "accept" ? "Tradesperson confirmed for this job" : "Tradesperson request declined",
      data: { job }
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  updateJobStatus,
  deleteJob,
  requestJob,
  decideJobRequest
};
