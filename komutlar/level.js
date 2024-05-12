const {
  Client,
  CommandInteraction,
  MessageEmbed,
  Permissions,
  MessageAttachment,
} = require("discord.js");
const {
  Font,
  RankCardBuilder,
  BuiltInGraphemeProvider,
  RankCardUserStatus,
} = require("canvacord");
// load default font
Font.loadDefault();
const { botOwner } = require("../ayarlar.json");
const { User } = require("../utils/schemas");
module.exports = {
  name: "level",
  description: "Seviyeler",
  type: 1,
  default_permission: true,
  options: [
    {
      name: "bilgi",
      description: "Kullanıcının seviye bilgisini gösterir",
      type: 1,
      options: [
        {
          name: "kullanıcı",
          description: "Seviye bilgilerini gösterilecek kullanıcıyı seç",
          type: 6,
          required: false,
        },
      ],
    },
    {
      name: "ayarla",
      description: "Kullanıcının seviye bilgisini ayarlar",
      type: 1,
      options: [
        {
          name: "kullanıcı",
          description: "Seviye bilgilerini ayarlanıcak kullanıcıyı seç",
          type: 6,
          required: true,
        },
        {
          name: "seviye",
          description: "Yeni seviyesi",
          type: 4,
          required: true,
        },
      ],
    },
    {
      name: "sıfırla",
      description: "Kullanıcının seviye bilgisini sıfırlar",
      type: 1,
      options: [
        {
          name: "kullanıcı",
          description: "Seviye bilgilerini sıfırlanacak kullanıcıyı seç",
          type: 6,
          required: true,
        },
      ],
    },
  ],
  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  run: async (client, interaction) => {
   
    let subCmd = interaction.options.getSubcommand();
    switch (subCmd) {
      case "ayarla": {
        if (
          interaction.member.user.id != botOwner 
        ) {
          interaction.reply({
            ephemeral: true,
            embeds: [
              new MessageEmbed()
                .setDescription(
                  "Bu komutu kullanmak için Bot Yöneticisi olman gerekiyor"
                )
                .setColor("RED"),
            ],
          });
          return;
        }
        let member = interaction.options.getMember("kullanıcı");
        let yenilevel = interaction.options.getInteger("seviye");
        await User.updateOne(
          { id: member.id },
          { xp: yenilevel },
          { upsert: true }
        );
        interaction.reply({
          embeds: [
            new MessageEmbed()
              .setColor("GREEN")
              .setTitle("Seviye Ayarlandı")
              .setDescription(
                `${member} adlı kullanıcının seviyesi ${yenilevel} olarak ayarlandı.`
              ),
          ],
        });
        break;
      }
      case "sıfırla": {
        if (
          interaction.member.user.id != botOwner
        ) {
          interaction.reply({
            ephemeral: true,
            embeds: [
              new MessageEmbed()
                .setDescription(
                  "Bu komutu kullanmak için Sunucu Yöneticisi olman gerekiyor"
                )
                .setColor("RED"),
            ],
          });
          return;
        }
        const member = interaction.options.getMember("kullanıcı");
        await User.updateOne(
          { id: member.user.id },
          { $set: { xp: 0, xpPoint: 0, gerekli: 20000 } },
          { upsert: true }
        );
        interaction.reply({
          embeds: [
            new MessageEmbed()
              .setColor("#2F3136")
              .setTitle("Seviye Sıfırlandı")
              .setDescription(
                `${member} adlı kullanıcının seviyesi sıfırlandı.`
              ),
          ],
        });
        break;
      }
      case "bilgi": {
        const lvlInteraction = await interaction.reply({
          content: "Hazırlanıyor",
          ephemeral: true,
        });
        let member =
          interaction.options.getMember("kullanıcı") || interaction.member;
        try {
          let x =
            (await User.findOne({ id: member.id })) ||
            new User({ id: member.id, level: 0, xp: 0, gerekli: 20000 });

          // const font = new canvacord.Font.loadDefault();
          const rank = new RankCardBuilder()
            .setTextStyles({
              rank: "Cüzdan: 🪙",
            })

            .setRank(x.wallet)

            .setDisplayName(member.displayName)
            .setUsername(`@${member.user.username}`)
            .setAvatar(member.user.avatarURL({ size: 1024 }))
            .setCurrentXP(x.xpPoint)
            .setRequiredXP(x.gerekli)
			  .setStyles({
              progressbar: {
                container: { className: "bg-[#23272a]" },
                track: { className: "bg-orange-500" },
                thumb: { className: "bg-white" },
              },
            })
            .setProgressCalculator((curret, required) => {
              return Math.floor((curret * 100) / required);
            })
            .setLevel(x.xp)
            .setOverlay(90)
            .setBackground("#23272a")
            .setStatus(member?.presence?.status ? member.presence.status : "dnd")
            .setGraphemeProvider(BuiltInGraphemeProvider.FluentEmojiFlat);
          rank
            .build({ format: "png" })
            .then((data) => {
              const dosya = new MessageAttachment(data, "seviye.png");
              interaction.channel.send({ files: [dosya] });
            })
            .catch((err) => {
              console.log(err);
              interaction.channel.send({
                ephemeral: true,
                embeds: [
                  new MessageEmbed()
                    .setColor("RED")
                    .setDescription(
                      "Seviye bilgileri alınırken bir hata ile karşılaşıldı."
                    ),
                ],
              });
            });
        } catch (err) {
          console.log(err);
          interaction.channel.send({
            ephemeral: true,
            embeds: [
              new MessageEmbed()
                .setColor("RED")
                .setDescription(
                  "Seviye bilgileri alınırken bir hata ile karşılaşıldı."
                ),
            ],
          });
        }
      }
    }
  },
};
