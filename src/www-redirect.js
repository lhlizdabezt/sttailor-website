const canonicalHost = "sttailor.com";

export default {
  async fetch(request) {
    const url = new URL(request.url);
    url.protocol = "https:";
    url.hostname = canonicalHost;
    return new Response(null, { status: 301, headers: {
      Location: url.toString(),
      "Cache-Control": "public, max-age=86400",
      "Strict-Transport-Security": "max-age=15552000",
      "X-Content-Type-Options": "nosniff"
    } });
  }
};
