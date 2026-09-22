// IndexNow ownership keys are intentionally public: the protocol requires this
// value to be hosted at the canonical origin before a search engine accepts a
// notification. It is not a Cloudflare, GitHub, or application secret.
export const indexNowHost = "sttailor.com";
export const indexNowKey = "7fef6e584133598b3cb206cc3a57f7c2d65f3d2aa8a077d84fe34b88b89cf373";
export const indexNowKeyFile = `${indexNowKey}.txt`;
export const indexNowKeyLocation = `https://${indexNowHost}/${indexNowKeyFile}`;
export const indexNowEndpoint = "https://www.bing.com/indexnow";
