# Wind 404

A quiet, wind-swept error page with an original paper character, responsive lettering, and a shared wind field. Built with HTML, CSS, and vanilla JavaScript; no install or build step.

## Run

Open `index.html` directly, or serve the gallery root with `python -m http.server 4173 --bind 127.0.0.1` and visit `http://127.0.0.1:4173/Wind-404/`.

## Interactions

- Two thick dark and light wind ribbons curl in front of the illustration. Their heads draw progressively while their tails erase, drift, and fade. Automatic gusts continue without pointer input.
- Gusts make the paper lean; letters follow stored wind history with a 22ms delay between successive characters. Airborne pieces drift with inertia.
- Move the pointer to add directional gusts. Pointer speed affects the wind strength.
- On touch screens, tap either half of the page to create a gust.
- Use the wind button to pause/resume motion. System reduced-motion preferences are respected by default.
- The home link opens the included, explicitly labeled demo destination. Back returns to a same-origin referring page when available, otherwise to the demo home.
- Animation stops when the tab is hidden. Navigation works without JavaScript.

## Integration

Replace the `home.html` destinations with your site's real homepage. Configure your host/router to serve this page for missing routes and return HTTP status 404. This standalone demo does not change hosting configuration. Use root-relative asset URLs when installing it as a site-wide error page for nested routes.

## Files and credits

- `css/style.css`: layout, responsive rules, illustration transforms, motion preferences.
- `js/wind.js`: shared wind simulation, particles, letter motion, controls.
- `assets/`: locally hosted typeface and favicon. Illustration paths are authored inline for independent animation.
- `home.html`: working demo navigation destination.

Visual and interaction inspiration: [SETTIGATION's wind-powered 404](https://www.tiktok.com/@settigation/video/7681287204626337042). This implementation is independently authored, with Vietnamese copy and a new paper character; it does not contain extracted video artwork or source code.

Typeface: Lora, distributed under the SIL Open Font License (see `assets/fonts/OFL.txt`).

Source: MIT, under the gallery's root license. TDUmii — Free UI/UX.

## Validation

The final ribbon animation was reviewed across multiple desktop phases and at a 390px mobile viewport, with no horizontal overflow observed. Earlier browser checks verified local font loading, home/back navigation, and pause-state changes. QA images remain local and are excluded from the source-only publication.

The earlier Impeccable detector ran in degraded regex-only mode because optional parser packages were unavailable; it is not a complete accessibility audit. Touch behavior and system reduced-motion behavior are implemented but have not been tested on a physical mobile device or with a changed OS preference.
