const {
  MessageEmbed,
  Client,
  CommandInteraction,
  Message,
  EmbedBuilder,
} = require("discord.js");
const cark = require("../utils/cark");
const { User } = require("../utils/schemas");
module.exports = {
  name: "cark",
  description: "Şanslı Çark",
  /**
   * @param {Client} client
   * @param {Message} message
   */
  run: async (client, message, args) => {
    const bet = Number(args[0]) || null;
    if (!bet || isNaN(bet) || bet < 1)
      return message.reply("Lütfen geçerli bir miktar girin.");
    if (bet < 500)
      return message.reply("Minimum 500 para ile oynayabilirsiniz.");

    const userData =
      (await User.findOne({ id: message.author.id })) ||
      new User({ id: message.author.id });
    if (userData.wallet < bet) return message.reply("Yeterli paranız yok.");
    userData.wallet -= bet;

    const embed = message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("Gold")
          .setTitle("Şanslı Çark Başladı!")
          .setFooter({
            text: `${message.author.globalName} tarafından istendi.`,
            iconURL: message.author.avatarURL({ dynamic: true }),
          })
          .setDescription("<a:slot:1250092657879941201>"),
      ],
    });
    let status = 0;
    const carkData = [
      "PASS",
      200,
      200,
      "PASS",
      200,
      300,
      "PASS",
      300,
      300,
      "PASS",
      300,
      "PASS",
      400,
      400,
      "PASS",
      400,
      "PASS",
      400,
      500,
      "PASS",
      600,
      700,
      "PASS",
      800,
      "PASS",
      1000,
      1300,
      "PASS",
      1500,
    ];
    const result = carkData[Math.floor(Math.random() * carkData.length)];

    setTimeout(() => {
      embed.then((msg) => {
        if (result === "PASS") {
          //LOSE
          msg.edit({
            embeds: [
              new EmbedBuilder()
                .setColor("Red")
                .setTitle("Şanslı Çark")
                .setFooter({
                  text: `${message.author.globalName} tarafından istendi.`,
                  iconURL: message.author.avatarURL({ dynamic: true }),
                })
                .setDescription(
                  `Çarkı çevirdin ve **İFLAS** geldi ${bet} para kaybettin!`
                ),
            ],
          });
        } else {
          //WIN
          const prize = result + bet;
          userData.wallet += prize;
          msg.edit({
            embeds: [
              new EmbedBuilder()
                .setColor("Green")
                .setTitle("Şanslı Çark")
                .setFooter({
                  text: `${message.author.globalName} tarafından istendi.`,
                  iconURL: message.author.avatarURL({ dynamic: true }),
                })
                .setDescription(`Çarkı çevirdin ve ${prize} para kazandın!`),
            ],
          });
        }
      });
    }, 1000);
  },
};
