import LyricBase from './include/lyric-base.js';
import BlockedError from './include/blocked-error.js';

const keyword = 'musixmatch';

class Lyric extends LyricBase {
  find_lyric(url, json) {
    try {
      const { lyrics } = json.props.pageProps.data.trackInfo.data;
      let lyric = lyrics.body;
      lyric = lyric.replaceAll('′', "'");
      this.lyric = lyric;
    } catch {
      console.error('json does not have lyrics body');
      return false;
    }

    return true;
  }

  find_info(url, json) {
    try {
      const { track } = json.props.pageProps.data.trackInfo.data;
      this.title = track.name;
      this.artist = track.artistName;
    } catch {
      return false;
    }

    return true;
  }

  is_blocked(html) {
    return html.includes('We detected that your IP is blocked');
  }

  find_json(html) {
    const prefix = '<script id="__NEXT_DATA__" type="application/json">';
    const suffix = '</script>';

    const raw = this.find_string_by_prefix_suffix(html, prefix, suffix, false);
    if (!raw) {
      if (this.is_blocked(html)) {
        throw new BlockedError('musixmatch is blocked');
      }
      console.error(`Failed to get json content`);
      console.error(html);
      return false;
    }

    return JSON.parse(raw);
  }

  async parse_page() {
    const { url } = this;

    const html = await this.getHtml(url);
    const json = this.find_json(html);
    this.find_lyric(url, json);
    this.find_info(url, json);

    return true;
  }
}

export default {
  keyword,
  Lyric,
};
