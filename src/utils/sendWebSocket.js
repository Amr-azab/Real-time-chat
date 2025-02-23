const sendError = (ws, message) => {
  ws.send(
    JSON.stringify({
      status: "error",
      message,
    })
  );
};

const sendSuccess = (ws, status, data) => {
  ws.send(
    JSON.stringify({
      status: "success",
      message: status,
      ...data,
    })
  );
};

module.exports = {
  sendError,
  sendSuccess,
};
