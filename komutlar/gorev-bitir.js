const Task = require("../utils/task");
const {
  Message,
  Client,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const ms = require("ms");
const useId = require("../utils/useId");
const { User } = require("../utils/schemas");
module.exports = {
  name: "görev-bitir",
  description: "Aktif görevinizi sonlandırır",
  isAdmin: false,
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    const userData = await User.findOne({ id: message.author.id });
    if (!userData.tasks?.isActive)
      return message.reply("Aktif bir göreviniz yok");
    userData.tasks.isActive = false;
    userData.save();
    message.guild.channels.cache.get("1241853620710932600").send({
      embeds: [
        new EmbedBuilder()
          .setTitle("Görev Sonlandırıldı")
          .setDescription(
            `Yeni bir kullanıcı görevini sonlandırdı. Aşağıdaki butonlar ile işlem yapabilirsiniz`
          )
          .setFields([
            {
              name: `Görev Adı`,
              value: `${userData.tasks.title}`,
              inline: true,
            },
            {
              name: `Görev Ödülü`,
              value: `${userData.tasks.prize} Cash`,
              inline: true,
            },
            {
              name: `Göreve başlama tarihi`,
              value: `<t:${Math.floor(
                new Date(userData.tasks.createdAt) / 1000
              )}:R>`,
              inline: true,
            },
            {
              name: `Görevi sonlandırma tarihi`,
              value: `<t:${Math.floor(new Date() / 1000)}:R>`,
              inline: true,
            },
            {
              name: `Görev ID`,
              value: `${userData.tasks.taskId}`,
              inline: true,
            },
          ]),
      ],
      components: [
        new ActionRowBuilder().setComponents(
          new ButtonBuilder()
            .setLabel("Onayla")
            .setCustomId(`onayla_${userData.tasks.taskId}`)
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setLabel("Reddet")
            .setCustomId(`reddet_${userData.tasks.taskId}`)
            .setStyle(ButtonStyle.Danger)
        ),
      ],
    });
    return message.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Görev Sonlandırıldı")
          .setDescription(
            `Görev başarıyla sonlandırıldı! Lütfen yetkililerin onaylamasını bekleyiniz\n**Görev ID: **\`${
              userData.tasks.taskId
            }\`\n**Ödül: **\`${userData.tasks.prize} Cash\`\n**Süre: **\`${ms(
              Number(userData.tasks.deadline),
              {
                long: true,
              }
            )}\`\n**Başlık: **\`${userData.tasks.title}\``
          )
          .setColor("Green"),
      ],
    });
  },
};
