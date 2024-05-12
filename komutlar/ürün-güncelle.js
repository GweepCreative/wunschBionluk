const {
  MessageEmbed,
  Client,
  CommandInteraction,
  Message,
} = require("discord.js");
const Shop = require("../utils/shop");
const { botOwner } = require("../ayarlar.json");
module.exports = {
  name: "ürün-güncelle",
  description: "Sisteme ürün günellersiniz",
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
    let urun = args[0]; // interaction.options.getString("ürün-adı"),
    ucret = args[1]; // interaction.options.getInteger("ücret"),
    if (!urun || !ucret || isNaN(ucret))
      return message.reply({
        embeds: [
          {
            title: "Hata",
            description: "Doğru kullanım: `!ürün-güncelle <ürün-adı> <ücret>`",
          },
        ],
      });
    urun_kod = Math.floor(Math.random() * 100000);
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
    await shop.updateOne({ id: urun_kod }, { name: urun, balance: ucret });
    interaction.reply({
      embeds: [
        {
          title: "Ürün Güncellendi",
          fields: [
            { name: "Ürün Adı", value: urun, inline: true },
            { name: "Ücret", value: `${ucret}`, inline: true },
            { name: "Ürün Kodu", value: `${urun_kod}`, inline: true },
          ],
        },
      ],
    });
  },
};
