# SEO operations: IndexNow, Google Search Console, and Bing Webmaster Tools

## Automated crawl notification

Every successful push to `main` follows this order:

1. Build the public static assets and validate technical SEO.
2. Save the current production build manifest, then deploy the apex Worker and the `www` redirect Worker from GitHub Actions.
3. Verify that production serves the exact Git revision, HTTPS canonical URLs, `robots.txt`, `sitemap.xml`, and the IndexNow ownership key.
4. Compare the prior and current release manifests. Send new, meaningfully updated and retired canonical URLs to Bing IndexNow in one batch. The script verifies that the current release still matches `dist/sitemap.xml`. The first release after introducing these signatures seeds the baseline. Later releases skip the submission when no URLs change.

The protocol key is published at `https://sttailor.com/7fef6e584133598b3cb206cc3a57f7c2d65f3d2aa8a077d84fe34b88b89cf373.txt`. It is public by design and only proves control of the domain. It is unrelated to Cloudflare or GitHub secrets.

Submitted URLs are canonical `https://sttailor.com` page addresses from either the current or prior production release. GitHub Actions caches the pre-deployment manifest for reruns of the same workflow. IndexNow acceptance gives Bing a crawl hint.

The optional `https://sttailor.com/llms.txt` provides a Markdown summary and links to all canonical pages for AI-agent discovery. It does not replace `robots.txt`, the sitemap, or IndexNow, and its presence does not guarantee inclusion in Bing or any AI answer.

The fitting film is playable on the Gallery and on its dedicated `/phim-thu-do/` watch page. The video sitemap and `VideoObject` point to the watch page, where the player is the primary content. The image sitemap lists the Gallery photographs and associates the same image URLs with relevant service, garment and project pages. Image descriptions remain in the visible page content and alt text.

If Bing is unavailable, GitHub Actions retries three times and adds a warning without failing a verified deployment. Re-run the workflow when Bing is reachable. Do not repeatedly submit unchanged URLs by hand.

## AI search crawl access

Google's AI search features use normal Search indexing and snippet eligibility as well as the site's Search generative AI inclusion setting in Search Console. Keep service information in the public HTML, maintain internal links and the sitemap, and check that Cloudflare serves the same canonical page to ordinary visitors and crawlers. `OAI-SearchBot` controls discovery for OpenAI search. `GPTBot` is OpenAI's separate training crawler. Bing uses the sitemap and IndexNow for discovery.

After every deployment, the smoke test compares five public pages and the three discovery files under eight simulated user agents, including Googlebot Smartphone, bingbot, OAI-SearchBot, Claude-SearchBot and PerplexityBot. It checks that each simulation receives the same main content and discovery files. Cloudflare AI Crawl Control and the Google and Bing owner reports provide evidence of verified crawler traffic, processing and indexing. Review those reports if the smoke test flags a difference or discovery drops.

[Google Search Central AI optimization guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) · [OpenAI crawler overview](https://developers.openai.com/api/docs/bots) · [Bing guidance on sitemaps in AI search](https://blogs.bing.com/webmaster/2025/7/Keeping-Content-Discoverable-with-Sitemaps-in-AI-Powered-Search/)

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

### Verification on 2026-10-16

The production review covered all 16 canonical routes and 515 public assets, plus
64 rendered cases at viewport widths of 320, 375, 768 and 1440 pixels. No overflow,
missing image alt attributes, inverted logo filters, heading-weight hierarchy
failures or automated accessibility violations were found. Automated checks left
some contrast and video-caption items for manual assessment; this is not a claim
of complete accessibility certification or field Core Web Vitals compliance.

Google's aggregate Page indexing report was dated October 12 and still listed
several current pages as excluded. Individual URL Inspection on October 16
reported the gallery, alterations, returns, terms, shipping and privacy pages as
indexed, each with HTTPS and one valid breadcrumb item. Inspect a specific URL
before treating an older aggregate count as a current failure. Bing's four
technical recommendation categories all pointed to the retired suit-care article;
its redirect to the current care guide is covered by live verification. The
separate inbound-link recommendation remains an external discovery concern.

Clarity recorded two `Can't find variable: zaloJSV2` errors in one iOS visit opened
through Zalo. The website source contains no use of that identifier, and no Zalo
SDK was present in the observed script list. Repeating the same campaign URL and
opening the gallery produced no page errors, one GA4 PageView per navigation,
and one loaded Clarity tag and GTM container per document. The iOS/Zalo cause
remains unverified. Do not hide the error or add a placeholder global: obtain a
reproduction or script source before changing the website integration.

Cloudflare AI Crawl Control showed all 32 listed crawler block switches off.
Successful requests were visible for Googlebot, BingBot, OAI-SearchBot and
ChatGPT-User. This does not mean every crawler request succeeded or that any
provider guarantees indexing. Public DNS also retained the domain-ownership TXT
records, a rejecting DMARC policy and `v=spf1 -all` for the domain, which does not
send mail. The business contact address remains the existing Gmail address.

The shared HTML template loads Google Analytics 4 measurement ID `G-BQDKE20XR0` through the first-party `/n31x/` gateway. GTM container `GTM-TQSDB6XT` owns the published Microsoft Clarity project tag `ymcn0kdqo0`. The page initializes the Clarity event queue but does not download a second Clarity tag. Google Analytics measures acquisition, engagement and conversion events; Clarity supplies session recordings, heatmaps and usability signals such as dead clicks and excessive scrolling.

The GTM event queue is available immediately. Its external container loads in idle time after the document load, with a 1.2-second scheduling deadline; pointer or keyboard interaction can load it earlier. This keeps the initial image and stylesheet ahead of non-rendering measurement work. Early interaction events remain queued. The loader runs once even when the idle and interaction paths both fire. Verify real fresh-navigation PageViews after changes; very short visits can still end before external tags finish downloading.

Use the two tools together: find a high-exit or low-conversion page in GA4, then inspect representative Clarity recordings or heatmaps before changing the page. Do not add duplicate analytics snippets through Cloudflare, a tag manager, or a page fragment. Review privacy disclosures and consent obligations applicable to the business before enabling additional advertising, remarketing, or cross-site tracking features.

### Event and Clarity configuration

The site records two deliberate interaction events without visitor-entered data:

- `contact_click` carries `contact_method`, `link_placement`, and `page_type` for telephone, email, WhatsApp, Zalo, Messenger, Instagram, and Maps actions.
- `consultation_intent` carries `link_placement` and `page_type` when a visitor follows an internal contact or booking link.

Register `contact_method`, `link_placement`, and `page_type` as event-scoped custom dimensions in GA4 before using them in detailed reports. Do not mark a raw contact click as a key event until it has been reviewed against real enquiry quality. `consultation_intent` is the appropriate initial key-event candidate; a successful form submission or confirmed appointment should use a separate `generate_lead` event only when that action exists.

Clarity receives non-personal custom tags `page_type` and `site_locale=vi_en`, plus the same interaction event names. Once traffic arrives, create a funnel from a landing page to a service or pricing page, then `consultation_intent` and `contact_click`. Use recordings only to diagnose user experience; do not collect or tag form values.

In GA4 administration, keep Enhanced Measurement on, set event-data retention to 14 months, and link the exact production Search Console property. Create any internal-traffic filter in **Testing** first and activate it only after the shop or office IP ranges have been verified. These account-level controls are intentionally not faked in source code.

## Local discovery standards

Keep the same business name, address, phone, opening hours, website, directions URL, service list, and original photographs across Google Business Profile, Apple Business Connect, Bing Places, social profiles, and eligible directories. The official Threads profile is `https://www.threads.com/@sttailorhcm`, published in the footer and `LocalBusiness.sameAs`. X/Twitter is excluded from all public integrations at the owner's request. External social profiles do not belong in the site's XML sitemap or IndexNow submissions. Request only genuine customer reviews and never use automated reviews, traffic, backlinks, or keyword-stuffed business names.

## Source change gate

Before pushing content or design updates, inspect the working tree and stage only reviewed source files. Do not stage local drafts, backup archives, credentials, or generated output by default. Replace the two example paths below with the files actually changed:

```powershell
Set-Location E:\S.TTailor\cloudflare-worker
npm run build
npm run check
git status --short
git add -- src/styles/standalone-shell.css scripts/build.mjs
git diff --cached --check
git diff --cached --stat
git commit -m "Describe the production change"
git push origin main
```

Then confirm **Build, verify and deploy S.T Tailor** is green in GitHub Actions. A green run proves the Worker deployed and live verification passed; IndexNow is recorded separately because it is an external crawl-notification service.
