const { config } = require("dotenv");
const path = require("path");

config();

const dbconfig = {
  development: {
    client: "sqlite3",
    connection: {
      filename: path.join(__dirname, "database.sqlite"), // Database file
    },
    useNullAsDefault: true, // Required for SQLite
    migrations: {
      directory: path.join(__dirname, "DB/migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "DB/seeds"),
    },
  },
  production: {
    client: "sqlite3",
    connection: {
      filename: path.join(__dirname, "database.sqlite"), // Database file
    },
    useNullAsDefault: true,
    migrations: {
      directory: path.join(__dirname, "DB/migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "DB/seeds"),
    },
  },
};

module.exports = dbconfig;
