/* global expect test */

import site from './musixmatch.js';
import BlockedError from './include/blocked-error.js';

const getHtml = async (url) => {
  const response = await fetch(url);
  return await response.text();
};

async function testLyric(object) {
  const { url, title, artist, lyricist, composer, arranger, length } = object;
  const inst = new site.Lyric(url, { getHtml });
  try {
    await inst.get();
  } catch (error) {
    if (error instanceof BlockedError) {
      console.warn('Blocked by vendor');
      return;
    }
  }

  expect(inst.title).toBe(title);
  expect(inst.artist).toBe(artist);
  if (lyricist) expect(inst.lyricist).toBe(lyricist);
  if (composer) expect(inst.composer).toBe(composer);
  if (arranger) expect(inst.arranger).toBe(arranger);
  if (length > 0) expect(inst.lyric.length).toBe(length);
}

test('', async () => {
  await testLyric({
    url: 'https://www.musixmatch.com/lyrics/SawanoHiroyuki-nZk-Tielle-Gemie/sh0ut',
    title: 'sh0ut',
    artist: 'SawanoHiroyuki[nZk]:Tielle&Gemie',
    length: 1957,
  });
});

test('', async () => {
  await testLyric({
    url: 'https://www.musixmatch.com/lyrics/Maroon-5/Sugar',
    title: 'Sugar',
    artist: 'Maroon 5',
    length: 2511,
  });
});
