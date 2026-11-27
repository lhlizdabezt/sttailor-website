# Cloudflare production settings

The table records the production settings verified during the 28 November 2026 audit in Ho Chi Minh City.

For a current read-only API check, run **Audit Cloudflare production (read-only)** from GitHub Actions, or `gh workflow run audit-cloudflare.yml --ref main`. It uses the existing encrypted production token, runs the audit's GET-only and secret-redaction test, and reports each endpoint's status in the run summary and sanitized job log. A denied or unreachable endpoint is marked unverified and causes the audit to fail. The production deployment runs separately.

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
| Cache level | No query string (`basic`) | Stable asset URLs use their file path as the cache key | The Worker sends the cache lifetime for each response |

The Worker asks browsers to revalidate HTML, SEO discovery files, and stable CSS and JavaScript aliases using the static assets' validators. CSS, JavaScript, fonts and social previews with versioned filenames can be cached as immutable for one year. Stable media and icon URLs can be cached for seven days. HTML and static-asset errors use `no-store` so browsers retry missing paths on later requests.

HTML responses enforce a script allowlist. Tripadvisor scripts run on the dedicated embed route inside the About page's sandboxed iframe. If Cloudflare changes its Google tag gateway snippets, review the returned script contents and update the matching hashes in `src/security-policy.js`. To verify changes, test GA4 page views and consultation events, Clarity, the Meta Pixel and the Tripadvisor link in a real browser. The live smoke check verifies the policy and inline hashes on every published route.
