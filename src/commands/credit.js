const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const { Database } = require("../services/Database.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("credit")
    .setDescription("send XWC to another user")
    .addNumberOption((option) =>
      option
        .setName("amount")
        .setRequired(true)
        .setDescription("amount to send")
    )
    .addUserOption((option) =>
      option.setName("recipient").setRequired(true).setDescription("recipient")
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const conn = Database.connect();

    const res = await conn.credit(
      interaction.options.getUser("recipient").id,
      interaction.options.getNumber("amount")
    );
    interaction.reply(res);
  },
};

function getUserFromMention(mention) {
  if (!mention) return;

  if (mention.startsWith("<@") && mention.endsWith(">")) {
    mention = mention.slice(2, -1);

    if (mention.startsWith("!")) {
      mention = mention.slice(1);
    }

    return mention;
  }
}
