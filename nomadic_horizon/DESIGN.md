---
name: Nomadic Horizon
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f4'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#43474c'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f0f1f1'
  outline: '#74777c'
  outline-variant: '#c4c7cc'
  surface-tint: '#4e6072'
  primary: '#000205'
  on-primary: '#ffffff'
  primary-container: '#0b1e2d'
  on-primary-container: '#748799'
  inverse-primary: '#b6c8dd'
  secondary: '#855300'
  on-secondary: '#ffffff'
  secondary-container: '#fea619'
  on-secondary-container: '#684000'
  tertiary: '#030200'
  on-tertiary: '#ffffff'
  tertiary-container: '#221c09'
  on-tertiary-container: '#8e8469'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d2e5f9'
  primary-fixed-dim: '#b6c8dd'
  on-primary-fixed: '#0a1d2c'
  on-primary-fixed-variant: '#374959'
  secondary-fixed: '#ffddb8'
  secondary-fixed-dim: '#ffb95f'
  on-secondary-fixed: '#2a1700'
  on-secondary-fixed-variant: '#653e00'
  tertiary-fixed: '#eee2c3'
  tertiary-fixed-dim: '#d2c6a8'
  on-tertiary-fixed: '#211b08'
  on-tertiary-fixed-variant: '#4e4630'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
  deep-expedition: '#0B1E2D'
  sunset-accent: '#F59E0B'
  sand-parchment: '#F2E5C6'
  snow-peak: '#FFFFFF'
typography:
  display-lg:
    fontFamily: Outfit
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Outfit
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Outfit
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Outfit
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  headline-md:
    fontFamily: Outfit
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Outfit
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Outfit
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-lg:
    fontFamily: Outfit
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-md:
    fontFamily: Outfit
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  container-max-width: 1280px
  gutter: 24px
  margin-desktop: 64px
  margin-tablet: 32px
  margin-mobile: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
  section-gap: 80px
---

## Brand & Style

The design system is built for the modern explorer, balancing the ruggedness of outdoor adventure with the precision of high-end travel planning. The brand personality is adventurous, reliable, and inspiring. It evokes the feeling of a crisp morning in the mountains—clear, vast, and full of possibility.

The chosen design style is **Corporate / Modern with Minimalist influences**. It prioritizes high-quality imagery and heavy whitespace to let travel photography breathe, while using structured layouts to convey trust and logistical competence. Visual elements are clean and functional, avoiding unnecessary decoration to keep the focus on the destination and the journey.

## Colors

The palette is rooted in the natural world. **Deep Expedition** (Primary) provides a grounded, authoritative base, reminiscent of the night sky or deep waters. **Sunset Accent** (Secondary) is used sparingly for high-action items, calls to action, and highlights, injecting energy and visibility into the UI. 

**Sand Parchment** acts as a sophisticated alternative to pure white for secondary surfaces, cards, or background sections, adding warmth and a "map-like" tactile quality. **Snow Peak** (Neutral) is the primary canvas color, ensuring maximum legibility and a clean, contemporary feel.

## Typography

The design system utilizes **Outfit** exclusively to maintain a geometric, clean, and highly readable appearance across all touchpoints. Its wide apertures and modern construction make it ideal for both large-scale inspirational headlines and dense itinerary details.

Headlines use tighter letter spacing and heavier weights to create a sense of impact and hierarchy. Body text is set with generous line heights to enhance readability during long-form reading of travel guides. Labels utilize uppercase styling and increased tracking to differentiate functional metadata from narrative content.

## Layout & Spacing

This design system employs a **fixed-width grid** for desktop to ensure a premium, editorial feel, transitioning to a fluid model for tablet and mobile devices. 

- **Desktop:** 12-column grid, 1280px max-width, 24px gutters.
- **Tablet:** 8-column fluid grid, 32px side margins.
- **Mobile:** 4-column fluid grid, 16px side margins.

A rigorous 4px base unit governs all spatial relationships. Section vertical spacing is generous (80px+) to maintain the minimalist aesthetic and prevent the interface from feeling cluttered with information. Content should be grouped using logical stacks (8px for related elements, 16px for distinct components, 32px for independent content blocks).

## Elevation & Depth

Hierarchy is established primarily through **tonal layers** and **low-contrast outlines** rather than heavy shadows. 

- **Surface Levels:** The base layer is #FFFFFF. Secondary containers or "cards" use #F2E5C6 with a subtle 1px border (#0B1E2D at 10% opacity).
- **Interactive Depth:** On hover, cards may lift slightly using a very soft, ambient shadow (0px 4px 20px rgba(11, 30, 45, 0.05)).
- **Overlays:** Modals and navigation menus use a clean white surface with a slightly more pronounced shadow to separate them from the content stream.
- **Imagery:** Photography often serves as the "lowest" layer, with text and UI elements placed on top using semi-transparent dark overlays (scrims) for legibility.

## Shapes

The shape language is **Rounded**, reflecting a balance between professional structure and approachable friendliness. 

Corner radii are standardized to 0.5rem (8px) for standard components like buttons and input fields. Larger containers, such as travel cards and image wrappers, should use `rounded-lg` (16px) to soften the visual impact of large photography. High-action elements like "Book Now" buttons or category filters may occasionally use pill-shaped (rounded-full) geometry to draw the eye.

## Components

- **Buttons:** Primary buttons are solid #0B1E2D with #FFFFFF text. Secondary buttons use the #F59E0B accent to denote priority actions like "Check Availability." 
- **Input Fields:** Clean, outlined boxes with 1px #0B1E2D (20% opacity) borders. On focus, the border shifts to the primary color with a 2px weight.
- **Cards:** Essential for destination showcases. Use `rounded-lg` for the container, with an image ratio of 4:3 or 16:9. Content inside cards uses #F2E5C6 as the background to distinguish them from the main page.
- **Chips/Tags:** Used for travel categories (e.g., "Hiking," "Luxury"). These use #F2E5C6 backgrounds with #0B1E2D text in `label-md` styling.
- **Lists:** Clean, border-bottom separated items with generous 16px vertical padding. Use Sunset Accent (#F59E0B) for bullet points or icons to add a spark of color.
- **Navigation:** A sticky top bar with high transparency (backdrop-blur) or solid #0B1E2D for high-contrast scenarios, ensuring the journey through the site is as seamless as the travel itself.