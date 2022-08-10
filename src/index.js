const {
  Client,
  IntentsBitField,
  Collection,
  REST,
  Routes,
  ActivityType,
} = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");
const deal = require("./commands/deal");
const hit = require("./commands/hit");
const stand = require("./commands/stand");
require("dotenv").config();

// Create the client
const client = new Client({
  intents: [
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessageReactions,
    IntentsBitField.Flags.DirectMessages,
  ],
  presence: {
    activities: [
      {
        type: ActivityType.Competing,
        name: "Blackjack",
      },
    ],
  },
});

// log client connection
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// register button handlers
client.on("interactionCreate", (interaction) => {
  if (!interaction.isButton()) return;
  message = interaction.message;
  switch (interaction.customId) {
    case "hit":
      hit.execute(interaction, message);
      break;
    case "stand":
      stand.execute(interaction, message);
      break;
    default:
      interaction.reply("an error occurred.");
  }
});

// get commands
client.commands = new Collection();
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  // Set a new item in the Collection
  // With the key as the command name and the value as the exported module
  client.commands.set(command.data.name, command);
}

// register commands
const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

const commands = client.commands.map((command) => command.data.toJSON());

rest
  .put(Routes.applicationGuildCommands(process.env.CID, process.env.GID), {
    body: commands,
  })
  .then(() => console.log("Successfully registered application commands."))
  .catch(console.error);

// handle commands
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

// begin session
client.login(process.env.TOKEN);
