# DirectorMessages Component

## Overview

A professional, card-based section displaying inspirational messages from the organization's managing directors with photos, designations, and quotes.

## Features

- ✅ **Responsive Grid**: 1 column (mobile), 2 columns (tablet), 3 columns (desktop)
- ✅ **Circular Avatars**: Professional director photos with border styling
- ✅ **Decorative Elements**: Quote icons for visual interest
- ✅ **Hover Effects**: Cards lift and shadow intensifies on hover
- ✅ **Background Pattern**: Subtle SVG pattern with gradient
- ✅ **Professional Design**: Clean, modern layout with proper spacing
- ✅ **Theme Consistent**: Uses dark blue (#111184) and white color scheme

## Design Elements

### Card Features

- **Circular Avatar**: 128px diameter with 4px border
- **Quote Icons**: Large decorative quote in background, small quote before text
- **Hover Animation**: -8px lift with enhanced shadow
- **Bottom Accent**: Gradient line appears on hover
- **Shadow**: Soft shadow that intensifies on hover

### Background

- **Gradient**: From primary-50 via white to primary-50
- **Pattern**: Subtle cross pattern at 3% opacity
- **Color**: Matches the dark blue (#111184) theme

## Data Structure

The component uses the `DirectorMessage` interface from `/types/index.ts`:

```typescript
interface DirectorMessage {
  name: string;
  position: string;
  message: string;
  image: string;
}
```

## Current Directors

### 1. Dr. Rajesh Kumar

- **Position**: Managing Director & Chief Diabetologist
- **Message**: Focus on comprehensive care and community empowerment
- **Image**: Professional medical photo

### 2. Dr. Priya Sharma

- **Position**: Medical Director & Endocrinologist
- **Message**: Emphasis on prevention and education
- **Image**: Professional medical photo

### 3. Dr. Amit Banerjee

- **Position**: Director of Community Outreach
- **Message**: Commitment to personalized care and accessibility
- **Image**: Professional medical photo

## Customization

### Adding/Removing Directors

Edit the `directors` array in `DirectorMessages.tsx`:

```typescript
const directors: DirectorMessage[] = [
  {
    name: "Dr. Your Name",
    position: "Your Position",
    message: "Your inspirational message here...",
    image: "https://your-image-url.com/photo.jpg",
  },
  // Add more directors...
];
```

### Changing Grid Layout

Modify the grid classes (line 60):

```typescript
// Current: 1 col mobile, 2 col tablet, 3 col desktop
className = "grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3";

// For 2 directors (2 columns max):
className = "grid grid-cols-1 gap-8 md:grid-cols-2";

// For 4 directors (4 columns):
className = "grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4";
```

### Updating Colors

The component uses Tailwind classes that reference the theme:

- **Primary Blue**: `text-primary-800`, `bg-primary-50`, `border-primary-100`
- **Accent**: `from-primary via-accent to-primary`
- **Text**: `text-gray-600`, `text-gray-700`

### Changing Avatar Size

Modify the avatar container (line 73):

```typescript
// Current: 128px (h-32 w-32)
className = "relative h-32 w-32";

// Larger: 160px
className = "relative h-40 w-40";

// Smaller: 96px
className = "relative h-24 w-24";
```

### Adjusting Card Hover Effect

Modify the hover transform (line 64):

```typescript
// Current: -8px lift
className = "hover:-translate-y-2";

// More lift: -12px
className = "hover:-translate-y-3";

// Less lift: -4px
className = "hover:-translate-y-1";
```

## Replacing Placeholder Images

### Option 1: Using Cloudinary

```typescript
const directors: DirectorMessage[] = [
  {
    name: "Dr. Name",
    position: "Position",
    message: "Message...",
    image: "https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/director-1.jpg",
  },
];
```

### Option 2: Using Local Images

1. Place images in `/public/images/directors/`
2. Update the image paths:

```typescript
image: "/images/directors/dr-rajesh-kumar.jpg";
```

### Option 3: Using Next Cloudinary

```typescript
import { CldImage } from 'next-cloudinary';

// Replace the Image component with:
<CldImage
  src="director-photo-public-id"
  alt={director.name}
  fill
  className="object-cover"
  sizes="128px"
/>
```

## Image Requirements

### Specifications

- **Format**: JPG, PNG, or WebP
- **Dimensions**: Minimum 400x400px (square)
- **File Size**: Under 500KB recommended
- **Aspect Ratio**: 1:1 (square) for best results

### Best Practices

- Use professional headshots
- Ensure good lighting and clear face visibility
- Neutral or professional background
- High resolution for retina displays

## Responsive Behavior

### Mobile (< 768px)

- 1 column layout
- Full-width cards
- Smaller text sizes
- Touch-friendly spacing

### Tablet (768px - 1024px)

- 2 column layout
- Medium card sizes
- Balanced spacing

### Desktop (> 1024px)

- 3 column layout
- Optimal card proportions
- Maximum visual impact

## Accessibility

- ✅ Semantic HTML structure
- ✅ Proper heading hierarchy (h2, h3)
- ✅ Alt text for images
- ✅ Sufficient color contrast
- ✅ Keyboard navigation support
- ✅ Screen reader friendly

## Performance

- ✅ Next.js Image component for optimization
- ✅ Lazy loading for images
- ✅ Optimized SVG background pattern
- ✅ CSS transforms for smooth animations
- ✅ Minimal JavaScript overhead

## Integration

The component is added to the home page in `/app/page.tsx`:

```typescript
import DirectorMessages from "@/components/DirectorMessages";

export default function Home() {
  return (
    <div>
      <HeroCarousel />
      <DirectorMessages />
      {/* Other sections... */}
    </div>
  );
}
```

## SEO Considerations

- Descriptive section heading
- Meaningful alt text for images
- Semantic HTML structure
- Proper content hierarchy

## Future Enhancements

Potential improvements:

1. Add social media links for each director
2. Include email or contact information
3. Add "Read More" functionality for longer messages
4. Implement a modal for full biography
5. Add video messages option
6. Include professional certifications/credentials
7. Add animation on scroll (AOS library)

## Troubleshooting

### Images Not Loading

- Check image URLs are correct and accessible
- Verify domain is added to `next.config.mjs`
- Ensure images are properly sized

### Layout Issues

- Verify Tailwind classes are correct
- Check responsive breakpoints
- Ensure parent container has proper width

### Hover Effects Not Working

- Check CSS transitions are enabled
- Verify group classes are applied correctly
- Test in different browsers
