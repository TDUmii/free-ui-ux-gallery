# Wind 404

A free interactive error-page experience with a quiet blue-gray atmosphere, a stranded paper character, and flowing wind ribbons that carry movement from the illustration into the typography.

## Highlights

- Two dark and light wind ribbons curl across the 404 illustration, drawing from the head and dissolving from the tail.
- Gentle gusts arrive automatically, keeping the scene alive even when the pointer is still.
- Move the pointer to create directional gusts, or tap either side of a touch screen to send a breeze through the scene.
- The paper character, drifting pieces, and individual headline letters respond to the same wind, with a small delay between letters.
- Pause and resume the scene from the wind control in the header.
- System reduced-motion preferences start the illustration still; explicitly enabling motion restores the complete animation.
- Vietnamese copy, visible keyboard focus, readable contrast, and responsive layouts support the recovery flow.
- Home and back links connect to a clearly labeled local demo destination.
- No dependencies, package installation, or build step are required.

## Run locally

Open `index.html` directly in a browser, or start a static web server from this directory:

```bash
python -m http.server 8080
```

Then visit `http://localhost:8080`.

The home button opens `home.html`, a demonstration destination. The back link uses same-origin browser history when available and otherwise opens that demo home. Navigation remains available without JavaScript.

## Structure

```text
Wind-404/
|-- assets/
|   |-- fonts/      # Local Lora typeface and its license
|   `-- favicon.svg
|-- css/            # Layout, illustration, motion and responsive styles
|-- js/             # Wind ribbons, particles, controls and navigation
|-- tests/          # Motion-state regression checks
|-- home.html       # Demo destination
|-- index.html      # Interactive 404 page
|-- AUDIT.md        # Review findings and correction evidence
|-- DESIGN.md       # Design and interaction decisions
`-- README.md
```

## Use in your website

Replace the `home.html` links with your real homepage. Configure your host or router to serve this page for missing routes and return HTTP status 404. Use root-relative asset URLs when installing the page as a site-wide error page for nested routes. This standalone example does not change your hosting configuration.

## Credits

The Lora typeface is bundled locally under the [SIL Open Font License](assets/fonts/OFL.txt). The inline illustration, wind animation, and favicon are authored as part of this interface.

## License

Source code is available under the [MIT License](../LICENSE). The Lora font retains its SIL Open Font License.

© 2026 TDUmii - Free UI/UX.
