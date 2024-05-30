const {
  MessageEmbed,
  Client,
  CommandInteraction,
  Message,
} = require("discord.js");
const Shop = require("../utils/shop");
const { botOwner } = require("../ayarlar.json");
const { User } = require("../utils/schemas");
module.exports = {
  name: "ürünal",
  description: "Kullanıcının ürününü alır",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    if (message.member.id !== global.botOwner) {
      return message.reply({
        content: "Bu komutu sadece bot sahibi kullanabilir",
        ephemeral: true,
      });
    }
    const user = args[0]; // interaction.options.getUser("kullanıcı");
    const urun = args[1]; //interaction.options.getString("ürün-kodu");
    const miktar = args[2]; //interaction.options.getInteger("miktar");
    if (isNaN(user) || isNaN(urun) || isNaN(miktar))
      return message.reply({
        content:
          "Komutu hatalı kullandınız. \n Doğru kullanım `!ürün-al <kullanıcı-Id> <ürün-kodu> <miktar>`",
        ephemeral: true,
      });
    if (miktar <= 0) {
      return message.reply({
        content: "Miktar 0'dan büyük olmalıdır",
        ephemeral: true,
      });
    }
    const userData =
      (await User.findOne({ id: user.id })) || new User({ id: user.id });
    const product = await Shop.findOne({ id: urun });
    if (!product) {
      return message.reply({
        content: "Ürün bulunamadı",
        ephemeral: true,
      });
    }
    const userProducts = userData.products.find((x) => x.id === String(urun));

    if (userProducts) {
      if (userProducts.count === miktar || userProducts.count < miktar) {
        await User.updateOne(
          { id: user.id },
          { $pull: { products: { id: urun } } }
        );
      } else {
        await User.updateOne(
          { id: user.id, "products.id": urun },
          { $inc: { "products.$.count": -miktar } }
        );
      }
      return message.reply({
        content: `${user.tag} kullanıcısından **${miktar}** adet **${product.name}** alındı.`,
      });
    } else {
      return message.reply({
        content: "Kullanıcının envanterinde bu ürün bulunmamaktadır",
        ephemeral: true,
      });
    }
  },
};
