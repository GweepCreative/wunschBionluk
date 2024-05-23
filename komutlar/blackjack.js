const {
  MessageEmbed,
  Client,
  CommandInteraction,
  Message,
  EmbedBuilder,
} = require("discord.js");
const blackjack = require("discord-blackjack-v14");
const prettyMilliseconds = require("pretty-ms");
const { User } = require("../utils/schemas");
module.exports = {
  name: "blackjack",
  description: "Blackjack oyunu başlatır",
  isAdmin: false,
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */

  run: async (client, message, args) => {
    if (!args[0] || isNaN(args[0]))
      return message.reply("Lütfen bir miktar belirtin.");
    const userData =
      (await User.findOne({ id: message.member.user.id })) ||
      new User({ id: message.member.user.id });

    if (userData.cooldowns.blackjack > Date.now())
      return message.reply({
        embeds: [
          new MessageEmbed().setColor("Yellow").setDescription(
            `⌛ **\`${prettyMilliseconds(
              userData.cooldowns.blackjack - Date.now(),
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
      //await User.updateOne({id:interaction.member.user.id},{$inc:{cooldowns:{blackjack:Date.now() + 1000 * 60 * 15}}},{upsert:true})
      userData.cooldowns.blackjack = Date.now() + 1000 * 60 * 7;
      userData.save();
    }
    const bet = args[0] || 100;
    let game = await blackjack(message);

    switch (game.result) {
      case "WIN":
        const point = Math.floor(Math.random() * 10);
        await User.updateOne(
          { id: message.member.user.id },
          { $inc: { xpPoint: point, wallet: bet * 2 } }
        );
        message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setTitle("Sen kaznadın!")
              .setDescription(
                `Bu oyundan **${
                  bet * 2
                } SGAT Cash** ve **${point}** puan kazandın!`
              ),
          ],
        });
        break;
      case "LOSE":
        await User.updateOne(
          { id: message.member.user.id },
          { $inc: { wallet: -bet } }
        );
        message.channel.send({
          content: "Maalesef ki bu oyunu kaybettin. Başka sefere!",
        });
    }
  },
};
