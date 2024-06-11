const {
  MessageEmbed,
  Client,
  CommandInteraction,
  Message,
  EmbedBuilder,
} = require("discord.js");
const { User } = require("../utils/schemas");
module.exports = {
  name: "slot",
  description: "Slot Oyunu",
  /**
   * @param {Client} client
   * @param {Message} message
   */
  run: async (client, message, args) => {
    const bet = Number(args[0]) || null;
    if (!bet || isNaN(bet) || bet < 1)
      return message.reply("Lütfen geçerli bir miktar girin.");
    const userData =
      (await User.findOne({ id: message.author.id })) ||
      new User({ id: message.author.id });
    if (userData.wallet < bet) return message.reply("Yeterli paranız yok.");
    userData.wallet -= bet;
    let spin = "<a:slot:1250092657879941201>";
    const embed = message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("Gold")
          .setTitle("Slot Oyunu Başladı!")
          .setFooter({
            text: `${message.author.globalName} tarafından istendi.`,
            iconURL: message.author.avatarURL({ dynamic: true }),
          })
          .setDescription(`${spin}${spin}${spin}`),
      ],
    });
    let slot1 = ["🍇", "🍉", "🍊", "🍋", "🍌", "🍍", "🍎", "🍏"];
    let s1 = slot1[Math.floor(Math.random() * slot1.length)];
    let s2 = slot1[Math.floor(Math.random() * slot1.length)];
    let s3 = slot1[Math.floor(Math.random() * slot1.length)];

    setTimeout(() => {
      embed.then((msg) => {
        msg.edit({
          embeds: [
            new EmbedBuilder()
              .setColor("Gold")
              .setTitle("Slot Oyunu Başladı!")
              .setDescription(`${s1}${spin}${spin}`),
          ],
        });
      });
    }, 1000);
    setTimeout(() => {
      embed.then((msg) => {
        msg.edit({
          embeds: [
            new EmbedBuilder()
              .setColor("Gold")
              .setTitle("Slot Oyunu Başladı!")
              .setDescription(`${s1}${s2}${spin}`),
          ],
        });
      });
    }, 2000);
    setTimeout(() => {
      embed.then((msg) => {
        let isWin = s1 === s2 && s2 === s3;
        if (isWin) userData.wallet += bet * 2;
        msg.edit({
          embeds: [
            new EmbedBuilder()
              .setColor("Gold")
              .setTitle("Slot Oyunu Bitti!")
              .setDescription(
                `${s1}${s2}${s3}  -  ${
                  isWin ? "**Kazandınız!**" : "**Kaybettiniz!**"
                }`
              ),
          ],
        });
      });
    }, 3000);
  },
};