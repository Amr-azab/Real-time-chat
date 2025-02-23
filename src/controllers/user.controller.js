const db = require("../db/knex");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { sendError, sendSuccess } = require("../utils/sendWebSocket");

// ============== REST API - User Management

// Get all users
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await db("users").select("id", "username");
  res.json(users);
});

// Create a new user
exports.createUser = catchAsync(async (req, res, next) => {
  const { username } = req.body;
  if (!username) {
    return next(new AppError("Username is required", 400));
  }

  const userExists = await db("users").where({ username }).first();
  if (userExists) {
    return next(new AppError("Username already exists", 400));
  }

  const [userId] = await db("users").insert({ username });
  res.status(201).json({ id: userId, username });
});

// ================= WebSocket - User Management
exports.CreateNewUser = async (ws, data) => {
  const { username } = data;

  if (!username) {
    return sendError(ws, "Username is required");
  }

  const userExists = await db("users").where({ username }).first();
  if (userExists) {
    return sendError(ws, "Username already exists");
  }

  await db("users").insert({ username });
  sendSuccess(ws, "User created", { username });
};
