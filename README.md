# quitehandy.app

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
