const { MessageEmbed, Client, CommandInteraction } = require("discord.js");
const { User } = require("../utils/schemas");
const prettyMilliseconds = require("pretty-ms");
const { botOwner } = require("../ayarlar.json");
const { upLevel } = require("../utils/xpCal");
module.exports = {
  name: "günlük",
  description: "Günlük ödülünü al",
  options: [],
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  run: async (client, interaction) => {
    const user = interaction.member.user;
    const userData =
      (await User.findOne({ id: user.id })) || new User({ id: user.id });
    const embed = new MessageEmbed({ color: "YELLOW" });

    if (userData.cooldowns.daily > Date.now())
      return interaction.reply({
        embeds: [
          embed.setDescription(
            `⌛ Paranızı zaten topladınız, **\`${prettyMilliseconds(
              userData.cooldowns.daily - Date.now(),
              { verbose: true, secondsDecimalDigits: 0 }
            )
              .replace("hours", "saat")
              .replace("minutes", "dakika")
              .replace("seconds", "saniye")}\`** bekleyin`
          ),
        ],
        ephemeral: true,
      });

    let userxp = userData.xp;
    if ((userxp < 11) && (userData.xpPoint + 50) / 20000 >= 1) {
      userxp += 1;
      userData.xpPoint = 0;
      userData.gerekli = 20000;

      await upLevel(interaction, user.id, userxp);
    }
    userData.xpPoint += 10;
    userData.xp = userxp;
    userData.wallet += 50;
    if (interaction.member.user.id !== botOwner)
      userData.cooldowns.daily = new Date().setHours(24, 0, 0, 0);
    userData.save();

    return interaction.reply({
      embeds: [
        embed.setDescription(`💰 Günlük \` 50 \` 🪙 kazandın, tebrikler!`),
      ],
    });
  },
};
