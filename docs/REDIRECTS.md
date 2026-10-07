# Redirect inventory

| Source | Destination | Status | Reason |
| --- | --- | --- | --- |
| `http://sttailor.com/*` | HTTPS equivalent | 301 | HTTPS normalization |
| `https://www.sttailor.com/*` | `https://sttailor.com/*` | 301 | Canonical hostname; preserves query string |
| `/en/` | `/` | 301 | Retired language directory; the homepage is bilingual |
| `/en/gioi-thieu/` | `/gioi-thieu/` | 301 | Retired language directory |
| `/about/` | `/gioi-thieu/` | 301 | Legacy English slug |
| `/services/` | `/dich-vu/` | 301 | Legacy English slug |
| `/gallery-page/` | `/gallery/` | 301 | Legacy gallery slug |
| `/pricing/` | `/bang-gia/` | 301 | Legacy English slug |
| `/payment/`, `/payment-methods/` | `/phuong-thuc-thanh-toan/` | 301 | Retained payment destinations |
| `/contact/` | `/lien-he/` | 301 | Legacy English slug |
| `/tailoring-guide/` | `/cam-nang-may-do/` | 301 | Current tailoring guide |
| `/fabric-guide/`, `/suit-fabrics-the-key-element-that-defines-true-elegance/` | `/chon-vai-may-do/` | 301 | Current cloth guide |
| `/fitting-process/` | `/quy-trinh-thu-do/` | 301 | Current fitting guide |
| `/alterations/` | `/chinh-sua-trang-phuc/` | 301 | Current alterations guide |
| `/garment-care/` | `/bao-quan-giat-la/` | 301 | Current care guide |
| `/refund_returns/` | `/doi-tra-hoan-tien/` | 301 | Current returns and refunds policy |
| `/bao-hanh-sua-chua/` | `/dich-vu/` | 301 | Closest existing service page |

Unknown paths return a real 404 and are not redirected to the homepage. There is one redirect authority for `www`: the dedicated redirect Worker.
