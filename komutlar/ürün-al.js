const { MessageEmbed, Client, CommandInteraction } = require("discord.js");
const Shop = require("../utils/shop");
const { botOwner } = require("../ayarlar.json");
const { User } = require("../utils/schemas");
module.exports = {
  name: "ürün-al",
  description: "Kullanıcının ürününü alır",
  options: [
    {
      name: "kullanıcı",
      description: "Ürünü almak istediğiniz kullanıcı",
      type: 6,
      required: true,
    },
    {
      name: "ürün-kodu",
      description: "Alınacak ürün kodu",
      type: 3,
      required: true,
    },
    {
      name: "miktar",
      description: "Ürün miktarı",
      type: 4,
      required: true,
    },
  ],
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  run: async (client, interaction) => {
    if (interaction.member.id !== botOwner) {
      return interaction.reply({
        content: "Bu komutu sadece bot sahibi kullanabilir",
        ephemeral: true,
      });
    }
    const user = interaction.options.getUser("kullanıcı");
    const urun = interaction.options.getString("ürün-kodu");
    const miktar = interaction.options.getInteger("miktar");
    if (miktar <= 0) {
      return interaction.reply({
        content: "Miktar 0'dan büyük olmalıdır",
        ephemeral: true,
      });
    }
    const userData =
      (await User.findOne({ id: user.id })) || new User({ id: user.id });
    const product = await Shop.findOne({ id: urun });
    if (!product) {
      return interaction.reply({
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
      return interaction.reply({
        content: `${user.tag} kullanıcısından **${miktar}** adet **${product.name}** alındı.`,
      });
    } else {
      return interaction.reply({
        content: "Kullanıcının envanterinde bu ürün bulunmamaktadır",
        ephemeral: true,
      });
    }
  },
};
