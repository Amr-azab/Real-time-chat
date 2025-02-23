const http = require("http");
const { config } = require("dotenv");
const app = require("./src/app.js");
const initializeWebSocket = require("./src/utils/websocket.js");

config({ path: ".env" });

const port = process.env.PORT || 5000;
const server = http.createServer(app);

// Initialize WebSocket server
initializeWebSocket(server);

// Start the server
server.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});
