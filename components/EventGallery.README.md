# EventGallery Component (ACDACON)

## Overview

A professional event photo gallery with year filtering, responsive grid layout, lightbox functionality, and lazy loading for optimal performance.

## Features

- Year Filtering: Dropdown to filter events by year (2021-2025)
- Responsive Grid: 1 col (mobile), 2 cols (tablet), 3-4 cols (desktop)
- Lightbox View: Click any image to view in full-screen modal
- Lazy Loading: Images load as needed for better performance
- Load More: Pagination with "Load More" button
- Smooth Animations: Hover effects and transitions
- Event Information: Title, description, and year displayed
- Theme Consistent: Uses dark blue and white

## Component Structure

### Location

- Component: /components/EventGallery.tsx
- Page: /app/acdacon/page.tsx
- Route: /acdacon

### Navigation

Added to Header navigation as "ACDACON"

## Data Structure

Uses the Event interface from /types/index.ts

## Current Mock Data

### 2025 (2 events, 6 images)

- Annual Health Camp 2025 - 4 images
- World Diabetes Day Celebration 2025 - 2 images

### 2024 (2 events, 6 images)

- Community Outreach Program 2024 - 3 images
- Annual Health Checkup Drive 2024 - 3 images

### 2023 (1 event, 2 images)

- Diabetes Awareness Week 2023 - 2 images

### 2022 (1 event, 2 images)

- Medical Camp 2022 - 2 images

### 2021 (1 event, 2 images)

- Foundation Day 2021 - 2 images

Total: 7 events, 18 images

## Features Breakdown

### 1. Year Selector

- Uses shadcn/ui Select component
- Displays years from YEARS constant (2021-2025)
- Default: Current year
- Icon: Calendar icon
- Resets pagination when year changes

### 2. Image Grid

- Responsive columns:
  - Mobile: 1 column
  - Tablet: 2 columns
  - Desktop: 3 columns
  - Large Desktop: 4 columns
- Aspect ratio: 4:3
- Gap: 1rem between images

### 3. Image Cards

- Hover effects:
  - Lifts up 8px
  - Shadow intensifies
  - Image scales to 110%
  - Overlay appears with gradient
  - Event info slides up from bottom
- Loading: Lazy loading with Next.js Image
- Sizes: Responsive sizes attribute

### 4. Lightbox (Dialog)

- Uses shadcn/ui Dialog component
- Full-screen modal view
- Shows event title and description
- Image displayed with object-contain
- Close button and backdrop click to dismiss

### 5. Load More

- Shows 6 images initially
- Loads 6 more on each click
- Button disappears when all images shown
- Smooth transition

## Customization

### Change Images Per Page

Edit IMAGES_PER_PAGE constant:

```typescript
const IMAGES_PER_PAGE = 6; // Change to 8, 12, etc.
```

### Update Grid Columns

Modify grid classes in the component:

```typescript
// Current: 1, 2, 3, 4 columns
className = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

// For 2, 3, 4 columns:
className = "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
```

### Change Aspect Ratio

Modify aspect ratio class:

```typescript
// Current: 4:3
className = "relative aspect-[4/3]";

// For 16:9:
className = "relative aspect-video";

// For square:
className = "relative aspect-square";
```

### Add More Years

Update YEARS in /lib/constants.ts:

```typescript
export const YEARS = [2021, 2022, 2023, 2024, 2025, 2026] as const;
```

## Replacing Mock Data

### Option 1: Static Data

Replace mockEvents array in EventGallery.tsx:

```typescript
const mockEvents: Event[] = [
  {
    id: "unique-id",
    title: "Your Event Title",
    year: 2025,
    description: "Event description",
    images: ["/images/events/event1-1.jpg", "/images/events/event1-2.jpg"],
  },
];
```

### Option 2: Fetch from API

```typescript
const [events, setEvents] = useState<Event[]>([]);

useEffect(() => {
  fetch("/api/events")
    .then((res) => res.json())
    .then((data) => setEvents(data));
}, []);
```

### Option 3: Use CMS (Contentful, Sanity, etc.)

```typescript
import { getEvents } from "@/lib/cms";

const events = await getEvents();
```

### Option 4: Cloudinary

Store images in Cloudinary and reference by public ID:

```typescript
images: ["https://res.cloudinary.com/YOUR_CLOUD/image/upload/v1/events/event1.jpg"];
```

## Image Requirements

### Specifications

- Format: JPG, PNG, or WebP
- Dimensions: Minimum 800x600px (4:3 ratio)
- File Size: Under 500KB recommended
- Quality: High resolution for zoom/lightbox

### Best Practices

- Use consistent aspect ratios
- Optimize images before upload
- Use descriptive filenames
- Consider WebP format for better compression

## Performance Optimization

### Implemented

- Next.js Image component with automatic optimization
- Lazy loading (loading="lazy")
- Responsive images with sizes attribute
- Pagination to limit initial load
- CSS transforms for smooth animations

### Additional Optimizations

- Consider image CDN (Cloudinary, Imgix)
- Implement blur placeholders
- Use WebP format with fallbacks
- Compress images before upload

## Responsive Behavior

### Mobile (< 640px)

- 1 column grid
- Full-width images
- Touch-friendly spacing
- Simplified hover effects

### Tablet (640px - 1024px)

- 2 column grid
- Medium image sizes
- Balanced spacing

### Desktop (> 1024px)

- 3-4 column grid
- Optimal image proportions
- Full hover effects
- Maximum visual impact

## Accessibility

- Semantic HTML structure
- Alt text for all images
- Keyboard navigation in lightbox
- Focus management in dialog
- ARIA labels where needed
- Sufficient color contrast

## SEO Considerations

- Page metadata in acdacon/page.tsx
- Descriptive alt text for images
- Semantic heading structure
- Meaningful event descriptions

## Integration with Backend

### API Endpoint Structure

```typescript
// GET /api/events?year=2025
{
  "events": [
    {
      "id": "1",
      "title": "Event Title",
      "year": 2025,
      "description": "Description",
      "images": ["url1", "url2"]
    }
  ]
}
```

### Database Schema

```sql
CREATE TABLE events (
  id VARCHAR PRIMARY KEY,
  title VARCHAR NOT NULL,
  year INT NOT NULL,
  description TEXT,
  created_at TIMESTAMP
);

CREATE TABLE event_images (
  id VARCHAR PRIMARY KEY,
  event_id VARCHAR REFERENCES events(id),
  image_url VARCHAR NOT NULL,
  order_index INT
);
```

## Future Enhancements

Potential improvements:

1. Image upload functionality for admins
2. Search/filter by event name
3. Share functionality for individual images
4. Download option for images
5. Image captions and metadata
6. Slideshow mode in lightbox
7. Navigation arrows in lightbox
8. Infinite scroll instead of "Load More"
9. Image tags/categories
10. Social media integration

## Troubleshooting

### Images Not Loading

- Check image URLs are correct
- Verify domain in next.config.mjs
- Check network tab for errors
- Ensure images are accessible

### Layout Issues

- Verify Tailwind classes
- Check responsive breakpoints
- Test in different browsers
- Clear Next.js cache

### Performance Issues

- Optimize image sizes
- Reduce images per page
- Implement virtual scrolling
- Use image CDN

### Dialog Not Opening

- Check Dialog component import
- Verify state management
- Check for console errors
- Test click handlers
