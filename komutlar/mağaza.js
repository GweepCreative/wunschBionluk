const {
  MessageEmbed,
  Client,
  CommandInteraction,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  Message,
  EmbedBuilder,
} = require("discord.js");
const Shop = require("../utils/shop");
module.exports = {
  name: "mağaza",
  description: "Mazağayı Gösterir",
  /**
   * @param {Client} client
   * @param {Message} message
   */
  run: async (client, message) => {
    let urunler = await Shop.find();
    if (urunler.length < 1) return message.reply("Henüz hiç ürün yok");
    let optins = [];
    let embed = new EmbedBuilder()
      .setTitle("Mağaza")
      .setDescription(
        `En çok beğenilen ürünler aşağıda sırlanmıştır. Dilersen onun yenine menüden seçim yapabilirsin`
      )
      .setColor("Gold");
    urunler
      .sort((a, b) => b.balance - a.balance)
      .forEach((x) => {
        optins.push({
          label: `${x.name} - Ücret: ${x.balance}`,
          value: `${x.id}`,
          emoji: "<a:star5:761479712743620608>",
        });
      });
    urunler
      .sort((a, b) => b.balance - a.balance)
      .slice(0, 9)
      .forEach((x) => {
        embed.addFields({name:x.name,value: `${x.balance} 🪙\nÜrün Kodu: ${x.id}`,inline: true});
      });
    const row = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("urunler")
        .setMinValues(1)
        .setMaxValues(1)
        .setPlaceholder("Görmek istediğiniz ürünü seçin")
        .setOptions(optins)
    );
    message.reply({ embeds: [embed], components: [row] });
  },
};
