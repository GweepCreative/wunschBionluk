const { Client, Message, EmbedBuilder } = require("discord.js");
const { User } = require("../utils/schemas");
module.exports = {
  name: "paragönder",
  description: "Kullanıcıya Para Gönderir (%20 Komisyon keser)",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    if (
      !args[0] ||
      !args[1] ||
      args[0].length < 17 ||
      isNaN(args[0].replace(/[<>@!]/g, "")) ||
      isNaN(args[1]) ||
      Number(args[1]) < 1 ||
      Number(args[1]) > 10000
    )
      return message.reply(
        "Hata kullanım lütfen geçerli bilgiler giriniz.\nDoğru kullanım: !paragönder @user miktar"
      );
    let userId = args[0].replace(/[<>@!]/g, ""); //interaction.options.getUser("kullanıcı").id;
    let author = message.member.user.id;
    let amount = Number(args[1]); //interaction.options.get("miktar").value;
    let komisyon = Math.ceil((amount * 10) / 100);
    let total = amount - komisyon;
    if (!client.users.fetch(userId))
      return message.reply({
        embeds: [
          { title: "Sistemde böyle bir kullanıcı bulamıyorum", color: "RED" },
        ],
      });
    const embed = new EmbedBuilder().setColor("Yellow");
    const userData =
      (await User.findOne({ id: author })) || new User({ id: author });

    const clientData =
      (await User.findOne({ id: userId })) || new User({ id: userId });
    if (userData.wallet < amount)
      return message.reply({
        embeds: [
          {
            description: `Hesabınızda yeteri kadar para bulunmuyor. Gerekli miktar \`${amount}\` 🪙 SGAT Cash`,
            color: "Red",
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
          `✅ Kullanıcı hesabınıza \` ${total} \` 🪙 tutar SGTK Cash eklendi. Hesabınızdan kesilen miktar \` ${amount} \``
        ),
      ],
    });
  },
};
