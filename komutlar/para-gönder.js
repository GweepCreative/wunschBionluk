const {
  Client,
  Message,
  EmbedBuilder,
} = require("discord.js");
const { User } = require("../utils/schemas");
module.exports = {
  name: "para-gönder",
  description: "Kullanıcıya Para Gönderir (%20 Komisyon keser)",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    let userId = args[0]; //interaction.options.getUser("kullanıcı").id;
    let author = message.member.user.id;
    let amount = args[1]; //interaction.options.get("miktar").value;
    let komisyon = Math.ceil((amount * 10) / 100);
    let total = amount - komisyon;
    if (!client.users.fetch(userId))
      return message.reply({
        embeds: [
          { title: "Sistemde böyle bir kullanıcı bulamıyorum", color: "RED" },
        ],
      });
    const embed = new EmbedBuilder({ color: "Yellow" });
    const userData =
      (await User.findOne({ id: author })) || new User({ id: author });

    const clientData =
      (await User.findOne({ id: userId })) || new User({ id: userId });
    if (userData.wallet < amount)
      return message.reply({
        embeds: [
          {
            description: `Hesabınızda yeteri kadar para bulunmuyor. Gerekli miktar \`${amount}\` 🪙 SGAT Cash`,
            color: "RED",
          },
        ],
      });
    userData.wallet -= amount;
    clientData.wallet += total;
    userData.save();
    clientData.save();
    return message.reply({
      embeds: [
        embed.setDescription(
          `✅ Kullanıcı hesabınıza \` ${total} \` 🪙 tutar SGAT Cash eklendi. Hesabınızdan kesilen miktar \` ${amount} \``
        ),
      ],
    });
  },
};
