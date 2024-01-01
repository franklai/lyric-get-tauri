/* global expect test */
import site from "./utamap.js";

const getHtml = async (url) => {
  const response = await fetch(url);
  return await response.text();
};

async function testLyric(object) {
  const { url, title, artist, lyricist, composer, arranger, length } = object;
  const inst = new site.Lyric(url, { getHtml });
  await inst.get();

  expect(inst.title).toBe(title);
  expect(inst.artist).toBe(artist);
  if (lyricist) expect(inst.lyricist).toBe(lyricist);
  if (composer) expect(inst.composer).toBe(composer);
  if (arranger) expect(inst.arranger).toBe(arranger);
  if (length > 0) expect(inst.lyric.length).toBe(length);
}

test("", async () => {
  await testLyric({
    url: "https://www.utamap.com/showkasi.php?surl=59709",
    title: "One more time,One more chance",
    artist: "山崎まさよし",
    lyricist: "山崎将義",
    length: 794,
  });
});

test("", async () => {
  await testLyric({
    url: "https://www.utamap.com/showkasi.php?surl=k-131226-001",
    title: "ちっぽけな愛のうた",
    artist: "小枝理子&小笠原秋",
    lyricist: "亀田誠治",
    composer: "亀田誠治",
    length: 572,
  });
});
