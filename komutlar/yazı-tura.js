const { EmbedBuilder, Client, Message } = require("discord.js");
const { User } = require("../utils/schemas");
const prettyMilliseconds = require("pretty-ms");
const { botOwner } = require("../ayarlar.json");
module.exports = {
  name: "yazıtura",
  description: "Yazı-Tura oyunu başlatır",

  /**
   * @param {Client} client
   * @param {Message} message
   */
  run: async (client, message, args) => {
    if (!args[0] || !args[1] || isNaN(args[0]) || !isNaN(args[1]))
      return message.reply({
        content:
          "Doğru kullanım !yazı-tura <bet> <seçim>\nörnek: `!yazı-tura 500 yazı` ",
        ephemeral: true,
      });

    const userData =
      (await User.findOne({ id: message.member.user.id })) ||
      new User({ id: message.member.user.id });

    if (userData.cooldowns.yazitura > Date.now())
      return message.reply({
        embeds: [
          new EmbedBuilder().setColor("Yellow").setDescription(
            `⌛ **\`${prettyMilliseconds(
              userData.cooldowns.yazitura - Date.now(),
              {
                verbose: true,
                secondDecimalDigits: 0,
              }
            )
              .replace("minutes", "dakika")
              .replace(
                "seconds",
                "saniye"
              )}\`** içinde tekrar çalışabilirsiniz.`
          ),
        ],
        ephemeral: true,
      });
    if (message.member.user.id !== global.botOwner) {
      userData.cooldowns.yazitura = Date.now() + 1000 * 60 * 3;
      userData.save();
    }

    let bet = Number(args[0]); //interaction.options.getInteger("bahis");
    const choice = String(args[1]).toUpperCase(); //interaction.options.get("seçim").value;
    if (bet > 100) bet = 100;
    if (bet > userData.wallet) return message.reply("Yeterli bakiyeniz yok");
    if (bet < 1) bet = 1;
    const msg = await message.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription(
            "<a:yaztura:863365410832908288> | Yazı-Tura oyunu başlatılıyor..."
          )
          .setColor("Gold"),
      ],
      fetchReply: true,
    });

    //YAZI - TURA OYUNU
    const result = secenek[Math.floor(Math.random() * secenek.length)];

    if (choice === result) {
      const point = Math.floor(Math.random() * 10);
      await User.updateOne(
        { id: message.member.user.id },
        { $inc: { xpPoint: point, wallet: bet * 2 } }
      );
      msg.edit({
        embeds: [
          new EmbedBuilder()
            .setColor("Gold")
            .setTitle("Sen kazandın!")
            .setDescription(
              `${
                result === "TURA"
                  ? `<:tura:863365407318474782> Tura Geldi!`
                  : `<:yaz:863365407620202516> Yazı Geldi!`
              }
              Bu oyundan **${
                bet * 2
              } SGTK Cash** ve **${point}** puan kazandın!`
            ),
        ],
      });
    } else {
      await User.updateOne(
        { id: message.member.user.id },
        { $inc: { wallet: -bet } }
      );
      msg.edit({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setTitle("Kaybettin!")
            .setDescription(
              `Maalesef ki bu oyunu kaybettin. Başka sefere!
              **Senin seçimin: \` ${choice} \`\nBenim seçimim: \` ${result} \`**`
            ),
        ],
      });
    }
  },
};
const secenek = ["YAZI", "TURA"];
