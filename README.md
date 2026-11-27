# S.T Tailor on Cloudflare Workers

This is a static-first rebuild of S.T Tailor from the owner-approved, read-only WordPress fragments and the latest supplied hosting backup. It keeps the approved Vietnamese URL slugs, bilingual navigation, original logo, shared footer and gallery media without duplicate image use.

## What is migrated

- Public routes include the homepage, service catalogue, gallery, tailoring guides and Client Care. The footer's site directory lists all canonical page paths.
- Shared responsive header, mobile navigation and footer.
- Versioned page fragments and the complete approved WordPress CSS in `source/wordpress`.
- Versioned approved website uploads in `source/media` and first-party interface icons in `source/icons`. The repository contains no database export, WordPress core, plugins, SSL certificates, API tokens or private keys.
- A Worker health check at `/healthz`, legacy URL mappings, true 404 responses and security response headers.

## Visit S.T Tailor

- [Bespoke suits in Ho Chi Minh City](https://sttailor.com/dich-vu/suit-may-do/)
- [Wedding and formalwear tailoring](https://sttailor.com/dich-vu/le-phuc-cuoi/)
- [Made-to-measure womenswear](https://sttailor.com/dich-vu/trang-phuc-nu/)
- [Made-to-measure shirts in Ho Chi Minh City](https://sttailor.com/dich-vu/so-mi-may-do/)
- [Made-to-measure trousers in Ho Chi Minh City](https://sttailor.com/dich-vu/quan-tay-may-do/)
- [Made-to-measure jackets and blazers](https://sttailor.com/dich-vu/ao-khoac-may-do/)
- [Prepare for your first tailoring consultation](https://sttailor.com/cam-nang-may-do/buoi-tu-van-dau-tien/)
- [Check your finished garment at collection](https://sttailor.com/cam-nang-may-do/nhan-trang-phuc-may-do/)
- [Plan fittings during a visit](https://sttailor.com/cam-nang-may-do/thu-do-khi-du-lich/)
- [Suit fitting checklist](https://sttailor.com/cam-nang-may-do/kiem-tra-phom-suit/)
- [Choosing a shirt collar](https://sttailor.com/cam-nang-may-do/chon-co-ao-so-mi/)
- [Choosing shirt cuffs and cufflinks](https://sttailor.com/cam-nang-may-do/chon-mang-set-so-mi/)
- [What to wear to a black-tie event](https://sttailor.com/cam-nang-may-do/trang-phuc-black-tie/)
- [Choosing a two-piece or three-piece suit](https://sttailor.com/cam-nang-may-do/chon-suit-hai-manh-ba-manh/)
- [Planning your wedding attire and fittings](https://sttailor.com/cam-nang-may-do/chuan-bi-trang-phuc-cuoi/)
- [Gallery of cloth, garments and fittings](https://sttailor.com/gallery/)
- [Italian suiting wool and Vitale Barberis Canonico](https://sttailor.com/chon-vai-may-do/vai-len-y/)
- [Vietnamese silk for custom garments](https://sttailor.com/chon-vai-may-do/lua-viet-nam/)
- [Finished garments and tailoring details](https://sttailor.com/san-pham/)
- [Bespoke beige double-breasted blazer](https://sttailor.com/san-pham/blazer-mau-be/)
- [Black shawl-lapel tuxedo](https://sttailor.com/san-pham/tuxedo-den-ve-sam/)
- [Burgundy stand-collar ceremonial jacket](https://sttailor.com/san-pham/ao-le-phuc-do-ruou-co-dung/)
- [White tailored shirt with checked trim](https://sttailor.com/san-pham/so-mi-trang-vien-ca-ro/)
- [White spread-collar tailored shirt](https://sttailor.com/san-pham/so-mi-trang-co-mo-rong/)
- [Ivory point-collar tailored shirt](https://sttailor.com/san-pham/so-mi-mau-nga-co-nhon/)
- [Pale pink tailored shirt with fine stripes](https://sttailor.com/san-pham/so-mi-hong-nhat-soc-min/)
- [White pleated-front dress shirt](https://sttailor.com/san-pham/so-mi-le-phuc-xep-ly/)
- [Rust-red tailored shirt](https://sttailor.com/san-pham/so-mi-do-gach/)
- [White tailored women’s suit](https://sttailor.com/san-pham/suit-nu-trang/)
- [Grey checked tailored trousers](https://sttailor.com/san-pham/quan-tay-ca-ro-xam/)
- [Dark tailored trousers and waistband details](https://sttailor.com/san-pham/quan-tay-toi-mau/)
- [Pale olive tailored jacket](https://sttailor.com/san-pham/ao-khoac-mau-o-liu/)
- [Tan tailored jacket with notch lapels](https://sttailor.com/san-pham/ao-khoac-nau-vang-ve-chu-k/)
- [Navy jacket with patterned blue lining](https://sttailor.com/san-pham/ao-khoac-navy-lot-xanh/)
- [Grey tailored jacket with floral lining](https://sttailor.com/san-pham/ao-khoac-xam-lot-hoa/)
- [Pale grey double-breasted suit](https://sttailor.com/san-pham/suit-xam-nhat-hai-hang-khuy/)
- [Pale blue tailored jacket](https://sttailor.com/san-pham/ao-khoac-xanh-da-troi/)
- [Blush floral silk dress](https://sttailor.com/san-pham/dam-lua-hong-phan-theu-hoa/)
- [Magenta floral wrap dress](https://sttailor.com/san-pham/dam-quan-hoa-hong-tim/)
- [Floral jacquard evening jacket](https://sttailor.com/san-pham/ao-khoac-jacquard-hoa/)
- [White botanical-print tunic](https://sttailor.com/san-pham/ao-co-cao-trang-hoa-thuc-vat/)
- [Slate-blue pleated trousers](https://sttailor.com/san-pham/quan-tay-xanh-xam-xep-ly/)
- [Tailoring projects and collaborations](https://sttailor.com/du-an/)
- [Niña Campos collaboration](https://sttailor.com/du-an/nina-campos/)
- [Garment handover at the showroom](https://sttailor.com/du-an/ban-giao-trang-phuc-tai-showroom/)
- [Tailoring for the stage](https://sttailor.com/du-an/trang-phuc-san-khau/)
- [Checking jacket fit while seated](https://sttailor.com/du-an/kiem-tra-phom-ao-khoac-khi-ngoi/)
- [Basting stitches on a tailored jacket](https://sttailor.com/du-an/duong-luoc-tren-ao-khoac/)
- [Navy formal suit fitting](https://sttailor.com/du-an/suit-le-phuc-navy/)
- [Olive shirt and ivory trousers in daylight](https://sttailor.com/du-an/so-mi-xanh-o-liu-khi-mac/)
- [Navy short-sleeve shirt in wear](https://sttailor.com/du-an/so-mi-navy-tay-ngan/)
- [Tailoring in wear](https://sttailor.com/du-an/trang-phuc-khi-mac/)
- [Inside a tailored trouser waistband](https://sttailor.com/du-an/ben-trong-cap-quan-tay/)
- [Embroidery and jacquard](https://sttailor.com/du-an/chi-tiet-theu-va-jacquard/)
- [Client Care for tailored orders](https://sttailor.com/cham-soc-khach-hang/)
- [Review your tailoring quotation](https://sttailor.com/cham-soc-khach-hang/bao-gia-va-dat-may/)
- [Arrange delivery of a tailored garment](https://sttailor.com/cham-soc-khach-hang/sap-xep-giao-trang-phuc/)
- [Aftercare and minor repairs](https://sttailor.com/cham-soc-khach-hang/sua-chua-sau-khi-nhan-do/)

## URL behaviour

- A mapped legacy URL returns `301` to its retained destination.
- A published URL returns `200`.
- Any unknown or mistyped URL keeps the requested address, returns `404`, renders the generated error document and provides `Back to Home / Về trang chủ`.
- Retired WordPress `attachment_id` and WooCommerce `wc-ajax` query endpoints also return a non-indexable `404`; ordinary campaign parameters remain available.

## Build and preview

Open PowerShell in this directory and run:

```powershell
npm install
npm run build
npm run check
npm run dev
```

`npm run build` produces `dist/`. The generated [full Custom CSS](CustomCSS-Full.css) is a single replacement file for select-all/copy/paste use. It contains the complete approved `source/wordpress/CustomCSS.css`, with local media URLs, followed by the small standalone shell needed outside Flatsome.

Page CSS is derived from the globally cleaned production bundle, so route-specific builds cannot restore retired rules from the editable source. `npm run check` verifies this for every published route. Guide pages retain their existing common CSS baseline.

Vietnamese text uses a self-hosted Latin and Vietnamese Noto Sans subset from Google Fonts revision `8b0a1d0f5983c89bc2b93f1b5fb55f9e252744b5`. The variable subset keeps weights 400–800 at normal width. The [SIL Open Font License](source/fonts/OFL-Noto-Sans.txt) accompanies the font.

## Automated production deployment

Every push to `main` runs `.github/workflows/deploy.yml`. GitHub Actions is the only normal deployment route: it validates the checked-in revision, maintains only the required proxied `www` DNS endpoint, deploys the apex Worker and `www` redirect Worker, and verifies that production serves that exact Git revision. Deployments are serialized and transient Cloudflare/DNS calls retry safely; a failed build or check exits before any Worker replacement, leaving the previously deployed production version online. The repository requires these GitHub Actions secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

Commits are authored with `luonghailong.work@gmail.com` as requested. Cloudflare credentials are stored only as encrypted GitHub Actions secrets. The normal production action is `git push origin main`; do not run a local Cloudflare deploy for ordinary content or code updates. Local preview/builds require `python -m pip install -r requirements-build.txt` once for responsive-image generation, but never require a local Cloudflare token.

## Emergency-only manual deployment

Use this only when GitHub Actions is unavailable. Ordinary deployments run entirely from GitHub Actions. See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## Operations runbooks

- [Architecture](docs/ARCHITECTURE.md)
- [Cloudflare settings](docs/CLOUDFLARE-SETTINGS.md)
- [DNS cutover](docs/DNS-CUTOVER.md) and [DNSSEC](docs/DNSSEC.md)
- [SEO](docs/SEO.md), [IndexNow and webmaster operations](docs/SEO-OPERATIONS.md), [local SEO](docs/LOCAL-SEO.md), and [redirects](docs/REDIRECTS.md)
- [Beta retirement](docs/BETA-RETIREMENT.md), [WordPress retirement](docs/WORDPRESS-RETIREMENT.md), and [rollback](docs/ROLLBACK.md)

## Content updates after cutover

Pages are generated from the versioned HTML fragments in `source/wordpress`. The current compact Returns, Shipping, Terms and Privacy copy lives in `src/client-care-pages.js`; Payment keeps only the approved method band through `scripts/build.mjs`. Update these current sources and transformations, add approved media to `source/media`, then run `npm run build` and `npm run check` before pushing. `scripts/client-care-contract.mjs` validates the same content scope locally and on production.

The contact form is deliberately represented by direct contact channels in this initial migration. If a form needs server-side delivery later, add a Cloudflare Turnstile-protected endpoint and a transactional email provider before accepting submissions.

The shared footer displays its Google Maps embed directly, with native browser lazy loading and no click-to-display control. The embedded map and independent directions link remain available without site JavaScript. The Contact page retains its dedicated location map. Do not add a button or filter that visitors must activate before seeing either map.

The public vulnerability-reporting contact is maintained in `source/security.txt` and served at `/.well-known/security.txt`. Review the contact and renew its expiry before 1 November 2027; the build checks reject an expired file. This file does not establish a bug-bounty programme or permission to test the site.
