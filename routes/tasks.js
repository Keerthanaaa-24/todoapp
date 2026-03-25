// routes/tasks.js
const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

// @GET all tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find().sort({
      pinned: -1,
      priority: -1,
      dueDate: 1
    });

    res.json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// @GET single task
router.get("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    res.json({ success: true, data: task });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Invalid ID"
    });
  }
});

// @POST create task
router.post("/", async (req, res) => {
  try {
    const task = await Task.create(req.body);

    res.status(201).json({
      success: true,
      data: task
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// @PUT update task
router.put("/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    res.json({
      success: true,
      data: task
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// @DELETE task
router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    res.json({
      success: true,
      message: "Task deleted"
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Invalid ID"
    });
  }
});

module.exports = router;