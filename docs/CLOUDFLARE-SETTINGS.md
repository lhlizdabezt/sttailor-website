# Cloudflare production settings

The following active Free-plan settings were audited on 2026-09-21.

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
