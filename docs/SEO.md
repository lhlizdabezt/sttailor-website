# Technical SEO controls

The build generates seven public routes with unique title and description data, a production canonical URL, Open Graph and Twitter metadata, `index, follow` directives, an XML sitemap, and `robots.txt` pointing to `https://sttailor.com/sitemap.xml`.

The generated JSON-LD uses real business details already present in the approved source: `LocalBusiness` and `ClothingStore`, `WebSite`, `WebPage`, `SiteNavigationElement`, `OfferCatalog`, route-level services, and breadcrumbs for inner pages. It does not contain ratings, reviews, or invented popularity claims.

Run `npm run build && npm run check` before every push. The checks reject beta hostnames in production output, duplicate sitemap image locations, missing canonical/robots/schema metadata, an invalid IndexNow ownership key, and incorrect public route inventory. `npm run verify:live` tests production headers, canonical URLs, robots, sitemap, IndexNow key delivery, redirects, 404 behavior, and public route responses.

The GitHub deployment workflow notifies Bing IndexNow after production verification. The key is intentionally public at the canonical root as required by the protocol; it is not an account credential. See [SEO operations](SEO-OPERATIONS.md) for the operational checklist.
