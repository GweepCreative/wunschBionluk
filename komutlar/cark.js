const {
  Client,
  Message,
  EmbedBuilder,
} = require("discord.js");
const { User } = require("../utils/schemas");

const carkData = [
  "PASS",
  200,
  200,
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
module.exports = {
  name: "çark",
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
    if (userData.cooldowns.cark > Date.now())
      return message.reply({
        embeds: [
          new EmbedBuilder().setColor("Yellow").setDescription(
            `⌛ **\`${prettyMilliseconds(userData.cooldowns.cark - Date.now(), {
              verbose: true,
              secondDecimalDigits: 0,
            })
              .replace("minutes", "dakika")
              .replace(
                "seconds",
                "saniye"
              )}\`** içinde tekrar çalışabilirsiniz.`
          ),
        ],
        ephemeral: true,
      });

    userData.wallet -= bet;
    if (message.member.user.id !== global.botOwner) {
      userData.cooldowns.blackjack = Date.now() + 1000 * 60 * 2;
    }
    userData.save();
    const options = carkData;
    const embed = await message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("Gold")
          .setTitle("Şanslı Çark Başladı!")
          .setImage("https://gcdn.bionluk.com/uploads/message/06c32f27-5696-49ee-a190-1278247c4ddd.png")
          .setFooter({
            text: `${message.author.globalName} tarafından istendi.`,
            iconURL: message.author.avatarURL({ dynamic: true }),
          })
          .setDescription("Çark hazırlanıyor <a:slot:1250092657879941201>"),
      ],
    });
    const prize = options[Math.floor(Math.random() * options.length)];
    setTimeout(async () => {
      if (prize === "PASS")
        return embed.edit({
          embeds: [
            new EmbedBuilder()
              .setColor("Red")
              .setTitle("Şanslı Çark")
              .setDescription("Çark döndü ve kazanan çıkmadı. Kaybettiniz!"),
          ],
        });

      userData.wallet += prize;
      userData.save();
      embed.edit({
        embeds: [
          new EmbedBuilder()
            .setColor("Green")
            .setTitle("Şanslı Çark")
            .setDescription(`Çark döndü ve **${prize}** SGTK kazandınız!`),
        ],
      });
    }, 2000);
  },
};
