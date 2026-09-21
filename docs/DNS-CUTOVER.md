# DNS cutover and invariants

The Cloudflare zone is active and uses the Cloudflare nameservers. The production DNS invariants are:

- `sttailor.com`: proxied Worker custom-domain record.
- `www.sttailor.com`: proxied `100::` record routed to `sttailor-www-redirect`.
- Apex TXT ownership records for Apple, Google, and Pinterest remain unchanged.
- `_discord` ownership TXT remains unchanged.
- Do not remove MX, SPF, DKIM, DMARC, or any unrelated verification record.

The GitHub deployment workflow runs `scripts/ensure-www-dns.mjs`. It changes only incompatible A/AAAA/CNAME records at the dedicated `www` host, preserves an already-correct proxied redirect record, and never touches apex TXT or mail records.

Before a DNS change, run `node scripts/cloudflare-production-audit.mjs` with a scoped Cloudflare token, then check `npm run verify:live` after propagation.
