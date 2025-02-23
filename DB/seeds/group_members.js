/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex("group_members").del();
  await knex("group_members").insert([
    { group_name: "Developers", username: "amr" },
    { group_name: "Designers", username: "mohamed" },
    { group_name: "Developers", username: "azab" },
  ]);
};
