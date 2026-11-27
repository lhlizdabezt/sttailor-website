import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { indexNowEndpoint, indexNowHost, indexNowKey, indexNowKeyLocation } from "../src/indexnow.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sitemap = readFileSync(path.join(root, "dist", "sitemap.xml"), "utf8");
const canonicalOrigin = `https://${indexNowHost}`;
const dryRun = process.env.INDEXNOW_DRY_RUN === "1";
const previousManifestPath = process.env.INDEXNOW_PREVIOUS_MANIFEST;
if (!dryRun && !previousManifestPath) {
  throw new Error("IndexNow submission requires INDEXNOW_PREVIOUS_MANIFEST from before deployment.");
}

function canonicalUrl(route) {
  const url = new URL(route, canonicalOrigin);
  if (url.origin !== canonicalOrigin || url.pathname !== route || url.search || url.hash || !route.endsWith("/")) {
    throw new Error(`IndexNow stopped: invalid production route ${route}.`);
  }
  return url.href;
}

function readReleaseManifest(filename, allowLegacy = false) {
  const { routes, indexNowPageSignatures: signatures } = JSON.parse(readFileSync(filename, "utf8"));
  if (!Array.isArray(routes) || !routes.length || new Set(routes).size !== routes.length) {
    throw new Error(`IndexNow stopped: invalid route list in ${filename}.`);
  }
  const urls = routes.map(canonicalUrl);
  if ((!allowLegacy || signatures !== undefined) &&
      (!signatures || Object.keys(signatures).length !== routes.length ||
       routes.some((route) => !/^[a-f0-9]{64}$/.test(signatures[route] ?? "")))) {
    throw new Error(`IndexNow stopped: missing or invalid page signatures in ${filename}.`);
  }
  return { routes, urls, signatures: signatures ?? {} };
}

const current = readReleaseManifest(path.join(root, "dist", "build-manifest.json"));
const sitemapUrls = [...sitemap.matchAll(/<url>\s*<loc>([^<]+)<\/loc>/g)].map(([, url]) => url);
const sitemapSet = new Set(sitemapUrls);
if (sitemapUrls.length !== current.urls.length || current.urls.some((url) => !sitemapSet.has(url))) {
  throw new Error("IndexNow stopped: release routes must match dist/sitemap.xml exactly.");
}

const previous = previousManifestPath ? readReleaseManifest(previousManifestPath, true) : { routes: [], signatures: {} };
const published = new Set(current.routes);
const changed = current.routes.filter((route) => previous.signatures[route] !== current.signatures[route]);
const removed = previous.routes.filter((route) => !published.has(route));
const urls = [...changed, ...removed].map(canonicalUrl);
if (urls.length > 10_000) throw new Error(`IndexNow stopped: ${urls.length} URLs exceed the protocol batch limit.`);
const summary = `${changed.length} new or updated pages and ${removed.length} removed pages`;
if (dryRun || !urls.length) {
  console.log(`IndexNow ${dryRun ? "dry run" : "skipped"}: ${summary}.`);
  process.exit(0);
}

const response = await fetch(indexNowEndpoint, {
  method: "POST",
  headers: {
    "content-type": "application/json; charset=utf-8",
    "user-agent": "S.T-Tailor-GitHub-Deploy/1.0"
  },
  signal: AbortSignal.timeout(20_000),
  body: JSON.stringify({
    host: indexNowHost,
    key: indexNowKey,
    keyLocation: indexNowKeyLocation,
    urlList: urls
  })
});

const responseBody = await response.text();
if (response.status !== 200 && response.status !== 202) {
  throw new Error(`IndexNow returned HTTP ${response.status}: ${responseBody.slice(0, 500) || "no response body"}`);
}

const outcome = response.status === 202 ? "received, key validation pending" : "accepted";
console.log(`IndexNow ${outcome}: ${summary} via ${new URL(indexNowEndpoint).hostname}.`);
