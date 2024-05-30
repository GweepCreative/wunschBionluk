const {
  Client,
  CommandInteraction,
  // MessageAttachment,
  AttachmentBuilder,
  Message,
} = require("discord.js");
const { LeaderboardBuilder, Font } = require("canvacord");
const { User } = require("../utils/schemas");
Font.loadDefault();

module.exports = {
  name: "leaderboard",
  description: "En fazla SGTK Cash sahipleri",
  isAdmin: false,
  /**
   * @param {Client} client
   * @param {Message} message
   */
  run: async (client, message) => {
    const msg = await message.reply({
      content: "Liderlik tablosu oluşturuluyor...",
      fetchReply: true,
    });
    const top10 = await User.find().sort({ wallet: -1 }).limit(10);
    const players = [];
    for (const [i, user] of top10.entries()) {
      if (client.users.cache.has(user.id))
        players.push({
          avatar:
            client.users.cache.get(user.id).displayAvatarURL({
              forceStatic: true,
              dynamic: false,
              size: 512,
              extension: "jpg",
            }) || "https://cdn.discordapp.com/embed/avatars/0.png",
          displayName: client.users.cache.get(user.id).displayName,
          rank: i + 1,
          level: user.xp,
          username: client.users.cache.get(user.id).username,
          xp: user.wallet,
        });
    }
    //console.log(players);
    if (players.length === 0) return msg.edit("Henüz bir lider yok.");
    const leaderboard = new LeaderboardBuilder()
      .setHeader({
        title: "Sanalika",
        subtitle: "TOP 10 SGTK Cash",
        image: message.guild.iconURL({
          forceStatic: true,
          extension: "jpg",
          dynamic: false,
        }),
      })
      .setPlayers(players)

      // .setStyle({ width: 600, height: 600 })
      .setBackground("https://i.hizliresim.com/a7ykk13.png")
      .setTextStyles({ xp: "Cash" });
    await leaderboard.build({ format: "png" }).then((data) => {
      const dosya = new AttachmentBuilder(data, { name: "leaderboard.png" });
      msg.edit({ content: "\u200B", files: [dosya] });
    });
  },
};
