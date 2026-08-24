# Cabra Technology — Website

Marketing site for **Cabra Technology**, a web design & digital services agency (web development, e-commerce, Google Ads, SEO, brand identity).

No build step required — plain HTML/CSS + React loaded via CDN and compiled in-browser with Babel Standalone. Open `index.html` directly, or serve the folder with any static host.

## Structure

```
.
├── index.html              # entry point — loads CSS/JS, meta tags, structured data
├── assets/
│   ├── css/
│   │   └── style.css       # full design system (tokens, layout, components)
│   ├── js/
│   │   └── app.jsx         # React app: data, components, i18n (EN/AR), root render
│   └── img/
│       └── ct-symbol.png   # CT brand mark (nav + footer)
├── robots.txt
└── sitemap.xml
```

## Run locally

Any static server works, e.g.:

```bash
npx serve .
# or
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Deploy on GitHub Pages

1. Push this repo to GitHub.
2. Repo **Settings → Pages → Source**: select the `main` branch, root folder.
3. Site will be live at `https://<username>.github.io/<repo-name>/`.

If deploying to a custom domain (e.g. `cabra.tech`), add a `CNAME` file with the domain name at the repo root, and update `index.html`'s `og:url` / `canonical` tag and `sitemap.xml` accordingly.

## Notes

- **Bilingual**: EN/LTR and AR/RTL, toggle top-right nav. All copy lives in the `T` object at the bottom of `assets/js/app.jsx`.
- **Case study stats and metrics are placeholder data** — replace with real numbers before launch (marked in `app.jsx` under `CASES` and `RESULTS`).
- Respects `prefers-reduced-motion`; custom cursor auto-disables under 900px width.
- Fonts (Space Grotesk, Inter, JetBrains Mono) and React/Babel are loaded from CDN — an internet connection is required at runtime.
