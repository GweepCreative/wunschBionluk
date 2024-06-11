const {
  MessageEmbed,
  Client,
  CommandInteraction,
  Message,
} = require("discord.js");
const Shop = require("../utils/shop");
module.exports = {
  name: "ürünekle",
  description: "Sisteme ürün eklersiniz",
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
	
    let ucret = isNaN(Number(args[1])) ? null : Number(args[1]); // interaction.options.getString("ürün-adı"),
    urun = args[0]; //interaction.options.getInteger("ücret"),
   
   if (!urun || !ucret)
      return message.reply({
        embeds: [
          {
            title: "Hata",
            description: "Doğru kullanım: `!ürünekle <ürün-adı> <ücret>`",
          },
        ],
      });
    if (isNaN(ucret))
      return message.reply({
        embeds: [{ title: "Hata", description: "Ücret sayı olmalıdır" }],
      });
    urun_kod = Math.floor(Math.random() * 100000);
    await Shop.create({ id: urun_kod, name: urun, balance: ucret });
    message.reply({
      embeds: [
        {
          title: "Yeni Ürün Eklendi",
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
