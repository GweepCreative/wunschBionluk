const { Client, Message, EmbedBuilder } = require("discord.js");
const { User } = require("../utils/schemas");
module.exports = {
  name: "paraver",
  description: "Kullanıcıya Para Verir",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    if (!message.member.roles.cache.has(global.modRoleId))
      return message.reply({
        content: "Bu komutu kullanmak için yetkili olmazsınız",
        ephemeral: true,
      });
    if (!args[0] || !args[1])
      return message.reply("Hatalı kullanım.\n!para-ver @user <miktar>");

    let userId = args[0].replace(/[<>@!]/g, ""); // interaction.options.getUser("kullanıcı").id;
    let samount = args[1]; //interaction.options.get("miktar").value;
    if (isNaN(Number(samount)))
      return message.reply("Lütfen geçerli bir sayı giriniz");
    let amount = Number(samount);
    if (userId.length < 18)
      return message.reply("Hatalı kullanım.\n!para-ver @user <miktar>");
    if (!client.users.fetch(userId))
      return message.reply({
        embeds: [
          { title: "Sistemde böyle bir kullanıcı bulamıyorum", color: "Red" },
        ],
      });
    const embed = new EmbedBuilder().setColor("Yellow");
    const userData =
      (await User.findOne({ id: userId })) || new User({ id: userId });
    userData.wallet += Number(amount);
    userData.save();
    return message.reply({
      embeds: [
        embed.setDescription(
          `✅ Kullanıcı hesabınıza \` ${amount} \` 🪙 tutar para eklendi`
        ),
      ],
    });
  },
};
