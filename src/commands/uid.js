const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("address")
    .setDescription("get your XWC address"),

  async execute(interaction) {
    await interaction.reply(interaction.user.id);
  },
};
