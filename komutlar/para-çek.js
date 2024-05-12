const {
  Client,
  Message,
  EmbedBuilder,
} = require("discord.js");
const { User } = require("../utils/schemas");
module.exports = {
  name: "para-çek",
  description: "Bankanızdan para çekin",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message) => {
    const user = message.member.user,
      amount = args[0]; //message.options.get("miktar").value
    (userData =
      (await User.findOne({ id: user.id })) || new User({ id: user.id })),
      (embed = new EmbedBuilder({ color: "Yellow" }));

    if (userData.bank < amount)
      return message.reply({
        embeds: [
          embed.setDescription(
            `💰 Para çekmek için banka hesabınızda \` ${
              amount - userData.bank
            } \` 🪙 daha fazlasına ihtiyacınız var`
          ),
        ],
        ephemeral: true,
      });

    userData.bank -= amount;
    userData.wallet += amount;
    userData.save();

    return message.reply({
      embeds: [
        embed.setDescription(
          `✅ Banka hesabınızdan \` ${amount} \` 🪙 tutarını çektiniz`
        ),
      ],
    });
  },
};
