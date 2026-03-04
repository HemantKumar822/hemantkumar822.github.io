# hemantkumar822.github.io

A neo-brutalist personal portfolio for **Hemant Kumar** — AI & Software Developer. Built with vanilla HTML, CSS, and JavaScript. No frameworks, no build tools, no dependencies — just raw code with bold design choices.

**[Live Site](https://hemantkumar822.github.io)**

---

## About

Hi, I'm Hemant Kumar — a CSE (AI & Data Science) student at JECRC University (2025–2029), based in Jaipur, India. I build full-stack web apps, explore machine learning, and collaborate on open-source as part of EWTCS.

---

## Design Style — Neo-Brutalism

Neo-brutalism rejects polished, over-smoothed modern web design and replaces it with:

- **Thick black borders** — every element has a hard, visible edge
- **Flat offset box-shadows** — solid color blocks shifted a few pixels (`box-shadow: 8px 8px 0 #000`)
- **High-contrast palette** — bright yellows, pinks, cyans on white/dark backgrounds
- **Visible structure** — the layout bones are intentionally exposed
- **Playful imperfection** — tape stickers, scrapbook textures, hand-crafted feel

---

## Features

- **Typing effect** on hero name with blinking terminal cursor
- **Glitch animation** on the hero heading
- **Magnetic buttons** — CTAs follow the cursor softly
- **Cursor trail** — tiny neo-brutalist squares trail the mouse
- **Keyboard keycap skill tags** — press down on hover
- **Film grain overlay** for texture
- **Interactive Leaflet map** centered on Jaipur
- **"hire" easter egg** — type `hire` anywhere to trigger confetti + toast
- **Scroll-driven highlight markers** animate in on scroll
- **Interactive terminal** at `/terminal.html` — full resume in CLI form

---

## Terminal Mode

Visit [/terminal.html](https://hemantkumar822.github.io/terminal.html) for an interactive terminal-style resume.

Commands: `about` · `experience` · `education` · `skills` · `contact` · `help` · `clear` · `theme` · `matrix` · `calc` · `game`

---

## Color System

| Color  | Variable    | Usage                      |
|--------|-------------|----------------------------|
| Yellow | `--yellow`  | Primary accent, loader     |
| Cyan   | `--cyan`    | Code elements, highlights  |
| Pink   | `--pink`    | Secondary accent           |
| Green  | `--green`   | Success states             |
| Black  | `--border`  | Borders, shadows, text     |

---

## Typography

- **Space Grotesk** — headings and body text
- **Space Mono** — code and terminal elements
- **Caveat** — handwritten annotations

---

## Project Structure

```
.
├── index.html          # Main portfolio (neo-brutalist)
├── neo-styles.css      # Styles for index.html
├── terminal.html       # Terminal-style resume
├── styles.css          # Styles for terminal.html
├── script.js           # Terminal logic & commands
├── favicon.svg         # HK favicon
├── image/              # Assets (avatar, social cover)
├── robots.txt          # Search engine directives
├── sitemap.xml         # Sitemap for SEO
└── LICENSE             # License
```

---

## Tech Stack

- **HTML / CSS / JS** — no frameworks, no build step
- **Leaflet.js** — interactive journey map
- **Font Awesome** — icons
- **Google Fonts** — Space Grotesk, Space Mono, Caveat

---

## Run Locally

```bash
# Python
python -m http.server 8000

# Node
npx serve .
```

Then open `http://localhost:8000`.

---

## License

MIT License — © 2026 Hemant Kumar. See [LICENSE](LICENSE).
