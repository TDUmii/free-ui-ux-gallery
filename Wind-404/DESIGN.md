---
name: Wind 404
description: A quiet Vietnamese error page with a paper character and a shared wind field.
colors:
  sky: "#cbd5db"
  ink: "#243540"
  muted: "#52636e"
  paper: "#fafbf4"
  sky-center: "#e1e7e8"
  sky-middle: "#d2dce0"
  sky-edge: "#c5cfd7"
  button-text: "#f6f7f5"
  button-hover: "#364e5e"
  focus: "#284f68"
  ribbon-dark: "#4b5962"
  ribbon-light: "#aebbc5"
typography:
  display:
    fontFamily: "WindSerif, Georgia, 'Times New Roman', serif"
    fontSize: "clamp(36px, 3.8vw, 53px)"
    fontWeight: 400
    lineHeight: 1.13
    letterSpacing: "-.03em"
  body:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "14px"
    lineHeight: 1.7
  wordmark:
    fontFamily: "WindSerif, Georgia, serif"
    fontSize: "30px"
    letterSpacing: "-1px"
rounded:
  action: "30px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.button-text}"
    rounded: "{rounded.action}"
    padding: "0 25px"
  button-primary-hover:
    backgroundColor: "{colors.button-hover}"
---

# Design System: Wind 404

## Overview

The built direction is wind-swept blue-gray paper: restrained, hand-drawn, and quietly playful. A stranded paper character sits on an oversized illustrated 404 above a two-line Vietnamese serif headline. Generous negative space keeps the recovery actions easy to find.

This documents the finished standalone gallery entry. The gallery's general commitments to runnable source and accessible interaction apply; its older cat-login-specific product language does not define this page.

## Colors

Cool neutral tones establish the atmosphere. The page uses a radial gradient centered at `50% 38%`, moving from sky-center through sky-middle at 38% to sky-edge. Ink anchors the headline and primary action; muted supports explanatory copy and peripheral controls. The illustration adds slate outlines, pale paper fills, and subtle gradients without introducing a bright accent.

The `paper` token is declared in the stylesheet; individual SVG paper fills are authored separately. Preserve those illustration values when adjusting the surrounding palette.

## Typography

`WindSerif` is the locally hosted Lora regular font with `font-display: swap`. It supplies the expressive headline and wordmark. Arial/Helvetica supplies compact supporting text and controls. The headline remains two explicit lines; JavaScript wraps words and letters for animation while preserving whole words.

At widths up to 600px, the headline is 36px, body copy is 12px, and wordmark is 27px. At widths from 1500px, the headline is 58px. Short desktop viewports use 40px. Primary and secondary navigation labels are 13px on desktop and 12px on mobile.

## Layout

The body is a vertical flex layout with a minimum height of `100svh` and a minimum page width of 320px. Header and footer frame a centered, flexible main composition. Desktop header padding is `30px 48px`; the artwork is `min(650px, 80vw)`, followed by the headline, one supporting sentence, and two horizontally arranged recovery actions.

The SVG uses a tight `viewBox="65 25 590 340"` to give the illustration greater presence. Its left 4 is an independently drawn angular silhouette with an open triangular counter.

At 600px and below, header side padding becomes 24px, main side padding becomes 20px, and artwork expands to 108% of its container with a 500px cap. The footer wraps with a centered interaction hint on its own line. At 1500px and above, artwork becomes 720px. Desktop viewports no taller than 730px use 480px artwork and tighter vertical spacing. Keep these adaptations coordinated so the illustration and recovery actions remain one composition.

## Elevation & Depth

Depth comes mainly from the atmospheric background, SVG fill gradients, an elliptical ground shadow, and irregular overlaps among the numerals and character. The home action has a restrained `0 5px 14px #33465014` shadow. There are no card surfaces or elevated panels.

## Shapes

The illustration uses irregular numeral silhouettes, folded paper, rounded strokes, and two thick curling wind ribbons layered in front of the artwork. The dark ribbon is 8.5 SVG units wide; the light ribbon is 10.5 units wide. Their heads progressively reveal each curve while their tails erase, accompanied by outward and upward drift. The primary action is a 30px-radius pill; the secondary action is a simple underlined text link. Avoid imposing a rectangular card system on this open composition.

## Components

- **Recovery navigation:** “Về trang chủ” is a filled pill with a minimum height of 49px and an arrow. Hover lifts it 2px, changes its fill, and moves the arrow 4px. “Quay lại” has a 44px minimum height and a thin underline with a 6px offset. Both retain real `home.html` fallback destinations without JavaScript.
- **Motion control:** A transparent header button with a 44px minimum height toggles the simulation and blinking. Its visible label and accessible label describe the current action/state, and `aria-pressed` is true while paused. Pausing freezes the current pose.
- **Signature shared wind:** An initial gust and automatic gusts every 2.5–2.8 seconds keep the page active without pointer input. Each gust contains dark and light ribbons, with the light curve delayed by .18 animation seconds. Stroke dashes reveal the head and erase the tail; age-based drift and fading complete the motion before the group is removed. A gust-age envelope drives smoothed numeral tilt, paper lean, folded corner, and legs. Letters sample stored wind history with an additional 22ms delay per letter, producing a sequential directional response. Nine airborne pieces maintain a 68px/s baseline drift, modified by wind and input force with smoothed velocity and rotation. Horizontal pointer velocity and left/right touch taps add bounded directional gusts; entering the primary action adds a small impulse. Eye blinking is a separate six-second CSS animation.
- **Accessibility:** The artwork has a descriptive image label; decorative SVG and leaves are hidden from assistive technology. The heading exposes one complete accessible sentence while its animated text spans are hidden. Links and buttons receive a 2px focus outline with a 6px offset. Reduced-motion preference starts the simulation paused, removes CSS animation/transitions, fixes letter transforms, and hides leaves and traveling trails. The user can explicitly resume the simulation. Animation scheduling stops while the tab is hidden; touch users receive a tap-specific hint.
- **Demo boundaries:** Home opens the included labeled demo destination. Back invokes browser history only when a same-origin referrer and usable history exist; otherwise it follows the demo-home link. This page does not configure a host's missing-route behavior or HTTP 404 status. Integration requires real home destinations, host/router configuration, and suitable asset URLs for nested routes.

## Do's and Don'ts

- **Do** keep Vietnamese copy readable while letters move and retain a complete accessible heading.
- **Do** keep motion optional and navigation functional with keyboard, touch, reduced motion, and JavaScript disabled.
- **Do** preserve the original inline illustration's independently animated parts and the shared wind relationship.
- **Do** retain local assets, framework-free source, and gallery attribution.
- **Don't** introduce bright accent colors, dense panels, or competing animation systems that disrupt this quiet composition.
- **Don't** describe the included demo home or static page as a configured production error route.
