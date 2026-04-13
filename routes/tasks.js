const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const auth = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({
      pinned: -1,
      priority: -1,
      dueDate: 1
    });

    res.json({ success: true, data: tasks });

  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// GET ONE
router.get("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    res.json({ success: true, data: task });

  } catch {
    res.status(400).json({ success: false });
  }
});

// CREATE
router.post("/", auth, async (req, res) => {
  try {
    const task = await Task.create({
      ...req.body,
      user: req.user.id
    });

    res.status(201).json({ success: true, data: task });

  } catch (err) {
    res.status(400).json({ success: false });
  }
});

// UPDATE
router.put("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({ success: true, data: task });

  } catch {
    res.status(400).json({ success: false });
  }
});

// DELETE
router.delete("/:id", auth, async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Deleted" });

  } catch {
    res.status(400).json({ success: false });
  }
});

module.exports = router;
