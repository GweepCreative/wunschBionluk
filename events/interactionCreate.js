const {
  Client,
  CommandInteraction,
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
  ButtonStyle,
} = require("discord.js");
const fs = require("fs");
const Shop = require("../utils/shop");
const { User } = require("../utils/schemas");
const Task = require("../utils/task");
const ms = require("ms");
/**
 *
 * @param {Client} client
 * @param {CommandInteraction} interaction
 */
module.exports = async (client, interaction) => {
  if (interaction.member.user.id !== global.botOwner) {
    if (!global.cmdChannelId.includes(interaction.channelId))
      return interaction.reply({
        content: "Bu kanalda komut kullanamazsınız.",
        ephemeral: true,
      });
  }
  if (interaction.isButton()) {
    if (interaction.customId.startsWith("onayla")) {
      const userId = interaction.customId.split("_")[1];
      const userData = await User.findOne({ id: userId });
      userData.wallet += userData.tasks.prize;

      if (userId !== global.botOwner)
        userData.cooldowns.task = Date.now() + 1000 * 60 * 60 * 12; // 12 saat

      userData.complatedTasks.push({
        taskId: userData.tasks.taskId,
        prize: userData.tasks.prize,
        complatedAt: new Date(),
      });
      try {
        client.users.cache.get(userId).send({
          content: `\`${userData.tasks.title}\` Göreviniz başarıyla onaylandı. Ödül olarak **${userData.tasks.prize}** Cash kazandınız`,
        });
      } catch {}
      userData.tasks = null;
      userData.save();

      interaction.message.edit({
        components: [
          new ActionRowBuilder().setComponents(
            new ButtonBuilder()
              .setLabel(
                `${interaction.member.user.username} tarafından onaylandı`
              )
              .setDisabled(true)
              .setCustomId("reddet")
              .setStyle(ButtonStyle.Success)
          ),
        ],
      });
      interaction.reply({
        content: "Görev başarıyla onaylandı",
        ephemeral: true,
      });
    } else if (interaction.customId.startsWith("reddet")) {
      const userId = interaction.customId.split("_")[1];
      const userData = await User.findOne({ id: userId });

      try {
        client.users.cache.get(userId).send({
          content: `\`${userData.tasks.title}\` Göreviniz reddedildi`,
        });
      } catch {}
      userData.tasks = null;

      userData.save();
      interaction.message.edit({
        components: [
          new ActionRowBuilder().setComponents(
            new ButtonBuilder()
              .setLabel(
                `${interaction.member.user.username} tarafından reddedildi`
              )
              .setDisabled(true)
              .setCustomId("reddet")
              .setStyle(ButtonStyle.Danger)
          ),
        ],
      });
      interaction.reply({
        content: "Görev reddedildi",
        ephemeral: true,
      });
    }

    if (interaction.customId.startsWith("satinal")) {
      let urun_kod = interaction.customId.split("-")[1];
      let data = await Shop.findOne({ id: urun_kod });
      if (!data)
        return interaction.reply({
          embeds: [
            {
              title: "Ürün Bulunamadı",
              description: "Belirtilen ürün koduna ait ürün bulunamadı",
            },
          ],
        });
      const userData =
        (await User.findOne({ id: interaction.member.user.id })) ||
        new User({ id: interaction.member.user.id });

      if (userData.wallet < data.balance)
        return interaction.reply({
          embeds: [{ title: "Hata", description: "Bakiye yetersiz" }],
        });
      if (userData.products.some((x) => x.id === urun_kod)) {
        // console.log("if");
        // Update product count
        await User.updateOne(
          { id: interaction.member.user.id, "products.id": urun_kod },
          { $inc: { wallet: -data.balance, "products.$.count": 1 } },
          { upsert: true }
        );
      } else {
        // console.log("else");
        data = { ...data._doc, count: 1 };
        await User.updateOne(
          { id: interaction.member.user.id },
          {
            $inc: { wallet: -data.balance },
            $push: { products: data },
          },
          { upsert: true }
        );
      }

      interaction.reply({
        embeds: [
          {
            title: "Ürün Satın Alındı",
            fields: [
              { name: "Ürün Adı", value: `${data.name}` },
              { name: "Ücret", value: `${data.balance}` },
            ],
          },
        ],
      });
    }
  }
  if (interaction.isStringSelectMenu()) {
    let kod = interaction.values[0];

    let data = await Shop.findOne({ id: kod });
    if (!data)
      return interaction.reply({
        embeds: [
          {
            title: "Ürün Bulunamadı",
            description: "Belirtilen ürün koduna ait ürün bulunamadı",
          },
        ],
      });
    interaction.reply({
      embeds: [
        {
          title: "Ürün Bilgisi",
          fields: [
            { name: "Ürün Adı", value: `${data.name}` },
            { name: "Ücret", value: `${data.balance}` },
          ],
          footer: {
            text: `Ürün Kodu: ${kod} - ${interaction.member.user.tag} tarafından istendi`,
          },
        },
      ],
      components: [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId(`satinal-${kod}`)
            .setEmoji("💰")
            .setLabel("Satın Al")
            .setStyle("Primary")
        ),
      ],
    });
  }
  // if (interaction.isCommand()) {
  //   try {
  //     fs.readdir("./slashKomutlar/", (err, files) => {
  //       if (err) throw err;

  //       files.forEach(async (f) => {
  //         const command = require(`../slashKomutlar/${f}`);
  //         if (
  //           interaction.commandName.toLowerCase() === command.name.toLowerCase()
  //         ) {
  //           return command.run(client, interaction);
  //         }
  //       });
  //     });
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }
};
