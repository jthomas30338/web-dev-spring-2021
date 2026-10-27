# Subcontractor Deal Analyzer

Single-file browser tool that tells a service subcontractor whether a
contract is profitable before they sign it. You enter (or upload) accounts
with monthly pay, contracted hours, and actual hours, mark which ones are
proposed, and it gives a verdict (Good / Caution / Bad / Walk Away), margin
zone, hours-variance warnings, and how the deal moves the whole book's
blended margin.

Built by Alternative Programming | Get AI Fluent.

## Run it

Open `index.html` in a browser. No build step. It pulls React, Babel,
Tailwind, and SheetJS from CDNs (versions pinned), so it needs internet.
Data saves to the browser's localStorage only; nothing leaves the machine.

Upload accepts `.xlsx`, `.xls`, `.csv`. Column names are fuzzy-matched
(e.g. "Contract Hours", "Budgeted Hrs" both work). "Download Template" gives
the expected layout.

## Math

- Effective labor rate = base wage × W-2 multiplier (default $15 × 1.25 = $18.75/hr)
- Labor cost = actual hours (falls back to contract hours) × effective rate
- Overhead is spread per labor hour across all accounts
- Zones: Thriving 40%+, Sustainable 30–40%, Fragile 20–30%, Danger <20%

## Lab notes (Oct 16, 2026 check-over)

Fixed on import:
- **Page was blank.** `const verdict = getVerdict();` was declared twice,
  which is a syntax error, so React never rendered. Removed the duplicate.
- Pinned CDN versions (were floating `react@18`, unversioned Babel/Tailwind)
  and switched to the production React builds + `createRoot`.
- Upload: blank header cells (e.g. a trailing empty column) matched the
  "name" field and wiped property names. Blank headers now match nothing,
  and the first matching column wins.
- Negative dollars rendered as `$-1,706`; now `-$1,706`.
- localStorage was re-read on every render; now read once.
- Template sample rows used real property names; swapped for generic ones.

Known, not changed:
- The "Target Margin" setting only colors the % column in the table. Verdict,
  zones, and growth readiness are hardcoded to 40/30/20. Wire it in or drop
  the setting.
- Rows with a property name but no pay are kept in the table but excluded
  from all totals.

Verified with a headless Chromium run (Playwright, CDN libs served locally):
renders with no console errors, manual entry math matches hand calculation,
CSV upload with `$2,000`-style values and a trailing blank column parses
correctly, template downloads, state survives reload.
