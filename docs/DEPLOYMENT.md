# Production deployment

## Normal workflow

GitHub Actions is the deployment connection. Cloudflare does not need Git installed locally, and a normal local update does not require `wrangler deploy`.

```powershell
Set-Location E:\S.TTailor\cloudflare-worker
git status
npm run build
npm run check
git add -A
git commit -m "Describe the change"
git push origin main
```

Each push to `main` runs [the deployment workflow](../.github/workflows/deploy.yml). It installs locked dependencies, builds the production site, checks redirects and SEO output, deploys the apex site, maintains the proxied `www` DNS record, deploys the `www` redirect Worker, then tests production. Only after that exact revision is live does it notify Bing IndexNow with the canonical URLs from `sitemap.xml`.

An IndexNow outage cannot make a verified deployment fail: the workflow retries the notification three times and emits a visible warning if Bing remains unavailable. Re-run the workflow later; do not use a local deploy as a workaround.

## Required GitHub secrets

The repository already has the two secrets required by the successful production workflow:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

Keep the token only in GitHub Actions secrets. It needs the existing Worker deployment and Zone DNS permissions so the workflow can deploy the two Workers and keep `www.sttailor.com` proxied. It is not needed on the local machine for the normal push-based process.

## Canonical domain behaviour

`https://sttailor.com` is the canonical public domain. `https://www.sttailor.com/*` returns a permanent `301` to the same path and query string on `https://sttailor.com/*`. This gives search engines one canonical URL for each page.

## Before pushing

Check the Actions run after each push:

1. Open the repository **Actions** tab.
2. Open **Build, verify and deploy S.T Tailor**.
3. Confirm the run is green, including **Verify production website**.

If the run fails, do not run a local deploy as a workaround. Fix the checked-in source, push the correction, and let the workflow deploy the same revision it verified.
