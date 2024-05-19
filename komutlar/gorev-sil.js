const Task = require("../utils/task");
const { Message, Client, EmbedBuilder } = require("discord.js");
const ms = require("ms");
const useId = require("../utils/useId");
module.exports = {
  name: "görev-sil",
  description: "Görev siler",
  isAdmin: true,
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    const taskId = args[0];
    if (!isNaN(taskId))
      return message.reply("Hatalı kullanım! Örnek: `!görev-sil <görev-id>`");
    const task = await Task.findOne({ id: taskId });
    if (!task) return message.reply("Görev bulunamadı");
    task.delete();

    return message.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Görev Silindi")
          .setDescription(
            `Görev silindi!\n**Görev ID: **\`${taskId}\`\n**Ödül: **\`${
              task.prize
            } Cash\`\n**Süre: **\`${ms(Number(task.deadline), {
              long: true,
            })}\`\n**Başlık: **\`${task.title}\``
          )
          .setColor("Red"),
      ],
    });
  },
};
