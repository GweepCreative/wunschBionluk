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
  name: "ürün-sat",
  description: "Sisteme ürün eklersiniz",
  /**
   * @param {Client} client
   * @param {Message} message
   */
  run: async (client, message, args) => {
    let urun = args[0]; // message.options.getString("ürün-kodu");
    if (isNaN(urun))
      return message.reply({
        content: "Ürün kodu sayı olmalıdır.",
        ephemeral: true,
      });
    let data = await User.findOne(
      {
        id: message.member.user.id,
        products: { $elemMatch: { id: urun } },
      },
      "products"
    );
    if (!data)
      return message.reply({
        content:
          "Bu ürün envanterinizde bulunamadı. Sadece envanterinizde bulunan ürünleri satabilirsiniz.",
        ephemeral: true,
      });
    const sell = data.products.filter((x) => x.id == urun);
    if (sell[0].count <= 1) {
      await User.updateOne(
        { id: message.member.user.id },
        { $pull: { products: { id: urun } } }
      )
        .then(() => {
          message.reply({
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
          message.reply({
            content: "Bir hata oluştu. Lütfen tekrar deneyin.",
            ephemeral: true,
          });
        });
      return;
    }
    await User.updateOne(
      { id: message.member.user.id, "products.id": urun },
      { $inc: { wallet: sell[0].balance, "products.$.count": -1 } }
    )
      .then(() => {
        message.reply({
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
        message.reply({
          content: "Bir hata oluştu. Lütfen tekrar deneyin.",
          ephemeral: true,
        });
      });
  },
};
