const Task = require("../utils/task");
const { Message, Client, EmbedBuilder } = require("discord.js");
const ms = require("ms");
const useId = require("../utils/useId");
const formatTime = require("../utils/formatTime");
module.exports = {
  name: "görevoluştur",
  description: "Görev Oluşturur",
  isAdmin: true,
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    const title = args.slice(2).join(" "),
      prize = args[0],
      deadline = args[1];
    if (!title || !prize || !deadline || isNaN(prize) || isNaN(ms(deadline)))
      return message.reply(
        "Hatalı kullanım! Örnek: `!görev-oluştur 300 1<m|h|d|w> Görev Başlığı\n(m: Dakika, h: Saat, d: Gün, w: Hafta)`"
      );
    const taskId = useId(6).toUpperCase();
    new Task({
      id: taskId,
      title,
      prize,
      deadline: ms(deadline),
    }).save();

    return message.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Görev Oluşturuldu")
          .setDescription(
            `Görev başarıyla oluşturuldu!\n**Görev ID: **\`${taskId}\`\n**Ödül: **\`${prize} Cash\`\n**Süre: **\`${formatTime(
              deadline
            )}\`\n**Başlık: **\`${title}\``
          )
          .setColor("Green"),
      ],
    });
  },
};
