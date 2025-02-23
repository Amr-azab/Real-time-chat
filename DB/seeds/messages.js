/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex("messages").del();
  await knex("messages").insert([
    { sender: "amr", receiver: "mohamed", message: "Hello, mohamed!" },
    { sender: "mohamed", receiver: "azab", message: "Hi, azab!" },
    {
      sender: "amr",
      group_name: "Developers",
      message: "Welcome to Developers group!",
    },
  ]);
};
