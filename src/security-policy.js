// Hashes cover the two build-time measurement bootstraps and the two inline
// snippets inserted by Cloudflare's first-party Google tag gateway.
// The build and live checks reject executable inline scripts outside this list.
export const inlineScriptHashes = [
  "Txl0jxehl06jkFDH497A3Va/XLXOwwrptSj2+4Y+Etc=",
  "KJezzJvqB3Q7lS9Q0HxeOdHhOaJ/RrVtha21SUMsylQ=",
  "yU1/2lX6VdSM1Kp45Hd8q1UXs7KJGTfkHlbmkbpHiS8=",
  "n8EGvd+f0qUCWGy8Y7UVeKDrBiP6td4UjWKroJeastE="
];

const measurementSources = [
  "'self'",
  ...inlineScriptHashes.map((hash) => `'sha256-${hash}'`),
  "https://www.googletagmanager.com",
  "https://www.clarity.ms",
  "https://scripts.clarity.ms",
  "https://connect.facebook.net",
  "https://cdn.jsdelivr.net/npm/meta-capi-param-builder-clientjs/dist/clientParamBuilder.bundle.js",
  "https://static.cloudflareinsights.com"
];

const tripadvisorSources = [
  "https://www.jscache.com",
  "https://www.tripadvisor.com",
  "https://static.tacdn.com"
];

export const tripadvisorEmbedPath = "/embed/tripadvisor/";

export function contentSecurityPolicy(pathname) {
  const scriptSources = pathname === tripadvisorEmbedPath
    ? ["'self'", ...tripadvisorSources]
    : measurementSources;
  return [
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'self'",
    `script-src ${scriptSources.join(" ")}`,
    "script-src-attr 'none'",
    "upgrade-insecure-requests"
  ].join("; ");
}
