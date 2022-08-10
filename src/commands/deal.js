const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonStyle,
  ButtonBuilder,
} = require("discord.js");
const { Blackjack } = require("../services/Blackjack.js");
const { Database } = require("../services/Database.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("deal")
    .setDescription("Begin a game of blackjack")
    .addNumberOption((option) =>
      option.setName("amount").setRequired(true).setDescription("amount to bet")
    ),

  async execute(interaction) {
    const hand = Blackjack.getManager();
    const conn = Database.connect();

    try {
      const ubal = await conn.getBalance(interaction.user.id);
      const bet = interaction.options.getNumber("amount");

      if (ubal < bet) {
        interaction.reply("insufficient balance.");
      } else {
        if (hand.state(interaction.user.id) === "playing") {
          await interaction.reply("you already have a game going!");
        } else {
          await conn.send(0, interaction.user.id, bet);

          const row = new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                .setCustomId("hit")
                .setLabel("Hit")
                .setStyle(ButtonStyle.Success)
            )
            .addComponents(
              new ButtonBuilder()
                .setCustomId("stand")
                .setLabel("Stand")
                .setStyle(ButtonStyle.Primary)
            );

          await interaction.reply({
            embeds: [hand.reset(interaction.user.id, bet)],
            components: [row],
          });
        }
      }
    } catch {
      interaction.reply(`an error occurred.`);
    }
  },
};
