const { User } = require("../utils/schemas");
const shop = require("../utils/shop");
const { Client, Message } = require("discord.js");
module.exports = {
  name: "satınal",
  description: "Belirtilen Ürünü Satın Alırsınız",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    let urun_kod = args[0]; //interaction.options.getInteger("ürün-kodu");
    let user = message.member.user;
    if (isNaN(urun_kod))
      return message.reply({
        embeds: [{ title: "Hata", description: "Ürün kodu sayı olmalıdır" }],
      });

    let data = (await shop.findOne({ id: urun_kod })) || null;
    if (!data)
      return message.reply({
        embeds: [
          {
            title: "Ürün Bulunamadı",
            description: "Belirtilen ürün koduna ait ürün bulunamadı",
          },
        ],
      });
    const userData =
      (await User.findOne({ id: user.id })) || new User({ id: user.id });
    if (userData.wallet < data.balance)
      return message.reply({
        embeds: [{ title: "Hata", description: "Bakiye yetersiz" }],
      });
    await User.updateOne(
      { id: user.id },
      { $inc: { wallet: -data.balance }, $push: { products: data } }
    );

    message.reply({
      embeds: [
        {
          title: "Ürün Satın Alındı",
          fields: [
            { name: "Ürün Adı", value: `${data.name}` },
            { name: "Ücret", value: `${data.balance}` },
          ],
        },
      ],
    });
  },
};
