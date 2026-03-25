# Design System Specification: The Digital Cultivator

## 1. Overview & Creative North Star
The "Digital Cultivator" is the guiding philosophy of this design system. It rejects the cold, sterile aesthetics of traditional agritech and the "boxy" rigidity of standard SaaS. Instead, it positions the platform as a high-end editorial experience—where the precision of AI meets the warmth of the Malaysian landscape.

**The Creative North Star:** *Intelligence Rooted in Earth.*
We break the "template" look by utilizing intentional asymmetry, expansive negative space, and a sophisticated layering of warm surfaces. This system is designed to feel like a premium concierge service for the modern grower: authoritative yet approachable, high-tech yet human.

---

## 2. Colors: Tonal Depth & The "No-Line" Rule
Our palette is derived from the lifecycle of a harvest—from deep forest greens to the muted gold of sun-dried wheat. 

### Core Palette (Material Convention)
*   **Primary:** `#334F2B` (Forest Depth)
*   **Primary Container:** `#4A6741` (Earthy Green)
*   **Secondary:** `#56642B` (Moss)
*   **Tertiary:** `#735C00` (Muted Gold/Wheat)
*   **Surface/Background:** `#FAF9F6` (Off-White)
*   **Surface Container Low:** `#F4F3F1` (Soft Cream)
*   **On-Surface:** `#1A1C1A` (Dark Charcoal)

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to define sections or cards. We define boundaries through **background color shifts** or **tonal transitions**. 
*   Place a `surface-container-lowest` card on a `surface-container-low` background. 
*   Avoid the "grid-of-boxes" look; use the 8px spacing system to let elements breathe.

### Surface Hierarchy & Glassmorphism
Treat the UI as a series of physical layers. Use `surface-container` tiers (Lowest to Highest) to create nested depth. 
*   **The Glass Rule:** For AI-driven insights or floating notifications, use Glassmorphism. Apply a semi-transparent `surface` color with a `20px` backdrop-blur. This suggests the "intelligence" layer is hovering over the physical "data" layer.
*   **Signature Textures:** Use subtle linear gradients (e.g., `primary` to `primary-container` at a 135-degree angle) for high-impact CTAs to provide a lush, premium feel that flat colors cannot achieve.

---

## 3. Typography: Editorial Authority
We utilize a pairing of **Manrope** for high-impact editorial moments and **Inter** for data-heavy utility. This creates a "Fintech-meets-Vogue" hierarchy.

*   **Display (Manrope):** Large, bold, and slightly tight-tracked. Used for hero statements and major financial figures. 
    *   *Display-LG (3.5rem):* Reserved for high-level "Harvest Value" or "AI Predictions."
*   **Headline (Manrope):** Used for section headers. These should often be asymmetrical (e.g., left-aligned with a generous top-margin) to break the "standard template" feel.
*   **Body (Inter):** High-legibility, standard tracking. 
    *   *Body-LG (1rem):* Use for primary descriptions. 
*   **Labels (Inter):** Small, often uppercase with slight letter-spacing (+0.05rem) to denote metadata or secondary tags.

---

## 4. Elevation & Depth: Tonal Layering
In this design system, shadows are an exception, not a rule. Hierarchy is achieved through **Tonal Layering**.

*   **The Layering Principle:** Stack `surface-container` tiers to create lift. An "Inner Card" should be `surface-container-lowest` (#FFFFFF) sitting inside a `surface-container-high` (#E9E8E5) section.
*   **Ambient Shadows:** If a card must float (e.g., a critical AI alert), use an extra-diffused shadow: `Y: 12px, Blur: 32px, Color: On-Surface (at 4% opacity)`. This mimics soft, natural Malaysian sunlight.
*   **The Ghost Border:** If a border is required for accessibility, it must be the `outline-variant` token at **20% opacity**. 100% opaque borders are strictly prohibited as they "trap" the content.

---

## 5. Signature Components

### Buttons & Interaction
*   **Primary Action:** `primary-container` background with `on-primary` text. Use `XL (3rem)` roundedness. No borders.
*   **Secondary/Tertiary:** `surface-container-low` background. These should feel like "depressions" in the interface rather than raised elements.
*   **Interaction:** On hover/tap, transition background colors subtly (e.g., move one tier up in the surface hierarchy).

### Cards & Lists
*   **The Card Style:** Use `LG (2rem)` or `XL (3rem)` corner radius. 
*   **List Items:** Forbid divider lines. Separate items using `Spacing: 2 (0.7rem)` and a background shift between even/odd items or simply through generous vertical white space.

### AI Insight Chips
*   **The Look:** Semi-transparent `primary-fixed-dim` background with a `backdrop-blur`. 
*   **The Feel:** These should appear "smarter" than the rest of the UI, using the `tertiary` (Gold/Wheat) token for subtle highlights or icons.

### Inputs
*   **Style:** Filled inputs using `surface-container-highest`. Upon focus, the background transitions to `surface-container-lowest` with a "Ghost Border" highlight. This provides a tactile "opening" effect.

---

## 6. Do’s and Don’ts

### Do
*   **Use Asymmetry:** Place a large headline on the left and a small AI summary on the right with different vertical offsets.
*   **Embrace Large Radii:** Stick to the `24px-28px` range for all main containers to maintain the "startup-modern" softness.
*   **Use Tonal Shifts:** Define sections by changing the background from `surface` to `surface-container-low`.

### Don't
*   **Don't use 1px lines:** They create visual "noise" and make the platform look dated.
*   **Don't use pure black:** Use `on-surface` (Dark Charcoal) for all text to keep the "Warmth" of the system intact.
*   **Don't crowd the screen:** If in doubt, add more `spacing-8 (2.75rem)` between sections. Rural-friendly means providing a calm, legible experience, not a cluttered dashboard.
*   **Don't use sharp corners:** Even small chips should have at least `sm (0.5rem)` rounding.

---

## 7. Spacing Scale: The 8px Rhythm
Everything in this system follows an 8px-based rhythmic progression but is expressed in `rem` for responsive fluidity.
*   **Content Padding:** Use `spacing-4 (1.4rem)` for internal card padding.
*   **Section Gaps:** Use `spacing-12 (4rem)` to `spacing-16 (5.5rem)` to create an editorial, airy feel.