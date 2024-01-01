/* global expect test */
import site from "./uta-net.js";

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
    url: "https://www.uta-net.com/song/231884/",
    title: "sh0ut",
    artist: "SawanoHiroyuki[nZk]:Tielle&Gemie",
    lyricist: "Hiroyuki Sawano・Tielle",
    composer: "Hiroyuki Sawano",
    length: 1881,
  });
});

test("", async () => {
  await testLyric({
    url: "https://www.uta-net.com/song/237845/",
    title: "灰色と青 ( + 菅田将暉)",
    artist: "米津玄師",
    lyricist: "米津玄師",
    composer: "米津玄師",
    length: 629,
  });
});

test("", async () => {
  await testLyric({
    url: "https://www.uta-net.com/song/322189/",
    title: "JUST COMMUNICATION",
    artist: "angela",
    lyricist: "永野椎菜",
    composer: "馬飼野康二",
    arranger: "angela",
    length: 671,
  });
});
