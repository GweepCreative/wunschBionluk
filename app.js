const fs = require("fs");
const { Client, Collection } = require("discord.js");
const client = new Client({
  fetchAllMembers: true,
  intents: [
    "Guilds",
    "GuildMembers",
    "GuildPresences",
    "GuildMessages",
    "MessageContent",
    "GuildBans",
    "GuildIntegrations",
    "GuildVoiceStates",
    "GuildMessageReactions",
  ],
});
const { isDev, prod, dev, mongoDB } = require("./ayarlar.json");
const token = isDev ? dev.token : prod.token;
global.isDev = isDev;
global.botOwner = isDev ? dev.botOwner : prod.botOwner;
const mongoose = require("mongoose");
mongoose
  .connect(mongoDB)
  .then(() => console.log("Connect MongoDb"))
  .catch(console.error);

global.client = client;
// client.commands = global.commands = [];
global.commands = new Collection();
fs.readdir("./komutlar/", (err, files) => {
  if (err) throw err;

  files.forEach((file) => {
    if (!file.endsWith(".js")) return;
    let props = require(`./komutlar/${file}`);
    global.commands.set(props.name.toLowerCase(), props);
    console.log(`[CMD] Komut Yüklendi: ${props.name}`);
  });
});

fs.readdir("./events/", (_err, files) => {
  files.forEach((file) => {
    if (!file.endsWith(".js")) return;
    const event = require(`./events/${file}`);
    let eventName = file.split(".")[0];

    console.log(`[EVENT] Event yüklendi: ${eventName}`);
    client.on(eventName, (...args) => {
      event(client, ...args);
    });
  });
});
client.on("ready", async () => {
  console.log(
    `[INFO] Bot started in ${isDev ? "DEVELOPMENT" : "PRODUCTION"} mode`
  );
});
client.login(token);
