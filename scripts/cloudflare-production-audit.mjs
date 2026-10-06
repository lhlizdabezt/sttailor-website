/* Read-only Cloudflare audit for the production zone. The API token is only
   read from the process environment and is never serialized or logged. */
const api = "https://api.cloudflare.com/client/v4";
const token = process.env.CLOUDFLARE_API_TOKEN;

if (!token) throw new Error("CLOUDFLARE_API_TOKEN is required for the production audit.");

async function request(path) {
  try {
    const response = await fetch(`${api}${path}`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(15000)
    });
    const payload = await response.json().catch(() => ({}));
    // API error text can echo request values. Report status/codes only.
    return { ok: response.ok && payload.success === true, status: response.status, result: payload.result, errorCodes: payload.errors?.map((error) => error.code).filter(Number.isInteger) ?? [] };
  } catch {
    return { ok: false, status: 0, errorCodes: ["transport_error"] };
  }
}

const zones = await request("/zones?name=sttailor.com&status=active");
if (!zones.ok || !Array.isArray(zones.result) || zones.result.length !== 1) throw new Error("Could not resolve the active sttailor.com zone.");
const zone = zones.result[0];
const paths = {
  dns: `/zones/${zone.id}/dns_records?per_page=100`,
  settings: `/zones/${zone.id}/settings`,
  dnssec: `/zones/${zone.id}/dnssec`,
  certificates: `/zones/${zone.id}/ssl/certificate_packs`,
  routes: `/zones/${zone.id}/workers/routes`,
  rulesets: `/zones/${zone.id}/rulesets`,
  pageRules: `/zones/${zone.id}/pagerules`,
  workerSettings: `/accounts/${zone.account.id}/workers/scripts/sttailor-atelier/settings`,
  workerDomains: `/accounts/${zone.account.id}/workers/scripts/sttailor-atelier/domains`
};
const entries = await Promise.all(Object.entries(paths).map(async ([key, path]) => [key, await request(path)]));
const report = Object.fromEntries(entries);
const settings = Object.fromEntries((report.settings.result ?? []).map((item) => [item.id, item.value]));

const dns = (report.dns.result ?? []).map(({ type, name, content, proxied, ttl }) => ({ type, name, content, proxied, ttl }));
const routeRules = (report.routes.result ?? []).map(({ pattern, script, enabled }) => ({ pattern, script, enabled }));
const rulesets = (report.rulesets.result ?? []).map(({ name, phase, kind }) => ({ name, phase, kind }));
const certificates = (report.certificates.result ?? []).map(({ hosts, status, type }) => ({ hosts, status, type }));
const workerSettings = report.workerSettings.ok ? report.workerSettings.result : null;

console.log(JSON.stringify({
  zone: { name: zone.name, status: zone.status, plan: zone.plan?.name, nameservers: zone.name_servers },
  // A forbidden endpoint is an unverified area, not an empty successful result.
  coverage: Object.fromEntries(entries.map(([key, { ok, status, errorCodes }]) => [key, { ok, status, errorCodes }])),
  dns,
  settings: Object.fromEntries(["always_use_https", "tls_1_3", "http3", "0rtt", "early_hints", "brotli", "browser_cache_ttl", "min_tls_version", "rocket_loader", "cache_level", "security_level"].map((key) => [key, settings[key]])),
  dnssec: report.dnssec.ok ? { status: report.dnssec.result?.status, ds: report.dnssec.result?.ds } : null,
  certificates,
  workerRoutes: routeRules,
  rulesets,
  pageRules: (report.pageRules.result ?? []).map(({ targets, actions, status }) => ({ targets, actions, status })),
  // Never serialize raw Worker settings: bindings include plaintext variables.
  workerSettings: workerSettings ? {
    compatibilityDate: workerSettings.compatibility_date,
    compatibilityFlags: workerSettings.compatibility_flags,
    usageModel: workerSettings.usage_model,
    bindings: (workerSettings.bindings ?? []).map(({ name, type }) => ({ name, type }))
  } : null,
  workerDomains: (report.workerDomains.result ?? []).map(({ hostname, service, environment }) => ({ hostname, service, environment }))
}, null, 2));
