# Redirect inventory

| Source | Destination | Status | Reason |
| --- | --- | --- | --- |
| `http://sttailor.com/*` | HTTPS equivalent | 301 | HTTPS normalization |
| `https://www.sttailor.com/*` | `https://sttailor.com/*` | 301 | Canonical hostname; preserves query string |
| `/about/` | `/gioi-thieu/` | 301 | Legacy English slug |
| `/services/` | `/dich-vu/` | 301 | Legacy English slug |
| `/gallery-page/` | `/gallery/` | 301 | Legacy gallery slug |
| `/pricing/` | `/bang-gia/` | 301 | Legacy English slug |
| `/payment/`, `/payment-methods/` | `/phuong-thuc-thanh-toan/` | 301 | Retained payment destinations |
| `/contact/` | `/lien-he/` | 301 | Legacy English slug |
| `/refund_returns/`, `/bao-hanh-sua-chua/` | `/dich-vu/` | 301 | Closest existing service page |

Unknown paths return a real 404 and are not redirected to the homepage. There is one redirect authority for `www`: the dedicated redirect Worker.
