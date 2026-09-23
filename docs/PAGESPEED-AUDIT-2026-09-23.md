# PageSpeed audit — 23 September 2026

All 16 canonical sitemap routes were audited on the production domain with Lighthouse 13.5.0, once on mobile and once on desktop. PageSpeed Insights uses Lighthouse for its laboratory audit, but also presents Chrome UX Report field data when available. The public PSI API returned HTTP 429 during this review, so these figures are **Lighthouse lab results**, not field Core Web Vitals. See [Google's PSI methodology](https://developers.google.com/speed/docs/insights/v5/about). The raw local JSON captures are intentionally outside the repository because network records can contain telemetry URLs.

| Route | Mobile performance | Desktop performance | Mobile accessibility | Best practices | SEO |
| --- | ---: | ---: | ---: | ---: | ---: |
| `/` | 91 | 99 | 100 | 77 | 100 |
| `/bang-gia/` | 90 | 98 | 98 | 77 | 100 |
| `/bao-quan-giat-la/` | 86 | 98 | 100 | 77 | 100 |
| `/cam-nang-may-do/` | 88 | 99 | 100 | 77 | 100 |
| `/chinh-sach-bao-mat/` | 90 | 99 | 100 | 77 | 100 |
| `/chinh-sach-van-chuyen/` | 86 | 99 | 100 | 77 | 100 |
| `/chinh-sua-trang-phuc/` | 85 | 98 | 100 | 77 | 100 |
| `/chon-vai-may-do/` | 87 | 98 | 100 | 77 | 100 |
| `/dich-vu/` | 91 | 99 | 94 | 77 | 100 |
| `/dieu-khoan-dieu-kien/` | 86 | 99 | 100 | 77 | 100 |
| `/doi-tra-hoan-tien/` | 89 | 99 | 100 | 77 | 100 |
| `/gallery/` | 86 | 99 | 96 | 77 | 100 |
| `/gioi-thieu/` | 84 | 98 | 96 | 77 | 100 |
| `/lien-he/` | 82 | 97 | 98 | 77 | 100 |
| `/phuong-thuc-thanh-toan/` | 91 | 99 | 100 | 77 | 100 |
| `/quy-trinh-thu-do/` | 89 | 99 | 100 | 77 | 100 |

The first separate homepage run scored 63 on mobile, a second scored 87, and the full sweep scored 91. Treat one Lighthouse performance number as a sample, not a stable site property. In the full sweep mobile performance ranged from 82–91, with median 87.5; desktop ranged from 97–99, with median 99. All 16 pages had zero measured layout shift in those runs.

After commit `0c1e803` deployed, all 16 production routes were audited again on both devices. Every route scored 100 for Accessibility and SEO. Mobile performance ranged from 77–96, median 87; desktop from 97–100, median 99. The low Gallery mobile sample (77) repeated at 89; the home page moved from 84 to 87 on repetition. The observed variation in Total Blocking Time was larger than the expected gain from the modest CSS reduction, so these runs do not establish a statistically reliable speed improvement. The deterministic change is the smaller CSS asset and the verified accessibility corrections.

## Findings and fixes

- Homepage hero already uses a responsive WebP image, declared dimensions, preload and high fetch priority. No quality-reducing image change was justified by the audit.
- The served CSS was the largest avoidable first-party resource. The build now prunes selectors dedicated to four unpublished legacy page IDs while keeping complete source and the paste-ready `CustomCSS-Full.css`. Mixed selectors needed by current pages remain. The minified asset fell from approximately 659 KB to 607 KB before compression; this is a deterministic transfer/render-path reduction, not a promised score increase.
- Lighthouse identified heading-order failures on the pricing, contact and services pages. Their heading levels were corrected without changing the visible wording, and build checks now cover the corrected structure.
- Low contrast in Vietnamese supporting text on the services, gallery and about pages was corrected with scoped warm-brown/light-gold colours. Focused Lighthouse accessibility reruns of the five previously affected routes scored 100 on the local build.
- The 77 Best Practices result has three Lighthouse findings: third-party cookies and Chrome cookie issues from the requested Microsoft Clarity instrumentation, plus absent source maps on the Google tag gateway's served `/n31x/` JavaScript. These vendor-controlled resources were kept functional instead of being disabled for a score.

Core Web Vitals field data still needs to be read separately in PageSpeed Insights or Search Console when available. Lighthouse performance can vary between runs because of network and CPU conditions.
