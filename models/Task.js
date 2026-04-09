const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  completed: {
    type: Boolean,
    default: false
  },
  dueDate: Date,
  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Low"
  },
  pinned: {
    type: Boolean,
    default: false
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, { timestamps: true });

// Sorting logic
taskSchema.index({ pinned: -1, priority: -1, dueDate: 1 });

module.exports = mongoose.model("Task", taskSchema);