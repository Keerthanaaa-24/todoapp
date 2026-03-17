require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 🔥 IMPORTANT: serve frontend
app.use(express.static("public"));

// 🔥 API route
app.use("/api/tasks", require("./routes/tasks"));

// DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Server
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});