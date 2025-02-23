const db = require("../db/knex");
const { broadcastOnlineUsers } = require("../utils/onlineUsers");
const { sendError, sendSuccess } = require("../utils/sendWebSocket");

exports.Connect = async (ws, data, clients) => {
  if (!data.username) {
    return sendError(ws, "Username is required");
  }
  const userExists = await db("users")
    .where({ username: data.username })
    .first();
  if (!userExists) {
    return sendError(ws, "User does not exist");
  }
  clients.set(data.username, ws);
  console.log(`${data.username} connected.`);
  sendSuccess(ws, "connected", { username: data.username });
  broadcastOnlineUsers(clients); // Update online users after connection
};

exports.Disconnection = async (ws, clients) => {
  for (const [username, client] of clients.entries()) {
    if (client === ws) {
      clients.delete(username);
      console.log(`${username} disconnected.`);
      broadcastOnlineUsers(clients); // Update online users after disconnection
      break;
    }
  }
};

exports.UnknownMessageType = async (ws) => {
  ws.send(JSON.stringify({ status: "error", message: "Unknown message type" }));
};
