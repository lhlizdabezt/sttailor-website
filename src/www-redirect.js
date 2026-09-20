const canonicalHost = "sttailor.com";

export default {
  async fetch(request) {
    const url = new URL(request.url);
    url.protocol = "https:";
    url.hostname = canonicalHost;
    return Response.redirect(url, 301);
  }
};
