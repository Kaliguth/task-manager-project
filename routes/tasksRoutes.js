// Task routes
const express = require("express");
const Task = require("../models/TaskModel");
const router = express.Router();
const authenticate = require("../middlewares/authenticate");

// Get all user's tasks
router.get("/", authenticate, async (req, res) => {
  // Find all currect user tasks in Task schema by user id and return them.
  try {
    const tasks = await Task.find({ userID: req.user.id });
    if (tasks.length === 0) {
      res.status(200).json({ message: "You do not have any tasks." });
    } else {
      res.status(200).json({ message: "Tasks:", tasks });
    }
    // Status 200 = OK - Request successful, tasks returned to user.
  } catch (error) {
    res.status(500).json({
      message: "Internal server error - Request could not be handled",
      error: error.message,
    });
    // Status 500 = Server error - Request could not be handled.
  }
});

// Create a new task
router.post("/", authenticate, async (req, res) => {
  try {
    // Create a new task by using body parameters and logged in user.
    const newTask = {
      title: req.body.title,
      category: req.body.category.toLowerCase(),
      description: req.body.description,
      dueDate: req.body.dueDate,
      status: req.body.status.toLowerCase(),
      userID: req.user.id,
    };

    // Add new task to task schema in another try catch to handle task creation errors.
    try {
      // Create the new task and display it to the user.
      const createdTask = await Task.create(newTask);
      res.status(201).json({ message: "Task created", createdTask });
      // Status 201 = Resource created - New task created, return success message and task to user.
    } catch (error) {
      res.status(400).json({
        message:
          "Error creating task: Make sure a title, category and status are provided. Description and due date can be empty.",
        error: error.message,
      });
      // Status 400 = Bad request - New task creation failed.
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal server error - Request could not be handled",
      error: error.message,
    });
    // Status 500 = Server error - Request could not be handled.
  }
});

// Update a task
router.patch("/:id", authenticate, async (req, res) => {
  try {
    // Find the requested task to update by using ID from url params.
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task ID not found." });
      // Status 404 = Not found - Task not found.
    }

    // Check if logged in used is the task owner.
    if (task.userID.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this task." });
      // Status 403 = Unauthorized - Current user not authorized to update given task.
    }

    // Collect updated title and description from body.
    const title = req.body.title;
    const category = req.body.category;
    const description = req.body.description;
    const dueDate = req.body.dueDate;
    const status = req.body.status;

    // Update parameters of the task to provided parameters.
    // If any parameter is undefined (user did not provide them in body), they stay the same.
    // Then update task in Task schema with changes made.
    task.title = title || task.title;
    task.category = category || task.category;
    task.description = description || task.description;
    task.dueDate = dueDate || task.dueDate;
    task.status = status || task.status;
    await Task.updateOne(
      { _id: task.id },
      {
        title: task.title,
        category: task.category,
        description: task.description,
        dueDate: task.dueDate,
        status: task.status,
      }
    );
    res.status(200).json({ message: "Task updated", task });
    // Status 200 = OK - Request successful, return success message and updated task to user.
  } catch (error) {
    res.status(500).json({
      message: "Internal server error - Request could not be handled",
      error: error.message,
    });
    // Status 500 = Server error - Request could not be handled.
  }
});

// Delete a task
router.delete("/:id", authenticate, async (req, res) => {
  try {
    // Find the requested task to delete by using ID from url params.
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found." });
      // Status 404 = Not found - Task not found.
    }

    // Check if logged in used is the task owner.
    if (task.userID.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this task." });
      // Status 403 = Unauthorized - Current user not authorized to update given task.
    }

    await Task.deleteOne({ _id: task.id });
    res.status(200).json({ message: "Task deleted", task });
    // Status 200 = OK - Request successful, return success message and deleted task to user.
  } catch (error) {
    res.status(500).json({
      message: "Internal server error - Request could not be handled",
      error: error.message,
    });
    // Status 500 = Server error - Request could not be handled.
  }
});

module.exports = router;
