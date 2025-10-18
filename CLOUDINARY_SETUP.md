# Cloudinary Setup Guide

## 📸 What is Cloudinary?

Cloudinary is a cloud-based image and video management service. It provides:

- Image upload and storage
- Automatic optimization
- Image transformations (resize, crop, etc.)
- CDN delivery (fast loading worldwide)
- Free tier: 25 GB storage, 25 GB bandwidth/month

---

## 🚀 Step-by-Step Setup

### Step 1: Create Cloudinary Account

1. Go to: https://cloudinary.com/users/register/free
2. Sign up with email or Google
3. Verify your email address
4. You'll be redirected to the dashboard

### Step 2: Get Your Credentials

After signing in, you'll see your **Dashboard**. You need these 3 values:

```
┌─────────────────────────────────────┐
│  Cloudinary Dashboard               │
├─────────────────────────────────────┤
│  Cloud Name: your-cloud-name        │
│  API Key: 123456789012345           │
│  API Secret: abcdefghijklmnop       │
└─────────────────────────────────────┘
```

**Where to find them:**

- Click on **"Dashboard"** in the left sidebar
- Look for **"Product Environment Credentials"** section
- You'll see:
  - **Cloud Name** (e.g., `dxyz123abc`)
  - **API Key** (e.g., `123456789012345`)
  - **API Secret** (click "Reveal" to see it)

### Step 3: Create Upload Preset

An upload preset defines how images should be handled when uploaded.

1. Go to **Settings** (gear icon in top right)
2. Click **Upload** tab in the left sidebar
3. Scroll down to **Upload presets**
4. Click **Add upload preset**
5. Configure:
   - **Preset name**: `acda-events` (or any name you like)
   - **Signing Mode**: Select **"Unsigned"** (allows uploads without authentication)
   - **Folder**: `acda/events` (optional, organizes your images)
   - **Use filename**: Toggle ON (keeps original filename)
   - **Unique filename**: Toggle ON (prevents overwriting)
   - **Overwrite**: Toggle OFF
6. Click **Save**

**Important:** Copy the **preset name** (e.g., `acda-events`)

### Step 4: Add to Environment Variables

Add these to your `.env.local` file:

```bash
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=acda-events
```

**Example:**

```bash
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dxyz123abc
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefGHIJKLmnopQRST
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=acda-events
```

**Note:**

- `NEXT_PUBLIC_` prefix makes the variable accessible in the browser
- Only use this prefix for non-sensitive data (Cloud Name, Upload Preset)
- Keep API Secret private (no `NEXT_PUBLIC_` prefix)

---

## 🔧 How Upload Works

### Upload Flow:

```
1. User selects image
   ↓
2. Frontend uploads to Cloudinary
   POST https://api.cloudinary.com/v1_1/{cloud_name}/image/upload
   ↓
3. Cloudinary processes image
   - Stores in cloud
   - Generates URL
   - Returns response
   ↓
4. Frontend receives response
   {
     secure_url: "https://res.cloudinary.com/...",
     public_id: "acda/events/photo123",
     width: 1920,
     height: 1080
   }
   ↓
5. Frontend saves to database
   POST /api/events/upload
   {
     eventName: "Health Camp 2024",
     year: 2024,
     imageUrl: "https://res.cloudinary.com/...",
     publicId: "acda/events/photo123"
   }
```

### Why Save public_id?

The `public_id` is needed to:

- Delete images from Cloudinary later
- Transform images (resize, crop, etc.)
- Generate different versions

---

## 📊 Cloudinary Dashboard Features

### Media Library

View all uploaded images:

1. Click **Media Library** in left sidebar
2. Browse your images
3. Click image to see details:
   - URL
   - Size
   - Dimensions
   - Transformations

### Transformations

Cloudinary can automatically transform images:

```javascript
// Original URL
https://res.cloudinary.com/demo/image/upload/sample.jpg

// Resized to 300x300
https://res.cloudinary.com/demo/image/upload/w_300,h_300,c_fill/sample.jpg

// Grayscale
https://res.cloudinary.com/demo/image/upload/e_grayscale/sample.jpg

// Multiple transformations
https://res.cloudinary.com/demo/image/upload/w_300,h_300,c_fill,e_grayscale/sample.jpg
```

### Usage Monitoring

Check your usage:

1. Go to **Dashboard**
2. See **Usage** section:
   - Storage used
   - Bandwidth used
   - Transformations used
   - Credits remaining

---

## 🎯 Free Tier Limits

| Resource            | Free Tier Limit |
| ------------------- | --------------- |
| **Storage**         | 25 GB           |
| **Bandwidth**       | 25 GB/month     |
| **Transformations** | 25,000/month    |
| **Video Storage**   | 1 GB            |
| **Video Bandwidth** | 1 GB/month      |

**For ACDA Project:**

- Assuming 2 MB per photo
- 25 GB = ~12,500 photos
- More than enough for your needs!

---

## 🔐 Security Best Practices

### 1. Use Unsigned Upload Preset

For public uploads (like your admin dashboard):

- Create unsigned preset
- No API secret needed in frontend
- Cloudinary validates the preset

### 2. Restrict Upload Preset

In Cloudinary settings:

1. Go to **Settings** → **Upload**
2. Edit your preset
3. Set restrictions:
   - **Max file size**: 10 MB
   - **Allowed formats**: jpg, png, jpeg, webp
   - **Max dimensions**: 4000x4000

### 3. Add Folder Organization

Organize uploads by folder:

```
acda/
  ├── events/
  │   ├── 2024/
  │   └── 2025/
  ├── team/
  └── gallery/
```

Set folder in upload preset or in upload request.

---

## 🧪 Testing Cloudinary

### Test Upload with cURL:

```bash
curl -X POST \
  https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload \
  -F "file=@/path/to/image.jpg" \
  -F "upload_preset=YOUR_PRESET_NAME"
```

**Expected Response:**

```json
{
  "public_id": "acda/events/abc123",
  "version": 1234567890,
  "signature": "...",
  "width": 1920,
  "height": 1080,
  "format": "jpg",
  "resource_type": "image",
  "created_at": "2024-01-01T00:00:00Z",
  "bytes": 234567,
  "type": "upload",
  "url": "http://res.cloudinary.com/...",
  "secure_url": "https://res.cloudinary.com/..."
}
```

---

## 📝 Environment Variables Summary

Your complete `.env.local` should have:

```bash
# MongoDB Configuration
MONGODB_URI=mongodb+srv://...

# NextAuth Configuration
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=acda-events

# Email Configuration
RESEND_API_KEY=...
ADMIN_EMAIL=gouravsuvo@gmail.com

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 🚀 Next Steps

After setup:

1. ✅ Create Cloudinary account
2. ✅ Get credentials
3. ✅ Create upload preset
4. ✅ Add to `.env.local`
5. ✅ Restart dev server
6. ✅ Test upload form

---

## 🆘 Troubleshooting

### Error: "Invalid upload preset"

**Solution:** Check that:

- Preset name matches exactly
- Preset is set to "Unsigned"
- Preset is saved and active

### Error: "Upload failed"

**Solution:** Check:

- Cloud name is correct
- File size is within limits
- File format is allowed
- Internet connection is working

### Error: "CORS error"

**Solution:**

- Cloudinary allows CORS by default
- Check browser console for details
- Verify upload URL is correct

---

## 📚 Resources

- **Cloudinary Docs**: https://cloudinary.com/documentation
- **Upload API**: https://cloudinary.com/documentation/image_upload_api_reference
- **Transformations**: https://cloudinary.com/documentation/image_transformations
- **Next.js Integration**: https://cloudinary.com/documentation/next_integration

---

**You're all set! Follow the steps above to configure Cloudinary for your ACDA project.** 🎉
