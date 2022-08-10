const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { Blackjack } = require("../services/Blackjack.js");
const { Database } = require("../services/Database.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("hit")
    .setDescription("hit in blackjack"),

  async execute(interaction, msg) {
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
      await interaction.reply({
        content: "you don't have a game going!",
        ephemeral: true,
      });
    } else {
      let state = hand.hit(interaction.user.id);
      if (state === "House Wins!") {
        interaction.update({ embeds: [state] });
      } else if (state.data.fields[0].value.startsWith("You")) {
        let bet = hand.getBet(interaction.user.id);
        await conn.credit(interaction.user.id, bet * 2);
        interaction.update({ embeds: [state] });
      } else if (state === "draw") {
        let bet = hand.getBet(interaction.user.id);
        await conn.credit(interaction.user.id, bet);
        interaction.update({ embeds: [state] });
      } else {
        interaction.update({ embeds: [state] });
      }
    }
  },
};
