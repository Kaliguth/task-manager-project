// Function to reset database to default with 3 default users
// Each user has 2 tasks with different parameters
require("dotenv").config();
const db = require("./db");
const bcrypt = require("bcrypt");
const User = require("./models/UserModel");
const Task = require("./models/TaskModel");

async function main() {
  try {
    await db.connect();

    const admin = new User({
      email: "admin@admin.net",
      username: "admin",
      password: await bcrypt.hash("Admin123", 10),
    });
    const einav = new User({
      email: "einav846@gmail.com",
      username: "einav846",
      password: await bcrypt.hash("Einav846", 10),
    });
    const test = new User({
      email: "test@test.co.il",
      username: "testtest",
      password: await bcrypt.hash("TestPass000", 10),
    });

    const defaultTasks = [
      new Task({
        title: "Team meeting",
        category: "meeting",
        description: undefined,
        dueDate: "1.4.2024 1:00 PM",
        status: "incomplete",
        userID: admin._id,
      }),
      new Task({
        title: "Leisure task",
        category: "leisure",
        description: "Day at the beach",
        dueDate: undefined,
        status: "completed",
        userID: admin._id,
      }),
      new Task({
        title: "Einav's trip",
        category: "leisure",
        description: "Travel",
        dueDate: undefined,
        status: "completed",
        userID: einav._id,
      }),
      new Task({
        title: "Einav's todo",
        category: "todo",
        description: "Clean house",
        dueDate: "Before guests arrive in 3 days",
        status: "incomplete",
        userID: einav._id,
      }),
      new Task({
        title: "Dishes",
        category: "todo",
        description: "",
        dueDate: "",
        status: "completed",
        userID: test._id,
      }),
      new Task({
        title: "Important meeting",
        category: "meeting",
        description: "Project update",
        dueDate: "10.5.2024 11:00 AM",
        status: "incomplete",
        userID: test._id,
      }),
    ];

    console.log("Deleting all users...");
    await User.deleteMany({});
    console.log("All users deleted\n");

    console.log("Inserting default users...");
    await User.insertMany([admin, einav, test]);
    console.log("Default users inserted\n");

    console.log("Deleting all tasks...");
    await Task.deleteMany({});
    console.log("All tasks deleted\n");

    console.log("Inserting default tasks...");
    await Task.insertMany(defaultTasks);
    console.log("Default tasks inserted\n");

    db.disconnect();
  } catch (error) {
    console.error("Error resetting database", error);
  }
}

main();
