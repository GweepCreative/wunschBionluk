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
    if (userData.tasks?.isActive)
      return message.reply("Zaten bir göreviniz var");
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
