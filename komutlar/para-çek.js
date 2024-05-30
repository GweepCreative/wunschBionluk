const { Client, Message, EmbedBuilder } = require("discord.js");
const { User } = require("../utils/schemas");
module.exports = {
  name: "paraçek",
  description: "Bankanızdan para çekin",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    const user = message.member.user,
      amount = args[0]; //message.options.get("miktar").value
    (userData =
      (await User.findOne({ id: user.id })) || new User({ id: user.id })),
      (embed = new EmbedBuilder().setColor("Yellow"));

      if(!amount || isNaN(amount) || Number(amount)<1) return message.reply({content: "Lütfen geçerli bir miktar belirtin", ephemeral: true});
    if (userData.bank < Number(amount))
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

    userData.bank -= Number(amount);
    userData.wallet += Number(amount);
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
