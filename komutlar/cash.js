const {
  MessageEmbed,
  Client,
  CommandInteraction,
  Message,
  EmbedBuilder,
} = require("discord.js");
const { User } = require("../utils/schemas");
const prettyMilliseconds = require("pretty-ms");
const { upLevel } = require("../utils/xpCal");
const { botOwner } = require("../ayarlar.json");
module.exports = {
  name: "cash",
  description: "Rastgele miktarda para kazan",
  isAdmin: false,

  /**
   * @param {Client} client
   * @param {Message} message
   */
  run: async (client, message) => {
    const user = message.member.user;
    const userData =
      (await User.findOne({ id: user.id })) || new User({ id: user.id });
    let userxp = userData.xp;
    if (userData.cooldowns.cash > Date.now())
      return await message.reply({
        embeds: [
          new EmbedBuilder().setColor("Yellow").setDescription(
            `⌛ **\`${prettyMilliseconds(userData.cooldowns.cash - Date.now(), {
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
    const amount = uretSeviyeyeGore(userxp) || 6;
    if (userxp < 21 && (userData.xpPoint + amount * 10) / 20000 >= 1) {
      userxp += 1;
      userData.xpPoint = userData.xpPoint - 20000;
      userData.gerekli = 20000;

      await upLevel(message, user.id, userxp);
    }

    userData.xpPoint += amount * 10;
    userData.xp = userxp;
    userData.wallet += amount;
    if (message.member.user.id !== global.botOwner)
      userData.cooldowns.cash = Date.now() + 1000 * 15;
    userData.save();

    const workEmbed = new EmbedBuilder()
      .setDescription(`\` ${amount} \` SGTK Cash kazandınız 🪙`)
      .setColor("Yellow");

    return await message.reply({ embeds: [workEmbed] });
  },
};
function uretSeviyeyeGore(seviye) {
  if (seviye < 10) {
    return Math.floor(Math.random() * 10);
  } else {
    return Math.floor(Math.random() * 4);
  }
}
