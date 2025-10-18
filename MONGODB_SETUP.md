# MongoDB Connection Setup

## Overview

This document explains the MongoDB connection setup for the ACDA project, including connection caching, error handling, and best practices.

## Files Created

### 1. `/lib/mongodb.ts`

Main MongoDB connection utility with caching.

### 2. `/global.d.ts`

TypeScript global type declarations for Mongoose caching.

### 3. `/lib/env.ts` (Updated)

Added MongoDB and NextAuth environment variable types.

### 4. `/app/api/test-db/route.ts`

Test endpoint to verify MongoDB connection.

## Architecture

### Connection Caching Pattern

The MongoDB connection uses a global caching pattern to prevent multiple connections in Next.js development mode:

```typescript
// Global cache structure
interface MongooseCache {
  conn: typeof mongoose | null; // Cached connection
  promise: Promise<typeof mongoose> | null; // Connection promise
}
```

### Why Caching?

In Next.js development mode:

- Hot Module Replacement (HMR) causes modules to reload
- Without caching, each reload creates a new MongoDB connection
- This leads to connection pool exhaustion
- Caching prevents this by reusing existing connections

## Usage

### Basic Connection

```typescript
import connectDB from "@/lib/mongodb";

// In API routes or server components
export async function GET() {
  try {
    await connectDB();
    // Your database operations here
  } catch (error) {
    console.error("Database error:", error);
  }
}
```

### Check Connection Status

```typescript
import { isConnected, getConnectionState } from "@/lib/mongodb";

// Check if connected
if (isConnected()) {
  console.log("Database is connected");
}

// Get detailed state
const state = getConnectionState();
// Returns: "connected" | "disconnected" | "connecting" | "disconnecting"
```

### Disconnect (Optional)

```typescript
import { disconnectDB } from "@/lib/mongodb";

// Useful for cleanup in serverless environments
await disconnectDB();
```

## Connection Configuration

### Mongoose Options

```typescript
const opts = {
  bufferCommands: false, // Disable buffering
  maxPoolSize: 10, // Max connections in pool
  serverSelectionTimeoutMS: 5000, // Timeout for server selection
  socketTimeoutMS: 45000, // Socket timeout
};
```

### Option Explanations

| Option                     | Value   | Purpose                                 |
| -------------------------- | ------- | --------------------------------------- |
| `bufferCommands`           | `false` | Fail fast instead of buffering commands |
| `maxPoolSize`              | `10`    | Maximum number of connections in pool   |
| `serverSelectionTimeoutMS` | `5000`  | 5 seconds to select a server            |
| `socketTimeoutMS`          | `45000` | 45 seconds before socket timeout        |

## Environment Variables

### Required Variable

```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
```

### Validation

The connection utility validates that `MONGODB_URI` is set:

```typescript
if (!process.env.MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}
```

## Connection States

Mongoose has 4 connection states:

| State         | Value | Description               |
| ------------- | ----- | ------------------------- |
| Disconnected  | `0`   | Not connected to MongoDB  |
| Connected     | `1`   | Successfully connected    |
| Connecting    | `2`   | Connection in progress    |
| Disconnecting | `3`   | Disconnection in progress |

## Testing the Connection

### Using the Test Endpoint

```bash
# Start your dev server
npm run dev

# Test the connection
curl http://localhost:3000/api/test-db
```

### Expected Response (Success)

```json
{
  "success": true,
  "message": "MongoDB connection test successful",
  "connection": {
    "initialState": "disconnected",
    "initiallyConnected": false,
    "finalState": "connected",
    "finallyConnected": true
  },
  "timestamp": "2025-10-16T10:00:00.000Z"
}
```

### Expected Response (Error)

```json
{
  "success": false,
  "error": "MongoDB connection failed",
  "message": "connect ECONNREFUSED",
  "details": "Please check your MONGODB_URI in .env.local and ensure MongoDB is accessible"
}
```

## Error Handling

### Common Errors

#### 1. Missing MONGODB_URI

```
Error: Please define the MONGODB_URI environment variable inside .env.local
```

**Solution**: Add `MONGODB_URI` to your `.env.local` file.

#### 2. Invalid Connection String

```
MongooseError: Invalid connection string
```

**Solution**: Check your connection string format:

```
mongodb+srv://username:password@cluster.mongodb.net/dbname
```

#### 3. Authentication Failed

```
MongoServerError: bad auth : Authentication failed
```

**Solutions**:

- Verify username and password
- Check user has correct permissions
- Ensure password is URL-encoded if it contains special characters

#### 4. Network Error

```
MongooseServerSelectionError: connect ECONNREFUSED
```

**Solutions**:

- Check internet connection
- Verify MongoDB Atlas IP whitelist (add `0.0.0.0/0` for development)
- Ensure MongoDB service is running (local)

#### 5. Timeout Error

```
MongooseServerSelectionError: Server selection timed out after 5000 ms
```

**Solutions**:

- Check network connectivity
- Verify cluster is active (MongoDB Atlas)
- Increase `serverSelectionTimeoutMS` if needed

## Best Practices

### ✅ DO:

1. **Always use the cached connection**

   ```typescript
   import connectDB from "@/lib/mongodb";
   await connectDB();
   ```

2. **Handle errors gracefully**

   ```typescript
   try {
     await connectDB();
   } catch (error) {
     console.error("DB Error:", error);
     return NextResponse.json({ error: "Database error" }, { status: 500 });
   }
   ```

3. **Check connection before operations**

   ```typescript
   if (!isConnected()) {
     await connectDB();
   }
   ```

4. **Use environment variables**
   ```typescript
   const uri = process.env.MONGODB_URI;
   ```

### ❌ DON'T:

1. **Don't create multiple connections**

   ```typescript
   // ❌ Bad
   mongoose.connect(uri);
   mongoose.connect(uri);

   // ✅ Good
   await connectDB();
   ```

2. **Don't hardcode connection strings**

   ```typescript
   // ❌ Bad
   mongoose.connect("mongodb://localhost:27017/mydb");

   // ✅ Good
   mongoose.connect(process.env.MONGODB_URI);
   ```

3. **Don't ignore errors**

   ```typescript
   // ❌ Bad
   connectDB();

   // ✅ Good
   try {
     await connectDB();
   } catch (error) {
     // Handle error
   }
   ```

## Performance Considerations

### Connection Pooling

- Default pool size: 10 connections
- Adjust based on your needs:
  - Low traffic: 5-10
  - Medium traffic: 10-20
  - High traffic: 20-50

### Connection Reuse

- First request: ~500ms (new connection)
- Subsequent requests: ~1ms (cached connection)
- Significant performance improvement

### Memory Usage

- Each connection: ~1-2MB
- Pool of 10: ~10-20MB
- Cached connection: Minimal overhead

## Development vs Production

### Development

```typescript
// Uses global caching
// Survives hot reloads
// Logs connection status
```

### Production

```typescript
// Single connection per instance
// No hot reloads
// Minimal logging
```

## Monitoring

### Connection Logs

The utility logs connection events:

```
✅ Using cached MongoDB connection
🔄 Creating new MongoDB connection...
✅ MongoDB connected successfully
❌ MongoDB connection error: [error details]
🔌 MongoDB disconnected
```

### Monitoring Connection Health

```typescript
import { isConnected, getConnectionState } from "@/lib/mongodb";

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    connected: isConnected(),
    state: getConnectionState(),
  });
}
```

## Integration with Models

### Example Model Usage

```typescript
// models/User.ts
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

// In API route
export async function GET() {
  await connectDB();
  const users = await User.find({});
  return NextResponse.json(users);
}
```

## Troubleshooting

### Issue: Multiple Connections in Development

**Symptom**: Logs show multiple "Creating new MongoDB connection" messages

**Solution**:

- Ensure you're using the cached `connectDB()` function
- Check that `global.mongoose` is properly set
- Restart dev server

### Issue: Connection Timeout

**Symptom**: `Server selection timed out after 5000 ms`

**Solutions**:

1. Check MongoDB Atlas IP whitelist
2. Verify network connectivity
3. Increase timeout in `mongodb.ts`:
   ```typescript
   serverSelectionTimeoutMS: 10000, // 10 seconds
   ```

### Issue: Too Many Connections

**Symptom**: `MongoError: too many connections`

**Solutions**:

1. Reduce `maxPoolSize`
2. Ensure connections are being reused
3. Check for connection leaks
4. Upgrade MongoDB plan (Atlas)

## Security

### ✅ Secure Practices:

1. **Use environment variables**
   - Never commit connection strings
   - Use `.env.local` for local development
   - Use platform secrets for production

2. **Restrict IP access**
   - Whitelist specific IPs in MongoDB Atlas
   - Use VPN for production access

3. **Use strong passwords**
   - Minimum 16 characters
   - Mix of letters, numbers, symbols
   - Rotate regularly

4. **Limit user permissions**
   - Create database-specific users
   - Grant minimum required permissions
   - Use read-only users where possible

### ❌ Avoid:

1. Committing `.env.local` to Git
2. Using weak passwords
3. Allowing all IPs (`0.0.0.0/0`) in production
4. Using admin credentials for application

## Next Steps

After setting up MongoDB connection:

1. **Create Models** - Define Mongoose schemas
2. **Create API Routes** - Build CRUD endpoints
3. **Add Validation** - Implement data validation
4. **Add Indexes** - Optimize queries
5. **Add Middleware** - Authentication, logging
6. **Add Tests** - Unit and integration tests

## Resources

- **Mongoose Docs**: https://mongoosejs.com/docs/
- **MongoDB Atlas**: https://www.mongodb.com/cloud/atlas
- **Next.js Database**: https://nextjs.org/docs/app/building-your-application/data-fetching
- **Connection Pooling**: https://mongoosejs.com/docs/connections.html#connection-pools

## Support

If you encounter issues:

1. Check this documentation
2. Verify environment variables
3. Test connection with `/api/test-db`
4. Check MongoDB Atlas dashboard
5. Review application logs
