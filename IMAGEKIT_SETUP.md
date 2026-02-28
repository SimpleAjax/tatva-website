# ImageKit Setup Guide for TATVA

## 1. Create ImageKit Account

1. Go to [ImageKit.io](https://imagekit.io) and sign up
2. Complete the onboarding process
3. Note down your **URL Endpoint**, **Public Key**, and **Private Key**

## 2. Configure Environment Variables

### Frontend (storefront/.env.local)

```env
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_imagekit_id
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
```

### Backend (backend/.env)

```env
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_imagekit_id
```

## 3. Upload Your Media Files

### Option A: Manual Upload via Dashboard

1. Go to [ImageKit Dashboard](https://imagekit.io/dashboard)
2. Click "Media Library"
3. Create folders:
   - `/products` - Product images
   - `/videos` - Product videos (Best Seller reels)
   - `/banners` - Hero banner images
4. Upload your files

### Option B: Upload via API (Recommended for bulk)

Use the provided upload API:

```typescript
// Example: Upload a file
const uploadFile = async (file: File) => {
  const base64 = await convertToBase64(file);
  
  const response = await fetch('/api/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      file: base64,
      fileName: file.name,
      folder: '/products',
    }),
  });
  
  const data = await response.json();
  return data.url; // ImageKit URL
};
```

## 4. Update Demo Data

After uploading files, update the paths in `storefront/src/app/page.tsx`:

```typescript
const bestSellersReels = [
  {
    productName: "Golden Aura Bracelet",
    videoPath: "/videos/your-actual-video.mp4",
    thumbnailPath: "/products/your-actual-thumbnail.jpg",
    // ... rest of the data
  },
];
```

## 5. Image Transformations

ImageKit automatically optimizes images. Use the utility functions:

```typescript
import { getImageUrl, getProductThumbnail, getProductCardImage } from '@/lib/imagekit';

// Basic transformation
const url = getImageUrl('/products/bracelet.jpg', {
  width: 800,
  height: 600,
  quality: 80,
  format: 'webp',
});

// Pre-configured transformations
const thumbnail = getProductThumbnail('/products/bracelet.jpg');
const cardImage = getProductCardImage('/products/bracelet.jpg');
```

## 6. Folder Structure Recommendations

```
/products/
  ├── bracelets/
  │   ├── golden-aura-1.jpg
  │   └── golden-aura-2.jpg
  ├── necklaces/
  ├── earrings/
  └── rings/

/videos/
  ├── best-sellers/
  │   ├── golden-aura-bracelet.mp4
  │   └── elegance-pearl-necklace.mp4
  └── promos/

/banners/
  ├── hero-banner-1.jpg
  ├── hero-banner-2.jpg
  └── sale-banner.jpg
```

## 7. Video Upload Guidelines

For Best Seller reels (9:16 aspect ratio):
- **Resolution**: 1080x1920 (vertical)
- **Format**: MP4 (H.264 codec)
- **Duration**: 10-30 seconds
- **File Size**: Under 100MB
- **Audio**: Optional, muted by default in UI

## 8. Free Tier Limits

- **20GB** Media storage
- **20GB** Video storage
- **Unlimited** transformations
- **Unlimited** CDN delivery
- No bandwidth limits!

## 9. Next Steps

1. Upload 4 product videos for Best Sellers section
2. Upload thumbnails for each video
3. Update `bestSellersReels` array with actual paths
4. Restart the frontend to see changes

## Troubleshooting

### Videos not playing
- Check video format (must be MP4)
- Verify video path in ImageKit
- Check browser console for errors

### Images not loading
- Verify URL Endpoint is correct
- Check file paths match exactly
- Ensure files are publicly accessible

### Upload API not working
- Verify Private Key is set in `.env.local`
- Check file size (under 100MB for videos)
- Check browser console for errors

## Support

- ImageKit Docs: https://docs.imagekit.io/
- ImageKit Support: support@imagekit.io
