const { Client, Message } = require("discord.js");
const { prefix } = require("../ayarlar.json");
/**
 *
 * @param {Client} client
 * @param {Message} message
 * @returns
 */
module.exports = (client, message) => {
    if (message.author.bot || !message.guild) return;
    if (!message.content.startsWith(prefix)) return;
    const command = message.content.split(" ")[0].slice(prefix.length);
    const args = message.content.split(" ").slice(1);
    const cmd = global.commands.get(command);
    if (cmd) cmd.run(client, message, args);
};
