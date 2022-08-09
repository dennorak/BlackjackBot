const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { Database } = require("../services/Database.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("gets your current balance"),

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
    let bal = await conn.getBalance(interaction.user.id);
    interaction.reply({ content: `${bal} XWC`, ephemeral: true });
  },
};
