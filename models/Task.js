// models/Task.js
const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true
    },
    description: {
      type: String,
      default: ""
    },
    completed: {
      type: Boolean,
      default: false
    },
    dueDate: {
      type: Date,
      required: false
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Low"
    },
    pinned: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// 🔥 Smart Sorting (Pinned → Priority → Due Date)
taskSchema.index({ pinned: -1, priority: -1, dueDate: 1 });

module.exports = mongoose.model("Task", taskSchema);