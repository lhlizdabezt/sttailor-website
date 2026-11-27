import assert from "node:assert/strict";
import { test } from "node:test";

test("Cloudflare audit uses only GET and keeps credentials out of its report", async () => {
  const originalFetch = globalThis.fetch;
  const originalLog = console.log;
  const originalToken = process.env.CLOUDFLARE_API_TOKEN;
  const secret = "synthetic-credential-must-never-appear";
  const requests = [];
  let output;
  process.env.CLOUDFLARE_API_TOKEN = secret;
  console.log = (value) => { output = value; };
  globalThis.fetch = async (url, options) => {
    requests.push({ url, method: options.method ?? "GET" });
    assert.equal(options.headers.Authorization, `Bearer ${secret}`);
    let result = [];
    let status = 200;
    if (url.includes("/zones?")) result = [{ id: "zone", name: "sttailor.com", account: { id: "account" } }];
    if (url.includes("/dns_records?")) result = [
      { type: "CNAME", name: "www.sttailor.com", content: secret, proxied: true, ttl: 1 },
      { type: "TXT", name: "sttailor.com", content: secret, proxied: false, ttl: 1 }
    ];
    if (url.endsWith("/bot_management")) result = {
      ai_search: "disabled",
      ai_user: "disabled",
      ai_training: "disallow",
      ai_agents: { openai_agent: "disabled", unrecognizedAgent: secret },
      is_robots_txt_managed: false,
      unrecognizedField: secret
    };
    if (url.endsWith("/settings/google-tag-gateway/config")) result = {
      enabled: true, hideOriginalIp: true, setUpTag: true, endpoint: secret, measurementId: secret
    };
    if (url.endsWith("/pagerules")) result = [{
      targets: [{ target: "url", constraint: { operator: "matches", value: secret } }],
      actions: [{ id: "forwarding_url", value: { status_code: 301, url: secret } }],
      status: "active"
    }];
    if (url.includes("/workers/scripts/") && url.endsWith("/settings")) result = {
      compatibility_date: "2026-09-23",
      bindings: [
        { name: "TOKEN", type: "secret_text", text: secret },
        { name: "CONFIG", type: "json", json: { nested: secret } },
        { name: "ENV", type: "plain_text", text: secret }
      ],
      unrecognizedField: secret
    };
    if (url.endsWith("/ssl/certificate_packs")) status = 403;
    if (url.endsWith("/workers/routes")) throw new Error(secret);
    return { ok: status === 200, status, json: async () => ({ success: status === 200, result, errors: status === 403 ? [{ code: 10000, message: secret }] : [] }) };
  };
  try {
    await import("./cloudflare-production-audit.mjs");
    assert.equal(requests.length, 12);
    assert.ok(requests.every(({ url, method }) => url.startsWith("https://api.cloudflare.com/client/v4/") && method === "GET"));
    assert.ok(!output.includes(secret));
    const report = JSON.parse(output);
    assert.equal(Object.keys(report.coverage).length, 11);
    assert.deepEqual(report.dns, [
      { type: "CNAME", name: "www.sttailor.com", proxied: true, ttl: 1 },
      { type: "TXT", name: "sttailor.com", proxied: false, ttl: 1 }
    ]);
    assert.deepEqual(report.pageRules, [{ targets: ["url"], actions: ["forwarding_url"], status: "active" }]);
    assert.deepEqual(report.coverage.botManagement, { ok: true, status: 200, errorCodes: [] });
    assert.deepEqual(report.botManagement, {
      aiSearch: "disabled", aiAgents: "disabled", aiTraining: "disallow",
      personalAgents: { openai_agent: "disabled" }, managedRobots: false
    });
    assert.deepEqual(report.coverage.googleTagGateway, { ok: true, status: 200, errorCodes: [] });
    assert.deepEqual(report.googleTagGateway, { enabled: true, hideOriginalIp: true, autoInject: true });
    assert.deepEqual(report.coverage.certificates, { ok: false, status: 403, errorCodes: [10000] });
    assert.deepEqual(report.coverage.routes, { ok: false, status: 0, errorCodes: ["transport_error"] });
    assert.deepEqual(report.workerSettings.bindings, [
      { name: "TOKEN", type: "secret_text" }, { name: "CONFIG", type: "json" }, { name: "ENV", type: "plain_text" }
    ]);
  } finally {
    globalThis.fetch = originalFetch;
    console.log = originalLog;
    if (originalToken === undefined) delete process.env.CLOUDFLARE_API_TOKEN;
    else process.env.CLOUDFLARE_API_TOKEN = originalToken;
  }
});
