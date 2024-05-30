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
  name: "ürünver",
  description: "Kullanıcıya ürün verir",
  /**
   * @param {Client} client
   * @param {Message} message
   */
  run: async (client, message, args) => {
    if (message.member.id !== global.botOwner) {
      return message.reply({
        content: "Bu komutu sadece bot sahibi kullanabilir",
        ephemeral: true,
      });
    }
    const userId = args[0]; // interaction.options.getUser("kullanıcı");
    const urun = args[1]; //interaction.options.getString("ürün-kodu");
    const miktar = args[2]; //interaction.options.getInteger("miktar");

    if (isNaN(userId) || isNaN(urun) || isNaN(miktar))
      return message.reply({
        content:
          "Komutu hatalı kullandınız. \n Doğru kullanım `!ürün-ver <kullanıcı-Id> <ürün-kodu> <miktar>`",
        ephemeral: true,
      });
    const user = await client.users.fetch(userId);
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
    if (userData.products.find((x) => x.id === String(urun))) {
      await User.updateOne(
        { id: user.id, "products.id": urun },
        { $inc: { "products.$.count": miktar } }
      );
      return message.reply({
        content: `${user.tag} kullanıcısına **${miktar}** adet **${product.name}** verildi.`,
      });
      return;
    } else {
      userData.products.push({
        id: product.id,
        name: product.name,
        balance: product.balance,
        count: miktar,
      });
      await userData.save();
      message.reply({
        content: `${user.tag} kullanıcısına **${miktar}** adet **${product.name}** verildi.`,
      });
      return;
    }
  },
};
