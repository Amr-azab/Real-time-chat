/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex("groups").del();
  await knex("groups").insert([
    { group_name: "Developers" },
    { group_name: "Designers" },
  ]);
};
