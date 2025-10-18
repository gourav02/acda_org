# AnnouncementBar Component

## Overview

A dismissible, sticky announcement bar that displays important messages at the top of the page with localStorage persistence.

## Features

- ✅ **Sticky positioning**: Stays at the top of the page above the navbar
- ✅ **Dismissible**: Users can close the announcement
- ✅ **localStorage persistence**: Remembers dismissal for 24 hours (configurable)
- ✅ **Priority levels**: Three color schemes (info, warning, urgent)
- ✅ **Smooth animations**: Slide-down animation on page load
- ✅ **Responsive design**: Adapts text sizing for mobile/desktop
- ✅ **Accessible**: Proper ARIA labels and keyboard navigation

## Priority Levels

### Info (Default)

- **Color**: Teal/Accent (`bg-accent`)
- **Icon**: Info circle
- **Use case**: General announcements, events, updates

### Warning

- **Color**: Yellow (`bg-yellow-500`)
- **Icon**: Alert triangle
- **Use case**: Important notices, upcoming changes

### Urgent

- **Color**: Red (`bg-red-600`)
- **Icon**: Alert circle
- **Use case**: Critical alerts, emergency notices

## Props

| Prop              | Type                              | Default                    | Description                                        |
| ----------------- | --------------------------------- | -------------------------- | -------------------------------------------------- |
| `message`         | `string`                          | Required                   | The announcement message to display                |
| `priority`        | `"info" \| "warning" \| "urgent"` | `"info"`                   | Visual priority level                              |
| `storageKey`      | `string`                          | `"announcement-dismissed"` | localStorage key for dismissal tracking            |
| `dismissDuration` | `number`                          | `24`                       | Hours until announcement reappears after dismissal |

## Usage

### Basic Usage

```tsx
import AnnouncementBar from "@/components/AnnouncementBar";

<AnnouncementBar message="Next Health Camp: October 25th, 2025" />;
```

### With Priority

```tsx
// Info (default - teal)
<AnnouncementBar
  message="🏥 Next Health Camp: October 25th, 2025"
  priority="info"
/>

// Warning (yellow)
<AnnouncementBar
  message="⚠️ Clinic closed on Sunday for maintenance"
  priority="warning"
/>

// Urgent (red)
<AnnouncementBar
  message="🚨 Emergency services relocated to Building B"
  priority="urgent"
/>
```

### Custom Dismissal Duration

```tsx
<AnnouncementBar
  message="Special offer ends soon!"
  dismissDuration={48} // Reappears after 48 hours
/>
```

### Multiple Announcements

To show different announcements without conflicts, use unique storage keys:

```tsx
<AnnouncementBar
  message="Health Camp on Oct 25th"
  storageKey="health-camp-oct-2025"
/>

<AnnouncementBar
  message="New clinic hours starting Nov 1st"
  storageKey="clinic-hours-nov-2025"
/>
```

## Implementation in Layout

The component is added to `app/layout.tsx` above the Header:

```tsx
import AnnouncementBar from "@/components/AnnouncementBar";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen flex-col">
          <AnnouncementBar message="🏥 Next Health Camp: October 25th, 2025" priority="info" />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
```

## localStorage Behavior

### How Dismissal Works

1. User clicks the close button
2. Current time + `dismissDuration` hours is stored in localStorage
3. Component checks localStorage on mount
4. If current time < stored time, announcement stays hidden
5. If stored time has passed, announcement reappears

### Storage Key Format

```json
{
  "announcement-dismissed": "2025-10-17T12:00:00.000Z"
}
```

### Clearing Dismissal (for testing)

```javascript
// In browser console
localStorage.removeItem("announcement-dismissed");
// Then refresh the page
```

## Customization

### Change Colors

Edit the `priorityConfig` object in `AnnouncementBar.tsx`:

```typescript
const priorityConfig = {
  info: {
    bgColor: "bg-accent",
    textColor: "text-white",
    icon: Info,
    hoverColor: "hover:bg-accent/90",
  },
  // Add custom priority...
};
```

### Change Animation Duration

Modify the transition classes (line 86):

```typescript
className={cn(
  "transition-all duration-300", // Change 300 to desired ms
  // ...
)}
```

### Change Icon Size

Modify the icon classes (line 95):

```typescript
<Icon className="h-5 w-5 sm:h-6 sm:w-6" /> // Adjust sizes
```

## Accessibility

- Close button has `aria-label="Dismiss announcement"`
- Focus ring on close button for keyboard navigation
- Semantic HTML structure
- Screen reader friendly

## Responsive Design

- **Mobile**: Smaller text (text-sm) and icon (h-5 w-5)
- **Desktop**: Larger text (text-base) and icon (h-6 w-6)
- Flexible layout with proper spacing
- Touch-friendly close button

## Best Practices

1. **Keep messages concise**: One line is ideal
2. **Use emojis sparingly**: They add visual interest but don't overdo it
3. **Match priority to urgency**: Don't use "urgent" for routine announcements
4. **Update storage keys**: Use unique keys for different announcements
5. **Test dismissal**: Verify localStorage behavior works as expected

## Examples

### Event Announcement

```tsx
<AnnouncementBar
  message="🏥 Free Diabetes Screening - October 25th, 2025 at Community Center"
  priority="info"
  storageKey="health-camp-oct-2025"
/>
```

### Maintenance Notice

```tsx
<AnnouncementBar
  message="⚠️ Website maintenance scheduled for Sunday 2 AM - 4 AM"
  priority="warning"
  storageKey="maintenance-nov-2025"
  dismissDuration={72}
/>
```

### Emergency Alert

```tsx
<AnnouncementBar
  message="🚨 Emergency: All appointments rescheduled due to weather. Call for details."
  priority="urgent"
  storageKey="emergency-weather-alert"
  dismissDuration={12}
/>
```
