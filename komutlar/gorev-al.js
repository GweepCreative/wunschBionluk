const Task = require("../utils/task");
const { Message, Client, EmbedBuilder } = require("discord.js");
const ms = require("ms");
const useId = require("../utils/useId");
const { User } = require("../utils/schemas");
module.exports = {
  name: "görev-al",
  description: "Rastgele görev verir",
  isAdmin: true,
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    const tasks = await Task.find();
    const task = tasks[Math.floor(Math.random() * tasks.length)];
    const userData = await User.findOne({ id: message.author.id });
    if (userData.tasks && userData.tasks.isActive)
      return message.reply("Zaten aktif bir göreviniz var");
    else if (userData?.tasks?.isActive == false) {
      return message.reply({
        content:
          "Lütfen önce yetkililerin önceki görevinizi onaylamasını bekleyin.",
      });
    }
    if (userData.cooldowns.task > Date.now())
      return message.reply({
        embeds: [
          embed.setDescription(
            `⌛ Zaten yakın zamanda görev aldınız, lütfen yeni görev almak için **\`${prettyMilliseconds(
              userData.cooldowns.daily - Date.now(),
              { verbose: true, secondsDecimalDigits: 0 }
            )
              .replace("hours", "saat")
              .replace("minutes", "dakika")
              .replace("seconds", "saniye")}\`** bekleyin`
          ),
        ],
        ephemeral: true,
      });
    userData.tasks = {
      isActive: true,
      title: task.title,
      taskId: task.id,
      deadline: new Date(Date.now() + Number(task.deadline)),
      createdAt: new Date(),
      prize: task.prize,
    };
    userData.save();
    return message.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Görev Alındı")
          .setDescription(
            `Görev başarıyla alındı!\n**Görev ID: **\`${
              task.id
            }\`\n**Ödül: **\`${task.prize} Cash\`\n**Süre: **\`${ms(
              Number(task.deadline),
              {
                long: true,
              }
            )}\`\n**Başlık: **\`${task.title}\``
          )
          .setColor("Green"),
      ],
    });
  },
};
