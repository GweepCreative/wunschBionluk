const {
  MessageEmbed,
  Client,
  CommandInteraction,
  MessageAttachment,
} = require("discord.js");
const { LeaderboardBuilder, Font } = require("canvacord");
const { User } = require("../utils/schemas");
Font.loadDefault();

module.exports = {
  name: "leaderboard",
  description: "En fazla SGAT Cash sahipleri",
  options: [],
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  run: async (client, interaction) => {
    const message = await interaction.reply({
      content: "Liderlik tablosu oluşturuluyor...",
      fetchReply: true,
    });
    const top10 = await User.find().sort({ wallet: -1 }).limit(10);
    const players = [];
    for (const [i, user] of top10.entries()) {
      if (client.users.cache.has(user.id))
        players.push({
          avatar:
            client.users.cache.get(user.id)  .avatarURL({ dynamic: false, size: 512, format: "png" }) ||
            "https://cdn.discordapp.com/embed/avatars/0.png",
          displayName: client.users.cache.get(user.id).displayName,
          rank: i + 1,
          level: user.xp,
          username: client.users.cache.get(user.id).username,
          xp: user.wallet,
        });
    }
    //console.log(players);
    if(players.length === 0) return message.edit("Henüz bir lider yok.");
    const leaderboard = new LeaderboardBuilder()
      .setHeader({
        title: "Sanalika",
        subtitle: "TOP 10 SGAT Cash",
        image: interaction.guild.iconURL({ dynamic: false }),
      })
      .setPlayers(players)
 
      // .setStyle({ width: 600, height: 600 })
      .setBackground("https://i.hizliresim.com/a7ykk13.png")
      .setTextStyles({ xp: "Cash" });
    await leaderboard.build({ format: "png" }).then((data) => {
      const dosya = new MessageAttachment(data, "liderlik.png");
      message.edit({ content: "\u200B", files: [dosya] });
    });
  },
};
