/* global expect test */
import site from './genius.js';
import BlockedError from './include/blocked-error.js';

const getHtml = async (url) => {
  const response = await fetch(url);
  return await response.text();
};

async function testLyric(object) {
  const { url, title, artist, lyricist, composer, length } = object;
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
  if (length > 0) expect(inst.lyric.length).toBe(length);
}

test('', async () => {
  await testLyric({
    url: 'https://genius.com/Hollow-coves-coastline-lyrics',
    title: 'Coastline',
    artist: 'Hollow Coves',
    length: 1028,
  });
});

// test('', async () => {
//   await testLyric({
//     url: 'https://genius.com/Guns-n-roses-sweet-child-o-mine-lyrics',
//     title: "Sweet Child O’ Mine",
//     artist: "Guns N’ Roses",
//     length: 1,
//   });
// });
