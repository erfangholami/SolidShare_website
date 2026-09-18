# solidshare.app

The website for [Solid Share](https://github.com/erfangholami/SolidShare), an Android app for
your Solid pod. Static files, served by Cloudflare Pages. No framework, no runtime.

## The site speaks five languages

Each language is its own page at its own address:

| Language | Home    | Privacy policy  |
| -------- | ------- | --------------- |
| English  | `/`     | `/privacy`      |
| Deutsch  | `/de/`  | `/de/privacy`   |
| Español  | `/es/`  | `/es/privacy`   |
| Français | `/fr/`  | `/fr/privacy`   |
| Italiano | `/it/`  | `/it/privacy`   |

A picker in the header links to the same page in the other four. Nothing is switched at
runtime, so every language is indexed, previews correctly when shared, and works with
JavaScript off.

## How a page is built

    templates/index.html     the markup, in English, with a data-i18n key on every
    templates/privacy.html   element that holds words
    i18n/<page>.<lang>.json  the words, one file per page and language
    tools/build.py           writes the ten pages and sitemap.xml

**Edit the templates and the string files, never the generated pages.** Then run:

    python3 tools/build.py

The generated pages carry a banner saying so. The script fails rather than publish a page
with a missing string, so a new key must be added to all five files.

## To change a sentence

1. Edit the English text in `i18n/home.en.json` (or `privacy.en.json`), keeping the key.
2. Edit the same key in the other four files.
3. Run `python3 tools/build.py`.

## To add a sentence

1. Add the element to the template with a new `data-i18n="<section>.<n>"` key.
2. Add that key to all five string files for that page.
3. Run `python3 tools/build.py`.

An attribute is translated the same way: `data-i18n-alt`, `data-i18n-label` for an
`aria-label`, and `data-i18n-content` for a `<meta>`.

## Everything else

    style.css   the landing page's styles; the privacy page carries its own, inline
    main.js     header state, the mobile menu, the install bar and scroll reveals
    public/     icons, store badges, screenshots
    .well-known Solid client ID document and Android App Links verification

The app's own translations are the source of terminology: an access level or a tab is
named here exactly as the app names it on screen.
