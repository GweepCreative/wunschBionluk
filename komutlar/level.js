const {
  Client,
  CommandInteraction,
  MessageEmbed,
  Permissions,
  MessageAttachment,
  Message,
  EmbedBuilder,
  AttachmentBuilder,
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
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    let subCmd = args[0];
    switch (subCmd) {
      case "ayarla": {
		  if(!args[1]) return message.reply("Lütfen bir seviye belirtiniz\nDoğru kullanım: !level ayarla <seviye> @user")
        if (message.member.user.id != botOwner) {
          message.reply({
            ephemeral: true,
            embeds: [
              new EmbedBuilder()
                .setDescription(
                  "Bu komutu kullanmak için Bot Yöneticisi olman gerekiyor"
                )
                .setColor("Red"),
            ],
          });
          return;
        }
       const member = args[2] ? 
          message.guild.members.cache.get(args[1].replace(/[<>@!]/g,"")) : message.member;
       if(isNaN(Number(args[2]))) return message.reply("Lütfen geçerli bir seviye belirtiniz")
        let yenilevel = Number(args[1])
        await User.updateOne(
          { id: member.id },
          { xp: yenilevel },
          { upsert: true }
        );
        message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("Green")
              .setTitle("Seviye Ayarlandı")
              .setDescription(
                `${member} adlı kullanıcının seviyesi ${yenilevel} olarak ayarlandı.`
              ),
          ],
        });
        break;
      }
      case "sıfırla": {
        if (message.member.user.id != global.botOwner) {
          message.reply({
            ephemeral: true,
            embeds: [
              new EmbedBuilder()
                .setDescription(
                  "Bu komutu kullanmak için Sunucu Yöneticisi olman gerekiyor"
                )
                .setColor("Red"),
            ],
          });
          return;
        }
        const member = args[1] ? 
          message.guild.members.cache.get(args[1].replace(/[<>@!]/g,"")) : message.member;
        await User.updateOne(
          { id: member.user.id },
          { $set: { xp: 0, xpPoint: 0, gerekli: 20000 } },
          { upsert: true }
        );
        message.reply({
          embeds: [
            new EmbedBuilder()
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
		 
        const lvlInteraction = await message.reply({
          content: "Hazırlanıyor",
          ephemeral: true,
        });
        const member = args[1] ?
          message.guild.members.cache.get(args[1].replace(/[<>@!]/g,"")) : message.member;
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
            .setStatus(
              member?.presence?.status ? member.presence.status : "dnd"
            )
            .setGraphemeProvider(BuiltInGraphemeProvider.FluentEmojiFlat);
          rank
            .build({ format: "png" })
            .then((data) => {
              const dosya = new AttachmentBuilder(data, "seviye.png");
              lvlInteraction.edit({ content: "Leveliniz", files: [dosya] });
            })
            .catch((err) => {
              console.log(err);
              lvlInteraction.edit({
                content: "Leveliniz",
                embeds: [
                  new EmbedBuilder()
                    .setColor("Red")
                    .setDescription(
                      "Seviye bilgileri alınırken bir hata ile karşılaşıldı."
                    ),
                ],
              });
            });
        } catch (err) {
          console.log(err);
          message.channel.send({
            ephemeral: true,
            embeds: [
              new EmbedBuilder()
                .setColor("Red")
                .setDescription(
                  "Seviye bilgileri alınırken bir hata ile karşılaşıldı."
                ),
            ],
          });
        }
        break;
      }
      default: {
        message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("Red")
              .setDescription(
                "Geçersiz bir alt komut girdiniz. Lütfen `ayarla`, `sıfırla` veya `bilgi` komutlarından birini girin.\n`!level <bilgi|ayarla|sıfırla> <kullanıcı> <seviye>`"
              ),
          ],
        });
      }
    }
  },
};
