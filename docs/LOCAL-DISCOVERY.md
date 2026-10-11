# Local search growth checklist

Technical SEO is already published: canonical URLs, a `www` permanent redirect, route-specific metadata, image sitemap entries, `LocalBusiness` structured data, robots rules, sitemap, responsive navigation, fast static delivery, and real 404 responses. These help search engines understand the site; they do not guarantee a placement in Google Maps or organic results.

## Highest-value recurring work

1. Claim and verify the Google Business Profile with the exact showroom name, address, primary phone, opening hours and website used on this site.
2. Use a truthful primary category and list actual tailoring and alteration services. Keep the same name, address and phone on Google, Apple Business Connect, Bing Places, Facebook, Instagram and every legitimate local directory.
3. Add original showroom, fitting, fabric and finished-garment photographs regularly. Describe each image accurately and keep its location and service context clear.
4. Ask every completed customer for an honest review using a direct review link or QR code. Do not offer incentives, publish reviews for customers, buy reviews, or place keywords in the business name.
5. Add new completed work to the Gallery only with approved, non-duplicate media and accurate captions. Link relevant service, pricing, payment and contact pages from each page where useful.
6. Add the verified `https://sttailor.com/sitemap.xml` to Google Search Console and request indexing only after a material page update.

## Channels to prioritize

Prioritize Google Business Profile, Google Maps, Apple Business Connect, Bing Places, Facebook, Instagram and direct messaging channels first. Create or claim a TripAdvisor listing only if S.T Tailor is eligible for its current business categories and the listing can be kept accurate; it should never be used to manufacture reviews or location signals.

## Monthly evidence check

- Review Google Business Profile performance, search terms, calls, website clicks and direction requests.
- Correct hours, temporary closures, services, photographs and address changes immediately.
- Check Search Console indexing, sitemap processing, mobile usability and page experience.
- Compare branded and local-intent queries month to month, then improve only pages that answer a real client need.


## Verified-business evidence and publication gate (2026-10-11)

S.T Tailor is the **customer-facing trade name**, not the legal name shown on the enterprise certificate. The registration states **CÔNG TY TNHH TMDV SƠN THỊNH** / **SON THINH TMDV COMPANY LIMITED**, enterprise number **0319232823**, first registered **24 October 2025**, with registered premises at **258 Lê Thánh Tôn, Phường Tân Định, Ho Chi Minh City, Vietnam**. Use this registered address as the baseline for business identity. A **floor number is not stated on the business certificate**: other supplied operational materials differ between **1st Floor** and **Floor 2**. Do not silently standardize the floor or relocate the POI until the storefront entrance and public-facing suite/floor designation are verified on site.

The October 2026 iNET *domain-registration declaration* records an anticipated **11 November 2031** expiry for `sttailor.com`, whereas an earlier iNET document records **11 November 2026**. The later form is supporting documentation, **not proof that renewal has been posted to the registrar registry**. Verify the actual expiry with the registrar before publishing renewal claims. The later form also has website-purpose checkboxes for electronic news, social networking and aggregated news; verify and correct those against the actual tailoring-company website before submitting the form.

Keep identity evidence in an access-controlled document store. Source control must **never** include full unredacted registration pages, personal identification numbers, personal addresses, domain administrative contacts, account tokens, Cloudflare API credentials, or customers' orders and measurements. For third-party POI requests, send the legal company name, enterprise number, public business address, company website and relevant existing public profiles first. Supply private documents only through a verified secure vendor upload after a specific request.

### Third-party data, reviews, and integrity

- **Tripadvisor:** The business exists as an attraction/place listing, but listing ownership and review legitimacy are different questions. Tripadvisor prohibits reviews by employees, owners and affiliates; businesses may not write reviews on behalf of guests, supply draft review wording, create customer accounts, provide incentives, or selectively solicit only positive feedback. A genuine independent guest must decide their own review and rating without business interference. See [Tripadvisor review posting guidelines](https://www.tripadvisor.com/Trust-lvBd3L1aU38Y.html) and [business owner content fraud FAQ](https://www.tripadvisor.com/Trust-l9ebaWaKhDeo.html). If a content-integrity appeal is active, keep communications within the existing case thread and preserve an internal compliance log; do not mass-mail unrelated contacts or reset listings to evade review penalties.
- **Bing, Apple Maps, and Instagram location tagging:** Publishing the company site, verifying a business portfolio, or being present on OpenStreetMap does **not** guarantee a searchable third-party POI or inclusion of Tripadvisor ratings. Request canonical place IDs, accurate business-entity matching, diagnostics and an official publication status. Never promise forced indexing or cross-platform review import.
- **Grab, Be, Green SM, Vinasun, Mai Linh, HERE, TomTom, Foursquare and other map-data providers:** Check for an existing entry and use the published POI correction/owner submission route before requesting a new one. Record provider ticket, canonical POI link, verified address, entrance pin and owner/contact authorization. Do not create duplicates or email multiple unrelated support addresses.
- **Founder biography:** Do not publish “founded by a former soldier,” military service, heritage dates, international material provenance or guaranteed warranties on the strength of a company registration certificate alone. Publish only after the business owner has supplied and approved the specific supporting evidence.

### Website and launch checklist

1. Preserve the original S.T Tailor logo assets and their colors; do not invert or recolor them. Use **Tailor** / **Tailoring**, not visible “Atelier” marketing copy. Keep bilingual English–Vietnamese hierarchy consistent and check small-screen contrast, button outlines, keyboard focus, headings and alt text.
2. Canonicalize each live public URL once; regenerate and validate `robots.txt`, `sitemap.xml`, breadcrumbs, LocalBusiness markup, internal links and actual public hours after any relevant change. Keep public `sameAs` links for actual official profiles only; external social/Tripadvisor URLs are not first-party sitemap entries.
3. Keep GA4, GTM, Meta Pixel and Microsoft Clarity installation owners explicit. The repository already has duplicate-tag checks; do not introduce direct GA4 or Clarity snippets to a page that is measured through the approved shared template, GTM or first-party tag gateway.
4. Check that every Gallery asset is used intentionally and that the same image is not accidentally repeated on a single public page. Verify media license/permission, responsive variants, descriptive alt text and layout stability before publication.
5. Follow the existing `npm run build`, `npm run check`, GitHub Actions deploy and `npm run verify:live` procedures. A passing GitHub Actions build proves the deploy checks completed on that revision; it does not prove real-world map indexing, user traffic conversion, GSC/GA4 dashboard status, or PageSpeed field Core Web Vitals. Report these independently.

### Provider status labels

Use **not submitted → submitted → acknowledged (ticket ID) → under review → published and independently searchable**, with separate **rejected / action required** states. “Sent” and an automated reply do not mean approved, and a business verification badge alone does not prove Apple/Instagram/Bing/ride-hailing map visibility.
