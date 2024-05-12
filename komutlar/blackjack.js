const { MessageEmbed, Client, CommandInteraction } = require("discord.js");
const blackjack = require("discord-blackjack");
const prettyMilliseconds = require("pretty-ms");
const { User } = require("../utils/schemas");
const { botOwner } = require("../ayarlar.json");
module.exports = {
  name: "blackjack",
  description: "Blackjack oyunu başlatır",
  options: [
    {
      name: "bahis",
      description: "Bahis miktarını belirler",
      type: 4,
      required: true,
      min_value: 5,
      max_value: 50,
    },
  ],
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  run: async (client, interaction) => {
    const botInteraction = interaction;
    const userData =
      (await User.findOne({ id: botInteraction.member.user.id })) ||
      new User({ id: botInteraction.member.user.id });
      
    if (userData.cooldowns.blackjack > Date.now())
      return botInteraction.reply({
        embeds: [
          new MessageEmbed().setColor("YELLOW").setDescription(
            `⌛ **\`${prettyMilliseconds(userData.cooldowns.blackjack - Date.now(), {
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
	  if (botInteraction.member.user.id !== botOwner){
		   //await User.updateOne({id:interaction.member.user.id},{$inc:{cooldowns:{blackjack:Date.now() + 1000 * 60 * 15}}},{upsert:true})
		userData.cooldowns.blackjack =    Date.now() + 1000 * 60 * 7
		userData.save();
	  }		   
    const bet = botInteraction.options.getInteger("bahis");
    let game = await blackjack(botInteraction);

    switch (game.result) {
      case "WIN":
        const point = Math.floor(Math.random() * 10);
        await User.updateOne(
          { id: botInteraction.user.id },
          { $inc: { xpPoint: point, wallet: bet * 2 } }
        );
        botInteraction.channel.send({
          embeds: [
            new MessageEmbed()
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
          { id: botInteraction.user.id },
          { $inc: { wallet: -bet } }
        );
        botInteraction.channel.send({
          content: "Maalesef ki bu oyunu kaybettin. Başka sefere!",
        });
    }
  },
};
