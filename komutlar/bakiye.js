const { MessageEmbed, Client, CommandInteraction, Message } = require("discord.js");
const { User } = require("../utils/schemas");
const { botOwner } = require("../ayarlar.json");
module.exports = {
  name: "bakiye",
  description: "Sizin veya başka bir kullanıcının bakiyesini kontrol edin",
  /**
   * @param {Client} client
   * @param {Message} message
   */
  run: async (client, message) => {
    let user =
      interaction.options.getUser("kullanıcı") || interaction.member.user;

    if (interaction.member.id !== botOwner) {
      user = interaction.member.user;
    }
    const userData =
      (await User.findOne({ id: user.id })) || new User({ id: user.id });

    const balanceEmbed = new MessageEmbed()
      .setTitle(`${user.username}'s bakiye`)
      .setDescription("Talep edilen kullanıcının cüzdan ve banka bilgileri")
      .setColor("YELLOW")
      .setThumbnail(user.displayAvatarURL())
      .addField("• Cüzdan", `**\` ${userData.wallet} \`** 🪙`, true)
      .addField("• Banka", `**\` ${userData.bank} \`** 🪙`, true);

    return interaction.reply({
      embeds: [balanceEmbed],
    });
  },
};
