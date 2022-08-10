const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const { Database } = require("../services/Database.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("faucet")
    .setDescription("free coin go brr"),

  async execute(interaction) {
    const conn = Database.connect();

    const timeout = await conn.getTimeout(interaction.user.id);

    if (timeout <= Math.floor(Date.now() / 1000) || timeout === null) {
      const res = await conn.pour(interaction.user.id);
      interaction.reply(res);
    } else {
      interaction.reply({
        content: `Please wait before using the faucet again!`,
        ephemeral: true,
      });
    }
  },
};
