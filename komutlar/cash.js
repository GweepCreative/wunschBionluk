const { MessageEmbed, Client, CommandInteraction } = require("discord.js");
const { User } = require("../utils/schemas");
const prettyMilliseconds = require("pretty-ms");
const { upLevel } = require("../utils/xpCal");
const { botOwner } = require("../ayarlar.json");
module.exports = { 
  name: "cash",      
  description: "Rastgele miktarda para kazan",
  options: [],
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  run: async (client, interaction) => { 

  const yedek = await interaction;
    const user = interaction.member.user;
    const userData =
      (await User.findOne({ id: user.id })) || new User({ id: user.id });
    let userxp = userData.xp;
    if (userData.cooldowns.cash > Date.now())
      return await yedek.reply({
        embeds: [
          new MessageEmbed().setColor("YELLOW").setDescription(
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
    const amount = uretSeviyeyeGore(userxp) || 3;
    if ((userxp < 11) && (userData.xpPoint + amount * 10) / 20000 >= 1) {
      userxp += 1;
      userData.xpPoint = userData.xpPoint - 20000;
      userData.gerekli = 20000;

      await upLevel(interaction, user.id, userxp);
    }

    userData.xpPoint += amount * 10; 
    userData.xp = userxp;
    userData.wallet += amount;
    if (interaction.member.user.id !== botOwner)
      userData.cooldowns.cash = Date.now() + 1000 * 15;
    userData.save();

    const workEmbed = new MessageEmbed()
      .setDescription(`\` ${amount} \` SGAT Cash kazandınız 🪙`)
      .setColor("YELLOW");    
 
    return await yedek.reply({ embeds: [workEmbed] });
  },
};
function uretSeviyeyeGore(seviye) {
  if (seviye < 10) {
    return Math.floor(Math.random() * 10);
  } else {
    return Math.floor(Math.random() * 7);
  }
  // Kullanıcının seviyesine göre ağırlık ekleyerek rastgele sayı üretme
  // const olasilikFaktoru = seviye / 10; // Seviyeyi 0 ile 1 arasına ölçekle
  // const rastgeleSayi = Math.random();

  // // 1 ile 10 arasında rastgele sayı üretme
  // const uretilenSayi = Math.floor(
  //   1 + (10 - 1) * Math.pow(rastgeleSayi, olasilikFaktoru)
  // );

  // return uretilenSayi;
}
