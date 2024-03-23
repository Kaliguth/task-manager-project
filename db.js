// Database connection and disconnection
const mongoose = require("mongoose");

async function connect() {
  try {
    // uri is database uri + / and database name: "mongodb://127.0.0.1:27017/task_manager_db"
    const uri = `${process.env.DB_URI}/${process.env.DB_NAME}`;

    await mongoose.connect(uri);
    console.log(`Connected to ${process.env.DB_NAME} database\n`);
  } catch (error) {
    console.error(
      `Error connecting to ${process.env.DB_NAME} database:`,
      error.message
    );
  }
}

async function disconnect() {
  await mongoose.connection.close();
  console.log(`Disconnected from ${process.env.DB_NAME} database\n`);
}

module.exports = {
  connect,
  disconnect,
};
