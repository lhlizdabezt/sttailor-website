# SEO operations: IndexNow, Google Search Console, and Bing Webmaster Tools

## Automated crawl notification

Every successful push to `main` follows this order:

1. Build the public static assets and validate technical SEO.
2. Deploy the apex Worker and the `www` redirect Worker from GitHub Actions.
3. Verify that production serves the exact Git revision, HTTPS canonical URLs, `robots.txt`, `sitemap.xml`, and the IndexNow ownership key.
4. Send the canonical URLs from `dist/sitemap.xml` to Bing IndexNow in one batch. The current site has 16 public routes; the script reads the sitemap so this count stays accurate as pages change.

The protocol key is published at `https://sttailor.com/7fef6e584133598b3cb206cc3a57f7c2d65f3d2aa8a077d84fe34b88b89cf373.txt`. It is public by design and only proves control of the domain. It is unrelated to Cloudflare or GitHub secrets.

The workflow sends only canonical `https://sttailor.com` pages; it never sends `www`, legacy redirect URLs, `beta`, `workers.dev`, 404s, or media files. Bing receives the update immediately, but acceptance is a crawl hint rather than a promise of ranking or immediate indexing.

If Bing is unavailable, GitHub Actions retries three times and adds a warning without failing a verified deployment. Re-run the workflow when Bing is reachable. Do not repeatedly submit unchanged URLs by hand.

## Bing Webmaster Tools

Add and verify the apex property `https://sttailor.com/`, then submit this sitemap once:

```text
https://sttailor.com/sitemap.xml
```

Each week, review:

- **IndexNow Insights** for accepted submissions and crawl feedback.
- **Site Explorer** for indexed URLs, unexpected redirects, 404s, and duplicate paths.
- **Site Scan** for crawl, markup, HTTPS, mobile, and broken-link findings.
- **URL Inspection** after a material change to a single page.
- **Search Performance** and **Keyword Research** to improve titles or content where a real client question is not answered.

## Google Search Console

Add the domain property and submit the same production sitemap. A focused weekly review should cover:

- **Page indexing:** investigate `Crawled - currently not indexed`, `Duplicate`, `Alternate page with proper canonical`, `Soft 404`, robots blocks, or server errors.
- **URL Inspection:** use **Test Live URL** for a materially changed page before requesting indexing.
- **Performance:** filter by page, query, country, device, and search type. Improve pages with meaningful impressions and weak click-through rates using truthful titles, descriptions, imagery, and internal links.
- **Core Web Vitals:** prioritise real mobile data for LCP, CLS, and INP rather than synthetic scores alone.

## Traffic and behaviour measurement

The shared HTML template loads Google Analytics 4 measurement ID `G-BQDKE20XR0` through the first-party `/n31x/` gateway. GTM container `GTM-TQSDB6XT` owns the published Microsoft Clarity project tag `ymcn0kdqo0`. The page initializes the Clarity event queue but does not download a second Clarity tag. Google Analytics measures acquisition, engagement and conversion events; Clarity supplies session recordings, heatmaps and usability signals such as dead clicks and excessive scrolling.

Use the two tools together: find a high-exit or low-conversion page in GA4, then inspect representative Clarity recordings or heatmaps before changing the page. Do not add duplicate analytics snippets through Cloudflare, a tag manager, or a page fragment. Review privacy disclosures and consent obligations applicable to the business before enabling additional advertising, remarketing, or cross-site tracking features.

### Event and Clarity configuration

The site records two deliberate interaction events without visitor-entered data:

- `contact_click` carries `contact_method`, `link_placement`, and `page_type` for telephone, email, WhatsApp, Zalo, Messenger, Instagram, and Maps actions.
- `consultation_intent` carries `link_placement` and `page_type` when a visitor follows an internal contact or booking link.

Register `contact_method`, `link_placement`, and `page_type` as event-scoped custom dimensions in GA4 before using them in detailed reports. Do not mark a raw contact click as a key event until it has been reviewed against real enquiry quality. `consultation_intent` is the appropriate initial key-event candidate; a successful form submission or confirmed appointment should use a separate `generate_lead` event only when that action exists.

Clarity receives non-personal custom tags `page_type` and `site_locale=vi_en`, plus the same interaction event names. Once traffic arrives, create a funnel from a landing page to a service or pricing page, then `consultation_intent` and `contact_click`. Use recordings only to diagnose user experience; do not collect or tag form values.

In GA4 administration, keep Enhanced Measurement on, set event-data retention to 14 months, and link the exact production Search Console property. Create any internal-traffic filter in **Testing** first and activate it only after the shop or office IP ranges have been verified. These account-level controls are intentionally not faked in source code.

## Local discovery standards

Keep the same business name, address, phone, opening hours, website, directions URL, service list, and original photographs across Google Business Profile, Apple Business Connect, Bing Places, social profiles, and eligible directories. The official X profile is `https://x.com/sttalior` and is published both in the footer and `LocalBusiness.sameAs`. Request only genuine customer reviews and never use automated reviews, traffic, backlinks, or keyword-stuffed business names.

## Source change gate

Before pushing content or design updates:

```powershell
Set-Location E:\S.TTailor\cloudflare-worker
npm run build
npm run check
git add -A
git commit -m "Describe the production change"
git push origin main
```

Then confirm **Build, verify and deploy S.T Tailor** is green in GitHub Actions. A green run proves the Worker deployed and live verification passed; IndexNow is recorded separately because it is an external crawl-notification service.
