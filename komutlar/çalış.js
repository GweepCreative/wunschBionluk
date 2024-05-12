const { MessageEmbed, Client, CommandInteraction, Message, EmbedBuilder } = require("discord.js");
const { User } = require("../utils/schemas");
const prettyMilliseconds = require("pretty-ms");
const { botOwner } = require("../ayarlar.json");
const { upLevel } = require("../utils/xpCal");

const jobs = [
  "🧑‍🏫 Öğretmen",
  "🧑‍⚕️ Doktor",
  "👮 Polis",
  "🧑‍🍳 Şef",
  "🧑‍🚒 İtfayeci",
  "🚌 Otobüs şöförü",
  "🧑‍🔬 Bilim Adamı",
  "📮 Postacı",
  "🧑‍🏭 Mühendis",
  "🧑‍🎨 Ressam",
  "🧑‍✈️ Pilot",
];
module.exports = {
  name: "çalış",
  description: "Bir işte çalışırsınız",
  /**
   * @param {Client} client
   * @param {Message} message
   */
  run: async (client, message) => {
    const user = message.member.user;
    const userData =
      (await User.findOne({ id: user.id })) || new User({ id: user.id });

    if (userData.cooldowns.work > Date.now())
      return message.reply({
        embeds: [
          new EmbedBuilder().setColor("Yellow").setDescription(
            `⌛ **\`${prettyMilliseconds(userData.cooldowns.work - Date.now(), {
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

    const amount = Math.floor(Math.random() * (50 - 10 + 1)) + 10;
    const job = jobs[Math.floor(Math.random() * jobs.length)];

    let userxp = userData.xp;
    if ((userxp < 11) && (userData.xpPoint + amount * 10) / 20000 >= 1) {
      userxp += 1;
      userData.xpPoint = 0;
      userData.gerekli = 20000;

      await upLevel(message, user.id, userxp);
    }
    userData.xpPoint += amount * 10;
    userData.xp = userxp;
    userData.wallet += amount;
    if (message.member.user.id !== botOwner)
      userData.cooldowns.work = Date.now() + 1000 * 60 * 60 * 3; // 3 saat
    userData.save();

    const workEmbed = new EmbedBuilder()
      .setDescription(
        `**\` ${job} \`** olarak çalıştınız ve \` ${amount} \` SGAT Cash kazandınız 🪙`
      )
      .setColor("Yellow");

    return message.reply({ embeds: [workEmbed] });
  },
};
