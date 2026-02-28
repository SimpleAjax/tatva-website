/**
 * Content & CMS Configuration
 * 
 * This file manages dynamic content like hero banners, reviews, and announcements.
 * In production, this could be replaced with a headless CMS like Strapi or Contentful.
 * 
 * For now, content is configured via environment variables or defaults.
 */

// Hero Banner Configuration
export interface HeroBannerConfig {
  enabled: boolean;
  title: string;
  subtitle: string;
  discountText: string;
  ctaText: string;
  ctaLink: string;
  theme: "valentine" | "default" | "festive" | "sale";
  backgroundImage?: string;
  startDate?: string;
  endDate?: string;
}

// Review Configuration
export interface ReviewConfig {
  enabled: boolean;
  allowGuestReviews: boolean;
  moderationEnabled: boolean;
  maxRating: number;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  product: string;
  productHandle?: string;
  date: string;
  verified: boolean;
  helpful: number;
  images?: string[];
}

// Announcement Bar Configuration
export interface AnnouncementConfig {
  enabled: boolean;
  text: string;
  link?: string;
  backgroundColor: string;
  textColor: string;
  startDate?: string;
  endDate?: string;
}

// Default Configurations
export const defaultHeroBanner: HeroBannerConfig = {
  enabled: process.env.NEXT_PUBLIC_HERO_ENABLED !== "false",
  title: process.env.NEXT_PUBLIC_HERO_TITLE || "Valentine Sale",
  subtitle: process.env.NEXT_PUBLIC_HERO_SUBTITLE || "Happy Valentine's Day",
  discountText: process.env.NEXT_PUBLIC_HERO_DISCOUNT || "25% OFF",
  ctaText: process.env.NEXT_PUBLIC_HERO_CTA || "Shop the Sale",
  ctaLink: process.env.NEXT_PUBLIC_HERO_LINK || "/category/new-arrivals",
  theme: (process.env.NEXT_PUBLIC_HERO_THEME as any) || "valentine",
  backgroundImage: process.env.NEXT_PUBLIC_HERO_IMAGE,
  startDate: process.env.NEXT_PUBLIC_HERO_START,
  endDate: process.env.NEXT_PUBLIC_HERO_END,
};

export const defaultReviewConfig: ReviewConfig = {
  enabled: process.env.NEXT_PUBLIC_REVIEWS_ENABLED !== "false",
  allowGuestReviews: process.env.NEXT_PUBLIC_REVIEWS_GUEST === "true",
  moderationEnabled: process.env.NEXT_PUBLIC_REVIEWS_MODERATION === "true",
  maxRating: 5,
};

export const defaultAnnouncement: AnnouncementConfig = {
  enabled: process.env.NEXT_PUBLIC_ANNOUNCEMENT_ENABLED !== "false",
  text: process.env.NEXT_PUBLIC_ANNOUNCEMENT_TEXT || "✨ Free Shipping on Orders Above ₹999",
  link: process.env.NEXT_PUBLIC_ANNOUNCEMENT_LINK,
  backgroundColor: process.env.NEXT_PUBLIC_ANNOUNCEMENT_BG || "bg-primary",
  textColor: process.env.NEXT_PUBLIC_ANNOUNCEMENT_COLOR || "text-white",
};

// Default Reviews Data (can be replaced with CMS data)
export const defaultReviews: Review[] = [
  {
    id: "1",
    name: "Ananya R.",
    rating: 5,
    text: "The quality of the jewelry is exceptional. I bought the Golden Aura Bracelet and it looks even better in person than in the photos! Highly recommend.",
    product: "Golden Aura Bracelet",
    productHandle: "golden-aura-bracelet",
    date: "Feb 12, 2026",
    verified: true,
    helpful: 24,
  },
  {
    id: "2",
    name: "Priya S.",
    rating: 5,
    text: "Tatva never disappoints. The packaging was beautiful and the delivery was so fast. The Celestial Star Earrings are my new favorites.",
    product: "Celestial Star Earrings",
    productHandle: "celestial-star-earrings",
    date: "Feb 10, 2026",
    verified: true,
    helpful: 18,
  },
  {
    id: "3",
    name: "Meera K.",
    rating: 4,
    text: "Elegant and affordable. I wear the Infinity Love Ring every day and it still looks brand new. Amazing craftsmanship.",
    product: "Infinity Love Ring",
    productHandle: "infinity-love-ring",
    date: "Feb 05, 2026",
    verified: true,
    helpful: 12,
  },
  {
    id: "4",
    name: "Shreya P.",
    rating: 5,
    text: "Bought the Bridal Kundan Set for my sister's wedding. It was absolutely stunning and received so many compliments! Worth every penny.",
    product: "Bridal Kundan Set",
    productHandle: "bridal-kundan-set",
    date: "Jan 28, 2026",
    verified: true,
    helpful: 32,
  },
  {
    id: "5",
    name: "Divya M.",
    rating: 5,
    text: "The Pearl Charm Bracelet is delicate and beautiful. Perfect for daily wear. Already planning my next purchase!",
    product: "Pearl Charm Bracelet",
    productHandle: "pearl-charm-bracelet",
    date: "Jan 20, 2026",
    verified: true,
    helpful: 15,
  },
];

// Helper functions
export function isHeroBannerActive(config: HeroBannerConfig = defaultHeroBanner): boolean {
  if (!config.enabled) return false;
  
  const now = new Date();
  
  if (config.startDate) {
    const start = new Date(config.startDate);
    if (now < start) return false;
  }
  
  if (config.endDate) {
    const end = new Date(config.endDate);
    if (now > end) return false;
  }
  
  return true;
}

export function isAnnouncementActive(config: AnnouncementConfig = defaultAnnouncement): boolean {
  if (!config.enabled) return false;
  
  const now = new Date();
  
  if (config.startDate) {
    const start = new Date(config.startDate);
    if (now < start) return false;
  }
  
  if (config.endDate) {
    const end = new Date(config.endDate);
    if (now > end) return false;
  }
  
  return true;
}

// Theme styles for hero banner
export const heroThemes = {
  valentine: {
    bg: "bg-[#FFF5F5]",
    text: "text-primary",
    accent: "text-primary",
    button: "bg-primary hover:bg-primary/90",
  },
  default: {
    bg: "bg-white",
    text: "text-primary",
    accent: "text-primary",
    button: "bg-primary hover:bg-primary/90",
  },
  festive: {
    bg: "bg-amber-50",
    text: "text-amber-800",
    accent: "text-amber-600",
    button: "bg-amber-600 hover:bg-amber-700",
  },
  sale: {
    bg: "bg-red-50",
    text: "text-red-800",
    accent: "text-red-600",
    button: "bg-red-600 hover:bg-red-700",
  },
};
