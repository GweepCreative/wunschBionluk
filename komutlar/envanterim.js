const {
  EmbedBuilder,
  Client,
  CommandInteraction,
  Message,
} = require("discord.js");
const { User } = require("../utils/schemas");
module.exports = {
  name: "envanterim",
  description: "Sahip olduğunuz envanterleri gösterir",
  isAdmin: false,

  /**
   * @param {Client} client
   * @param {Message} message
   */
  run: async (client, message) => {
    const user = message.member.user;
    let total = 0;
    let options = [];
    const userData =
      (await User.findOne({ id: user.id })) || new User({ id: user.id });
    const embed = new EmbedBuilder().setColor("Yellow").setAuthor({
      name: `${user.tag} kişisinin envanteri`,
      iconURL: user.avatarURL({ dynamic: true }),
    });
    const products = userData.products.sort((a, b) => b.balance - a.balance);
    if (!products.length || products.length <= 0)
      return message.reply({
        embeds: [
          {
            title: "Envanteriniz Boş",
            description: "Envanterinizde hiçbir ürün bulunmamaktadır.",
          },
        ],
      });
    products.forEach((x) => {
      total += x.balance * x.count;
      options.push({
        label: `${x.name} - Ücret: ${x.balance}`,
        value: `${x.id}`,
        emoji: "<a:star5:761479712743620608>",
      });
    });
    products.slice(0, 9).forEach((x) => {
      embed.addFields({
        name: x.name,
        value: `Ücret: ${x.balance}\nÜrün kodu: ${x.id}\nAdet:${x.count}`,
        inline: true,
      });
    });
    embed.setFooter({
      text: `Envanter Değeri: ${total} 💰`,
      iconURL: user.avatarURL({ dynamic: true }),
    });
    message.reply({ embeds: [embed] });
  },
};
