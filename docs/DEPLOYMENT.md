# Production deployment

## Normal workflow

GitHub Actions is the deployment connection. Cloudflare does not need Git installed locally, and a normal local update does not require `wrangler deploy`.

`npm run deploy` dispatches the same GitHub Actions workflow for the committed `main` branch; it does not publish local files or use local Cloudflare credentials. Use it only to redeploy the current remote source. Commit and push reviewed changes first when updating the site.

```powershell
Set-Location E:\S.TTailor\cloudflare-worker
git status
npm run build
npm run check
# Replace these examples with the files actually reviewed.
git add -- src/styles/standalone-shell.css scripts/build.mjs
git diff --cached --check
git diff --cached --stat
git commit -m "Describe the change"
git push origin main
```

Each push to `main` runs [the deployment workflow](../.github/workflows/deploy.yml). It installs locked dependencies, checks npm security advisories and stops for high or critical findings, builds the production site, checks redirects and SEO output, deploys the apex site, maintains the proxied `www` DNS record, deploys the `www` redirect Worker, then tests production. Only after that exact revision is live does it audit Cloudflare configuration and notify Bing IndexNow with the canonical URLs from `sitemap.xml`.

The dependency lock overrides `sharp` to 0.35.5 because Wrangler's Miniflare dependency still pins vulnerable 0.35.4 (GHSA-wq5f-xc86-pv6w). This patches the local/CI toolchain; the public static Worker does not process images with Sharp. Keep the override until the upstream dependency accepts a patched version. Verify with `npm ci`, `npm ls sharp`, `npm audit --audit-level=high` and a Wrangler dry-run before changing it. Do not use `npm audit fix --force`, which currently proposes an unrelated Wrangler downgrade.

The Cloudflare audit uses GET requests with the existing Actions secret. Its report lists endpoint coverage, public DNS, security settings and Worker binding names/types; it never prints binding values or raw API error text. Restricted endpoints remain explicitly unverified. An unavailable audit produces a warning without invalidating a verified deployment. Do not broaden token permissions automatically.

Keep `source/wordpress` as the approved baseline. Edit build transformations or current modules/styles, and include the derived CSS export when a style change updates it. Stage explicit reviewed paths; do not include unrelated drafts, private business documents, credentials or build output.

The build serves a content-addressed CSS bundle for each page. It removes only project selectors absent from that page and the site script; generic and vendor rules remain. Guide pages keep the complete existing bundle: Chromium intermittently resolves their computed grid auto margins differently even with identical CSS and geometry, so those pages retain the baseline pending independent comparison. Identical page bundles share a URL. `CustomCSS-Full.css` stays complete for editing, and the complete minified `site.css` remains the 404 fallback. Checks validate each page's stylesheet, content hash and size; production verification fetches every distinct bundle and confirms its immutable cache header. When changing this pruning logic, compare computed styles, motion and mobile navigation across all routes before deployment.

An IndexNow outage cannot make a verified deployment fail: the workflow retries the notification three times and emits a visible warning if Bing remains unavailable. Re-run the workflow later; do not use a local deploy as a workaround.

## Required GitHub secrets

The repository already has the two secrets required by the successful production workflow:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

Keep the token only in GitHub Actions secrets. It needs the existing Worker deployment and Zone DNS permissions so the workflow can deploy the two Workers and keep `www.sttailor.com` proxied. It is not needed on the local machine for the normal push-based process.

## Domain ownership verification

The DNS step also maintains the Apple and Meta ownership TXT records at `sttailor.com`. Meta uses `facebook-domain-verification=ngnols5cd8qykojw2q69ym3qo2lco4` for domain asset `1091652893748374`, owned by `sttailorhcm`. This public verification value is not an API credential. The script adds it only when absent and preserves other apex TXT records. After deployment, confirm it through public DNS and select **Verify domain** in Meta Business settings. Meta verification is separate from deployment success.

## Analytics ownership

The website initializes GA4 `G-BQDKE20XR0` once through the Cloudflare `/n31x/` gateway. GTM `GTM-TQSDB6XT` owns Microsoft Clarity `ymcn0kdqo0` and Meta Pixel `2294442874726399`. Do not add another direct `fbq` base snippet to the HTML. The static body includes only the Meta `PageView` image fallback for browsers with JavaScript disabled. The GA4 Config and GA4 Event tags imported by Meta's integration are paused in GTM to prevent parallel GA4 tracking. A published-container check fails if those GA4 tags become active again or the approved Pixel disappears. Browser verification must confirm a single Meta `PageView`, rather than treating the presence of a tag as proof of delivery.

## Canonical domain behaviour

`https://sttailor.com` is the canonical public domain. `https://www.sttailor.com/*` returns a permanent `301` to the same path and query string on `https://sttailor.com/*`. This gives search engines one canonical URL for each page.

## Before pushing

Check the Actions run after each push:

1. Open the repository **Actions** tab.
2. Open **Build, verify and deploy S.T Tailor**.
3. Confirm the run is green, including **Verify production website**.

If the run fails, do not run a local deploy as a workaround. Fix the checked-in source, push the correction, and let the workflow deploy the same revision it verified.
