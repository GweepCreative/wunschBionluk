const { MessageEmbed, Client, CommandInteraction } = require("discord.js");
const { User } = require("../utils/schemas");
const { botOwner } = require("../ayarlar.json");

module.exports = {
  name: "para-al",
  description: "Kullanıcıdan para alır",
  options: [
    {
      name: "kullanıcı",
      description: "Kullanıcı",
      type: 6,
      required: true,
    },
    {
      name: "miktar",
      description: "Vermek istediğiniz miktar",
      type: 4,
      required: true,
      min_value: 50,
    },
  ],
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  run: async (client, interaction) => {
    if (interaction.member.id !== botOwner)
      return interaction.reply({
        content: "Bu komutu kullanmak için Bot Sahibi Olmazsınız",
        ephemeral: true,
      });
    let userId = interaction.options.getUser("kullanıcı").id;
    let amount = interaction.options.get("miktar").value;
    if (!client.users.fetch(userId))
      return interaction.reply({
        embeds: [
          { title: "Sistemde böyle bir kullanıcı bulamıyorum", color: "RED" },
        ],
      });
    const embed = new MessageEmbed({ color: "YELLOW" });
    const userData =
      (await User.findOne({ id: userId })) || new User({ id: userId });
    if (userData.wallet >= amount) {
      userData.wallet -= amount;
    } else {
      if (userData.bank >= amount) {
        userData.bank -= amount;
      } else {
        userData.wallet = 0;
      }
    }
    userData.save();
    return interaction.reply({
      embeds: [
        embed.setDescription(
          `✅ Kullanıcı hesabından \` ${amount} \` 🪙 tutar para alındı`
        ),
      ],
    });
  },
};
