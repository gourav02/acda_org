# Authentication & Database Models Setup

## Overview

Complete setup for NextAuth.js authentication with MongoDB and Mongoose models for the ACDA project.

## Files Created

### Database Models

1. **`/models/EventPhoto.ts`** - Event photo model with Cloudinary integration
2. **`/models/Admin.ts`** - Admin user model for authentication

### Authentication

3. **`/app/api/auth/[...nextauth]/route.ts`** - NextAuth configuration
4. **`/types/next-auth.d.ts`** - NextAuth TypeScript declarations

### Utilities

5. **`/scripts/create-admin.ts`** - CLI script to create admin users
6. **`/app/api/admin/create/route.ts`** - API endpoint to create admin users

## Database Models

### EventPhoto Model

Stores event photos with Cloudinary integration.

#### Schema

```typescript
{
  eventName: String,      // Required, max 200 chars
  year: Number,           // Required, 1900 to current year + 1
  imageUrl: String,       // Required, Cloudinary URL
  publicId: String,       // Required, unique, for Cloudinary deletion
  uploadedAt: Date,       // Default: current timestamp
  createdAt: Date,        // Auto-generated
  updatedAt: Date         // Auto-generated
}
```

#### Indexes

- `{ eventName: 1, year: -1 }` - Query by event and year
- `{ year: -1 }` - Query by year
- `{ uploadedAt: -1 }` - Query by upload date

#### Usage Example

```typescript
import connectDB from "@/lib/mongodb";
import EventPhoto from "@/models/EventPhoto";

// Create a photo
await connectDB();
const photo = await EventPhoto.create({
  eventName: "Health Camp 2025",
  year: 2025,
  imageUrl: "https://res.cloudinary.com/...",
  publicId: "acda/events/photo123",
});

// Find photos by event
const photos = await EventPhoto.find({ eventName: "Health Camp 2025" }).sort({ uploadedAt: -1 });

// Find photos by year
const yearPhotos = await EventPhoto.find({ year: 2025 }).sort({ uploadedAt: -1 });

// Delete a photo
await EventPhoto.findByIdAndDelete(photoId);
```

### Admin Model

Stores admin user credentials with bcrypt password hashing.

#### Schema

```typescript
{
  username: String,       // Required, unique, lowercase, 3-50 chars
  password: String,       // Required, bcrypt hash (60 chars)
  createdAt: Date,        // Auto-generated
  updatedAt: Date         // Auto-generated
}
```

#### Validation

- **Username**:
  - 3-50 characters
  - Lowercase
  - Only letters, numbers, underscores, hyphens
  - Unique
- **Password**:
  - Stored as bcrypt hash (60 characters)
  - Minimum 8 characters (before hashing)

#### Usage Example

```typescript
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import Admin from "@/models/Admin";

// Create an admin
await connectDB();
const hashedPassword = await bcrypt.hash("myPassword123", 10);
const admin = await Admin.create({
  username: "admin",
  password: hashedPassword,
});

// Find admin by username
const admin = await Admin.findOne({ username: "admin" });

// Verify password
const isValid = await bcrypt.compare("myPassword123", admin.password);
```

## NextAuth Configuration

### Features

- ✅ Credentials provider (username/password)
- ✅ MongoDB integration
- ✅ bcrypt password verification
- ✅ JWT session strategy
- ✅ Custom sign-in page
- ✅ 30-day session duration
- ✅ TypeScript support

### Authentication Flow

```
1. User enters credentials
   ↓
2. NextAuth calls authorize function
   ↓
3. Connect to MongoDB
   ↓
4. Find admin by username
   ↓
5. Verify password with bcrypt
   ↓
6. Return user object or throw error
   ↓
7. Create JWT token
   ↓
8. Store in session cookie
```

### Configuration Details

#### Provider: CredentialsProvider

```typescript
CredentialsProvider({
  name: "Credentials",
  credentials: {
    username: { label: "Username", type: "text" },
    password: { label: "Password", type: "password" },
  },
  async authorize(credentials) {
    // Authentication logic
  },
});
```

#### Custom Pages

```typescript
pages: {
  signIn: "/admin/login",      // Custom login page
  error: "/admin/login",        // Redirect errors to login
}
```

#### Session Strategy

```typescript
session: {
  strategy: "jwt",              // Use JWT (not database sessions)
  maxAge: 30 * 24 * 60 * 60,   // 30 days
}
```

#### Callbacks

```typescript
callbacks: {
  // Add user info to JWT
  async jwt({ token, user }) {
    if (user) {
      token.id = user.id;
      token.name = user.name;
    }
    return token;
  },

  // Add user info to session
  async session({ session, token }) {
    if (token && session.user) {
      session.user.id = token.id;
      session.user.name = token.name;
    }
    return session;
  },
}
```

## Creating Admin Users

### Method 1: Using CLI Script (Recommended)

```bash
# Install tsx (already installed)
npm install -D tsx

# Create admin user
npx tsx scripts/create-admin.ts <username> <password>

# Example
npx tsx scripts/create-admin.ts admin mySecurePassword123
```

**Output:**

```
🔄 Connecting to MongoDB...
🔐 Hashing password...
👤 Creating admin user...
✅ Admin user created successfully!
Username: admin
ID: 507f1f77bcf86cd799439011
```

### Method 2: Using API Endpoint

```bash
# Create admin via API
curl -X POST http://localhost:3000/api/admin/create \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"mySecurePassword123"}'
```

**Response:**

```json
{
  "success": true,
  "message": "Admin user created successfully",
  "admin": {
    "id": "507f1f77bcf86cd799439011",
    "username": "admin",
    "createdAt": "2025-10-16T10:30:00.000Z"
  }
}
```

### Method 3: Using API in Browser

Visit: `http://localhost:3000/api/admin/create`

Send POST request with body:

```json
{
  "username": "admin",
  "password": "mySecurePassword123"
}
```

## Using NextAuth in Your App

### Server-Side (API Routes)

```typescript
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: Request) {
  // Get session
  const session = await getServerSession(authOptions);

  // Check if authenticated
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Access user info
  console.log("User ID:", session.user.id);
  console.log("Username:", session.user.name);

  // Your protected logic here
}
```

### Server Components

```typescript
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div>
      <h1>Welcome, {session.user.name}!</h1>
    </div>
  );
}
```

### Client Components

```typescript
"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function Profile() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    return (
      <button onClick={() => signIn()}>
        Sign In
      </button>
    );
  }

  return (
    <div>
      <p>Signed in as {session?.user?.name}</p>
      <button onClick={() => signOut()}>
        Sign Out
      </button>
    </div>
  );
}
```

### Protecting Pages with Middleware

Create `/middleware.ts`:

```typescript
import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/admin/login",
  },
});

export const config = {
  matcher: ["/admin/:path*"],
};
```

## Session Management

### Sign In

```typescript
import { signIn } from "next-auth/react";

const result = await signIn("credentials", {
  username: "admin",
  password: "myPassword123",
  redirect: false,
});

if (result?.error) {
  console.error("Login failed:", result.error);
} else {
  console.log("Login successful!");
}
```

### Sign Out

```typescript
import { signOut } from "next-auth/react";

await signOut({
  redirect: true,
  callbackUrl: "/",
});
```

### Get Session

```typescript
import { useSession } from "next-auth/react";

const { data: session, status } = useSession();

// status: "loading" | "authenticated" | "unauthenticated"
```

## Security Best Practices

### ✅ DO:

1. **Use Strong Passwords**
   - Minimum 12 characters
   - Mix of uppercase, lowercase, numbers, symbols
   - Use password manager

2. **Secure NEXTAUTH_SECRET**

   ```bash
   # Generate strong secret
   openssl rand -base64 32
   ```

3. **Use HTTPS in Production**
   - NextAuth requires HTTPS in production
   - Use environment variable for NEXTAUTH_URL

4. **Limit Admin Accounts**
   - Create only necessary admin accounts
   - Use unique usernames
   - Rotate passwords regularly

5. **Disable Admin Creation in Production**
   - Remove or protect `/api/admin/create` endpoint
   - Use CLI script for admin creation

### ❌ DON'T:

1. Don't use weak passwords
2. Don't commit `.env.local` to Git
3. Don't share admin credentials
4. Don't use default usernames (admin, root, etc.)
5. Don't leave admin creation endpoint open in production

## Environment Variables Required

```bash
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/acda

# NextAuth
NEXTAUTH_SECRET=your_generated_secret_key_here
NEXTAUTH_URL=http://localhost:3000
```

## Testing Authentication

### 1. Create Admin User

```bash
npx tsx scripts/create-admin.ts admin myPassword123
```

### 2. Test Login (Manual)

Visit: `http://localhost:3000/admin/login` (once you create the login page)

### 3. Test Login (API)

```bash
curl -X POST http://localhost:3000/api/auth/callback/credentials \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"myPassword123"}'
```

### 4. Check Session

```typescript
// In any server component or API route
const session = await getServerSession(authOptions);
console.log(session);
```

## Troubleshooting

### Error: "Please define the MONGODB_URI environment variable"

**Solution**: Add `MONGODB_URI` to `.env.local`

### Error: "Please define the NEXTAUTH_SECRET environment variable"

**Solution**:

```bash
# Generate secret
openssl rand -base64 32

# Add to .env.local
NEXTAUTH_SECRET=your_generated_secret
```

### Error: "Invalid username or password"

**Solutions**:

- Verify username exists in database
- Check password is correct
- Ensure username is lowercase
- Check bcrypt hash is valid

### Error: "Admin user already exists"

**Solution**: Username is already taken, choose a different username

### Session Not Persisting

**Solutions**:

- Check NEXTAUTH_SECRET is set
- Verify cookies are enabled
- Check NEXTAUTH_URL matches your domain
- Clear browser cookies and try again

## Next Steps

1. **Create Login Page** - `/app/admin/login/page.tsx`
2. **Create Admin Dashboard** - `/app/admin/page.tsx`
3. **Add Protected Routes** - Use middleware
4. **Create Photo Upload** - Use EventPhoto model
5. **Add Role-Based Access** - Extend user model

## API Endpoints

| Endpoint            | Method | Description       |
| ------------------- | ------ | ----------------- |
| `/api/auth/signin`  | POST   | Sign in           |
| `/api/auth/signout` | POST   | Sign out          |
| `/api/auth/session` | GET    | Get session       |
| `/api/admin/create` | POST   | Create admin      |
| `/api/admin/create` | GET    | Check admin count |

## Resources

- **NextAuth.js**: https://next-auth.js.org/
- **Mongoose**: https://mongoosejs.com/
- **bcrypt**: https://github.com/kelektiv/node.bcrypt.js
- **JWT**: https://jwt.io/
