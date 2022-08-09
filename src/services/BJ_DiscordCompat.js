const { EmbedBuilder } = require("discord.js");

// inside a command, event listener, etc.
const exampleEmbed = new EmbedBuilder()
  .setColor(0x0099ff)
  .setTitle("Some title")
  .setURL("https://discord.js.org/")
  .setAuthor({
    name: "Some name",
    iconURL: "https://i.imgur.com/AfFp7pu.png",
    url: "https://discord.js.org",
  })
  .setDescription("Some description here")
  .setThumbnail("https://i.imgur.com/AfFp7pu.png")
  .addFields(
    { name: "Regular field title", value: "Some value here" },
    { name: "\u200B", value: "\u200B" },
    { name: "Inline field title", value: "Some value here", inline: true },
    { name: "Inline field title", value: "Some value here", inline: true }
  )
  .addFields({
    name: "Inline field title",
    value: "Some value here",
    inline: true,
  })
  .setImage("https://i.imgur.com/AfFp7pu.png")
  .setTimestamp()
  .setFooter({
    text: "Some footer text here",
    iconURL: "https://i.imgur.com/AfFp7pu.png",
  });

module.exports = {
  getEmbed: function (uid, status, dh, ph) {
    console.log(ph, dh);

    return new EmbedBuilder()
      .setAuthor({
        name: "Blackjack",
        iconURL:
          "https://raw.githubusercontent.com/ixdko/BlackjackBot/master/assets/card_back.png",
      })
      .addFields(
        { name: "Game Status", value: status },
        { name: "\u200B", value: "\u200B" },
        { name: "Your Hand", value: ph.toString(), inline: true },
        { name: "Dealer Hand", value: dh.toString(), inline: true }
      )
      .setFooter({
        text: uid,
      });
  },
};
