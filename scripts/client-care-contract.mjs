// Validate both local output and deployed HTML against the owner's page scope.
export function clientCareFailures(html, payment = false) {
  const failures = [];
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1] ?? "";
  if (!main) return ["Main content is missing"];
  for (const removed of ["st-info-law", "Legal reference", "Căn cứ tham khảo", "congbao.chinhphu.vn", "kimbespoke.com.vn", "in writing", "bằng văn bản"]) {
    if (main.includes(removed)) failures.push(`Removed reference or formal wording remains: ${removed}`);
  }
  if (payment) {
    if ((main.match(/class="st-payment-methods"/g) ?? []).length !== 1 || (main.match(/class="st-payment-card"/g) ?? []).length !== 3) failures.push("Payment must keep one method band with three cards: showroom/bank, international cards and NFC");
    for (const removed of ["st-payment-hero", "st-payment-intro", "st-payment-compliance", "st-payment-gallery-suite", "st-payment-security", "st-payment-terms", "st-policy-refund-link"]) {
      if (main.includes(removed)) failures.push(`Removed payment band remains: ${removed}`);
    }
    for (const expected of ["CHOOSE THE METHOD THAT SUITS YOUR ORDER", "Vietnamese dong (VND) cash", "đồng Việt Nam (VND)", "Visa", "Mastercard", "American Express", "JCB", "UnionPay", "Discover", "Diners Club", "credit and debit", "tín dụng và ghi nợ", "NFC MOBILE PAYMENTS", "Apple Pay", "Google Pay", "Samsung Pay"]) {
      if (!main.includes(expected)) failures.push(`Payment channel or bilingual cash information missing: ${expected}`);
    }
  } else {
    const sections = [...main.matchAll(/<section\b[^>]*class="st-info-section"[^>]*>([\s\S]*?)<\/section>/g)];
    if (sections.length < 5 || sections.length > 6) failures.push("Client care must remain concise: five or six topics");
    for (const [section] of sections) {
      if (!section.includes('<p lang="en">') || !section.includes('<p lang="vi">')) failures.push("A client-care topic is missing its English or Vietnamese paragraph");
    }
    if (main.replace(/<[^>]*>/g, " ").trim().split(/\s+/).length > 1100) failures.push("Client-care copy exceeds its concise content budget");
    if (!main.includes('href="/lien-he/"')) failures.push("Client care has no direct contact route");
  }
  return failures;
}
