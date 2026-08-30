# workshops.ujjwalagarwal.com

Workshop units taught by Ujjwal Agarwal (Assistant Professor, Srishti Manipal
Institute of Art, Design and Technology). Static site, GitHub Pages.

## Structure

```
/                                   → index of all workshop units
/computational-approach-to-sound/   → CAS 2026 (31 Aug – 11 Sep 2026)
  day-1/ … day-10/                  → full teaching material, one page per day
  starters/                         → phone-instrument templates (Week 2)
  tools/qr/                         → URL → QR generator for the deploy ritual
  assets/strings/                   → guitar sample library (G3–B5, mp3)
```

Future workshops: add a sibling folder next to
`computational-approach-to-sound/` and a card on the root `index.html`.

## Deploy (first time)

```bash
cd "$(dirname "$0")"            # this workshops/ folder
git init -b main
git add -A && git commit -m "CAS 2026 microsite"
gh repo create kala0606/workshops --public --source=. --push
gh api repos/kala0606/workshops/pages -X POST \
  -f 'source[branch]=main' -f 'source[path]=/'
```

Then one DNS record at GoDaddy (ujjwalagarwal.com → DNS management):

- Type **CNAME** · Name **workshops** · Value **kala0606.github.io** · TTL default

GitHub picks up the custom domain from the `CNAME` file in this repo. In the
repo's Pages settings, tick **Enforce HTTPS** once the certificate is issued
(needed — phone audio/sensor APIs require HTTPS).

## Deploy (updates)

```bash
git add -A && git commit -m "update" && git push
```

Pages redeploys automatically in about a minute.
