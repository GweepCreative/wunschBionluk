const { MessageEmbed, Client, CommandInteraction } = require("discord.js");
const Shop = require("../utils/shop");
const { botOwner } = require("../ayarlar.json");
const { User } = require("../utils/schemas");
module.exports = {
  name: "ürün-sat",
  description: "Sisteme ürün eklersiniz",
  options: [
    {
      name: "ürün-kodu",
      description: "Satmak istediğiniz ürünün kodunu giriniz",
      type: 3,
      required: true,
    },
  ],
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  run: async (client, interaction) => {
    let urun = interaction.options.getString("ürün-kodu");
    let data = await User.findOne(
      {
        id: interaction.member.user.id,
        products: { $elemMatch: { id: urun } },
      },
      "products"
    );
    if (!data)
      return interaction.reply({
        content:
          "Bu ürün envanterinizde bulunamadı. Sadece envanterinizde bulunan ürünleri satabilirsiniz.",
        ephemeral: true,
      });
    const sell = data.products.filter((x) => x.id == urun);
    if (sell[0].count <= 1) {
      await User.updateOne(
        { id: interaction.member.user.id },
        { $pull: { products: { id: urun } } }
      )
        .then(() => {
          interaction.reply({
            embeds: [
              new MessageEmbed().setTitle("Ürün Satıldı").setFields([
                { name: "Ürün Adı", value: `${sell[0].name}` },
                { name: "Ücret", value: `${sell[0].balance}` },
              ]),
            ],
          });
        })
        .catch((err) => {
          console.log(err);
          interaction.reply({
            content: "Bir hata oluştu. Lütfen tekrar deneyin.",
            ephemeral: true,
          });
        });
      return;
    }
    await User.updateOne(
      { id: interaction.member.user.id, "products.id": urun },
      { $inc: { wallet: sell[0].balance, "products.$.count": -1 } }
    )
      .then(() => {
        interaction.reply({
          embeds: [
            new MessageEmbed().setTitle("Ürün Satıldı").setFields([
              { name: "Ürün Adı", value: `${sell[0].name}` },
              { name: "Ücret", value: `${sell[0].balance}` },
            ]),
          ],
        });
      })
      .catch((err) => {
        console.log(err);
        interaction.reply({
          content: "Bir hata oluştu. Lütfen tekrar deneyin.",
          ephemeral: true,
        });
      });
  },
};
