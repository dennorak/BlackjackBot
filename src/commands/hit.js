const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { Blackjack } = require("../services/Blackjack.js");
const { Database } = require("../services/Database.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("hit")
    .setDescription("hit in blackjack"),

  async execute(interaction) {
    const hand = Blackjack.getManager();
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
    if (hand.state(interaction.user.id) !== "playing") {
      await interaction.reply("you don't have a game going!");
    } else {
      let state = hand.hit(interaction.user.id);
      if (state === "dealer") {
        await interaction.reply({ embeds: [state] });
      } else if (state === "player") {
        let bet = hand.getBet(interaction.user.id);
        await conn.credit(interaction.user.id, bet * 2);
        await interaction.reply({ embeds: [state] });
      } else if (state === "draw") {
        let bet = hand.getBet(interaction.user.id);
        await conn.credit(interaction.user.id, bet);
        await interaction.reply({ embeds: [state] });
      } else {
        await interaction.reply({ embeds: [state] });
      }
    }
  },
};
