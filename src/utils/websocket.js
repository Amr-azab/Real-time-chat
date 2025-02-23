const { Server } = require("ws");
const { CreateNewUser } = require("../controllers/user.controller");
const {
  CreateNewGroup,
  JoinTheGroup,
} = require("../controllers/group.controller");
const {
  sendPrivateMessage,
  sendGroupMessage,
} = require("../controllers/message.controller");
const {
  Connect,
  UnknownMessageType,
  Disconnection,
} = require("../controllers/connection.controller");

const clients = new Map();

const initializeWebSocket = (server) => {
  const wss = new Server({ server });

  wss.on("connection", (ws, req) => {
    console.log("New WebSocket connection established.");

    ws.on("message", async (message) => {
      try {
        const data = JSON.parse(message);
        await handleMessage(ws, data);
      } catch (error) {
        console.error("Error processing message:", error);
        ws.send(
          JSON.stringify({
            status: "error",
            message: "Failed to process message.",
          })
        );
      }
    });

    ws.on("close", () => {
      Disconnection(ws, clients);
    });
  });
};

const handleMessage = async (ws, data) => {
  switch (data.type) {
    case "create_user":
      // Expected request body:
      // {
      //   "type": "create_user",
      //   "username": "amr"
      // }
      await CreateNewUser(ws, data);
      break;
    case "create_group":
      // Expected request body:
      // {
      //   "type": "create_group",
      //   "username": "amr",
      //   "group_name": "Developers"
      // }
      await CreateNewGroup(ws, data, clients);
      break;
    case "join_group":
      // Expected request body:
      // {
      //   "type": "join_group",
      //   "username": "mohamed",
      //   "group_name": "Developers"
      // }
      await JoinTheGroup(ws, data, clients);
      break;
    case "connect":
      // Expected request body:
      // {
      //   "type": "connect",
      //   "username": "amr"
      // }
      Connect(ws, data, clients);
      break;
    case "private_message":
      // Expected request body:
      // {
      //   "type": "private_message",
      //   "sender": "amr",
      //   "receiver": "mohamed",
      //   "message": "Hello, mohamed!"
      // }
      await sendPrivateMessage(ws, data, clients);
      break;
    case "group_message":
      // Expected request body:
      // {
      //   "type": "group_message",
      //   "sender": "amr",
      //   "group_name": "Developers",
      //   "message": "Hello, Developers!"
      // }
      await sendGroupMessage(ws, data, clients);
      break;
    default:
      UnknownMessageType(ws);
  }
};

module.exports = initializeWebSocket;
