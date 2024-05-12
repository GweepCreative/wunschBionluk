const { MessageEmbed, Client, CommandInteraction } = require("discord.js");
const Shop = require("../utils/shop");
const { botOwner } = require("../ayarlar.json");
const { User } = require("../utils/schemas");
module.exports = {
  name: "ürün-ver",
  description: "Kullanıcıya ürün verir",
  options: [
    {
      name: "kullanıcı",
      description: "Ürün vermek istediğiniz kullanıcı",
      type: 6,
      required: true,
    },
    {
      name: "ürün-kodu",
      description: "Verilecek ürün kodu",
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
    if (userData.products.find((x) => x.id === String(urun))) {
      await User.updateOne(
        { id: user.id, "products.id": urun },
        { $inc: { "products.$.count": miktar } }
      );
      return interaction.reply({
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
      interaction.reply({
        content: `${user.tag} kullanıcısına **${miktar}** adet **${product.name}** verildi.`,
      });
      return;
    }
  },
};
