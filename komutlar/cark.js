const {
  MessageEmbed,
  Client,
  CommandInteraction,
  Message,
  EmbedBuilder,
  AttachmentBuilder,
} = require("discord.js");
const { User } = require("../utils/schemas");

// import { parseArgsAsCsv } from '../../utils/commands';
// import { generateSpinWheel } from './pick/spin-wheel';
const { generateSpinWheel } = require("../utils/spin-wheel");

const FRAME_DELAY_MS = 50;
const MAX_DURATION_MS = 5000;
const LAST_FRAME_DURATION_MS = 1000 / FRAME_DELAY_MS;
const MIN_ANGLE = 360;
const MAX_ANGLE = 360 * 8;
const DURATION = MAX_DURATION_MS / FRAME_DELAY_MS;

const styles = {
  canvas: {
    width: 250,
    height: 250,
  },
};
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
      return message.reply(
        `Bu komutu tekrar kullanabilmek için **${new Date(
          userData.cooldowns.cark
        ).toLocaleTimeString()}** tarihine kadar beklemelisin.`
      );

    userData.wallet -= bet;
    userData.cooldowns.cark = Date.now() + 1000 * 3;
    userData.save();
    const options = carkData;
    const embed = await message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("Gold")
          .setTitle("Şanslı Çark Başladı!")
          .setFooter({
            text: `${message.author.globalName} tarafından istendi.`,
            iconURL: message.author.avatarURL({ dynamic: true }),
          })
          .setDescription("Çark hazırlanıyor <a:slot:1250092657879941201>"),
      ],
    });

    const randomEndAngle = Math.random() * (MAX_ANGLE - MIN_ANGLE) + MIN_ANGLE;
    const wheel = generateSpinWheel(
      options,
      randomEndAngle,
      DURATION,
      FRAME_DELAY_MS,
      styles.canvas.width,
      styles.canvas.height,
      LAST_FRAME_DURATION_MS
    );
    const spinWheelAttachment = new AttachmentBuilder(wheel.getGif(), {
      name: "spin-wheel.gif",
    });

    const msg = await message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setTitle("Şanslı Çark Dönüyor!")
          .setImage("attachment://spin-wheel.gif"),
      ],
      files: [spinWheelAttachment],
    });
    embed.delete();
    setTimeout(async () => {
      await msg.delete();

      const selectedOptionAttachmment = new AttachmentBuilder(
        wheel.getLastFrame(),
        { name: "last-option.png" }
      );

      if (wheel.selectedOption != "PASS")
        userData.wallet += wheel.selectedOption;
      userData.save();
      await message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(wheel.selectedOptionColor)
            .setTitle("Şanslı Çark Bitti!")
            .setDescription(
              `${
                wheel.selectedOption != "PASS"
                  ? `🏆 KAZANDINIZ: **${wheel.selectedOption}** Cash kazandınız!`
                  : "**IFLAS** GELDİ! Bir daha ki sefere!"
              }`
            )
            .setImage("attachment://last-option.png"),
        ],
        files: [selectedOptionAttachmment],
      });
    }, MAX_DURATION_MS);
  },
};
