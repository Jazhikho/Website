# Jazhikho Portfolio Site

Static public-facing portfolio for the game developer identity `Jazhikho`.

The site is designed for GitHub Pages and uses plain HTML, CSS, and minimal vanilla JavaScript. All public content is loaded from JSON so the structure can stay stable while projects and links change over time.

## Project structure

```text
/index.html
/styles/site.css
/scripts/site.js
/scripts/sync_itch_devlogs.py
/.github/workflows/sync-itch-devlogs.yml
/assets/branding/
/assets/projects/
/content/site-data.json
/content/itch-devlog.json
/content/site-data.schema.json
/content/AI_ARTIFACT_LOG.md
/README.md
/VERSION.md
```

## How content works

The page shell lives in [index.html](/D:/Website/index.html), the visual system lives in [site.css](/D:/Website/styles/site.css), and the rendered portfolio data lives in [site-data.json](/D:/Website/content/site-data.json).

The renderer in [site.js](/D:/Website/scripts/site.js) loads `content/site-data.json` and fills the following areas:

- Hero copy and quick strengths
- Latest news ticker sourced from itch devlogs
- About copy
- Featured project cards
- Additional work cards
- Research themes and public-output empty state
- Public links

## Automatic itch devlog sync

The site now includes a generated news feed in [itch-devlog.json](/D:/Website/content/itch-devlog.json).

It is produced by [sync_itch_devlogs.py](/D:/Website/scripts/sync_itch_devlogs.py), which:

- Fetches the public itch profile at `https://jazhikho.itch.io/`
- Discovers project URLs automatically from the profile page
- Tries each project's `devlog.rss`
- Collects recent entries and writes a local JSON file for the site to render

This avoids client-side cross-origin dependence on itch itself and keeps the published site static.

### GitHub Actions automation

The workflow in [sync-itch-devlogs.yml](/D:/Website/.github/workflows/sync-itch-devlogs.yml):

- Runs every 6 hours
- Can also be run manually from the Actions tab
- Regenerates `content/itch-devlog.json`
- Commits and pushes the updated file if anything changed

### Run the sync locally

```powershell
python scripts/sync_itch_devlogs.py
```

This updates `content/itch-devlog.json` locally.

## How to edit project data

Edit [site-data.json](/D:/Website/content/site-data.json).

Each project entry supports:

- `slug`
- `title`
- `shortPitch`
- `description`
- `longDescription`
- `role`
- `techTools`
- `status`
- `year`
- `tags`
- `image`
- `featured`
- `links`

If you want to check the expected shape before editing, use [site-data.schema.json](/D:/Website/content/site-data.schema.json) as the reference.

### Featured vs additional work

- Set `"featured": true` to place a project in the Featured Projects section.
- Set `"featured": false` to place it in Additional Work.

### Project images

- Local project thumbnails live in `/assets/projects/`.
- `image` paths in JSON should stay relative, for example: `./assets/projects/stargen.png`
- If an image is missing or fails to load, the site automatically shows a fallback placeholder instead of a broken image.

## How to replace branding assets

Branding files live in `/assets/branding/`.

- Replace `logo-512.png` to change the favicon and watermark source.
- Replace `logo-full.png` if you want to keep a larger original in the repo.
- If the branding aspect ratio or filename changes, update the image references in [index.html](/D:/Website/index.html).

## How to deploy to GitHub Pages

1. Push this repository to GitHub.
2. In the repository settings, open `Pages`.
3. Set the source to deploy from the default branch root.
4. Confirm that `index.html` is in the repository root.
5. Wait for GitHub Pages to publish the site.

Because the site uses only relative paths and no client-side routing, it works cleanly on GitHub Pages without server rewrites.

## Local preview

Open the site through a simple local web server so the JSON fetch works.

Example with Python:

```powershell
python -m http.server 8000
```

Then visit `http://localhost:8000/`.

## Maintenance notes

- The site intentionally excludes legal name, phone number, street address, private email, and private resume details.
- Public project text should stay grounded in public-safe source material only.
- The current research section is intentionally conservative and shows an empty-state message until there are public-safe talks or publications to add.
- `og:image` is already set, but if you later know the final production URL you may also want to add `og:url` and a canonical tag in [index.html](/D:/Website/index.html).
- The itch news section is generated. If it looks stale, run the sync workflow or the local Python sync script.

## Content checklist

Update these later if public-safe information becomes available:

- Add public GitHub link if one should be shown on the site.
- Add talks, papers, showcases, or academic outputs with public URLs.
- Add education only if the exact school and date are confirmed as public-safe for this portfolio.
- Swap in preferred project thumbnails if you want something other than the current public capture images.
- Review project descriptions whenever public release pages change.
- Review the auto-discovered itch projects occasionally in case profile layout changes require updates to the sync script.
