---
name: STRIDE Aurora
description: A saturated sneaker colorway stage with an off-screen rotating orbit.
colors:
  shell: "#0b1016"
  white: "#fff"
  button-ink: "#222"
  button-hover: "#f4f4f4"
  footer-copy: "#c5c9d0"
  panel-tint: "rgba(20,10,8,.09)"
  solar-stage: "#ad381d"
  solar-swatch: "#fa704c"
  voltage-stage: "#4a5b16"
  voltage-swatch: "#d6f236"
  ultraviolet-stage: "#513786"
  ultraviolet-swatch: "#ac80e0"
  desert-stage: "#705737"
  desert-swatch: "#d6bb8e"
  after-hours-stage: "#283238"
  after-hours-swatch: "#373d40"
  tidal-stage: "#166c68"
  tidal-swatch: "#29c5ba"
typography:
  display:
    fontFamily: "Manrope, Arial, sans-serif"
    fontSize: "clamp(25px, 2.4vw, 38px)"
    fontWeight: 800
    lineHeight: 1.12
    letterSpacing: "-.025em"
  price:
    fontFamily: "Manrope, Arial, sans-serif"
    fontSize: "25px"
    fontWeight: 800
    lineHeight: 1.25
  body:
    fontFamily: "Manrope, Arial, sans-serif"
    fontSize: "13px"
    lineHeight: 1.65
  collection:
    fontFamily: "Manrope, Arial, sans-serif"
    fontSize: "9px"
    fontWeight: 800
    letterSpacing: ".2em"
rounded:
  panel: "24px"
  panel-mobile: "20px"
  button: "30px"
  circle: "50%"
  toast: "12px"
components:
  button-primary:
    backgroundColor: "{colors.white}"
    textColor: "{colors.button-ink}"
    rounded: "{rounded.button}"
    padding: "10px 22px"
  button-primary-hover:
    backgroundColor: "{colors.button-hover}"
  product-panel:
    backgroundColor: "{colors.panel-tint}"
    textColor: "{colors.white}"
    rounded: "{rounded.panel}"
    padding: "38px 34px"
---

# Design System: STRIDE Aurora

## Overview

**Creative North Star: STRIDE Aurora reference.** Experience mode puts the sneaker rotation at the center of the page. A saturated, changing stage fills the space between dark gallery chrome; white product copy and a lightly tinted panel keep the selected colorway readable.

Key characteristics:

- Large alpha-transparent sneaker artwork, with neighboring shoes entering from the cropped left edge.
- One synchronized color, image, title, description, and selection state.
- Self-hosted Manrope, compact labels, bold product names, and rounded controls.

## Colors

### Primary

The six stage/swatch pairs are defined in the frontmatter in their browsing order: Solar Flare, Voltage, Ultraviolet, Desert Bone, After Hours, and Tidal. Darker stage colors support white copy; brighter swatches identify the corresponding artwork.

**The Synchronized Color Rule.** Change the stage background and selected swatch with the product content. Keep the header and footer dark across all six states.

### Neutral

Shell anchors the page and toast. White supplies product text, selection rings, focus outlines, and the save button. Button ink provides contrast on that button. The translucent panel tint gives product information a quiet boundary without separating it from the stage.

## Typography

Manrope is self-hosted as a variable Latin WOFF2, with Arial and sans-serif fallbacks. Bold, tightly spaced names lead; widely tracked uppercase collection labels and small supporting copy sit beneath that hierarchy.

The desktop name is limited to 12 characters of line measure and balanced across lines. Description copy is capped at 32 characters. On mobile, the name becomes 27px, price 22px, and description 12px; the narrowest breakpoint reduces the name to 24px. The position counter uses tabular numerals.

## Layout

Desktop uses a 72px header and 56px footer around a stage sized to the remaining viewport, constrained between 620px and 1100px high. The selected shoe is centered near 34% horizontally and 48% vertically; the information panel begins at 63% with a maximum width of 410px. At 1600px and above, the panel begins at 62%.

At 760px and below, the stage stacks: shoe viewport first, product panel next, navigation below. The header becomes 58px, footer 54px, the shoe viewport is 320px high, and the centered panel has a maximum width of 420px. Its top margin reserves 305px for the artwork. Small footer links and the gesture hint are hidden. At 360px and below, panel width and padding tighten again.

## Elevation & Depth

A radial white spotlight illuminates the selected shoe. The tinted product panel uses a soft ambient shadow. The selected shoe gains a drop shadow, while other shoes use 48% opacity and 2px blur. Depth belongs to the artwork and a few supporting surfaces, rather than an extensive card hierarchy. Exact shadow and motion values live in the sidecar.

## Shapes

The orbit, swatches, and arrow buttons repeat circular geometry. The save action is a pill; the panel and toast use softer rectangular corners. Stage clipping deliberately crops neighboring sneakers. Product artwork retains its original proportions through counterrotation and inverse vertical scaling.

## Components

- **Sneaker orbit:** Six spokes sit 60 degrees apart around an off-screen axis. The wheel is compressed vertically to 0.55; each shoe counterrotates and scales vertically by 1.8181818. Desktop radius is `min(48vw, 660px)`; mobile radius is 74vw. Movement and stage color share a 1050ms easing curve. Swatch selection takes the shorter path around the wheel.
- **Product panel:** A translucent surface holds the collection label, name, concept price, swatches, description, save action, and demonstration notice. Mobile places it in normal flow below the shoe.
- **Swatches:** Circular 20px fills sit in 38px by 44px buttons. A 28px white ring marks the pressed state; hover enlarges the fill to 1.13 times its resting size.
- **Save action:** A white pill with dark bold text and an inline arrow. Hover lifts it 2px, active returns it to rest. Its text reflects whether the current colorway is saved. The header heart recalls the single saved favorite.
- **Browse controls:** Circular 44px arrows surround a two-digit position counter. Hover increases background opacity and scales the arrow button to 1.07. Keyboard arrows, Home/End, and horizontal swipe provide equivalent navigation.
- **Motion and feedback:** Auto rotation starts off and, when enabled, advances every 4500ms. Manual navigation, focus entering the stage, or a hidden tab stops it. Reduced motion uses 1ms transitions and hides the auto control. A dark bottom toast announces saving and recall for three seconds.
- **Focus:** Buttons, links, and the stage expose a white 3px focus outline. Product copy is announced through a polite live region; selected swatches and the save action expose pressed state.

## Do's and Don'ts

- **Do** preserve the six colorway pairings and synchronized content changes.
- **Do** keep shoe proportions stable during the compressed orbit.
- **Do** retain the stacked mobile composition and full keyboard/touch flow.
- **Do** keep the gallery credit and the concept-only product language.
- **Don't** replace the alpha-transparent artwork with text or icon placeholders.
- **Don't** add the reference video's editor panels to the product stage.
- **Don't** turn optional rotation into unavoidable movement.
