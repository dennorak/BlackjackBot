const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { Hand } = require("../game.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("deal")
    .setDescription("Begin a game og blackjack"),
  /*.addStringOption((option) =>
      option
        .setName("suit")
        .setDescription("card suit")
        .setRequired(true)
        .addChoices(
          { name: "diamonds", value: "diamonds" },
          { name: "hearts", value: "hearts" },
          { name: "spades", value: "spades" },
          { name: "clubs", value: "clubs" }
        )
    )
    .addStringOption((option) =>
      option
        .setName("deno")
        .setDescription("card deno")
        .setRequired(true)
        .addChoices(
          { name: "A", value: "A" },
          { name: "2", value: "02" },
          { name: "3", value: "03" },
          { name: "4", value: "04" },
          { name: "5", value: "05" },
          { name: "6", value: "06" },
          { name: "7", value: "07" },
          { name: "8", value: "08" },
          { name: "9", value: "09" },
          { name: "10", value: "10" },
          { name: "J", value: "J" },
          { name: "Q", value: "Q" },
          { name: "K", value: "K" }
        )
    ),*/

  async execute(interaction) {
    // const suit = interaction.options.getString("suit");
    // const deno = interaction.options.getString("deno");

    const hand = new Hand(interaction.user.id);

    const exampleEmbed = new EmbedBuilder()
      .setAuthor({
        name: "Blackjack",
        iconURL: "http://beaconwire.com/card_back.png",
      })
      .setThumbnail(await hand.renderDealer())
      .setImage(await hand.renderHand())
      .setFooter({
        text: `${hand.uuid}`,
        iconURL: "http://beaconwire.com/card_back.png",
      });
    const message = await interaction.reply({
      embeds: [exampleEmbed],
      fetchReply: true,
    });
    await message.react("🔽");
    await message.react("✅");

    const filter = (reaction, user) => {
      return (
        ["🔽", "✅"].includes(reaction.emoji.name) &&
        user.id === interaction.user.id
      );
    };

    const reaction = await message
      .awaitReactions({ filter, max: 1, time: 60000, errors: ["time"] })
      .then((collection) => {
        return collection.first();
      });

    if (reaction._emoji.name === "🔽") {
      message.reply("You reacted with hit.");
    } else {
      message.reply("You reacted with call.");
    }
  },
};
