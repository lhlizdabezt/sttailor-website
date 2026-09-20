const api = "https://api.cloudflare.com/client/v4";
const token = process.env.CLOUDFLARE_API_TOKEN;

if (!token) throw new Error("CLOUDFLARE_API_TOKEN is required to maintain deployment DNS records.");

const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

async function apiRequest(path, options = {}) {
  const response = await fetch(`${api}${path}`, { ...options, headers: { ...headers, ...options.headers } });
  const payload = await response.json();
  if (!response.ok || !payload.success) throw new Error(`Cloudflare API request failed: ${path}`);
  return payload.result;
}

const zones = await apiRequest("/zones?name=sttailor.com&status=active");
if (zones.length !== 1) throw new Error("Could not resolve a single active Cloudflare zone for sttailor.com.");
const zoneId = zones[0].id;
const recordName = "www.sttailor.com";
const records = await apiRequest(`/zones/${zoneId}/dns_records?name=${recordName}&per_page=100`);
const appleVerification = "apple-domain-verification=yQzSEAR1bU9DtwAF";

for (const record of records.filter((item) => ["A", "AAAA", "CNAME"].includes(item.type))) {
  await apiRequest(`/zones/${zoneId}/dns_records/${record.id}`, { method: "DELETE" });
}

const record = await apiRequest(`/zones/${zoneId}/dns_records`, {
  method: "POST",
  body: JSON.stringify({ type: "AAAA", name: "www", content: "100::", ttl: 1, proxied: true, comment: "Proxy record for sttailor-www-redirect Worker" })
});

const apexTxtRecords = await apiRequest(`/zones/${zoneId}/dns_records?type=TXT&name=sttailor.com&per_page=100`);
let appleRecord = apexTxtRecords.find((item) => item.content === appleVerification);

if (!appleRecord) {
  appleRecord = await apiRequest(`/zones/${zoneId}/dns_records`, {
    method: "POST",
    body: JSON.stringify({
      type: "TXT",
      name: "sttailor.com",
      content: appleVerification,
      ttl: 1,
      comment: "Apple domain verification"
    })
  });
}

console.log(JSON.stringify({
  www: { name: record.name, type: record.type, proxied: record.proxied },
  appleDomainVerification: { name: appleRecord.name, type: appleRecord.type, content: appleRecord.content }
}));
