# quitehandy-site

Website of the Mac app Quite Handy, served by GitHub Pages at https://quitehandy.app.

- `/` – the product page
- `/download` – always the newest DMG (from `src/data/quitehandy-release.json`)
- `/appcast.xml` – the update feed the app reads

`scripts/publish.sh` in the app's repo writes the appcast, the changelog and the release data
here, commits and pushes. The DMGs are releases of this repo, tagged `quitehandy-v<version>`.

www.esreverse.com/quitehandy forwards here. Its appcast stays there for installs of 2.3 and
earlier, which read the feed from esreverse.com.



## Develop, Build and Preview

```bash
npm install        # once
npm run dev        # dev server at http://localhost:4321
npm run build      # static site into dist/
npm run preview    # serve dist/ locally to check the build
```



## How the Page Works

`/` is a vertical scroll story: a sticky "desktop", the Quite Handy hand rising in, and
one sheet of paper per feature, ending with the download.

- Once the hand has arrived it follows the mouse; clicks press it like in the app (smaller, less
  lift, softer shadow – values from `ArmView.swift`).
- A toolbar lets visitors pick one of four hands. Each hand has a measured fingertip (`tip` in the
  page) where the ink comes out; its stick is extended with a repeated slice of the image.
- Each sheet unlocks one feature to try (draw, rainbow ink, number stamps, zoom loupe), see
  `components/quitehandy/sheet-ink.ts`. Below each sheet is the matching shortcut in the app.



## Third-Party Assets and Licences

- **Playpen Sans**, **Roboto Mono**, **Fredoka** and **Inter:** SIL Open Font License, via Fontsource.
- **Quite Handy hands:** from the Quite Handy app (MIT License); the Christmas tree hand is Eric's own.
- **Lenis:** MIT License.
