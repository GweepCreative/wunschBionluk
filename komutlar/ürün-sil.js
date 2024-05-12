const {
  MessageEmbed,
  Client,
  CommandInteraction,
  Message,
} = require("discord.js");
const Shop = require("../utils/shop");
const { botOwner } = require("../ayarlar.json");
module.exports = {
  name: "ürün-sil",
  description: "Sisteme ürün günellersiniz",
  options: [
    {
      name: "ürün-kodu",
      description: "Günceelenicek olan ürünün kodu",
      type: 4,
      required: true,
    },
  ],
  /**
   * @param {Client} client
   * @param {Message} message
   */
  run: async (client, message, args) => {
    if (message.member.id !== global.botOwner)
      return message.reply({
        embeds: [
          { title: "Hata", description: "Bu komut bot sahibine özeldir" },
        ],
        ephemeral: true,
      });
    let urun_kod = args[0]; // message.options.get("ürün-kodu").value;
    if (isNaN(urun_kod))
      return message.reply({
        embeds: [{ title: "Hata", description: "Ürün kodu sayı olmalıdır" }],
      });
    let data = await Shop.findOne({ id: urun_kod });
    if (!data)
      return message.reply({
        embeds: [
          {
            title: "Ürün Bulunamadı",
            description: "Belirtilen ürün koduna ait ürün bulunamadı",
          },
        ],
      });
    await Shop.deleteOne({ id: urun_kod });
    message.reply({
      embeds: [
        {
          title: "Ürün Silindi",
          fields: [{ name: "Ürün Kodu", value: `${urun_kod}`, inline: true }],
        },
      ],
    });
  },
};
