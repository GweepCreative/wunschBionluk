const roles = {
  1: "1207700782829281410",
  2: "1207700870867849266",
  3: "1207700917323960350",
  4: "1207700949204734022",
  5: "1207701714677927966",
  6: "1207701742456938516",
  7: "1207702125337903145",
  8: "1207702153276301422",
  9: "1207702184406421534",
  10: "1207702220305473667",
};
async function upLevel(interaction, userId, level) {
	if(level > 10) return;
  const roleId = roles[level] || undefined;
  if (roleId == undefined) return;
  try {
    await interaction.member.roles.add(roleId);
  } catch (err) {
    console.log(`[UPLEVEL ERROR] | ${err}`);
  }
}
module.exports = { upLevel };
