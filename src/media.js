// Vite replacement for CRA's webpack `require(`${isrc}.mp4`)`.
// Eagerly resolve every bundled media asset to its final hashed URL, keyed by
// the same "./images/iN.ext" path the components already use.
const modules = import.meta.glob("./images/*.{mp4,gif}", {
  eager: true,
  query: "?url",
  import: "default",
});

// isrc is like "./images/i3", ext is "mp4" or "gif".
export function mediaUrl(isrc, ext) {
  return modules[`${isrc}.${ext}`];
}
