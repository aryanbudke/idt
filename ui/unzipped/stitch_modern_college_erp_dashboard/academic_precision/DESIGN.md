---
name: Academic Precision
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#424754'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#727785'
  outline-variant: '#c2c6d6'
  surface-tint: '#005ac2'
  primary: '#0058be'
  on-primary: '#ffffff'
  primary-container: '#2170e4'
  on-primary-container: '#fefcff'
  inverse-primary: '#adc6ff'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#924700'
  on-tertiary: '#ffffff'
  tertiary-container: '#b75b00'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#ffdcc6'
  tertiary-fixed-dim: '#ffb786'
  on-tertiary-fixed: '#311400'
  on-tertiary-fixed-variant: '#723600'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  h1:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  h2:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.01em
  h3:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-base:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  h1-mobile:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 36px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  container-padding: 32px
  gutter: 24px
  section-gap: 48px
  element-gap: 12px
---

## Brand & Style
The design system centers on clarity, trust, and administrative efficiency. It is tailored for high-density academic environments where information architecture is paramount. The style is a refined take on **Modern Minimalism**, drawing heavily from the Shadcn/UI philosophy: stripping away unnecessary decoration to prioritize content and functional utility.

The aesthetic utilizes a "Studio" approach—heavy use of white space (negative space) to reduce cognitive load, paired with sharp, high-contrast typography to ensure legibility across complex data tables and dashboards. The emotional response should be one of "calm control," moving away from the cluttered, legacy feel of traditional ERPs toward a breathable, app-like experience.

## Colors
This design system employs a focused palette built on professional blues and slate neutrals. 

- **Primary:** The core blue (#3b82f6) is reserved for primary actions, active states, and progress indicators. 
- **Neutral/Slate:** We use a calibrated scale of slates. `Slate-900` (#0f172a) for headings, `Slate-600` (#475569) for body text, and `Slate-400` (#94a3b8) for secondary labels.
- **Backgrounds:** The interface utilizes a tiered white system. The main canvas is pure white (#ffffff), while subtle grey washes (#f8fafc) are used for sidebars or "muted" container sections to provide soft contrast without heavy lines.
- **Feedback:** Use standard semantic tokens: Destructive (#ef4444), Success (#22c55e), and Warning (#f59e0b).

## Typography
Inter is the sole typeface for the design system to ensure a systematic, utilitarian feel. 

For headlines (H1-H3), use a tighter letter-spacing (-0.01em to -0.02em) to maintain a modern, "compact" look. Body text should remain at 0em for maximum readability in long-form reports. Use **Semi-bold (600)** for UI labels and button text to differentiate them from static content. Data-heavy tables should exclusively use `body-sm` to maximize information density without sacrificing clarity.

## Layout & Spacing
The layout follows a **Fixed-Fluid hybrid** model. On desktop, the sidebar is fixed at 280px, while the main content area expands to a max-width of 1440px.

- **The 8px Grid:** All spacing is derived from a 4px/8px base unit. 
- **Generous Margins:** Content containers use 32px internal padding to provide a "breathable" feel. 
- **Card-Based Architecture:** Information is grouped into distinct white cards. Between these cards, a 24px gutter ensures clear separation.
- **Responsive Reflow:** On tablet, horizontal padding reduces to 24px. On mobile, the sidebar collapses into a hamburger menu, and content cards stack vertically with 16px margins.

## Elevation & Depth
In line with the Shadcn-inspired minimalist aesthetic, this design system avoids heavy drop shadows. 

- **Low-Contrast Outlines:** Depth is primarily communicated through 1px borders using `Slate-200` (#e2e8f0). 
- **Level 1 (Surface):** Content cards use a single, very soft shadow: `0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)`.
- **Level 2 (Overlays):** Modals and dropdown menus use a slightly more pronounced shadow to indicate focus, but remain crisp and clean.
- **Tonal Layers:** Active states (like a selected navigation item) are indicated by a light blue tint (#eff6ff) rather than physical elevation.

## Shapes
The shape language is "Friendly Professional." While the overall system is systematic, we use generous corner radii to soften the institutional feel of an ERP.

- **Global Radius:** Use 0.5rem (8px) for standard UI elements like inputs and buttons.
- **Container Radius:** Use 0.75rem (12px) or 1rem (16px) for main content cards and modals to create a distinct, modern silhouette.
- **Interactive Elements:** Checkboxes and radio buttons should maintain a consistent 4px (0.25rem) radius to feel cohesive with the larger components.

## Components
- **Buttons:** Primary buttons use a solid `#3b82f6` fill with white text. Secondary buttons use a transparent background with a `#e2e8f0` border and `#0f172a` text. Active/Pressed states involve a subtle darken (5-10%).
- **Inputs:** High-contrast borders (`Slate-200`) that shift to `Primary Blue` on focus. Use an 8px (0.5rem) radius. Labels are always positioned above the input in `label-sm` style.
- **Cards:** The workhorse of the ERP. Pure white background, 1px border (`Slate-200`), and 12px-16px corner radius. Header sections within cards should have a subtle bottom border.
- **Chips/Badges:** Small, rounded-full shapes with a light background tint (e.g., light green for "Enrolled") and darker foreground text.
- **Lists/Tables:** Rows should have a minimum height of 48px. Use alternating row stripes (Zebra striping) only in high-density data views, otherwise, use a simple 1px bottom divider.
- **Sidebar:** A vertical navigation strip with a `Slate-50` background. Icons should be stroke-based (Lucide/Feather style) for a light, airy feel.