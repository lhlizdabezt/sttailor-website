# Rollback runbook

## Application rollback

1. Open the last successful GitHub Actions run and identify its commit.
2. Revert the faulty commit on `main` with `git revert <commit>`.
3. Push the revert; GitHub Actions builds, validates, and deploys it.
4. Confirm the new workflow is green and run `npm run verify:live`.

Cloudflare Worker deployments are atomic: a failed build or failed pre-deploy check does not replace the running production Worker.

## DNS rollback

Do not change apex or mail DNS as part of an application rollback. The dedicated `www` record may be restored only to its proxied Worker redirect configuration. Preserve all mail and ownership TXT records.

## DNSSEC rollback

Follow the ordered registrar-first procedure in [DNSSEC.md](DNSSEC.md). Do not remove Cloudflare signing before the parent DS record is removed.
