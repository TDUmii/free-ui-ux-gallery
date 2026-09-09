# Wind 404 audit

Reviewed on 2026-09-09 after the short-hyphen copy update. This is one bounded source and browser review, not a complete accessibility certification or a new artwork-fidelity assessment.

## Implementation integrity

The intended shared-wind interaction is present, the two navigation actions work, and the responsive composition remains coherent. The page is not an all-clear for accessibility: the contrast and small target findings below remain open.

| Dimension | Score | Evidence |
| --- | --- | --- |
| Accessibility | 2/4 | Accessible heading and artwork labels, keyboard focus and working pause; muted text contrast is insufficient in darker regions. |
| Performance | 3/4 | No frameworks, bounded gust lifecycle, hidden-tab scheduling guard; layout measurement remains inside the animation loop. |
| Responsive design | 3/4 | No horizontal overflow at 320, 435 and 1440px; footer link has a small touch target. |
| Theming | 3/4 | Intentional light palette with core tokens; some illustration colors remain local literals. No dark theme is required by the brief. |
| Implementation integrity | 4/4 | Working standalone example, honest demo destination, authored wind ribbons and consistent copy. |
| Total | 15/20 | Good overall, with open accessibility work. |

## Open findings

### P1 - Muted text contrast

Location: `css/style.css`, `--muted`, `.motion-toggle`, `.copy p`, and `footer`.

The muted text color is `#52636e`. Its contrast against the darkest gradient color `#c5cfd7` is 3.94:1. Sampling the current 435x698 capture near the footer gives a background of `(207, 214, 222)` and approximately 4.25:1. This is below the 4.5:1 normal-text threshold. The primary button text is approximately 11.78:1 and the main ink against the darkest ground is approximately 8.01:1.

Suggested correction: darken the shared muted token enough to meet 4.5:1 over the whole gradient, then verify actual rendered text regions.

### P2 - Small peripheral link targets

Location: `css/style.css`, `footer a` and `.wordmark`.

At the current mobile-sized viewport, the author link measures about 33x11px and the wordmark about 90x34px. The primary action is 150x49px, back is 44x44px and the motion control is 104x44px. The author link is particularly difficult to tap.

Suggested correction: provide at least 44px of clickable height and an adequate width for the peripheral links, preserving their visual text sizes.

### P2 - Reduced-motion resume has mixed behavior

Location: `js/wind.js`, motion-toggle handler; `css/style.css`, reduced-motion media query.

Source inspection shows that the toggle can resume JavaScript while the system still requests reduced motion. The label then says wind is running, but CSS continues hiding the ribbons and particles and fixing letter transforms; paper/number transforms may still update. This produces an inconsistent opt-in state. This branch was identified in source, not exercised by changing the user's OS preference.

Suggested correction: either keep the control clearly in reduced-motion mode or implement a deliberate user override applied consistently to all decorative motion.

### P3 - Per-frame layout measurement

Location: `js/wind.js`, `field.getBoundingClientRect()` inside `tick`.

The field size is read after animation style writes on every frame. It can require style/layout synchronization even though the field size normally stays unchanged. No performance trace was recorded, so this is an optimization opportunity, not proof of dropped frames.

Suggested correction: cache the field dimensions and refresh on resize rather than measuring them every animation frame.

## Verified behavior

- The local font loads.
- No horizontal overflow at 320x740, 435x698, and 1440x900.
- The pause action freezes the ribbon markup across separate observations.
- Keyboard Tab reaches the home link with a visible solid focus outline; Enter opens the demo home.
- The demo return link and the 404 back link complete the home/404 navigation loop.
- No browser error or warning logs were reported during this pass.
- Authored page titles, visible copy and labels use short ASCII hyphens after reload.
- JavaScript syntax and `git diff --check` pass.

The bundled detector fell back to degraded regex analysis because optional HTML/CSS parser packages were missing. Its empty finding list is not evidence of complete coverage. Physical touch, screen readers, browser text enlargement, and OS reduced-motion changes were not exercised. QA screenshots stay local under the ignored `docs/` directory.
