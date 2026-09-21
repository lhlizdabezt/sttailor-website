# Retired beta environment

`beta.sttailor.com` is retired. It is not a Worker custom domain, DNS record, canonical URL, sitemap URL, robots target, deployment target, or preview URL. Production output checks fail if that hostname appears in a rendered public page.

Use GitHub Actions and Cloudflare Worker versions for review. Do not recreate a beta hostname; preview URLs and `workers.dev` exposure are disabled for production Workers to prevent duplicate indexable content.
