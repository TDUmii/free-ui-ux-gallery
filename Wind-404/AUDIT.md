# Wind 404 audit

Initial review and correction pass: 2026-09-09.

The initial browser review identified four issues. All four have now been addressed in the source. Three controller regression tests pass. The browser automation tool failed to initialize during the correction pass, including after a reset, so the final layout and OS media-query behavior have not been visually rechecked.

## Correction status

| Original finding | Change | Verification |
| --- | --- | --- |
| P1 - Muted text contrast | Changed `--muted` from `#52636e` to `#455762`. | Calculated contrast against darkest gradient color `#c5cfd7` improved from 3.94:1 to 4.76:1. Rendered confirmation pending. |
| P2 - Small peripheral targets | Wordmark and footer links now use inline flex alignment and minimum 44px width/height. | CSS verified; new rendered dimensions pending. |
| P2 - Mixed reduced-motion resume | One `motion-enabled` root class reflects explicit playback state; reduced-motion CSS suppression applies only when the class is absent. Preference changes reset wind history and pause/resume consistently. | Controller tests cover reduced-motion startup, explicit override, pause, preference changes and single-loop scheduling. Real OS preference behavior pending. |
| P3 - Per-frame measurement | Field dimensions are cached and refreshed by `ResizeObserver`. | Controller test resizes the field and runs frames with synchronous bounding-box reads configured to fail. Test passes. |

## Regression checks

Run with Node.js:

```bash
node --test tests/motion.test.cjs
```

Three tests pass:

- Reduced-motion startup stays still; explicit resume enables the complete shared playback state.
- System preference changes reset motion and do not duplicate animation loops.
- Hidden tabs stop scheduling; resize updates do not require per-frame synchronous layout reads.

The harness executes the real controller with a minimal DOM and media-preference model. It does not render CSS, simulate a physical touchscreen, or replace browser testing.

JavaScript syntax validation and `git diff --check` also pass. The earlier detector used degraded regex analysis because optional parsers were unavailable; its empty result is not complete audit coverage.

## Earlier browser evidence

Before the four corrections, the browser review confirmed:

- No horizontal overflow at 320x740, 435x698 and 1440x900.
- Local font loading, frozen ribbon state while paused, and visible keyboard focus.
- Home and back navigation, including activating the home link with Enter.
- No error or warning console messages during that pass.
- Short ASCII hyphens in visible copy, labels and titles after reload.

These observations describe the earlier build. They are not a claim that the final correction pass received browser validation.

## Documentation

The README now introduces the project in the gallery's BamBo format: highlights, local setup, structure, integration, credits and license. Social-video links have been removed as requested. Font licensing and the root MIT license link remain intact. QA captures are local only and are ignored by Git.
