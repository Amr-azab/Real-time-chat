const db = require("../db/knex");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { sendError, sendSuccess } = require("../utils/sendWebSocket");

//========== REST API - Group Management

// Get all groups
exports.getAllGroups = catchAsync(async (req, res, next) => {
  const groups = await db("groups").select("id", "group_name");
  res.json(groups);
});

// Create a new group
exports.createGroup = catchAsync(async (req, res, next) => {
  const { group_name } = req.body;
  if (!group_name) {
    return next(new AppError("Group name is required", 400));
  }

  const groupExists = await db("groups").where({ group_name }).first();
  if (groupExists) {
    return next(new AppError("Group already exists", 400));
  }

  const [groupId] = await db("groups").insert({ group_name });
  res.status(201).json({ id: groupId, group_name });
});

// Join an existing group
exports.joinGroup = catchAsync(async (req, res, next) => {
  const { username, group_name } = req.body;
  if (!username || !group_name) {
    return next(new AppError("Username and group name are required", 400));
  }

  const userExists = await db("users").where({ username }).first();
  if (!userExists) {
    return next(new AppError("User does not exist", 400));
  }

  const groupExists = await db("groups").where({ group_name }).first();
  if (!groupExists) {
    return next(new AppError("Group does not exist", 400));
  }

  const isMember = await db("group_members")
    .where({ group_name, username })
    .first();
  if (isMember) {
    return next(new AppError("User is already a member of this group", 400));
  }

  await db("group_members").insert({ group_name, username });
  res
    .status(200)
    .json({ message: `User ${username} joined group ${group_name}` });
});

// ================== WebSocket - Group Management

// Create a new group via WebSocket
exports.CreateNewGroup = async (ws, data, clients) => {
  const { username, group_name } = data;

  if (!username || !group_name) {
    return sendError(ws, "Username and group name are required");
  }

  // Check if the user is connected
  if (!clients.has(username)) {
    return sendError(ws, "You must connect first before creating a group");
  }
  const userExists = await db("users").where({ username }).first();
  if (!userExists) {
    return sendError(ws, "User does not exist");
  }
  const groupExists = await db("groups").where({ group_name }).first();
  if (groupExists) {
    return sendError(ws, "Group already exists");
  }

  await db("groups").insert({ group_name });
  sendSuccess(ws, "Group created", { group_name });
};

// ============= Join an existing group via WebSocket
exports.JoinTheGroup = async (ws, data, clients) => {
  const { username, group_name } = data;

  if (!username || !group_name) {
    return sendError(ws, "Username and group  are required");
  }

  const userExists = await db("users").where({ username }).first();
  if (!userExists) {
    return sendError(ws, "User does not exist");
  }
  // Check if the user is connected
  if (!clients.has(username)) {
    return sendError(ws, "You must connect first before joining a group");
  }

  const groupExists = await db("groups").where({ group_name }).first();
  if (!groupExists) {
    return sendError(ws, "Group does not exist");
  }

  const isMember = await db("group_members")
    .where({ group_name, username })
    .first();
  if (isMember) {
    return sendError(ws, "User is already a member of this group");
  }

  await db("group_members").insert({ group_name, username });
  sendSuccess(ws, "Joined group", { group_name });
  // Notify all group members
  const members = await db("group_members")
    .where({ group_name })
    .pluck("username");

  members.forEach((member) => {
    if (clients.has(member)) {
      clients.get(member).send(
        JSON.stringify({
          type: "group_notification",
          group_name,
          message: `${username} has joined the group ${group_name}`,
        })
      );
    }
  });
  // if (clients.has(username)) {
  //   clients.get(username).send(
  //     JSON.stringify({
  //       type: "group_join",
  //       group_name,
  //       message: `You have joined the group ${group_name}`,
  //     })
  //   );
  // }
};
