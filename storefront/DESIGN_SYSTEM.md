# TATVA Design System

## Brand Philosophy
TATVA represents exquisite handcrafted jewelry that tells stories. Our design reflects:
- **Elegance**: Clean, sophisticated aesthetics
- **Timelessness**: Classic design patterns that never age
- **Artistry**: Attention to detail and craftsmanship
- **Warmth**: Inviting, human-centered experiences

---

## Color Palette

### Primary Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `primary` | `#A91D22` | Brand color, CTAs, accents |
| `primary-dark` | `#8B1519` | Hover states, emphasis |
| `primary-light` | `#FDF2F2` | Light backgrounds, subtle accents |

### Neutral Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `background` | `#FFFFFF` | Main background |
| `background-warm` | `#FFFBFB` | Section alternates |
| `background-cream` | `#FDF8F8` | Cards, subtle sections |
| `foreground` | `#1A1A1A` | Primary text |
| `foreground-muted` | `#4A4A4A` | Secondary text |
| `muted` | `#F5F5F5` | Input backgrounds |
| `muted-foreground` | `#737373` | Placeholder text, captions |
| `border` | `#E8E8E8` | Borders, dividers |
| `border-light` | `#F0F0F0` | Subtle separators |

### Accent Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `gold` | `#C9A962` | Premium highlights |
| `rose` | `#F4E4E4` | Soft backgrounds |
| `champagne` | `#F7F1E8` | Elegant section backgrounds |
| `success` | `#22C55E` | Success states |
| `warning` | `#F59E0B` | Warnings, badges |
| `error` | `#EF4444` | Errors, destructive |

---

## Typography System

### Font Families
- **Headings**: Playfair Display (serif) - Elegant, timeless
- **Body**: Inter (sans-serif) - Clean, highly readable
- **Accent**: Geist Sans - Modern UI elements

### Type Scale
| Level | Font | Size | Weight | Line Height | Letter Spacing |
|-------|------|------|--------|-------------|----------------|
| Hero | Playfair | 56-72px | 500 | 1.1 | -0.02em |
| H1 | Playfair | 48px | 500 | 1.15 | -0.01em |
| H2 | Playfair | 36px | 500 | 1.2 | 0 |
| H3 | Playfair | 28px | 500 | 1.25 | 0 |
| H4 | Playfair | 22px | 500 | 1.3 | 0 |
| H5 | Inter | 18px | 600 | 1.4 | 0.01em |
| H6 | Inter | 14px | 700 | 1.4 | 0.1em |
| Body Large | Inter | 18px | 400 | 1.6 | 0 |
| Body | Inter | 16px | 400 | 1.6 | 0 |
| Body Small | Inter | 14px | 400 | 1.5 | 0 |
| Caption | Inter | 12px | 500 | 1.4 | 0.05em |
| Overline | Inter | 11px | 600 | 1.2 | 0.2em |

### Typography Patterns
- **Section Labels**: Uppercase, 11px, letter-spacing 0.2em, primary color
- **Product Names**: Uppercase, 12px, letter-spacing 0.1em, bold
- **Prices**: 14px, semibold, primary color
- **Navigation**: Uppercase, 12px, letter-spacing 0.15em

---

## Spacing System

### Section Spacing
| Size | Value | Usage |
|------|-------|-------|
| Section XL | 120px | Hero sections, major divisions |
| Section LG | 80px | Major section padding |
| Section MD | 60px | Standard section padding |
| Section SM | 40px | Compact sections |
| Section XS | 24px | Tight spacing |

### Content Spacing
| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | 4px | Tight gaps |
| `space-2` | 8px | Icon gaps |
| `space-3` | 12px | Related elements |
| `space-4` | 16px | Default gap |
| `space-5` | 20px | Component internal |
| `space-6` | 24px | Standard gap |
| `space-8` | 32px | Large gap |
| `space-10` | 40px | Section internal |
| `space-12` | 48px | Major divisions |
| `space-16` | 64px | Large divisions |

### Container Widths
| Container | Max Width | Padding |
|-----------|-----------|---------|
| Default | 1280px | 16px (mobile) / 24px (tablet) / 32px (desktop) |
| Wide | 1440px | 16px / 24px / 48px |
| Narrow | 960px | 16px / 24px / 32px |
| Content | 720px | 16px |

---

## Component Patterns

### Buttons

#### Primary Button
- Background: `primary`
- Text: White, 12px, uppercase, tracking 0.15em
- Padding: 16px 32px
- Border Radius: 0 (sharp edges for elegance)
- Hover: `primary-dark`, subtle lift shadow
- Transition: 200ms ease

#### Secondary Button
- Background: Transparent
- Border: 1px solid `primary`
- Text: `primary`, 12px, uppercase
- Hover: Background `primary`, text white

#### Ghost Button
- Background: Transparent
- Text: `foreground`, 12px, uppercase
- Hover: Background `muted`

### Cards

#### Product Card
- Image aspect ratio: 3:4
- Background: `background-cream` for placeholder
- Border radius: 0
- Shadow: None (clean aesthetic)
- Hover: Image scale 1.05, quick add button slides up
- Transition: 400ms cubic-bezier(0.4, 0, 0.2, 1)

#### Collection Card
- Background: `rose` or `champagne`
- Padding: 32px
- Hover: Subtle shadow, underline animation
- Transition: 300ms ease

### Forms

#### Input Fields
- Background: `muted`
- Border: 1px solid transparent
- Border radius: 0
- Padding: 14px 16px
- Focus: Border `primary`, subtle shadow
- Placeholder: `muted-foreground`

### Badges
- Border radius: 0
- Padding: 4px 8px
- Font: 10px, uppercase, bold
- Types: Discount (primary), New (black), Sale (red)

---

## Section Patterns

### Section Header Pattern
```
[OVERLINE - 11px, uppercase, primary color, tracking 0.2em]
[HEADING - H2, Playfair, italic, primary color]
[OPTIONAL: Subtitle/description]
[OPTIONAL: View All link - right aligned on desktop]
```

### Two-Column Layout Pattern
- Left: Sticky content / Banner (33-40%)
- Right: Scrolling content / Products (60-67%)
- Gap: 48-64px
- Mobile: Stack vertically

### Grid Patterns
- Product Grid: 2 cols (mobile) / 4 cols (desktop), gap 24px
- Collection Grid: 2 cols / 4 cols, gap 24px
- Feature Grid: 2 cols / 4 cols, gap 32px

---

## Animation & Motion

### Easing Functions
| Name | Value | Usage |
|------|-------|-------|
| Default | `cubic-bezier(0.4, 0, 0.2, 1)` | General transitions |
| Enter | `cubic-bezier(0, 0, 0.2, 1)` | Elements entering |
| Exit | `cubic-bezier(0.4, 0, 1, 1)` | Elements leaving |
| Bounce | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Playful interactions |

### Durations
- Micro: 100ms (hover color changes)
- Fast: 200ms (button states)
- Normal: 300ms (card hover, menus)
| Slow: 500ms (page transitions)

### Common Animations
1. **Image Zoom**: scale 1.0 → 1.05 on hover, 500ms
2. **Quick Add Slide**: translateY(100%) → translateY(0), 300ms
3. **Underline Grow**: width 0% → 100%, 300ms
4. **Fade In**: opacity 0 → 1, translateY(20px) → translateY(0), 500ms
5. **Marquee**: translateX(0) → translateX(-50%), 30s linear infinite

---

## Responsive Breakpoints
| Name | Width | Usage |
|------|-------|-------|
| Mobile | < 640px | Single column, compact spacing |
| Tablet | 640px - 1024px | 2 columns, medium spacing |
| Desktop | 1024px - 1280px | Full layout |
| Wide | > 1280px | Max-width containers |

---

## UX Guidelines

### Visual Hierarchy
1. Use size contrast to establish importance
2. Use color sparingly - primary for CTAs and accents only
3. Use whitespace generously - let content breathe
4. Keep text lines to 60-75 characters for readability

### Interaction Patterns
1. **Hover States**: Every interactive element must have a hover state
2. **Focus States**: Clear focus indicators for accessibility
3. **Loading States**: Skeleton screens preferred over spinners
4. **Empty States**: Helpful messaging with clear next steps

### Accessibility
- Minimum contrast ratio: 4.5:1 for text
- Touch targets: Minimum 44x44px
- Focus rings: Visible on all interactive elements
- Alt text: Descriptive for all images
- Reduced motion: Respect `prefers-reduced-motion`

### Performance
- Images: Use Next.js Image component with proper sizing
- Animations: Use transform/opacity for GPU acceleration
- Fonts: Use font-display: swap
- Lazy loading: For below-fold content

---

## Section-Specific Guidelines

### Announcement Bar
- Height: 40px
- Background: Primary or accent color
- Text: White, 12px, centered
- Behavior: Marquee scroll or static

### Header
- Height: 72px (desktop), 64px (mobile)
- Background: White with subtle shadow on scroll
- Logo: Left/center aligned
- Navigation: Center/right aligned
- Icons: Right aligned, 24px size

### Hero Banner
- Height: 70vh (max 600px)
- Content: Centered, max-width 800px
- CTA: Primary button, prominent placement
- Overlay: Subtle gradient if using background image

### Product Sections
- Section padding: 80px vertical
- Header: Overline + Heading + optional link
- Grid: 4 columns desktop, 2 mobile
- "View All" link: Uppercase, underlined on hover

### Category Circles
- Circle size: 80px desktop, 64px mobile
- Spacing: 32px between items
- Scroll: Horizontal on mobile, centered on desktop

### Footer
- Background: Dark (`#1A1A1A`)
- Text: White and gray tints
- Padding: 80px top, 40px bottom
- Grid: 4 columns desktop, 1 column mobile

---

## Image Guidelines

### Aspect Ratios
- Product images: 3:4 (portrait)
- Banner images: 16:6 or 16:9
- Category images: 1:1 (square)
- Lifestyle images: 4:5 or 3:4

### Image Treatment
- Consistent color grading
- Soft shadows on product images
- White or neutral backgrounds for products
- Lifestyle images with warm tones

---

## Shadow System
| Name | Value | Usage |
|------|-------|-------|
| None | - | Default, clean aesthetic |
| Subtle | `0 1px 3px rgba(0,0,0,0.05)` | Card hover |
| Soft | `0 4px 12px rgba(0,0,0,0.08)` | Elevated cards |
| Medium | `0 8px 24px rgba(0,0,0,0.1)` | Modals, drawers |
| Strong | `0 16px 48px rgba(0,0,0,0.12)` | Full-screen overlays |

---

## Border Radius System
- Cards: 0 (sharp edges)
- Buttons: 0 (sharp edges)
- Badges: 0 (sharp edges)
- Inputs: 0 (sharp edges)
- Icons/Circles: 50% (fully rounded)
- Search inputs: 9999px (pill shape exception)

---

## Z-Index Scale
| Element | Z-Index |
|---------|---------|
| Base content | 0 |
| Elevated content | 10 |
| Sticky header | 50 |
| Drawers | 100 |
| Modals | 200 |
| Toasts | 300 |
| Tooltips | 400 |

