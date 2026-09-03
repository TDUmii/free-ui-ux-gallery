# BamBo Login

A free interactive login page with a vintage storybook aesthetic, a cheerful panda, and a pull-cord lamp with spring-like physical feedback.

![BamBo Login preview](docs/preview.webp)

## Highlights

- Pull the lamp cord down and release it to toggle the light, complete with stretch, recoil, and bounce.
- Turning the lamp off changes the lighting and character expressions while locking the entire form until the light is restored.
- Turning the lamp back on wakes the panda, who waves and says `Hiii!`.
- The panda covers its eyes while a password is entered and peeks when password visibility is enabled.
- Native Edge and Windows password reveal controls are suppressed to prevent a duplicate eye icon.
- Keyboard interaction, reduced-motion preferences, and responsive layouts are supported.
- No dependencies, package installation, or build step are required.

## Run locally

Open `index.html` directly in a browser, or start a static web server from this directory:

```bash
python -m http.server 8080
```

Then visit `http://localhost:8080`.

## Structure

```text
BamBo-Login/
├── assets/icons/   # Favicon and third-party attribution
├── css/            # Background, lamp, layout, panda, form, theme, responsive
├── docs/           # Preview media
├── js/             # Core, toast, panda, form, lamp, and initialization
├── index.html
└── README.md
```

## Credits

The panda favicon comes from the [Twemoji](https://github.com/jdecked/twemoji) project and is used under [CC BY 4.0](https://github.com/jdecked/twemoji/blob/main/LICENSE-GRAPHICS). See [`assets/icons/ATTRIBUTION.md`](assets/icons/ATTRIBUTION.md) for full details.

## License

Source code is available under the [MIT License](../LICENSE). The Twemoji favicon is not covered by this project's MIT License and remains licensed under CC BY 4.0.

© 2026 TDUmii - Free UI/UX.
