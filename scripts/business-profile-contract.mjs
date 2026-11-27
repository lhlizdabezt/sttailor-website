const englishAddress = "1st Floor, 258 Le Thanh Ton, Tan Dinh Ward";
const vietnameseAddress = "Lầu 1, 258 Lê Thánh Tôn, Phường Tân Định, Thành phố Hồ Chí Minh, Việt Nam";
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const followHosts = ["www.facebook.com", "www.instagram.com", "wa.me", "zalo.me", "www.linkedin.com", "www.youtube.com", "www.tiktok.com", "www.pinterest.com", "www.threads.com", "www.tripadvisor.com"];

export function businessProfileFailures(footer, schemaGraph) {
  const business = schemaGraph.find((entity) => [entity["@type"]].flat().includes("LocalBusiness"));
  if (!business) return ["LocalBusiness structured data is missing"];

  const failures = [];
  const address = business.address;
  const visit = footer.match(/<section class="st-footer-v7__visit"[^>]*>[\s\S]*?<\/section>/)?.[0] ?? "";
  const addressHtml = visit.match(/<address\b[^>]*>([\s\S]*?)<\/address>/)?.[1] ?? "";
  const visibleAddress = addressHtml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  if (business.name !== "S.T Tailor" || business.url !== "https://sttailor.com/" ||
      address?.streetAddress !== englishAddress || address?.addressLocality !== "Ho Chi Minh City" || address?.addressCountry !== "VN" ||
      !visibleAddress.includes(`${englishAddress}, Ho Chi Minh City, Vietnam`) || !visibleAddress.includes(vietnameseAddress)) {
    failures.push("LocalBusiness identity and the footer must use the approved bilingual showroom address");
  }

  const hours = business.openingHoursSpecification;
  if (hours?.length !== 1 || hours[0]?.opens !== "09:00" || hours[0]?.closes !== "20:00" ||
      !sameEntries(hours[0]?.dayOfWeek, days) || !visit.includes("Monday–Sunday · 09:00–20:00") || !visit.includes("Thứ Hai–Chủ nhật · 09:00–20:00")) {
    failures.push("LocalBusiness and the footer must give daily 09:00–20:00 opening hours in both languages");
  }

  const telephone = business.telephone?.replace(/\s+/g, "");
  if (!/^\+84\d{9}$/.test(telephone) || !visit.includes(`href="tel:${telephone}"`) ||
      business.contactPoint?.telephone?.replace(/\s+/g, "") !== telephone ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(business.email) || !visit.includes(`href="mailto:${business.email}"`) || business.contactPoint?.email !== business.email) {
    failures.push("LocalBusiness, ContactPoint and the footer must agree on the showroom phone and email");
  }

  if (!/^https:\/\/maps\.app\.goo\.gl\/[\w-]+$/.test(business.hasMap) ||
      !visit.includes(`class="st-footer-v7__address-link" href="${business.hasMap}"`) || !visit.includes(`class="st-footer-v7__map" href="${business.hasMap}"`)) {
    failures.push("Both footer directions links must agree with LocalBusiness.hasMap");
  }

  const follow = footer.match(/<nav class="st-footer-v7__social"[^>]*>[\s\S]*?<\/nav>/)?.[0] ?? "";
  const followLinks = [...follow.matchAll(/\bhref="([^"]+)"/g)].map(([, href]) => href);
  const hosts = followLinks.map((href) => /^https:\/\/([^/]+)\/.+/.exec(href)?.[1]);
  if (!sameEntries(hosts, followHosts) || !sameEntries(business.sameAs, followLinks)) {
    failures.push("FOLLOW and LocalBusiness.sameAs must contain the same ten official social profiles");
  }

  return failures;
}

function sameEntries(actual, expected) {
  return Array.isArray(actual) && actual.length === expected.length && new Set(actual).size === expected.length && expected.every((entry) => actual.includes(entry));
}
