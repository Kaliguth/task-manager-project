// Task category route
const express = require("express");
const router = express.Router();
const Task = require("../models/TaskModel");
const authenticate = require("../middlewares/authenticate");

// Get all user's tasks filtered by category provided
router.get("/:category", authenticate, async (req, res) => {
  try {
    const category = req.params.category.toLowerCase();
    const tasks = await Task.find({ userID: req.user.id, category });

    if (tasks.length === 0) {
      return res
        .status(200)
        .json({ message: `You do not have any ${category} tasks.` });
    }

    res.status(200).json({ message: `${category} Tasks:`, tasks });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error - Request could not be handled",
      error: error.message,
    });
  }
});

module.exports = router;
