const origin = "https://sttailor.com";
const routes = [
  "/",
  "/gioi-thieu/",
  "/dich-vu/",
  "/gallery/",
  "/bang-gia/",
  "/phuong-thuc-thanh-toan/",
  "/lien-he/"
];

const failures = [];
const expect = (condition, message) => {
  if (!condition) failures.push(message);
};

const pages = new Map();
for (const route of routes) {
  const response = await fetch(`${origin}${route}`);
  const html = await response.text();
  pages.set(route, html);
  expect(response.status === 200, `${route} returned ${response.status}`);
  expect(html.includes(`<link rel="canonical" href="${origin}${route}">`), `${route} has no production canonical`);
  expect(!html.toLowerCase().includes("beta.sttailor.com"), `${route} still contains the beta host`);
  expect(html.includes('name="robots" content="index, follow'), `${route} is not indexable`);
}

const home = pages.get("/");
const cssPath = home.match(/<link rel="stylesheet" href="([^"]+)"/)?.[1];
expect(Boolean(cssPath), "The production stylesheet was not found");
const css = cssPath ? await (await fetch(new URL(cssPath, origin))).text() : "";
expect(css.includes("text-transform: uppercase"), "Navigation is not forced to uppercase");
expect(css.includes("flex-direction: column"), "Mobile navigation is not a vertical list");
expect(css.includes("background: linear-gradient(110deg, rgba(244, 226, 197, .97)"), "Old-money tan header treatment is missing");
expect(css.includes(".st-service-page .st-service-commission-map { margin-top: 0 !important; }"), "Services spacing fix is missing");

const contact = pages.get("/lien-he/");
expect(!contact.includes("Tell us what you are dressing for"), "Removed contact introduction is still present");
expect(!contact.includes("Hãy chia sẻ dịp sử dụng"), "Removed Vietnamese contact introduction is still present");
expect(!contact.includes("CONTACT S.T TAILOR / LIÊN HỆ"), "Removed contact hero label is still present");

expect(home.includes('"LocalBusiness"'), "LocalBusiness structured data is missing");
expect(home.includes('"OfferCatalog"'), "OfferCatalog structured data is missing");
expect(home.includes('"SiteNavigationElement"'), "SiteNavigationElement structured data is missing");
expect(pages.get("/dich-vu/").includes('"Service"'), "Services structured data is missing");

const robots = await fetch(`${origin}/robots.txt`);
const robotsText = await robots.text();
expect(robots.status === 200 && robotsText.includes(`Sitemap: ${origin}/sitemap.xml`), "robots.txt is invalid");

const sitemap = await fetch(`${origin}/sitemap.xml`);
const sitemapText = await sitemap.text();
expect(sitemap.status === 200, `sitemap.xml returned ${sitemap.status}`);
expect((sitemapText.match(/<url>/g) || []).length === routes.length, "sitemap.xml does not contain exactly seven public routes");
expect(sitemapText.includes("xmlns:image="), "Image sitemap namespace is missing");
expect(sitemapText.includes("<image:image>"), "Image sitemap entries are missing");

const legacy = await fetch(`${origin}/about/`, { redirect: "manual" });
expect(legacy.status === 301 && legacy.headers.get("location") === `${origin}/gioi-thieu/`, "Legacy URL mapping is not a 301");

const www = await fetch("https://www.sttailor.com/", { redirect: "manual" });
expect(www.status === 301 && www.headers.get("location") === `${origin}/`, "www does not 301 to the apex host");

const missing = await fetch(`${origin}/this-page-does-not-exist`);
const missingHtml = await missing.text();
expect(missing.status === 404, `Unknown URL returned ${missing.status}`);
expect(missingHtml.includes("Back to Home"), "404 page has no Back to Home action");

if (failures.length) {
  console.error(failures.map((failure) => `FAIL: ${failure}`).join("\n"));
  process.exit(1);
}

console.log("PASS: production routes, mobile navigation, header styling, removals, schema, sitemap, redirects and true 404 verified.");
