# DESIGN.md test: does a short style file change Claude's output?

Prompted by Charlie Hills' "REA" newsletter (Oct 18, 2026). His claim: paste a
~10-line style file into Claude and everything it builds looks like one brand.
Instead of copying Apple, we used **our own** Get AI-Fluent system.

## What's here

| File | What it is |
|---|---|
| `GAF-DESIGN.md` | The style file, short format, built from the GAF design system snapshot (Claude Design, 8/9/2026) |
| `before.html` / `before.png` | Subcontractor Deal Analyzer as built: generic dark Tailwind |
| `after.html` / `after.png` | Same app restyled using only the rules in `GAF-DESIGN.md` |
| `*-mobile.png` | Same at 390px wide |
| `shoot.js` | Screenshot script (Playwright, serves CDN libs and fonts locally) |

Logic is untouched. Only classes, the header, and the footer changed. Same inputs
give the same numbers in both versions (current $3,000/100 hrs, proposed $3,900/299 hrs: Walk Away, −$1,081 take-home).

## How to run

Open `before.html` and `after.html` in a browser (needs internet for CDNs + Google Fonts).

To regenerate screenshots offline: `npm i react@18.3.1 react-dom@18.3.1 @babel/standalone@7.24.7 xlsx@0.18.5 tailwindcss@3.4.16 @fontsource/inter@5 @fontsource/ibm-plex-sans@5 @fontsource/ibm-plex-mono@5`
in a scratch folder, copy `shoot.js` there, then `node shoot.js path/to/after.html out/after`.

## What we learned

- **It works.** One file turned a generic app into a GAF-branded one: blue header
  band, orange kicker and divider, Plex/Inter type, light cards with hairline
  borders, solid status colors instead of gradients, "MAKE AI PRACTICAL." footer.
  It was a mechanical class swap, no design judgment calls needed.
- **The file has to answer data-UI questions, not just marketing ones.** The GAF
  snapshot is built around social posts. For an app we had to decide what
  "worst-case" verdict looks like (used midnight #050814) and what orange means
  (it's both the CTA and "at risk"). Those rules are now in `GAF-DESIGN.md`.
- **Known rule break:** the Accounts section shows orange four times (button,
  "Proposed?" label, proposed-row tint, 38% margin). The file says one orange per
  region. Fix: make "below target" margins slate or a darker amber, keep orange for the CTA.
- **REA not used.** It's a general reverse-engineering toolkit (app unpacking,
  smart contracts, PGP), unvetted, and modifies Claude Code settings. Parked.
  Also, this cloud env can't reach external sites, so extraction from live
  sites needs domains allow-listed first.

## Next (if this earns it)

1. VendorCall DESIGN.md in the same format.
2. Pull tokens from getaifluent.com's live CSS (needs network allow-list) and diff
   against `GAF-DESIGN.md` to see where the site has drifted.
