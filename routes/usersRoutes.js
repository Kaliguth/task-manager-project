// User routes
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
const {
  isValidEmail,
  isValidUsername,
  isValidPassword,
} = require("../functions/assistFunctions");
const router = express.Router();

const secretKey = process.env.JWT_SECRET;

// Get all users
router.get("/", async (req, res) => {
  try {
    // Collect all users in User schema into a const and show it.
    const users = await User.find({}, { password: 0 });
    // Find explaination: {} means all users, {password : 0} will not show passwords.
    res.status(200).json({ message: "All users:", users });
    // Status 200 = OK - Request processed successfully, list of all users returned.
  } catch (error) {
    res.status(500).json({
      message: "Internal server error - Request could not be handled",
      error: error.message,
    });
    // Status 500 = Server error - Request could not be handled.
  }
});

// Get user by username
router.get("/username/:username", async (req, res) => {
  try {
    // Collect username from params and find relevant user in User schema.
    const username = req.params.username;
    const user = await User.findOne({ username }, { password: 0 });
    // Find explaination: {username} finds by username, {password : 0} will not show password.
    if (!user) {
      return res
        .status(404)
        .json({ message: `User with username '${username}' not found.` });
      // Status 404 = Not found - User with provided username not found.
    }
    res.status(200).json({ message: "User found", user });
    // Status 200 = OK - Request processed successfully, user with provided username returned.
  } catch (error) {
    res.status(500).json({
      message: "Internal server error - Request could not be handled",
      error: error.message,
    });
    // Status 500 = Server error - Request could not be handled.
  }
});

// Get user by email
router.get("/email/:email", async (req, res) => {
  try {
    // Collect email from params and find relevant user in User schema.
    const email = req.params.email;
    const user = await User.findOne({ email }, { password: 0 });
    // Find explaination: {email} finds by email, {password : 0} will not show password.
    if (!user) {
      return res
        .status(404)
        .json({ message: `User with Email '${email}' not found.` });
      // Status 404 = Not found - User with provided email not found.
    }
    res.status(200).json({ message: "User found:", user });
    // Status 200 = OK - Request processed successfully, user with provided email returned.
  } catch (error) {
    res.status(500).json({
      message: "Internal server error - Request could not be handled",
      error: error.message,
    });
    // Status 500 = Server error - Request could not be handled.
  }
});

// Register
router.post("/register", async (req, res) => {
  const givenEmail = req.body.email;
  const givenUsername = req.body.username;
  const givenPassword = req.body.password;

  try {
    // Check if user with the same email or username already exists
    const existingEmail = await User.findOne({ email: givenEmail });
    const existingUsername = await User.findOne({ username: givenUsername });

    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists." });
      // Status 400 = Bad request - Email already exists, user fault.
    }

    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists." });
      // Status 400 = Bad request - Username already exists, user fault.
    }

    // Check if email format is valid
    if (!isValidEmail(givenEmail)) {
      return res.status(400).json({
        message:
          "Invalid email format - Please include '@' and domain. No spaces allowed.",
      });
      // Status 400 = Bad request - Invalid email format, user fault.
    }

    // Check if username format is valid
    if (!isValidUsername(givenUsername)) {
      return res.status(400).json({
        message:
          "Invalid username format - Username must be at least 5 characters long. No spaces or capital letters allowed.",
      });
      // Status 400 = Bad request - Invalid username format, user fault.
    }

    // Check if password format is valid
    if (!isValidPassword(givenPassword)) {
      return res.status(400).json({
        message:
          "Invalid password format - Password must be at least 5 characters long, include at least 1 number and capital letter. No spaces allowed.",
      });
      // Status 400 = Bad request - Invalid password format, user fault.
    }

    // Hash password, create new user and add it to User schema.
    const hashedPassword = await bcrypt.hash(givenPassword, 10);
    const newUser = new User({
      email: givenEmail,
      username: givenUsername,
      password: hashedPassword,
    });
    await User.create(newUser);
    res.status(201).json({
      message: `User ${newUser.username} created successfully!`,
      user: newUser,
    });
    // Status 201 = Resource created - New user created message and newUser details.
  } catch (error) {
    res.status(500).json({
      message: "Internal server error - Request could not be handled",
      error: error.message,
    });
    // Status 500 = Server error - Request could not be handled.
  }
});

// Login
router.post("/login", async (req, res) => {
  // Can login either with email OR username.
  const givenEmail = req.body.email;
  const givenUsername = req.body.username;
  const givenPassword = req.body.password;

  // Check if none are provided.
  if (!givenEmail && !givenUsername) {
    return res.status(400).json({ message: "Username or email is required." });
    // Status 400 = Bad request - Username or email not provided, user fault.
  }

  // Check if only one of email or username is provided.
  if (givenEmail && givenUsername) {
    return res
      .status(400)
      .json({ message: "Provide username OR email, not both!" });
    // Status 400 = Bad request - Both email and username provided, user fault.
  }

  // Check if password is provided.
  if (!givenPassword) {
    return res.status(400).json({ message: "Password is required." });
    // Status 400 = Bad request - Password not provided, user fault.
  }

  // Check if given email or username is of existing user.
  try {
    let user;
    if (givenUsername) {
      user = await User.findOne({ username: givenUsername });

      if (!user) {
        return res.status(400).json({ message: "Username not found." });
        // Status 400 = Bad request - Given username incorrect, user fault.
      }
    }

    if (givenEmail) {
      user = await User.findOne({ email: givenEmail });

      if (!user) {
        return res.status(400).json({ message: "Email not found." });
        // Status 400 = Bad request - Given email incorrect, user fault.
      }
    }

    // Check if given password is the same as found user password.
    const isPasswordCorrect = await bcrypt.compare(
      givenPassword,
      user.password
    );
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Incorrect password." });
      // Status 401 = Unauthorized - Given password incorrect, user fault.
    }

    // Create private token for the user.
    const userForToken = {
      user: user.username,
      id: user._id,
    };

    const token = jwt.sign(userForToken, secretKey);
    res
      .status(200)
      .json({ message: `Login successful, welcome ${user.username}!`, token });
    // Status 200 = OK - Request processed successfully, user logged in and provided a private token.
  } catch (error) {
    res.status(500).json({
      message: "Internal server error - Request could not be handled",
      message: error.message,
    });
    // Status 500 = Server error - Request could not be handled.
  }
});

module.exports = router;
