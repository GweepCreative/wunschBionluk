function formatTime(string) {
  return string
    .replace("s", " saniye")
    .replace("m", " dakika")
    .replace("h", " saat")
    .replace("d", " gün")
    .replace("w", " hafta");
}
module.exports = formatTime;
