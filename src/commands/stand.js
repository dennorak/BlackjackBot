const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { Blackjack } = require("../services/Blackjack.js");
const { Database } = require("../services/Database.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stand")
    .setDescription("stand in blackjack"),

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
      let state = hand.stand(interaction.user.id);
      console.log(
        state.data.fields[0].value,
        state.data.fields[0].value === /^.*You.*$/gm,
        state.data.fields[0].value.startsWith("You")
      );
      if (state.data.fields[0].value === "House Wins!") {
        interaction.update({ embeds: [state] });
      } else if (state.data.fields[0].value.startsWith("You")) {
        let bet = hand.getBet(interaction.user.id);
        await conn.credit(interaction.user.id, bet * 2);
        interaction.update({ embeds: [state] });
      } else if (state.data.fields[0].value === "draw") {
        let bet = hand.getBet(interaction.user.id);
        await conn.credit(interaction.user.id, bet);
        interaction.update({ embeds: [state] });
      }
    }
  },
};
