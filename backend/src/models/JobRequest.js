const mongoose = require("mongoose");

const categories = ["Plumbing", "Electrical", "Painting", "Joinery"];
const statuses = ["Open", "In Progress", "Closed"];
const requestStatuses = ["Pending", "Accepted", "Declined"];

const jobRequestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 120
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 1200
  },
  category: {
    type: String,
    required: true,
    enum: categories
  },
  location: {
    type: String,
    trim: true,
    maxlength: 120,
    default: ""
  },
  contactName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 80
  },
  contactEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"]
  },
  status: {
    type: String,
    enum: statuses,
    default: "Open"
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },
  requests: [
    {
      tradesperson: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      },
      message: {
        type: String,
        trim: true,
        maxlength: 500,
        default: ""
      },
      status: {
        type: String,
        enum: requestStatuses,
        default: "Pending"
      },
      requestedAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

jobRequestSchema.index({ title: "text", description: "text" });
jobRequestSchema.index({ category: 1, status: 1, createdAt: -1 });
jobRequestSchema.index({ createdAt: -1 });

module.exports = {
  JobRequest: mongoose.model("JobRequest", jobRequestSchema),
  categories,
  statuses,
  requestStatuses
};
