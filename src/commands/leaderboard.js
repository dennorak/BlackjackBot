const { SlashCommandBuilder } = require("discord.js");
const { Database } = require("../services/Database.js");
const { getLeaderboardEmbed } = require("../services/BJ_DiscordCompat.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lb")
    .setDescription("gets the current leaderboard"),

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
    let lb = await conn.getLeaderboard(interaction.user.id);

    interaction.reply({ embeds: [getLeaderboardEmbed(lb)] });

    // interaction.reply({ content: `${bal} XWC`, ephemeral: true });
  },
};
