import LyricBase from "./include/lyric-base.js";

const keyword = "uta-net";

class Lyric extends LyricBase {
  find_song_id(url) {
    const pattern = /[a-z]+\/(\d+)/;
    return this.get_first_group_by_pattern(url, pattern);
  }

  async find_lyric(url) {
    const song_id = this.find_song_id(url);

    if (!song_id) {
      console.warn("Failed to get song id of url:", url);
      return false;
    }

    const song_url = `https://www.uta-net.com/user/phplib/svg/showkasi.php?ID=${song_id}`;
    const raw = await this.getHtml(song_url);
    if (!raw) {
      console.warn("Failed to get content of url:", song_url);
      return false;
    }

    const prefix = "<svg ";
    const suffix = "</svg>";
    let lyric = this.find_string_by_prefix_suffix(raw, prefix, suffix, true);
    if (!lyric) {
      console.warn("Failed to find lyric");
      return false;
    }

    lyric = lyric.replaceAll("</text>", "\n");
    lyric = this.sanitize_html(lyric);

    this.lyric = lyric;
    return true;
  }

  async find_info(url) {
    const html = await this.getHtml(url);

    const patterns = {
      title: "<h2[^>]*>([^<]+)</h2>",
      artist: '<a href="/artist/[0-9]+/".*?itemprop="byArtist".*?>(.+?)</a>',
      lyricist: '作詞：<a.*?itemprop="lyricist".*?>(.+?)</a>',
      composer: '作曲：<a.*?itemprop="composer".*?>(.+?)</a>',
      arranger: '編曲：<a.*?itemprop="arranger".*?>(.+?)</a>',
    };

    this.fill_song_info(html, patterns);
  }

  async parse_page() {
    const { url } = this;

    await this.find_lyric(url);
    await this.find_info(url);

    return true;
  }
}

export default {
  keyword,
  Lyric,
};
