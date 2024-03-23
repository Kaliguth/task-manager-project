// Task status route
const express = require("express");
const router = express.Router();
const Task = require("../models/TaskModel");
const authenticate = require("../middlewares/authenticate");

// Get all user's tasks filtered by provided status
router.get("/:status", authenticate, async (req, res) => {
  try {
    const status = req.params.status.toLowerCase();
    const tasks = await Task.find({ userID: req.user.id, status });

    if (tasks.length === 0) {
      return res
        .status(200)
        .json({ message: `You do not have any ${status} tasks.` });
    }

    res.status(200).json({ message: `${status} tasks:`, tasks });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error - Request could not be handled",
      error: error.message,
    });
  }
});

module.exports = router;
