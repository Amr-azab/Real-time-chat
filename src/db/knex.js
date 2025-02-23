const knex = require("knex");
const knexfile = require("../../knexfile.js");

class Database {
  constructor() {
    if (Database.instance) {
      return Database.instance;
    }

    const environment = "development"; // Ensure using the correct environment
    const config = knexfile[environment];

    this.connection = knex(config);
    Database.instance = this;
  }

  getConnection() {
    return this.connection;
  }
}

module.exports = new Database().getConnection();
