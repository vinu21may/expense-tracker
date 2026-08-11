# Finances — iPad app

The front end for a personal expense tracker. **This repository contains no
financial data of any kind** — only the code that draws the screens. That is why
it can safely be public, which is what makes free GitHub Pages hosting possible.

The data lives in a separate **private** repository and is fetched at runtime with
a read-only token that the user enters once on their own device. The token is kept
in that device's browser storage and is never committed here.

## Files

| File | What it is |
|---|---|
| `index.html` | The whole app — layout, charts and logic in one file |
| `sw.js` | Service worker, so the app opens without a connection |
| `manifest.json` | Makes it installable to the iPad Home Screen |
| `icon.png`, `icon-512.png` | Home Screen icon |

## Running it locally

Put a `data.json` next to `index.html` and serve the folder:

```bash
python3 -m http.server 8777
```

The app loads that local file directly and skips the unlock screen, which is
handy for development. Never commit a `data.json` to this repository.

## Notes

- No external libraries, no build step. Charts are hand-drawn SVG.
- Light and dark themes both follow the device setting.
- Currency is formatted for Indian numbering (lakh / crore).
