export const fittingFilmRoute = "/phim-thu-do/";
export const fittingFilm = {
  src: "/media/2026/09/st-tailor-womenswear-fitting-film.mp4",
  poster: "/media/2026/09/st-tailor-womenswear-fitting-poster.webp",
  name: "A fitting in motion | Thử phom qua chuyển động",
  description: "A client reviews the line and movement of a long black skirt during a fitting at S.T Tailor in Ho Chi Minh City.",
  duration: 34,
  publishedAt: "2026-09-27T13:51:00+07:00"
};

export async function fetchFittingFilm(request, assets) {
  const source = await assets.fetch(request);
  if (source.status !== 200) return source;

  const headers = new Headers(source.headers);
  headers.set("Accept-Ranges", "bytes");
  const range = request.method === "GET" && request.headers.get("Range")?.trim().match(/^bytes=(\d*)-(\d*)$/i);
  const ifRange = request.headers.get("If-Range");
  const validatorMatches = !ifRange ||
    (!ifRange.startsWith("W/") && ifRange === headers.get("ETag")) ||
    ifRange === headers.get("Last-Modified");
  if (!range || (!range[1] && !range[2]) || !validatorMatches) {
    return new Response(source.body, { status: 200, headers });
  }

  // Workers Static Assets supplies the complete MP4 even when Range is set.
  // Only this small, fixed asset is buffered so Safari can seek and play it.
  const bytes = new Uint8Array(await source.arrayBuffer());
  const start = range[1] ? Number(range[1]) : Math.max(0, bytes.length - Number(range[2]));
  const end = range[1] && range[2] ? Math.min(Number(range[2]), bytes.length - 1) : bytes.length - 1;
  if (start > end) {
    headers.set("Content-Range", `bytes */${bytes.length}`);
    headers.set("Content-Length", "0");
    return new Response(null, { status: 416, headers });
  }

  headers.set("Content-Range", `bytes ${start}-${end}/${bytes.length}`);
  headers.set("Content-Length", String(end - start + 1));
  return new Response(bytes.subarray(start, end + 1), { status: 206, headers });
}
