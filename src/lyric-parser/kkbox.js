import LyricBase from "./include/lyric-base.js";
import BlockedError from "./include/blocked-error.js";

const keyword = "kkbox";

class Lyric extends LyricBase {
  get_json_ld(html) {
    const prefix = '<script type="application/ld+json">';
    const suffix = "</script>";

    const pos = html.indexOf(prefix);
    if (pos === -1) {
      return false;
    }
    const second_part = html.slice(Math.max(0, pos + 1));

    const json_ld = this.find_string_by_prefix_suffix(
      second_part,
      prefix,
      suffix,
      false
    );
    return JSON.parse(json_ld);
  }

  find_lyric(url, html) {
    const json_ld = this.get_json_ld(html);
    if (!json_ld) {
      return false;
    }

    let lyric = json_ld.recordingOf.lyrics.text;
    lyric = lyric.trim();

    this.lyric = lyric;

    return true;
  }

  find_info(url, html) {
    const json_ld = this.get_json_ld(html);

    this.title = json_ld.name;
    this.artist = json_ld.byArtist.name;
    this.lyricist = json_ld.recordingOf.lyricist.name;
    this.composer = json_ld.recordingOf.composer.name;
  }

  async parse_page() {
    const { url } = this;

    try {
      const html = await this.getHtml(url);
      await this.find_lyric(url, html);
      await this.find_info(url, html);
    } catch (error) {
      if (error.status === 403) {
        throw new BlockedError("KKbox shows 403");
      }
      if (error.code === "ECONNRESET") {
        throw error;
      }
    }

    return true;
  }
}

export default {
  keyword,
  Lyric,
};
