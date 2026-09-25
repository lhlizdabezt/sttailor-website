# DNS cutover and invariants

The Cloudflare zone is active and uses the Cloudflare nameservers. The production DNS invariants are:

- `sttailor.com`: proxied Worker custom-domain record.
- `www.sttailor.com`: proxied `100::` record routed to `sttailor-www-redirect`.
- Apex TXT ownership records for Apple, Google, and Pinterest remain unchanged.
- `_discord` ownership TXT remains unchanged.
- Do not remove MX, SPF, DKIM, DMARC, or any unrelated verification record.

The GitHub deployment workflow runs `scripts/ensure-www-dns.mjs`. It changes only incompatible A/AAAA/CNAME records at the dedicated `www` host, preserves an already-correct proxied redirect record, and never touches apex TXT or mail records.

Before a DNS change, run `node scripts/cloudflare-production-audit.mjs` with a scoped Cloudflare token, then check `npm run verify:live` after propagation.

## Email authentication (checked 2026-09-26)

The site publishes `contact.sttailor@gmail.com` as its contact address. No MX record or sending service for `@sttailor.com` was found when the following restrictive Cloudflare records were created:

| Type | Host | Value |
| --- | --- | --- |
| TXT | `@` | `v=spf1 -all` |
| TXT | `*._domainkey` | `v=DKIM1; p=` |
| TXT | `_dmarc` | `v=DMARC1; p=reject; pct=100; sp=reject; adkim=s; aspf=s;` |

The DMARC TXT was confirmed through Cloudflare DNS. Apple Business Branded Mail still showed **Incomplete** after its Verify action, including when the DMARC value was temporarily changed to Apple's exact sample. Domain ownership TXT verification was already successful; the Apple brand itself remained in review. Do not represent Branded Mail as active until Apple reports Verified.

These records deny unauthenticated mail claiming to be from this domain. Before sending legitimate `@sttailor.com` mail, provision a real mail provider and mailbox, publish its MX/SPF/DKIM records, and test DKIM-aligned delivery before replacing the restrictive SPF and DKIM records. Keep DMARC at `p=reject; pct=100` once authorized mail passes. DNS TXT ownership records for Apple, Google, and Pinterest must remain intact.
