const { Client, Message, EmbedBuilder } = require("discord.js");
const { User } = require("../utils/schemas");

module.exports = {
  name: "paraal",
  description: "Kullanıcıdan para alır",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message,args) => {
    if (message.member.id !== global.botOwner)
      return message.reply({
        content: "Bu komutu kullanmak için Bot Sahibi Olmazsınız",
        ephemeral: true,
      });
    let userId = args[0].replace(/[<>@!]/g,"") //interaction.options.getUser("kullanıcı").id;
    let samount = args[1] //interaction.options.get("miktar").value;
    if(isNaN(Number(samount))) return message.reply("Lütfen geçerli bir sayı giriniz")
let amount = Number(samount)
if (!client.users.fetch(userId))
      return message.reply({
        embeds: [
          { title: "Sistemde böyle bir kullanıcı bulamıyorum", color: "RED" },
        ],
      });
    const embed = new EmbedBuilder().setColor("Yellow");
    const userData =
      (await User.findOne({ id: userId })) || new User({ id: userId });
    if (userData.wallet >= amount) {
      userData.wallet -= amount;
    } else {
      if (userData.bank >= amount) {
        userData.bank -= amount;
      } else {
        userData.wallet = 0;
      }
    }
    userData.save();
    return message.reply({
      embeds: [
        embed.setDescription(
          `✅ Kullanıcı hesabından \` ${amount} \` 🪙 tutar para alındı`
        ),
      ],
    });
  },
};
