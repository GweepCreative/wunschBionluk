const {
  EmbedBuilder,
  Client,
  Message,
} = require("discord.js");
const komutlarListesi = new Map(global.commands);
const { prefix } = require("../ayarlar.json");
module.exports = {
  name: "yardım",
  description: "Botun Komut Menüsü",
  /**
   * @param {Client} client
   * @param {Message} message
   */
  run: async (client, message) => {
    let komutlar = [];
    komutlarListesi.forEach((commands) => {
      komutlar.push( {
        name: `${prefix}${commands.name}`,
        value: commands.description,
        inline: true,
      });
    });
    const embed = new EmbedBuilder()
      .setTitle(`${client.user.username} Yardım Menüsü`)
      .setDescription(`Bu komutler ile beni kullanabilirsin!`)
      .setColor("Gold")
      .setFields(komutlar)
      .setFooter({
        text: `${message.member.user.username} tarafından istendi`,
        iconURL: message.member.user.avatarURL({ dynmic: true }),
      })
      .setTimestamp();
    message.reply({ embeds: [embed] });
  },
};
