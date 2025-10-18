# Hero Carousel Component

## Overview

A full-width, auto-playing image carousel component for the homepage hero section with overlay text and navigation controls.

## Features

- ✅ **Auto-play**: Automatically transitions every 5 seconds
- ✅ **Navigation dots**: Visual indicators for current slide
- ✅ **Arrow navigation**: Previous/Next buttons (desktop only)
- ✅ **Smooth transitions**: Seamless slide animations
- ✅ **Responsive design**: Adapts to mobile, tablet, and desktop
- ✅ **Overlay gradient**: Dark blue gradient for text readability
- ✅ **Accessible**: Proper ARIA labels and keyboard navigation

## Responsive Heights

- **Mobile**: 400px
- **Tablet (md)**: 500px
- **Desktop (lg)**: 600px

## Current Images

The carousel currently uses placeholder images from Unsplash:

1. Medical professionals providing diabetes care
2. Healthcare consultation and patient care
3. Modern medical facility and equipment
4. Diabetes awareness and community support

## Replacing with Cloudinary Images

To replace placeholder images with your Cloudinary images:

1. Upload your images to Cloudinary
2. Get the Cloudinary URLs for each image
3. Update the `carouselImages` array in `HeroCarousel.tsx`:

```typescript
const carouselImages = [
  {
    src: "https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/hero-1.jpg",
    alt: "Your image description",
  },
  // Add more images...
];
```

### Using Next Cloudinary Component (Recommended)

For better optimization, you can use the `CldImage` component:

```typescript
import { CldImage } from 'next-cloudinary';

// In the carousel item:
<CldImage
  src="your-public-id"
  alt={image.alt}
  fill
  priority={index === 0}
  className="object-cover"
  sizes="100vw"
/>
```

## Customization

### Change Auto-play Interval

Edit the `delay` value in the Autoplay plugin (line 35):

```typescript
Autoplay({ delay: 5000 }); // 5000ms = 5 seconds
```

### Change Overlay Colors

Modify the gradient overlay (line 67):

```typescript
<div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/50" />
```

### Update Text Content

Edit the overlay text (lines 71-76):

```typescript
<h1>Your Title Here</h1>
<p>Your subtitle here</p>
```

### Adjust Heights

Modify the height classes (line 61):

```typescript
<div className="relative h-[400px] w-full md:h-[500px] lg:h-[600px]">
```

## Dependencies

- `@/components/ui/carousel` - shadcn/ui Carousel component
- `embla-carousel-autoplay` - Auto-play plugin
- `next/image` - Next.js Image component

## Usage

```typescript
import HeroCarousel from "@/components/HeroCarousel";

export default function Page() {
  return <HeroCarousel />;
}
```

## Accessibility

- Navigation dots have descriptive `aria-label` attributes
- Images have proper `alt` text
- Keyboard navigation supported
- Screen reader friendly

## Performance

- First image uses `priority` loading for LCP optimization
- Subsequent images lazy load
- Uses Next.js Image component for automatic optimization
- Responsive images with `sizes="100vw"`
