// ============================================
// ImageKit Integration Utility
// ============================================

const IMAGEKIT_URL_ENDPOINT = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/tatva';

export interface ImageKitTransformations {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
  crop?: 'maintain_ratio' | 'force' | 'at_max' | 'at_least';
  focus?: 'center' | 'top' | 'left' | 'bottom' | 'right' | 'top_left' | 'top_right' | 'bottom_left' | 'bottom_right';
  blur?: number;
  grayscale?: boolean;
}

/**
 * Build ImageKit URL with transformations
 * 
 * @param path - The file path in ImageKit (e.g., "/images/tatva-jewlary-image-1.jpg")
 * @param transformations - Image transformation options
 * @returns Full ImageKit URL with transformations
 */
export function getImageUrl(
  path: string,
  transformations: ImageKitTransformations = {}
): string {
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  // Build transformation string
  const transformParts: string[] = [];
  
  if (transformations.width) {
    transformParts.push(`w-${transformations.width}`);
  }
  if (transformations.height) {
    transformParts.push(`h-${transformations.height}`);
  }
  if (transformations.quality) {
    transformParts.push(`q-${transformations.quality}`);
  }
  if (transformations.format && transformations.format !== 'auto') {
    transformParts.push(`f-${transformations.format}`);
  }
  if (transformations.crop) {
    transformParts.push(`c-${transformations.crop}`);
  }
  if (transformations.focus) {
    transformParts.push(`fo-${transformations.focus}`);
  }
  if (transformations.blur) {
    transformParts.push(`bl-${transformations.blur}`);
  }
  if (transformations.grayscale) {
    transformParts.push('e-grayscale');
  }

  const transformString = transformParts.join(',');
  const queryString = transformString ? `?tr=${transformString}` : '';

  return `${IMAGEKIT_URL_ENDPOINT}${normalizedPath}${queryString}`;
}

/**
 * Get optimized image URL for product thumbnails (small circular images)
 */
export function getProductThumbnail(path: string): string {
  return getImageUrl(path, {
    width: 200,
    height: 200,
    quality: 80,
    format: 'webp',
    crop: 'at_max',
    focus: 'center',
  });
}

/**
 * Get optimized image URL for product cards
 */
export function getProductCardImage(path: string): string {
  return getImageUrl(path, {
    width: 600,
    height: 800,
    quality: 85,
    format: 'webp',
    crop: 'at_max',
  });
}

/**
 * Get optimized image URL for product detail page
 */
export function getProductDetailImage(path: string): string {
  return getImageUrl(path, {
    width: 1200,
    height: 1500,
    quality: 90,
    format: 'webp',
    crop: 'at_max',
  });
}

/**
 * Get video URL from ImageKit
 */
export function getVideoUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${IMAGEKIT_URL_ENDPOINT}${normalizedPath}`;
}

// ============================================
// Demo Data with Your Actual ImageKit Assets
// ============================================

// Images: tatva-jewlary-image-1.jpg to tatva-jewlary-image-30.jpg
// Videos: tatva-jewlary-video-1.mp4 to tatva-jewlary-video-5.mp4

export function getDemoImage(index: number): string {
  // Cycle through images 1-30
  const imageNum = ((index - 1) % 30) + 1;
  return `/images/tatva-jewlary-image-${imageNum}.jpg`;
}

export function getDemoVideo(index: number): string {
  // Cycle through videos 1-5
  const videoNum = ((index - 1) % 5) + 1;
  return `/videos/tatva-jewlary-video-${videoNum}.mp4`;
}

// Demo data for Best Sellers using your actual ImageKit files
export const bestSellersData = [
  {
    productName: "Golden Aura Bracelet",
    price: "₹1,299",
    originalPrice: "₹1,899",
    discount: "30%",
    likes: "2.4K",
    views: "15.2K",
    shares: "450",
    imagePath: getDemoImage(1),
    videoPath: getDemoVideo(1),
  },
  {
    productName: "Elegance Pearl Necklace",
    price: "₹2,499",
    originalPrice: "₹3,499",
    discount: "28%",
    likes: "1.8K",
    views: "12.1K",
    shares: "230",
    imagePath: getDemoImage(5),
    videoPath: getDemoVideo(2),
  },
  {
    productName: "Celestial Star Earrings",
    price: "₹999",
    originalPrice: "₹1,299",
    discount: "23%",
    likes: "3.2K",
    views: "22.5K",
    shares: "890",
    imagePath: getDemoImage(10),
    videoPath: getDemoVideo(3),
  },
  {
    productName: "Infinity Love Ring",
    price: "₹1,599",
    originalPrice: "₹2,199",
    discount: "27%",
    likes: "1.5K",
    views: "10.8K",
    shares: "120",
    imagePath: getDemoImage(15),
    videoPath: getDemoVideo(4),
  },
];

// Product categories with your images
export const categoryImages = {
  bracelets: getDemoImage(2),
  necklaces: getDemoImage(6),
  earrings: getDemoImage(11),
  rings: getDemoImage(16),
  wedding: getDemoImage(20),
  bestsellers: getDemoImage(25),
};
