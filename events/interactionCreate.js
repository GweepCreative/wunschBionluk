const {
  Client,
  CommandInteraction,
  ActionRowBuilder,
  ButtonBuilder,
} = require("discord.js");
const fs = require("fs");
const Shop = require("../utils/shop");
const { User } = require("../utils/schemas");
/**
 *
 * @param {Client} client
 * @param {CommandInteraction} interaction
 */
module.exports = async (client, interaction) => {
   if (interaction.member.user.id !== "586822327568695317") {
     if (
       interaction.channelId !== "1155193203146895451" &&
       interaction.channel.parentId !== "1206363617625251850"
    )
     return interaction.reply({
         content: "Bu kanalda komut kullanamazsınız.",
         ephemeral: true,
       });
   }
  if (interaction.isButton()) {
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
  if (interaction.isAnySelectMenu()) {
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
