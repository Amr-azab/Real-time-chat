const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error("ERROR 💥", err);

    res.status(500).json({
      status: "error",
      message: i18n.__("somethingWrong"),
    });
  }
};
const sendErrorDev = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

// const errorController = (err, req, res, next) => {
//   err.statusCode = err.statusCode || 500;
//   err.status = err.status || "error";
//   if (process.env.NODE_ENV === "development") {
//     // sendErrorProd(err, res);
//     sendErrorDev(err, res);
//   } else if (process.env.NODE_ENV === "production") {
//     sendErrorProd(err, res);
//   }
// };
const errorController = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // Always use the development error handler
  sendErrorDev(err, res);
};

module.exports = errorController;
