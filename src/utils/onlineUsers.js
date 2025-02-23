const broadcastOnlineUsers = (clients) => {
  const onlineUsers = Array.from(clients.keys());

  clients.forEach((ws) => {
    ws.send(
      JSON.stringify({
        type: "online_users",
        users: onlineUsers,
      })
    );
  });
};

module.exports = {
  broadcastOnlineUsers,
};
