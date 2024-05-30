const Task = require("../utils/task");
const { Message, Client, EmbedBuilder } = require("discord.js");
const ms = require("ms");
const useId = require("../utils/useId");
const { User } = require("../utils/schemas");
const prettyMilliseconds = require("pretty-ms");
const formatTime = require("../utils/formatTime");
module.exports = {
  name: "göreval",
  description: "Rastgele görev verir",
  isAdmin: false,
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    if (message.channelId !== global.taskChannel) return;

    const tasks = await Task.find();
    const task = tasks[Math.floor(Math.random() * tasks.length)];
    const userData =
      (await User.findOne({ id: message.author.id })) ||
      new User({ id: message.author.id });
    if (userData?.tasks && userData.tasks.isActive)
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
          new EmbedBuilder().setTitle("Lütfen Bekleyin").setDescription(
            `⌛ Zaten yakın zamanda görev aldınız, lütfen yeni görev almak için **\`${prettyMilliseconds(
              userData.cooldowns.task - Date.now(),
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
          .setFields([
            { name: `Göreviniz`, value: `${task.title}`, inline: false },
            { name: `Ödül`, value: `${task.prize} Cash`, inline: false },
            {
              name: `Süre`,
              value: `${formatTime(
                ms(Number(task.deadline), {
                  long: false,
                })
              )}`,
              inline: false,
            },
            { name: `Görev ID`, value: `${task.id}`, inline: false },
          ])

          .setColor("Green"),
      ],
    });
  },
};
