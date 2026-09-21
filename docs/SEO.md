# Technical SEO controls

The build generates seven public routes with unique title and description data, a production canonical URL, Open Graph and Twitter metadata, `index, follow` directives, an XML sitemap, and `robots.txt` pointing to `https://sttailor.com/sitemap.xml`.

The generated JSON-LD uses real business details already present in the approved source: `LocalBusiness` and `ClothingStore`, `WebSite`, `WebPage`, `SiteNavigationElement`, `OfferCatalog`, route-level services, and breadcrumbs for inner pages. It does not contain ratings, reviews, or invented popularity claims.

Run `npm run build && npm run check` before every push. The checks reject beta hostnames in production output, duplicate sitemap image locations, missing canonical/robots/schema metadata, and incorrect public route inventory. `npm run verify:live` tests production headers, canonical URLs, robots, sitemap, redirects, 404 behavior, and public route responses.
