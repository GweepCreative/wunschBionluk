const { EmbedBuilder, Client, CommandInteraction, Message } = require("discord.js");
const { User } = require("../utils/schemas");
const prettyMilliseconds = require("pretty-ms");
const { botOwner } = require("../ayarlar.json");
const { upLevel } = require("../utils/xpCal");
module.exports = {
  name: "dilen",
  description: "Para iste",

  /**
   * @param {Client} client
   * @param {Message} message
   */
  run: async (client, message) => {
    const user = message.member.user;
    const userData =
      (await User.findOne({ id: user.id })) || new User({ id: user.id });
    const embed = new EmbedBuilder({ color: "Yellow" });

    if (userData.cooldowns.beg > Date.now())
      return message.reply({
        embeds: [
          embed.setDescription(
            `⌛ Yeniden dilenmek için **\`${prettyMilliseconds(
              userData.cooldowns.beg - Date.now(),
              { verbose: true, secondsDecimalDigits: 0 }
            )
              .replace("minutes", "dakika")
              .replace("seconds", "saniye")}\`** bekle`
          ),
        ],
        ephemeral: true,
      });

    const amount = Math.floor(
      (Math.round(10 / (Math.random() * 10 + 1)) * 5) / 2
    );
    if (message.member.user.id !== botOwner)
      userData.cooldowns.beg = Date.now() + 1000 * 60 * 60 * 3; // 3 saat
    if (amount <= 5) {
      userData.save();

      return message.reply({
        embeds: [
          embed.setDescription(
            "🥺 Bu sefer hiçbir şeyin yok, belki bir dahaki sefere çabalarsın?"
          ),
        ],
      });
    }
    let userxp = userData.xp;
    if ((userxp < 11) && (userData.xpPoint + amount * 10) / 2000 >= 1) {
      userxp += 1;
      userData.xpPoint = 0;
      userData.gerekli = 2000;

      await upLevel(message, user.id, userxp);
    }
    userData.xpPoint += amount * 10;
    userData.xp = userxp;
    userData.wallet += amount;
    userData.save();

    return message.reply({
      embeds: [
        embed.setDescription(
          `Dilendin ve \` ${amount} \` SGAT Cash kazandınız 🪙`
        ),
      ],
    });
  },
};
