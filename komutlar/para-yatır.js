const { Client, Message, EmbedBuilder } = require("discord.js");
const { User } = require("../utils/schemas");
module.exports = {
  name: "para-yatır",
  description: "Cüzdanınızdaki paranızı bankaya yatırın",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    const user = message.member.user, // interaction.member.user,
      amount = args[0];
    if (!amount || isNaN(amount))
      return message.reply({
        content: "Lütfen geçerli bir miktar belirtin",
        ephemeral: true,
      });
      
    const userData =
        (await User.findOne({ id: user.id })) || new User({ id: user.id }),
      embed = new EmbedBuilder({ color: "Yellow" });

    if (userData.wallet < amount)
      return message.reply({
        embeds: [
          embed.setDescription(
            `Para yatırmak için cüzdanınızda \` ${
              amount - userData.wallet
            } \` 🪙 daha fazlasına ihtiyacınız var`
          ),
        ],
        ephemeral: true,
      });

    userData.wallet -= amount;
    userData.bank += amount;
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
