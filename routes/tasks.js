const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

// GET ALL
router.get("/", async (req, res) => {
  const tasks = await Task.find().sort({ createdAt: -1 });
  res.json(tasks);
});

// GET ONE
router.get("/:id", async (req, res) => {
  const task = await Task.findById(req.params.id);
  res.json(task);
});

// CREATE
router.post("/", async (req, res) => {
  const task = await Task.create(req.body);
  res.json(task);
});

// UPDATE
router.put("/:id", async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(task);
});

// DELETE
router.delete("/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;