# Production architecture

`https://sttailor.com` is the single public origin. It is attached as the production custom domain for the `sttailor-atelier` Cloudflare Worker. The Worker serves built files from Workers Static Assets and applies only routing, redirect, cache, 404, and response-header behavior.

```text
Visitor -> Cloudflare DNS -> sttailor-atelier Worker -> Workers Static Assets
www visitor -> sttailor-www-redirect Worker -> 301 https://sttailor.com
```

The site has no WordPress, PHP, database, KV, D1, R2, or Durable Object runtime dependency. `source/wordpress/` is a versioned migration input only; `scripts/build.mjs` produces the deployable `dist/` directory.

Production changes flow only through `main` -> GitHub Actions -> Wrangler -> Cloudflare. The public `workers.dev` endpoint and preview URLs are disabled in both Worker configurations.
