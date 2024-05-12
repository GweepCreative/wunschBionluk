const {
  MessageEmbed,
  Client,
  CommandInteraction,
  Message,
  EmbedBuilder,
} = require("discord.js");
module.exports = {
  name: "Ping",
  description: "Botun Geçikme Değeri",
  /**
   * @param {Client} client
   * @param {Message} message
   */
  run: async (client, message, args) => {
    const embed = new EmbedBuilder()
      .setTitle(":ping_pong: Pong!")
      .setDescription(`Gecikme değeri: ${client.ws.ping}ms!`);
    if (client.ws.ping < 60) embed.setColor("Green");
    else if (client.ws.ping > 60 && client.ws.ping < 120)
      embed.setColor("Yellow");
    else if (client.ws.ping > 120) embed.setColor("Red");
    message.reply({ embeds: [embed] });
  },
};
