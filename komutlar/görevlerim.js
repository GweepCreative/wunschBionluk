const {
  EmbedBuilder,
  Client,
  CommandInteraction,
  Message,
} = require("discord.js");
const { User } = require("../utils/schemas");
module.exports = {
  name: "görevlerim",
  description: "Aktif görevinizi gösterir",
  isAdmin: false,

  /**
   * @param {Client} client
   * @param {Message} message
   */
  run: async (client, message) => {
    const user = message.member.user;
    const userData =
      (await User.findOne({ id: user.id })) || new User({ id: user.id });
    const embed = new EmbedBuilder()
      .setColor("Yellow")
      .setTitle("Aktif görevlerim");
    if (!userData.tasks || userData.tasks.isActive == false)
      return message.reply({
        embeds: [embed.setDescription(`Aktif bir göreviniz bulunmamaktadır.`)],
      });

    const task = userData.tasks;
    const remaining = task.deadline - Date.now();
    const remainingTime = new Date(remaining).toISOString().substr(11, 8);
    embed.setDescription(
      `**${task.title}** göreviniz aktif durumda. Kalan süre: **${remainingTime}**`
    );
    message.reply({ embeds: [embed] });
  },
};
