const { Client, Message, EmbedBuilder } = require("discord.js");
const { User } = require("../utils/schemas");
module.exports = {
  name: "parayatır",
  description: "Cüzdanınızdaki paranızı bankaya yatırın",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    const user = message.member.user, // interaction.member.user,
      amount = args[0];
    if (!amount || isNaN(amount) || Number(amount)<1)
      return message.reply({
        content: "Lütfen geçerli bir miktar belirtin",
        ephemeral: true,
      });

    const userData =
        (await User.findOne({ id: user.id })) || new User({ id: user.id }),
      embed = new EmbedBuilder().setColor("Yellow");

    if (userData.wallet < Number(amount))
      return message.reply({
        embeds: [
          embed.setDescription(
            `Para yatırmak için cüzdanınızda \` ${
              Number(amount) - userData.wallet
            } \` 🪙 daha fazlasına ihtiyacınız var`
          ),
        ],
        ephemeral: true,
      });

    userData.wallet -= Number(amount);
    userData.bank += Number(amount);
    userData.save();

    return message.reply({
      embeds: [
        embed.setDescription(
          `✅ Banka hesabınıza \` ${amount} \` 🪙 tutarı yatırdınız`
        ),
      ],
    });
  },
};
