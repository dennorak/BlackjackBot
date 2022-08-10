const { SlashCommandBuilder } = require("discord.js");
const { Database } = require("../services/Database.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("register")
    .setDescription("get your XWC address"),

  async execute(interaction) {
    const conn = Database.connect();

    await interaction.reply({
      content: await conn.register(interaction.user.id),
      ephemeral: true,
    });
  },
};
