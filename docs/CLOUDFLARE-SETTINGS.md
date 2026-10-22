# Cloudflare production settings

The following Free-plan settings describe the production baseline audited on 2026-09-21. They are historical evidence; use a fresh audit to establish current values.

For a current read-only API check, run **Audit Cloudflare production (read-only)** from GitHub Actions, or `gh workflow run audit-cloudflare.yml --ref main`. It uses the existing encrypted production token, runs the audit's GET-only and secret-redaction test, and reports all nine endpoint results in the run summary and sanitized job log. A denied or unreachable endpoint fails this audit instead of appearing as an empty successful result. The workflow does not deploy, change DNS/settings, or expand token permissions. The ordinary deployment workflow remains separate.

| Setting | Value | Purpose | Risk / verification |
| --- | --- | --- | --- |
| Always Use HTTPS | On | Permanently upgrades HTTP | Verify `http://sttailor.com` returns HTTPS 301 |
| Minimum TLS | 1.2 | Rejects obsolete TLS | Test a modern browser and `https://sttailor.com` |
| TLS 1.3 | On | Faster secure handshakes | Cloudflare setting reports `zrt` |
| HTTP/3 | On | QUIC support | Check browser protocol/network tools |
| 0-RTT | On | Faster resumed visits | Safe for this read-only site |
| Early Hints | On | Starts critical asset fetches earlier | Check page delivery after a deploy |
| Brotli | On | Compresses text assets | Inspect response headers in browser tools |
| Browser Cache TTL | Respect existing headers | Lets Worker distinguish HTML and assets | Confirm `Cache-Control` with a header request |
| Rocket Loader | Off | Avoids JavaScript ordering changes | Keep off unless benchmarked |
| Cache level | Standard/basic | Uses Static Assets caching safely | No zone-wide Cache Everything |

The Worker sets `max-age=0, must-revalidate` for HTML, a one-year immutable policy for versioned CSS/JS, and seven days for stable media URLs. No paid Cloudflare feature, Polish, Mirage, Rocket Loader, or global HTML cache rule is enabled.
