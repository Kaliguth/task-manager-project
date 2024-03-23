// Main app index.js
require("dotenv").config();
const express = require("express");
const usersRoutes = require("./routes/usersRoutes");
const tasksRoutes = require("./routes/tasksRoutes");
const statusFilterRoute = require("./routes/statusFilterRoute");
const categoryFilterRoute = require("./routes/categoryFilterRoute");
const db = require("./db");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Routes
app.use("/users", usersRoutes);
app.use("/tasks", tasksRoutes);
app.use("/tasks/status", statusFilterRoute);
app.use("/tasks/category", categoryFilterRoute);

db.connect();

app.listen(port, () => {
  console.log(`Listening to port ${port}\n`);
});
