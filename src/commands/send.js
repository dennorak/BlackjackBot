const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { Database } = require("../services/Database.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("send")
    .setDescription("send XWC to another user")
    .addNumberOption((option) =>
      option
        .setName("amount")
        .setRequired(true)
        .setDescription("amount to send")
    )
    .addStringOption((option) =>
      option.setName("recipient").setRequired(true).setDescription("recipient")
    ),

  async execute(interaction) {
    const conn = Database.connect();

    /*const exampleEmbed = new EmbedBuilder()
      .setAuthor({
        name: "Blackjack",
        iconURL: "http://beaconwire.com/card_back.png",
      })
      .setThumbnail(await hand.renderDealer())
      .setImage(await hand.renderHand())
      .setFooter({
        text: `${hand.uuid}`,
        iconURL: "http://beaconwire.com/card_back.png",
      });*/
    const res = await conn.send(
      parseInt(interaction.options.getString("recipient")),
      interaction.user.id,
      interaction.options.getNumber("amount")
    );
    interaction.reply(res);
  },
};
