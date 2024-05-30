const {
  MessageEmbed,
  Client,
  CommandInteraction,
  Message,
  EmbedBuilder,
} = require("discord.js");
const { User } = require("../utils/schemas");
module.exports = {
  name: "bakiye",
  description: "Sizin veya başka bir kullanıcının bakiyesini kontrol edin",
  isAdmin: false,
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    let user = args[0]
      ? (await message.guild.members.fetch(args[0].replace(/[<>@!]/g, ""))).user
      : message.member.user;

    if (message.member.user.id !== global.botOwner) {
      user = message.member.user;
    }
    const userData =
      (await User.findOne({ id: user.id })) || new User({ id: user.id });

    const balanceEmbed = new EmbedBuilder()
      .setTitle(`${user.username}'s bakiye`)
      .setDescription("Talep edilen kullanıcının cüzdan ve banka bilgileri")
      .setColor("Yellow")
      .setThumbnail(user.displayAvatarURL())
      .setFields([
        {
          name: "• Cüzdan",
          value: `**\` ${userData.wallet} \`** 🪙`,
          inline: true,
        },
        {
          name: "• Banka",
          value: `**\` ${userData.bank} \`** 🪙`,
          inline: true,
        },
      ]);

    return message.reply({
      embeds: [balanceEmbed],
    });
  },
};
