# Environment Variables Setup Guide

## Overview

This guide will help you set up all required environment variables for the ACDA project, including authentication, database, email, and image upload functionality.

## Required Environment Variables

### 1. MongoDB Configuration

#### MONGODB_URI

Your MongoDB connection string for database operations.

**How to get it:**

1. **Option A: MongoDB Atlas (Cloud - Recommended)**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up or log in
   - Create a new cluster (free tier available)
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password
   - Replace `<dbname>` with your database name (e.g., `acda`)

   Example:

   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/acda?retryWrites=true&w=majority
   ```

2. **Option B: Local MongoDB**
   ```
   MONGODB_URI=mongodb://localhost:27017/acda
   ```

### 2. NextAuth Configuration

#### NEXTAUTH_SECRET

A random secret key used to encrypt JWT tokens and session data.

**How to generate:**

```bash
# Option 1: Using OpenSSL
openssl rand -base64 32

# Option 2: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Option 3: Online generator
# Visit: https://generate-secret.vercel.app/32
```

Example:

```
NEXTAUTH_SECRET=your_generated_secret_key_here_32_characters_minimum
```

#### NEXTAUTH_URL

The base URL of your application.

**Values:**

- Development: `http://localhost:3000`
- Production: `https://yourdomain.com`

```
NEXTAUTH_URL=http://localhost:3000
```

### 3. Cloudinary Configuration

Cloudinary is used for image upload and management.

#### NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

Your Cloudinary cloud name (public).

#### CLOUDINARY_API_KEY

Your Cloudinary API key (private).

#### CLOUDINARY_API_SECRET

Your Cloudinary API secret (private).

**How to get them:**

1. Go to https://cloudinary.com
2. Sign up or log in
3. Go to Dashboard
4. Find your credentials:
   - **Cloud Name**: Displayed at the top
   - **API Key**: In the Account Details section
   - **API Secret**: Click "Reveal" to see it

Example:

```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123456
```

### 4. Resend Email Configuration

#### RESEND_API_KEY

Your Resend API key for sending emails.

**How to get it:**

1. Go to https://resend.com
2. Sign up or log in
3. Go to API Keys section
4. Click "Create API Key"
5. Copy the key (starts with `re_`)

Example:

```
RESEND_API_KEY=re_abc123def456ghi789jkl
```

#### ADMIN_EMAIL

The email address where form submissions will be sent.

Example:

```
ADMIN_EMAIL=admin@acdacon.org
```

### 5. Site Configuration

#### NEXT_PUBLIC_SITE_URL

The public URL of your site.

**Values:**

- Development: `http://localhost:3000`
- Production: `https://yourdomain.com`

```
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Complete .env.local Template

Create a `.env.local` file in the root of your project with these variables:

```bash
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/acda?retryWrites=true&w=majority

# NextAuth Configuration
NEXTAUTH_SECRET=your_generated_secret_key_here_32_characters_minimum
NEXTAUTH_URL=http://localhost:3000

# Cloudinary Configuration (for image handling)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123456

# Email Configuration (Resend for transactional emails)
RESEND_API_KEY=re_abc123def456ghi789jkl
ADMIN_EMAIL=admin@acdacon.org

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Setup Steps

### Step 1: Copy the Template

```bash
# Copy .env.example to .env.local
cp .env.example .env.local
```

### Step 2: Fill in the Values

Open `.env.local` and replace all placeholder values with your actual credentials.

### Step 3: Verify .gitignore

Ensure `.env.local` is in your `.gitignore` file (it should be by default):

```gitignore
# local env files
.env*.local
```

### Step 4: Restart Development Server

After updating environment variables, restart your dev server:

```bash
npm run dev
```

## Security Best Practices

### ✅ DO:

- Keep `.env.local` in `.gitignore`
- Use different values for development and production
- Rotate secrets regularly
- Use strong, random values for secrets
- Store production secrets in secure environment (Vercel, AWS, etc.)

### ❌ DON'T:

- Commit `.env.local` to version control
- Share secrets in chat/email
- Use the same secrets across environments
- Hardcode secrets in your code
- Use weak or predictable secrets

## Environment-Specific Configuration

### Development (.env.local)

```bash
MONGODB_URI=mongodb://localhost:27017/acda-dev
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Production (Vercel/Hosting Platform)

```bash
MONGODB_URI=mongodb+srv://prod-user:password@prod-cluster.mongodb.net/acda-prod
NEXTAUTH_URL=https://acdacon.org
NEXT_PUBLIC_SITE_URL=https://acdacon.org
```

## Troubleshooting

### MongoDB Connection Issues

**Error: "MongoServerError: bad auth"**

- Check username and password in connection string
- Ensure user has correct permissions
- Verify IP whitelist in MongoDB Atlas

**Error: "MongooseServerSelectionError"**

- Check network connectivity
- Verify connection string format
- Ensure MongoDB service is running (local)

### NextAuth Issues

**Error: "NEXTAUTH_SECRET is not set"**

- Ensure NEXTAUTH_SECRET is in .env.local
- Restart dev server after adding

**Error: "Invalid callback URL"**

- Check NEXTAUTH_URL matches your domain
- Ensure no trailing slash

### Cloudinary Issues

**Error: "Invalid cloud name"**

- Verify NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is correct
- Check for typos or extra spaces

**Error: "Invalid API credentials"**

- Verify API key and secret
- Ensure no spaces in credentials

### Resend Issues

**Error: "Invalid API key"**

- Check RESEND*API_KEY starts with `re*`
- Verify key is active in Resend dashboard

**Error: "Domain not verified"**

- Verify your domain in Resend
- Use test domain for development

## Verification Checklist

After setting up, verify each service:

- [ ] MongoDB connection successful
- [ ] NextAuth authentication working
- [ ] Cloudinary image upload working
- [ ] Resend email sending working
- [ ] All environment variables loaded

### Quick Test Commands

```bash
# Test MongoDB connection
node -e "require('mongoose').connect(process.env.MONGODB_URI).then(() => console.log('✅ MongoDB connected')).catch(err => console.error('❌ MongoDB error:', err))"

# Test environment variables are loaded
node -e "console.log('MONGODB_URI:', process.env.MONGODB_URI ? '✅ Set' : '❌ Not set')"
```

## Production Deployment

### Vercel

1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add all variables from .env.local
4. Set appropriate values for production
5. Redeploy

### Other Platforms

Refer to your hosting platform's documentation for setting environment variables:

- **Netlify**: Site settings > Environment variables
- **Railway**: Project settings > Variables
- **AWS**: Use AWS Systems Manager Parameter Store
- **DigitalOcean**: App settings > Environment variables

## Additional Resources

- **MongoDB Atlas**: https://www.mongodb.com/docs/atlas/
- **NextAuth.js**: https://next-auth.js.org/configuration/options
- **Cloudinary**: https://cloudinary.com/documentation
- **Resend**: https://resend.com/docs
- **Next.js Env Variables**: https://nextjs.org/docs/basic-features/environment-variables

## Support

If you encounter issues:

1. Check this guide thoroughly
2. Verify all credentials are correct
3. Check service dashboards for errors
4. Review application logs
5. Consult service-specific documentation
