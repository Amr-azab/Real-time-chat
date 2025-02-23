const db = require("../db/knex");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { sendError, sendSuccess } = require("../utils/sendWebSocket");

// ============== REST API - Message Management

// Get private messages for a user
exports.getPrivateMessages = catchAsync(async (req, res, next) => {
  const { username } = req.params;
  const messages = await db("messages")
    .where(function () {
      this.where({ receiver: username }).orWhere({ sender: username });
    })
    .andWhere("group_name", null)
    .orderBy("timestamp", "desc")
    .limit(20);
  // Get the total count of private messages
  const totalMessages = await db("messages")
    .where(function () {
      this.where({ receiver: username }).orWhere({ sender: username });
    })
    .andWhere("group_name", null)
    .count("id as count")
    .first();
  res.json({ success: true, totalMessages: totalMessages.count, messages });
});

// =============== Get messages from a group
exports.getGroupMessages = catchAsync(async (req, res, next) => {
  const { groupName } = req.params;
  // Check if the group exists
  const groupExists = await db("groups")
    .where({ group_name: groupName })
    .first();
  if (!groupExists) {
    return next(new AppError("Group does not exist", 404));
  }
  const messages = await db("messages")
    .where({ group_name: groupName })
    .orderBy("timestamp", "desc") // Latest first
    .limit(20); // Limit messages
  const totalMessages = await db("messages")
    .where({ group_name: groupName })
    .count("id as count")
    .first();
  res.json({ success: true, totalMessages: totalMessages.count, messages });
});

// =============== WebSocket - Message Management

// sending a private message via WebSocket
exports.sendPrivateMessage = async (ws, data, clients) => {
  const { sender, receiver, message } = data;

  if (!sender || !receiver || !message) {
    return sendError(ws, "Invalid private message format");
  }
  if (sender === receiver) {
    return sendError(ws, "You cannot send a message to yourself");
  }

  if (!clients.has(sender)) {
    return sendError(ws, "You must be connected to send messages");
  }

  const receiverExists = await db("users")
    .where({ username: receiver })
    .first();
  if (!receiverExists) {
    return sendError(ws, "Receiver does not exist");
  }

  await db("messages").insert({ sender, receiver, message });
  sendSuccess(ws, "sent", { receiver, message });

  if (clients.has(receiver)) {
    clients
      .get(receiver)
      .send(JSON.stringify({ type: "private_message", sender, message }));
  }
};

// sending a group message via WebSocket
exports.sendGroupMessage = async (ws, data, clients) => {
  const { sender, group_name, message } = data;

  if (!sender || !group_name || !message) {
    return sendError(ws, "Invalid group message format");
  }

  if (!clients.has(sender)) {
    return sendError(ws, "You must be connected to send messages");
  }

  const isMember = await db("group_members")
    .where({ group_name, username: sender })
    .first();
  if (!isMember) {
    return sendError(ws, "You must join the group before sending messages");
  }

  await db("messages").insert({
    sender,
    receiver: null,
    group_name,
    message,
  });

  sendSuccess(ws, "sent", { group_name, message });

  const members = await db("group_members")
    .where({ group_name })
    .pluck("username");

  members.forEach((user) => {
    if (clients.has(user) && user !== sender) {
      clients.get(user).send(
        JSON.stringify({
          type: "group_message",
          sender,
          group_name,
          message,
        })
      );
    }
  });
};
