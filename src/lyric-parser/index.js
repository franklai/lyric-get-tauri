import BlockedError from './include/blocked-error.js';

import genius from './genius.js';
import kkbox from './kkbox.js';
import mojim from './mojim.js';
import musixmatch from './musixmatch.js';
import uta_net from './uta-net.js';
import utamap from './utamap.js';

// let site_dict = {};
const site_array = [
  genius,
  kkbox,
  // lyrical_nonsense,
  mojim,
  musixmatch,
  utamap,
  uta_net,
];

class SiteNotSupportError extends Error {
  constructor(domain) {
    const message = `Site ${domain} is not supported`;
    super(message);
    this.domain = domain;
  }
}

const get_object = async (url, { getHtml }) => {
  let site;

  site_array.some((item) => {
    if (!url.includes(item.keyword)) {
      return false;
    }

    site = item;
    return true;
  });

  if (!site) {
    const found = url.substring(0, url.indexOf('/', 'https://'.length)) || url;
    throw new SiteNotSupportError(found);
  }

  const object = new site.Lyric(url, { getHtml });

  if (!(await object.parse_page())) {
    throw new Error('Parse failed.');
  }

  return object;
};

const getFull = async (url, { getHtml }) => {
  const object = await get_object(url, { getHtml });

  return object.get_full();
};

const getJson = async (url, { getHtml }) => {
  const object = await get_object(url, { getHtml });

  return object.get_json();
};

export default {
  getFull,
  getJson,
  SiteNotSupportError,
  BlockedError,
};
