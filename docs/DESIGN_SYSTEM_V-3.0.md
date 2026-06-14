# Design System Inspired by Nike Commerce Platform

## 1. Visual Theme & Atmosphere

This design system embodies a modern, performance-driven aesthetic rooted in athletic retail and digital commerce. The interface combines a dark, sophisticated sidebar navigation with a clean, light-filled main content area, creating a striking visual contrast that emphasizes product discovery and transaction clarity. The design prioritizes functionality while maintaining premium aesthetics through deliberate use of whitespace, bold typography, and high-contrast UI elements. Neon-green accent colors pop against neutral backgrounds, signaling interactivity and action with energy and confidence. The overall mood is sleek, professional, and accessible—designed for users engaged in high-intent commerce who value both visual appeal and rapid navigation.

**Key Characteristics**

- High-contrast dark sidebar with neon-green accents against light content areas
- Clean grid-based product card layouts with minimal visual clutter
- Premium typography hierarchy emphasizing product names and pricing
- Flat design with minimal shadows, relying on color and spacing for depth
- Strategic use of neon green (`#BFFF00`) for primary CTAs and interactive highlights
- Dark badges and overlays for inventory and stock information
- Accessible button patterns with clear hover and active states
- Professional, modern aesthetic suitable for high-value transactions

## 2. Color Palette & Roles

### Primary

- **Neon Green / Brand Action** (`#BFFF00`): Primary CTA buttons, interactive highlights, add-to-cart actions, positive interactions, and category badges indicating active selections or count notifications.

### Interactive

- **Soft Green Highlight** (`#C8FF5E`): Hover states for primary buttons, lighter interactive feedback, secondary CTAs, and "Continue" or affirmative action states.
- **Dark Gray Badge Background** (`#1A1A1A`): Stock labels, inventory badges, dark overlays on product cards for text contrast.

### Neutral Scale

- **Charcoal / Sidebar Dark** (`#0E0E0E`): Primary navigation sidebar background, creating strong visual frame and hierarchy.
- **Pure Black / Deep Dark** (`#000000`): Text on light backgrounds, primary typography, icons in sidebar, stock badge text and borders.
- **Light Gray / Background** (`#E6E6E6`): Product card backgrounds, section dividers, soft content areas, subtle borders and disabled states.

### Surface & Borders

- **White** (`#FFFFFF`): Main content area background, card surfaces, transaction detail panels, ensuring maximum readability and clean aesthetic.
- **Light Gray Borders** (`#D0D0D0`): Subtle dividers between sections, card borders, form field underlines, and low-emphasis separators.

### Semantic / Status

- **Red / Payment Method** (`#FF3B30`): Mastercard indicator, payment-related icons, and financial alerts.
- **Gray / Disabled** (`#999999`): Placeholder text, disabled interactive elements, secondary information, and de-emphasized content.

## 3. Typography Rules

### Font Family

**Primary Font:** Inter or system sans-serif (fallback: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif`)

**Secondary Font:** Same as primary (system-consistent, neutral, modern sans-serif stack)

### Hierarchy

| Role                   | Font                          | Size        | Weight          | Line Height | Letter Spacing | Notes                                              |
|------------------------|-------------------------------|-------------|-----------------|-------------|----------------|----------------------------------------------------|
| Display / Page Title   | Inter                         | 28px - 32px | 800 (Extrabold) | 40px        | -0.5px         | Gradient text (`from-brand-dark to-brand-primary`)  |
| Heading / Card Title   | Inter                         | 16px        | 600             | 24px        | -0.3px         | Product names, section headings                    |
| Subheading             | Inter                         | 14px        | 500             | 20px        | 0px            | Category labels, secondary headings                |
| Body / Description     | Inter                         | 14px        | 400             | 20px        | 0px            | Product descriptions, detail text                  |
| Body Compact           | Inter                         | 13px        | 400             | 18px        | 0px            | Meta information, smaller content                  |
| Button / Label         | Inter                         | 14px        | 600             | 20px        | 0.5px          | CTA buttons, interactive labels                    |
| Caption / Small Text   | Inter                         | 12px        | 400             | 16px        | 0px            | Captions, stock counts, price qualifiers           |
| Code / Monospace       | "SF Mono", Monaco, monospace  | 12px        | 400             | 16px        | 0px            | Stock numbers, SKUs, technical info                |

### Principles

- **Hierarchy through weight and size:** Leverage 600/500/400 weights to create clear visual priority without excessive size scaling.
- **Generous line height:** Maintain at least 1.4× multiplier for readability, especially in product descriptions and longer body text.
- **Consistent letter spacing:** Use slight negative spacing on large text (display/headings) to tighten visual mass; default to zero for body.
- **Dark text on light, light text on dark:** Ensure sufficient contrast ratios (WCAG AA minimum 4.5:1 for body, 3:1 for large text).
- **Right-aligned prices:** Numerical content (pricing, quantities) uses right alignment for scannability.
- **Semantic use of weight:** Never rely on italics; use weight shifts instead for emphasis or distinction.

## 4. Component Stylings

### Buttons

#### Primary Button (Neon Green CTA)

```
background: #BFFF00
color: #000000
padding: 12px 24px
font-size: 14px
font-weight: 600
border-radius: 12px
border: none
cursor: pointer
line-height: 20px
letter-spacing: 0.5px
transition: all 200ms ease-out

&:hover
  background: #C8FF5E
  box-shadow: 0 4px 12px rgba(191, 255, 0, 0.3)

&:active
  background: #AFEE00
  transform: scale(0.98)

&:disabled
  background: #999999
  color: #666666
  cursor: not-allowed
```

#### Secondary Button (Light Text, Ghost Style)

```
background: transparent
color: #000000
padding: 8px 16px
font-size: 13px
font-weight: 500
border-radius: 12px
border: 1px solid #D0D0D0
cursor: pointer
transition: all 150ms ease-out

&:hover
  background: #E6E6E6
  border-color: #999999

&:active
  background: #D0D0D0
```

#### Ghost Button (Text-Only, Inline Action)

```
background: transparent
color: #0E0E0E
padding: 0
font-size: 14px
font-weight: 400
border: none
border-bottom: 1px solid #D0D0D0
cursor: pointer
text-decoration: none
transition: all 100ms ease-out

&:hover
  border-bottom-color: #000000
  color: #000000
```

### Cards & Containers

#### Product Card

```
background: #FFFFFF
border: 1px solid #E6E6E6
border-radius: 16px
padding: 0
overflow: hidden
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04)
transition: all 200ms ease-out

.product-image
  width: 100%
  height: 240px
  background: #E6E6E6
  object-fit: cover
  object-position: center

.product-badge
  position: absolute
  top: 12px
  right: 12px
  background: #1A1A1A
  color: #FFFFFF
  padding: 4px 12px
  border-radius: 4px
  font-size: 11px
  font-weight: 600
  letter-spacing: 0.3px

.product-content
  padding: 16px

.product-title
  font-size: 16px
  font-weight: 600
  color: #000000
  line-height: 22px
  margin-bottom: 8px

.product-description
  font-size: 13px
  font-weight: 400
  color: #666666
  line-height: 18px
  margin-bottom: 12px

.product-price
  font-size: 16px
  font-weight: 600
  color: #000000
  text-align: right
  margin-bottom: 12px

.product-footer
  display: flex
  justify-content: center

&:hover
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08)
  border-color: #D0D0D0
```

#### Transaction Detail Panel

```
background: #FFFFFF
border-left: 1px solid #E6E6E6
padding: 24px
border-radius: 0
width: 340px
position: relative

.detail-header
  font-size: 18px
  font-weight: 600
  color: #000000
  margin-bottom: 24px
  line-height: 26px

.detail-item
  display: flex
  justify-content: space-between
  align-items: center
  padding: 12px 0
  border-bottom: 1px solid #E6E6E6
  font-size: 14px

.detail-label
  color: #999999
  font-weight: 400

.detail-value
  color: #000000
  font-weight: 500
  text-align: right
```

### Inputs & Forms

#### Text Input / Select

```
background: #FFFFFF
border: 1px solid #D0D0D0
border-radius: 12px
padding: 10px 12px
font-size: 14px
font-weight: 400
color: #000000
line-height: 20px
transition: all 150ms ease-out

&:focus
  outline: none
  border-color: #BFFF00
  box-shadow: 0 0 0 3px rgba(191, 255, 0, 0.1)

&:disabled
  background: #E6E6E6
  color: #999999
  cursor: not-allowed
  border-color: #D0D0D0

&::placeholder
  color: #999999
  font-style: italic
```

#### Quantity Control (Increment / Decrement)

```
.qty-wrapper
  display: flex
  align-items: center
  gap: 8px
  border: 1px solid #D0D0D0
  border-radius: 12px
  padding: 4px

.qty-button
  background: transparent
  border: none
  width: 28px
  height: 28px
  border-radius: 4px
  font-size: 14px
  font-weight: 600
  cursor: pointer
  display: flex
  align-items: center
  justify-content: center
  transition: all 100ms ease-out

.qty-button.minus
  color: #666666

.qty-button.minus:hover
  background: #E6E6E6

.qty-button.plus
  background: #BFFF00
  color: #000000

.qty-button.plus:hover
  background: #C8FF5E

.qty-input
  width: 32px
  text-align: center
  border: none
  background: transparent
  font-size: 14px
  font-weight: 600
  color: #000000
  padding: 0
```

### Navigation

#### Sidebar Navigation

```
background: #0E0E0E
width: 80px
height: 100vh
display: flex
flex-direction: column
align-items: center
padding: 24px 0
gap: 32px
position: fixed
left: 0
top: 0

.nav-logo
  width: 48px
  height: 48px
  background: #BFFF00
  border-radius: 12px
  display: flex
  align-items: center
  justify-content: center
  cursor: pointer
  transition: all 150ms ease-out

.nav-logo:hover
  background: #C8FF5E
  transform: scale(1.05)

.nav-icon
  width: 40px
  height: 40px
  border-radius: 12px
  display: flex
  align-items: center
  justify-content: center
  cursor: pointer
  color: #FFFFFF
  font-size: 18px
  transition: all 150ms ease-out

.nav-icon.active
  background: #BFFF00
  color: #000000

.nav-icon:hover:not(.active)
  background: rgba(191, 255, 0, 0.1)
  color: #BFFF00
```

#### Top Tab Navigation (Product Categories / Sub-views)

```
display: flex
gap: 24px
padding-bottom: 0
border-bottom: 1px solid #E6E6E6
margin-bottom: 24px

.tab
  padding-bottom: 12px
  font-size: 14px
  font-weight: 700
  color: rgba(0, 0, 0, 0.5)
  background: transparent
  border: none
  border-bottom: 2px solid transparent
  cursor: pointer
  transition: all 150ms ease-out

.tab.active
  color: #000000
  border-bottom-color: #BFFF00

.tab:hover:not(.active)
  color: #000000
  border-bottom-color: rgba(0, 0, 0, 0.2)

.tab:active
  transform: scale(0.97)

.tab-badge
  display: inline-block
  background: #BFFF00
  color: #000000
  margin-left: 6px
  padding: 2px 8px
  border-radius: 12px
  font-size: 11px
  font-weight: 600
```

### Badges & Status Indicators

#### Stock Badge (Dark Overlay)

```
position: absolute
top: 12px
right: 12px
background: #1A1A1A
color: #FFFFFF
padding: 4px 10px
border-radius: 4px
font-size: 11px
font-weight: 600
letter-spacing: 0.3px
line-height: 14px
```

#### Category Count Badge (Neon Green)

```
display: inline-block
background: #BFFF00
color: #000000
padding: 2px 8px
border-radius: 12px
font-size: 11px
font-weight: 600
margin-left: 6px
line-height: 14px
```

## 5. Layout Principles

### Spacing System

**Base Unit:** `8px`

**Scale:** `8px, 12px, 16px, 24px, 32px, 40px, 48px, 56px, 64px`

**Usage:**
- `8px`: Micro spacing between inline elements, tight component gaps
- `12px`: Padding within small components, button internal spacing
- `16px`: Default card/section padding, standard component gap
- `24px`: Section margins, heading spacing, major container padding
- `32px`: Large vertical spacing between content blocks, page sections
- `40px+`: Full-page margins, maximum breathing room around major sections

### Grid & Container

**Max Width:** `1440px` for main content (full product grid + detail panel)

**Sidebar Width:** `80px` fixed, left-aligned

**Content Area:** Remaining viewport width after sidebar

**Product Grid:** 3-column layout with `16px` gaps between cards on desktop

**Detail Panel:** `340px` width, fixed right side

**Section Padding:** `24px` horizontal, `32px` vertical between major sections

**Gutters:** `16px` minimum between grid items; `24px` horizontal padding for container edges

### Whitespace Philosophy

Whitespace is actively used to create breathing room and guide visual hierarchy. Large, intentional gaps between sections reduce cognitive load and emphasize logical groupings. Card-to-card spacing encourages natural scanning patterns. Interior card padding is conservative (`16px`), while section-to-section gaps are generous (`24px–32px`), creating a clear spatial hierarchy that supports user navigation and task completion.

### Border Radius Scale

- **Small/Badge Scale:** `8px` (`rounded-lg`) — Badge labels, status badges, and inline status indicator dots
- **Interactive Elements (Buttons/Inputs/Selectors):** `12px` (`rounded-xl`) — Primary & secondary CTA buttons, text inputs, textareas, select dropdowns, and category tab selectors
- **Container Cards & Lists:** `16px` (`rounded-2xl`) — Stat cards, product cards, table containers, preview cards, and section card structures
- **Overlays & Modals:** `24px` (`rounded-3xl`) — Inline modal screens, dialog boxes, alert popups, and floating prompt panels
- **Full Round:** `50%` (`rounded-full`) — Live status pulses, trend indicator dots, user avatar frames, and circular progress meters

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| 0 (Flat) | `box-shadow: none` | Backgrounds, surfaces flush with page |
| 1 (Raised) | `box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04)` | Product cards at rest, subtle lift |
| 2 (Elevated) | `box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08)` | Product cards on hover, modals, emphasis |
| 3 (Floating) | `box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12)` | Dropdowns, overlays, modal dialogs |
| Interactive Focus | `box-shadow: 0 0 0 3px rgba(191, 255, 0, 0.1)` | Input focus state, keyboard navigation highlight |
| Stat Card Hover Glow | `box-shadow: 0 10px 25px -4px rgba(191, 255, 0, 0.16), 0 4px 12px -2px rgba(191, 255, 0, 0.10)` | Highlighted dashboard stat cards on hover / focus-within |

**Shadow Philosophy:** Shadows are minimal and subtle, preferring color and spacing for depth. Only product cards and interactive overlays receive shadows; most elements remain flat. Focus states use a colored glow (`rgba(191, 255, 0, 0.1)`) rather than shadows to emphasize interactivity and accessibility. All shadows use black with reduced opacity (`rgba(0, 0, 0, 0.04–0.12)`) to remain visually soft and premium. For specialized dashboard metrics, a soft, refined neon-green glow shadow is used on hover/focus-within to highlight key operational statistics.

## 7. Do's and Don'ts

### Do

- **Use neon green (`#BFFF00`) for all primary CTAs** — "Add to Cart," "Continue," primary buttons, and active navigation states. This color communicates brand energy and action.
- **Maintain clear visual hierarchy through typography weight shifts** — Use 600 for headings/CTAs, 500 for subheadings, 400 for body. Never mix sizes and weights arbitrarily.
- Group related information in cards with consistent padding — All cards use `16px` internal padding and `16px` border-radius (`rounded-2xl`) for visual cohesion.
- **Right-align numeric content** (prices, quantities, stock counts) for visual scannability and professional appearance.
- **Provide clear focus states on all interactive elements** — Use `border-color: #BFFF00` and inner glow `0 0 0 3px rgba(191, 255, 0, 0.1)` for keyboard navigation.
- **Use the dark sidebar as a visual anchor** — Keep navigation icons centered, spaced `32px` apart vertically, with clear active state styling.
- **Test contrast ratios** — Ensure all text meets WCAG AA minimum (4.5:1 for body, 3:1 for large text).
- **Leverage whitespace to reduce cognitive load** — Generous section gaps (`24px–32px`) guide natural scanning and task flow.

### Don't

- **Avoid using multiple colors for CTAs** — Only neon green should signal primary actions. Secondary buttons must use different styling (ghost, outlined, or muted).
- **Don't exceed 3 font sizes in a view** — Hierarchy should be built through weight and spacing, not excessive size variation.
- **Never remove the sidebar on desktop** — It provides critical navigation context and visual framing.
- **Avoid shadows on small UI elements** — Keep shadows reserved for Level 1–3 (cards, modals, overlays only).
- **Don't use pure red or orange for UI elements except status/alerts** — The Mastercard red is reserved for payment methods; use neutral grays for secondary content.
- **Never left-align price or quantity data** — Always right-align for visual consistency and scannability.
- **Avoid low-contrast color pairs** — Text must contrast sharply with backgrounds; never use dark gray text on light gray backgrounds.
- **Don't break the 80px sidebar width** — Icons and spacing should remain centered and proportional; never overcrowd or shrink sidebar items.

## 8. Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | 375px–599px | Single-column product grid, sidebar collapses to icon-only nav, detail panel becomes modal drawer |
| Tablet | 600px–1023px | 2-column product grid, sidebar remains fixed, detail panel becomes sticky right side panel at 280px width |
| Desktop | 1024px–1439px | 3-column product grid, full layout with sidebar + grid + detail panel, all horizontal |
| Large Desktop | 1440px+ | Max-width container applied (`1440px`), centered layout, 3-column grid maintained |

### Touch Targets

- **Minimum Interactive Element Size:** `44px × 44px` (icon buttons, navigation items)
- **Button Padding:** Minimum `12px` vertical, `24px` horizontal (results in ~44px height)
- **Tap/Click Area:** All interactive elements must have at least `8px` of surrounding breathing room to prevent accidental triggers
- **Input Fields:** Minimum `40px` height for comfortable touch input
- **Quantity Controls:** Each increment/decrement button `28px × 28px` minimum
- **Card Clickable Areas:** Product cards must be fully tappable; recommend minimum `240px × 280px` on mobile

### Collapsing Strategy

**Mobile (< 600px):**
- Sidebar collapses to vertical icon strip; navigation icons remain visible but labels hidden
- Product grid shifts to single column with `16px` horizontal margin
- Detail panel becomes a full-height modal drawer that slides up from bottom
- Category tabs scroll horizontally if overflow occurs
- Buttons stack vertically in detail panel instead of horizontal alignment

**Tablet (600px–1023px):**
- Product grid becomes 2-column with `16px` gaps
- Sidebar remains `80px` fixed width
- Detail panel remains sticky right side, width reduced to `280px`
- Typography sizes reduce by 1–2px for compact screens
- Margins reduce from `24px` to `16px` horizontally

**Desktop (≥ 1024px):**
- Full 3-column grid maintained
- All panels visible side-by-side
- Sidebar `80px`, detail panel `340px`
- Standard typography and spacing applied
- Hover states fully available (no touch-only considerations)

## 9. Agent Prompt Guide

### Quick Color Reference

- **Primary CTA:** Neon Green (`#BFFF00`) — use for buttons, active tabs, interactive highlights
- **Secondary CTA:** Soft Green (`#C8FF5E`) — hover states, lighter emphasis
- **Background:** White (`#FFFFFF`) — main content area, card surfaces
- **Surface Dark:** Charcoal (`#0E0E0E`) — sidebar, dark containers
- **Badge/Overlay:** Dark Gray (`#1A1A1A`) — stock labels, product badges
- **Heading Text:** Black (`#000000`) — primary typography, high contrast
- **Body Text:** Black or Gray (`#000000` or `#666666`) — hierarchy through weight, not color
- **Disabled/Secondary:** Gray (`#999999`) — low-priority content, disabled states
- **Light Background:** Light Gray (`#E6E6E6`) — card backgrounds, subtle fills
- **Border:** Light Gray (`#D0D0D0`) — dividers, subtle separators

### Iteration Guide

1. **Always use `#BFFF00` (neon green) for primary CTAs** — no exceptions. This is the brand action color and must remain the strongest signal for user interaction.

2. **Typography hierarchy is built on weight, not size** — use 600-weight for card/section headings, 500 for subheadings, 400 for body. Main Display/Page Titles retain their 800 (Extrabold) gradient text styling (`from-brand-dark to-brand-primary`).

3. **Sidebar is fixed at `80px` width, centered alignment** — icons are spaced `32px` apart vertically. Active state uses neon green background + black icon.

4. **Product cards use consistent internal padding of `16px`** and `12px` border-radius. Never crop images or overflow text; let cards breathe.

5. **Focus states must include both border color (`#BFFF00`) and inner glow (`0 0 0 3px rgba(191, 255, 0, 0.1)`)** for keyboard accessibility and visual feedback.

6. **Spacing scale is always a multiple of 8px** — `8px, 12px, 16px, 24px, 32px`. No arbitrary spacing; every margin/padding is intentional.

7. **Shadows are minimal; only use on Level 1 (cards) and above** — most UI remains flat. Depth comes from color, spacing, and focus states.

8. **Detail transaction panel is always `340px` wide on desktop, positioned right-aligned** — text is right-aligned where appropriate (prices, values). All content is organized vertically with `12px` gaps.

9. **Breakpoint logic:** At mobile (`< 600px`), sidebar becomes icon-only, grid becomes 1-column, detail panel becomes modal. At tablet (`600px–1023px`), grid is 2-column. At desktop (`≥ 1024px`), full 3-column + sidebar + detail panel visible.

10. **Color contrast is critical** — all body text must achieve 4.5:1 contrast (WCAG AA). Use `#000000` text on light backgrounds; `#FFFFFF` or `#E6E6E6` text on dark backgrounds.