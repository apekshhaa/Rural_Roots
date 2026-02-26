# Rural Roots - Technical Specification

## 1. Tech Stack Overview

| Category | Technology |
|----------|------------|
| Framework | React 18 + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS 3.4 |
| UI Components | shadcn/ui |
| Animation | Framer Motion |
| Icons | Lucide React |
| Fonts | Google Fonts (Playfair Display, Inter) |

## 2. Tailwind Configuration

### Color Extensions

```javascript
colors: {
  'farm': {
    'dark': '#1a3d2e',
    'primary': '#2d5a45',
    'light': '#3d7a5a',
    'mint': '#c8e6d5',
    'cream': '#e8f5ee',
    'muted': '#6b8a7a',
    'accent': '#d4a574',
  }
}
```

### Font Extensions

```javascript
fontFamily: {
  'serif': ['Playfair Display', 'serif'],
  'sans': ['Inter', 'sans-serif'],
}
```

## 3. Component Inventory

### Shadcn/UI Components (Pre-installed)

| Component | Usage | Style Overrides |
|-----------|-------|-----------------|
| Button | CTAs, actions | Custom farm colors |
| Input | Search field | Dark background variant |
| Sheet | Mobile menu, cart drawer | Slide from right |
| DropdownMenu | Nav dropdowns | Dark green theme |
| Badge | Product tags | Mint/dark variants |
| Card | Product cards, blog cards | Custom shadows |
| Separator | Section dividers | Green tint |

### Custom Components

| Component | Props Interface | Description |
|-----------|-----------------|-------------|
| Navbar | - | Fixed nav with dropdowns, search, cart |
| HeroSection | - | Full-screen hero with background |
| SectionLabel | `{ children: string }` | Decorative section label with diamonds |
| AboutSection | - | Two-part about with images |
| SelectionSection | - | Product categories with parallax |
| SustainableSection | - | Icon features grid |
| FarmSection | - | Image collage with text |
| GallerySection | - | Image carousel |
| ShopSection | - | Product cards grid |
| BlogSection | - | Blog cards grid |
| Footer | - | Multi-column footer |
| CartDrawer | `{ open: boolean, onClose: () => void }` | Shopping cart slide-out |
| ProductCard | `{ product: Product }` | Shop product card |
| BlogCard | `{ post: BlogPost }` | Blog post card |

### Type Definitions

```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  badges: ('featured' | 'sale')[];
}

interface BlogPost {
  id: string;
  title: string;
  image: string;
  tags: string[];
  author: {
    name: string;
    avatar: string;
  };
}
```

## 4. Animation Implementation Plan

| Interaction Name | Tech Choice | Implementation Logic |
|------------------|-------------|---------------------|
| Page Load | Framer Motion | `AnimatePresence` with staggered children |
| Navbar Scroll | React State + CSS | `useScroll` hook toggles `scrolled` class |
| Hero Content Reveal | Framer Motion | `staggerChildren: 0.1`, `y: 20 → 0`, `opacity: 0 → 1` |
| Hero Background | CSS | `scale: 1.05 → 1` on load, `transition: 1.5s` |
| Section Scroll Reveal | Framer Motion | `whileInView`, `viewport: { once: true, amount: 0.2 }` |
| Card Hover | Tailwind + Framer | `whileHover: { y: -4, scale: 1.02 }` |
| Image Hover Scale | CSS | `group-hover:scale-105` with `overflow-hidden` |
| Button Hover | Tailwind | `hover:scale-102 hover:shadow-lg transition-all` |
| Dropdown Open | Framer Motion | `animate: { opacity: 1, y: 0 }` from `y: -10` |
| Cart Drawer | Shadcn Sheet | Slide from right, overlay fade |
| Gallery Carousel | Framer Motion | `AnimatePresence` with slide direction |
| Link Hover | CSS | `transition-colors duration-200` |
| Parallax Background | Framer Motion | `useScroll` + `useTransform` for Y offset |

### Animation Timing Constants

```typescript
const ANIMATION = {
  duration: {
    fast: 0.2,
    normal: 0.3,
    slow: 0.6,
    hero: 0.8,
  },
  easing: {
    default: [0.25, 0.1, 0.25, 1],
    bounce: [0.68, -0.55, 0.265, 1.55],
  },
  stagger: {
    fast: 0.05,
    normal: 0.1,
    slow: 0.15,
  },
};
```

## 5. Project File Structure

```
src/
├── components/
│   ├── ui/                    # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── sheet.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── badge.tsx
│   │   └── card.tsx
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── CartDrawer.tsx
│   ├── sections/
│   │   ├── HeroSection.tsx
│   │   ├── AboutSection.tsx
│   │   ├── SelectionSection.tsx
│   │   ├── SustainableSection.tsx
│   │   ├── FarmSection.tsx
│   │   ├── GallerySection.tsx
│   │   ├── ShopSection.tsx
│   │   └── BlogSection.tsx
│   └── shared/
│       ├── SectionLabel.tsx
│       ├── ProductCard.tsx
│       └── BlogCard.tsx
├── hooks/
│   ├── useScrollPosition.ts
│   └── useCart.ts
├── lib/
│   ├── utils.ts
│   └── constants.ts
├── types/
│   └── index.ts
├── data/
│   └── content.ts
├── App.tsx
├── main.tsx
└── index.css
public/
├── images/
│   └── (all image assets)
└── fonts/
```

## 6. Package Installation List

```bash
# Already included in shadcn init
# - tailwindcss
# - postcss
# - autoprefixer
# - typescript
# - @types/react
# - @types/react-dom
# - vite
# - @vitejs/plugin-react

# Animation library
npm install framer-motion

# Icons (already included with shadcn)
# - lucide-react

# Fonts will be loaded via Google Fonts CDN in index.html
```

## 7. Responsive Breakpoints

| Breakpoint | Width | Layout Changes |
|------------|-------|----------------|
| Mobile | < 640px | Single column, hamburger menu, stacked sections |
| Tablet | 640-1024px | Two columns where applicable |
| Desktop | > 1024px | Full layout as designed |

## 8. Performance Considerations

1. **Images**: Use WebP format with fallbacks, lazy loading
2. **Animations**: Use `transform` and `opacity` only, add `will-change`
3. **Fonts**: Preload critical fonts, use `font-display: swap`
4. **Code Splitting**: Lazy load below-fold sections
5. **Reduced Motion**: Respect `prefers-reduced-motion` media query
