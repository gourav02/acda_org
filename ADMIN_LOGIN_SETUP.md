# Admin Login Page Setup

## Overview

Professional admin login page with NextAuth integration, matching the ACDA project's color theme and design system.

## Files Created

1. **`/app/admin/login/page.tsx`** - Admin login page (client component)
2. **`/app/admin/dashboard/page.tsx`** - Admin dashboard (server component)
3. **`/components/AdminDashboard.tsx`** - Dashboard UI component
4. **`/components/SessionProvider.tsx`** - NextAuth session provider wrapper
5. **`/app/layout.tsx`** - Updated with SessionProvider

## Features

### Login Page (`/admin/login`)

✅ **Client-side Component** - Uses `"use client"` directive
✅ **Form Validation** - Required fields with HTML5 validation
✅ **Loading State** - Shows spinner during authentication
✅ **Error Handling** - Displays error messages for invalid credentials
✅ **Redirect on Success** - Navigates to `/admin/dashboard` after login
✅ **Professional Design** - Matches project color theme (primary blue)
✅ **Centered Layout** - Full-screen centered form
✅ **Responsive** - Works on all screen sizes
✅ **Accessibility** - Proper labels, ARIA attributes, keyboard navigation
✅ **Icons** - Lucide React icons for visual appeal

### Dashboard Page (`/admin/dashboard`)

✅ **Server-side Authentication** - Checks session on server
✅ **Protected Route** - Redirects to login if not authenticated
✅ **Welcome Message** - Displays admin username
✅ **Sign Out Button** - Logout functionality
✅ **Quick Actions** - Placeholder cards for future features
✅ **Stats Section** - Placeholder for statistics

## Design System

### Color Theme

The login page uses the project's primary color theme:

- **Primary**: `#111184` (Dark Blue)
- **Primary Light**: `#1a1a9e`
- **Primary Lighter**: `#e8e8f5`
- **Background**: Gradient from `primary-50` to white

### Components Used

- **shadcn/ui Button** - Consistent button styling
- **shadcn/ui Input** - Form inputs
- **shadcn/ui Label** - Form labels
- **Lucide Icons** - Lock, User, AlertCircle, Loader2

### Layout

```
┌─────────────────────────────────────┐
│     Full Screen Background          │
│     (Gradient + Pattern)            │
│                                     │
│    ┌─────────────────────┐         │
│    │   Login Card        │         │
│    │   ┌─────────┐       │         │
│    │   │  Icon   │       │         │
│    │   └─────────┘       │         │
│    │   Admin Login       │         │
│    │                     │         │
│    │   [Username]        │         │
│    │   [Password]        │         │
│    │   [Sign In Button]  │         │
│    └─────────────────────┘         │
│                                     │
└─────────────────────────────────────┘
```

## Authentication Flow

### Login Process

```
1. User visits /admin/login
   ↓
2. Enters username and password
   ↓
3. Clicks "Sign In"
   ↓
4. Form calls signIn() from next-auth/react
   ↓
5. NextAuth validates credentials
   ↓
6. If valid:
   - Creates JWT token
   - Sets session cookie
   - Redirects to /admin/dashboard
   ↓
7. If invalid:
   - Returns error
   - Shows error message
   - User can retry
```

### Dashboard Access

```
1. User visits /admin/dashboard
   ↓
2. Server checks session with getServerSession()
   ↓
3. If authenticated:
   - Renders dashboard
   - Shows user info
   ↓
4. If not authenticated:
   - Redirects to /admin/login
```

## Usage

### Accessing the Login Page

```
http://localhost:3000/admin/login
```

### Login Credentials

Use the admin user you created:

```bash
# Create admin user first
npx tsx scripts/create-admin.ts admin myPassword123

# Then login with:
Username: admin
Password: myPassword123
```

### Testing Login

1. **Start dev server**:

   ```bash
   npm run dev
   ```

2. **Visit login page**:

   ```
   http://localhost:3000/admin/login
   ```

3. **Enter credentials**:
   - Username: `admin`
   - Password: `myPassword123`

4. **Click "Sign In"**

5. **Should redirect to**:
   ```
   http://localhost:3000/admin/dashboard
   ```

## Code Examples

### Login Form Submission

```typescript
const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  const result = await signIn("credentials", {
    username,
    password,
    redirect: false,
  });

  if (result?.error) {
    setError("Invalid username or password");
  } else if (result?.ok) {
    router.push("/admin/dashboard");
  }
};
```

### Protected Dashboard

```typescript
export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  return <AdminDashboard session={session} />;
}
```

### Sign Out

```typescript
const handleSignOut = async () => {
  await signOut({
    redirect: true,
    callbackUrl: "/",
  });
};
```

## SessionProvider Integration

### Why SessionProvider?

NextAuth requires a `SessionProvider` to make session data available to client components via the `useSession()` hook.

### Implementation

```typescript
// components/SessionProvider.tsx
"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

export default function SessionProvider({ children }) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
```

### Layout Integration

```typescript
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          {/* Your app content */}
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
```

## Styling Details

### Login Card

- **Width**: `max-w-md` (28rem)
- **Padding**: `p-8` on mobile, `p-10` on desktop
- **Border Radius**: `rounded-2xl`
- **Shadow**: `shadow-2xl`
- **Background**: White

### Form Fields

- **Icons**: Left-aligned with `pl-10` padding
- **Focus State**: Primary color ring
- **Disabled State**: Reduced opacity
- **Validation**: HTML5 required attribute

### Button

- **Full Width**: `w-full`
- **Size**: `lg`
- **Loading State**: Spinner icon + "Signing in..." text
- **Disabled**: When loading

### Error Message

- **Background**: Red-50
- **Border**: Red-200
- **Text**: Red-700
- **Icon**: AlertCircle
- **Animation**: Fade in + slide from top

## Responsive Design

### Mobile (< 640px)

- Full-width card with padding
- Stacked form fields
- Touch-friendly button size

### Tablet (640px - 1024px)

- Centered card
- Comfortable spacing
- Readable font sizes

### Desktop (> 1024px)

- Centered card
- Maximum width constraint
- Optimal reading width

## Accessibility

### Keyboard Navigation

- ✅ Tab through form fields
- ✅ Enter to submit
- ✅ Escape to clear (browser default)

### Screen Readers

- ✅ Proper label associations
- ✅ Error announcements
- ✅ Loading state announcements
- ✅ Button state changes

### ARIA Attributes

- `autoComplete="username"` on username field
- `autoComplete="current-password"` on password field
- `autoFocus` on username field
- `required` on both fields

## Security Features

### Client-Side

- ✅ No password stored in state longer than necessary
- ✅ Form cleared on error
- ✅ HTTPS enforced in production (NextAuth requirement)

### Server-Side

- ✅ Credentials validated against database
- ✅ Password hashed with bcrypt
- ✅ JWT tokens for sessions
- ✅ Secure cookie settings

## Error Handling

### Invalid Credentials

```
Error: "Invalid username or password"
```

**Causes**:

- Wrong username
- Wrong password
- User doesn't exist

### Network Error

```
Error: "An unexpected error occurred. Please try again."
```

**Causes**:

- Network connection lost
- Server not responding
- Database connection failed

### Session Expired

**Behavior**:

- Automatic redirect to login
- No error message (expected behavior)

## Customization

### Change Colors

Edit the classes in `/app/admin/login/page.tsx`:

```typescript
// Primary color
className = "bg-primary text-white";

// Background gradient
className = "bg-gradient-to-br from-primary-50 via-white to-primary-50";
```

### Change Redirect URL

```typescript
// After successful login
router.push("/admin/dashboard"); // Change this
```

### Change Session Duration

Edit `/app/api/auth/[...nextauth]/route.ts`:

```typescript
session: {
  strategy: "jwt",
  maxAge: 30 * 24 * 60 * 60, // Change this (currently 30 days)
}
```

## Troubleshooting

### Login Button Does Nothing

**Solutions**:

1. Check browser console for errors
2. Verify NEXTAUTH_SECRET is set
3. Ensure MongoDB is connected
4. Check admin user exists

### "Invalid username or password" Error

**Solutions**:

1. Verify username is correct (case-insensitive)
2. Check password is correct
3. Ensure admin user exists in database
4. Check MongoDB connection

### Redirect Not Working

**Solutions**:

1. Check NEXTAUTH_URL is set correctly
2. Verify `/admin/dashboard` page exists
3. Check browser console for errors
4. Clear browser cache and cookies

### Session Not Persisting

**Solutions**:

1. Check NEXTAUTH_SECRET is set
2. Verify cookies are enabled
3. Check NEXTAUTH_URL matches your domain
4. Clear browser cookies and retry

## Next Steps

After login is working:

1. **Add Protected Routes** - Create middleware to protect admin pages
2. **Build Upload Feature** - Photo upload functionality
3. **Add User Management** - Create/edit/delete admin users
4. **Add Activity Logs** - Track admin actions
5. **Add Dashboard Stats** - Real photo/event counts

## API Endpoints

| Endpoint            | Method | Description         |
| ------------------- | ------ | ------------------- |
| `/api/auth/signin`  | POST   | Sign in             |
| `/api/auth/signout` | POST   | Sign out            |
| `/api/auth/session` | GET    | Get current session |
| `/api/auth/csrf`    | GET    | Get CSRF token      |

## Environment Variables

Required for login to work:

```bash
# MongoDB
MONGODB_URI=mongodb+srv://...

# NextAuth
NEXTAUTH_SECRET=your_secret_here
NEXTAUTH_URL=http://localhost:3000
```

## Resources

- **NextAuth.js**: https://next-auth.js.org/
- **Credentials Provider**: https://next-auth.js.org/providers/credentials
- **Session Management**: https://next-auth.js.org/getting-started/client
- **shadcn/ui**: https://ui.shadcn.com/
