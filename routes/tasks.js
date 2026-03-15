const express = require("express");
const router = express.Router();
const Task = require("../models/Task");


// GET all tasks
router.get("/", async (req, res) => {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
});


// CREATE task
router.post("/", async (req, res) => {
    const { title, description } = req.body;

    const newTask = new Task({
        title,
        description
    });

    const savedTask = await newTask.save();
    res.json(savedTask);
});


// UPDATE task
router.put("/:id", async (req, res) => {
    const updated = await Task.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    res.json(updated);
});


// DELETE task
router.delete("/:id", async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
});

module.exports = router;