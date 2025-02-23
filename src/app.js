const express = require("express");
const morgan = require("morgan");
const userRoutes = require("./routes/user.route");
const groupRoutes = require("./routes/group.route");
const messageRoutes = require("./routes/message.route");
const errorController = require("./controllers/error.controller.js");
const AppError = require("./utils/appError.js");

const app = express();
app.use(express.json());

// Logging Request
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/messages", messageRoutes);

// Not Found Router
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handler
app.use(errorController);

module.exports = app;
