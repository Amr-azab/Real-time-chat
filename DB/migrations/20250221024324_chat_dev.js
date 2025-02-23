/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("users", (table) => {
      table.increments("id").primary();
      table.string("username").unique().notNullable();
    })
    .createTable("groups", (table) => {
      table.increments("id").primary();
      table.string("group_name").unique().notNullable();
    })
    .createTable("messages", (table) => {
      table.increments("id").primary();
      table
        .string("sender")
        .notNullable()
        .references("username")
        .inTable("users");
      table.string("receiver").nullable(); // Nullable for group messages
      table.string("group_name").nullable(); // Nullable for private messages
      table.text("message").notNullable();
      table.timestamp("timestamp").defaultTo(knex.fn.now());
    })
    .createTable("group_members", (table) => {
      table.increments("id").primary();
      table.string("group_name").references("group_name").inTable("groups");
      table.string("username").references("username").inTable("users");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .dropTable("group_members")
    .dropTable("messages")
    .dropTable("groups")
    .dropTable("users");
};
