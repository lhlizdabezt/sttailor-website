import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { indexNowEndpoint, indexNowHost, indexNowKey, indexNowKeyLocation } from "../src/indexnow.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sitemap = readFileSync(path.join(root, "dist", "sitemap.xml"), "utf8");
const canonicalOrigin = `https://${indexNowHost}`;
const urls = [...new Set([...sitemap.matchAll(/<loc>(https:\/\/sttailor\.com\/[^<]*)<\/loc>/g)].map((match) => match[1]))];

if (!urls.length) throw new Error("IndexNow submission stopped: no production URLs were found in dist/sitemap.xml.");
if (urls.length > 10_000) throw new Error(`IndexNow submission stopped: ${urls.length} URLs exceed the protocol batch limit.`);
for (const url of urls) {
  const parsed = new URL(url);
  if (parsed.origin !== canonicalOrigin || parsed.protocol !== "https:") {
    throw new Error(`IndexNow submission stopped: non-canonical URL in sitemap: ${url}`);
  }
}

if (process.env.INDEXNOW_DRY_RUN === "1") {
  console.log(`IndexNow dry run: validated ${urls.length} canonical production URLs and ${indexNowKeyLocation}.`);
  process.exit(0);
}

const response = await fetch(indexNowEndpoint, {
  method: "POST",
  headers: {
    "content-type": "application/json; charset=utf-8",
    "user-agent": "S.T-Tailor-GitHub-Deploy/1.0"
  },
  body: JSON.stringify({
    host: indexNowHost,
    key: indexNowKey,
    keyLocation: indexNowKeyLocation,
    urlList: urls
  })
});

const responseBody = await response.text();
if (!response.ok) {
  throw new Error(`IndexNow returned HTTP ${response.status}: ${responseBody.slice(0, 500) || "no response body"}`);
}

console.log(`IndexNow accepted ${urls.length} canonical production URLs via ${new URL(indexNowEndpoint).hostname}.`);
