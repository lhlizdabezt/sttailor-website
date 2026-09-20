# S.T Tailor on Cloudflare Workers

This is a static-first rebuild of S.T Tailor from the owner-approved, read-only WordPress fragments and the latest supplied hosting backup. It keeps the approved Vietnamese URL slugs, bilingual navigation, original logo, shared footer and gallery media without duplicate image use.

## What is migrated

- Public routes: homepage, About, Services, Gallery, Pricing, Payment Methods and Contact.
- Shared responsive header, mobile navigation and footer.
- Versioned page fragments and the complete approved WordPress CSS in `source/wordpress`.
- The 149 approved website uploads in `source/media`. The repository contains no database export, WordPress core, plugins, SSL certificates, API tokens or private keys.
- A Worker health check at `/healthz`, legacy URL mappings, true 404 responses and security response headers.

## URL behaviour

- A mapped legacy URL returns `301` to its retained destination.
- A published URL returns `200`.
- Any unknown or mistyped URL keeps the requested address, returns `404`, renders the generated error document and provides `Back to Home / Về trang chủ`.

## Build and preview

Open PowerShell in this directory and run:

```powershell
npm install
npm run build
npm run check
npm run dev
```

`npm run build` produces `dist/`. The generated [full Custom CSS](CustomCSS-Full.css) is a single replacement file for select-all/copy/paste use. It contains the complete approved `DoNotWriteJustRead/CustomCSS.css`, with local media URLs, followed by the small standalone shell needed outside Flatsome.

## Automated production deployment

Every push to `main` runs `.github/workflows/deploy.yml`. GitHub Actions installs exact dependencies, rebuilds the site, runs the migration/SEO checks, deploys the apex Worker, and then deploys the `www` redirect Worker. The repository requires these GitHub Actions secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

Commits are authored with `luonghailong.work@gmail.com` as requested. Cloudflare credentials are stored only as encrypted GitHub Actions secrets.

## Manual deployment

1. Authenticate once with `npx wrangler login`.
2. Run `npm run deploy`.
3. Verify `https://sttailor.com/`, all seven published routes, `/healthz`, legacy redirects and the true 404 response.

## Content updates after cutover

Pages are generated from the versioned HTML fragments in `source/wordpress`. Update transformations in `scripts/build.mjs`, add approved media to `source/media`, then run `npm run build` and `npm run check` before pushing.

The contact form is deliberately represented by direct contact channels in this initial migration. If a form needs server-side delivery later, add a Cloudflare Turnstile-protected endpoint and a transactional email provider before accepting submissions.
