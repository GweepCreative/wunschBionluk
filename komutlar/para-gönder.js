const { MessageEmbed, Client, CommandInteraction } = require("discord.js");
const { User } = require("../utils/schemas");
const { botOwner } = require("../ayarlar.json");
module.exports = {
  name: "para-gönder",
  description: "Kullanıcıya Para Gönderir (%20 Komisyon keser)",
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
    let userId = interaction.options.getUser("kullanıcı").id;
    let author = interaction.member.user.id;
    let amount = interaction.options.get("miktar").value;
    let komisyon = Math.ceil((amount * 10) / 100);
    let total = amount - komisyon;
    if (!client.users.fetch(userId))
      return interaction.reply({
        embeds: [
          { title: "Sistemde böyle bir kullanıcı bulamıyorum", color: "RED" },
        ],
      });
    const embed = new MessageEmbed({ color: "YELLOW" });
    const userData =
      (await User.findOne({ id: author })) || new User({ id: author });

    const clientData =
      (await User.findOne({ id: userId })) || new User({ id: userId });
    if (userData.wallet < amount)
      return interaction.reply({
        embeds: [
          {
            description: `Hesabınızda yeteri kadar para bulunmuyor. Gerekli miktar \`${amount}\` 🪙 SGAT Cash`,
            color: "RED",
          },
        ],
      });
    userData.wallet -= amount;
    clientData.wallet += total;
    userData.save();
    clientData.save();
    return interaction.reply({
      embeds: [
        embed.setDescription(
          `✅ Kullanıcı hesabınıza \` ${total} \` 🪙 tutar SGAT Cash eklendi. Hesabınızdan kesilen miktar \` ${amount} \``
        ),
      ],
    });
  },
};
