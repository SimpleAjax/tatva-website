# Tatva E-Commerce Architecture Guide

> **Understanding Homepage Content, Data Models, Query Patterns & Medusa Integration**
> 
> This document clarifies how to structure your jewelry e-commerce store's content, what entities to maintain, and how Medusa supports (or doesn't support) various features.

---

## Table of Contents

1. [Homepage Content Layers](#1-homepage-content-layers)
2. [Storage & Query Patterns](#2-storage--query-patterns)
3. [Data Models & Entities](#3-data-models--entities)
4. [Query Patterns by Context](#4-query-patterns-by-context)
5. [Medusa Native vs Custom Features](#5-medusa-native-vs-custom-features)
6. [Recommended Architecture](#6-recommended-architecture)
7. [Implementation Roadmap](#7-implementation-roadmap)
8. [Quick Reference: Categories vs Collections](#8-quick-reference-categories-vs-collections)

---

## 1. Homepage Content Layers

Your homepage consists of four distinct content types, each with different data sources and update frequencies:

```
┌─────────────────────────────────────────────────────────────────┐
│                    HOMEPAGE CONTENT LAYERS                       │
├─────────────────────────────────────────────────────────────────┤
│  1. STATIC CONTENT (Hardcoded/Marketing)                        │
│     ├── Hero Banner (promotional, time-bound)                   │
│     ├── Announcement Bar (shipping, offers)                     │
│     └── Info Bar (trust signals: "Free Returns", etc.)          │
├─────────────────────────────────────────────────────────────────┤
│  2. NAVIGATION CONTENT (Helps users find products)              │
│     ├── Category Circles (Rings, Earrings, etc.)               │
│     ├── Collections (Wedding Edit, Daily Wear)                  │
│     └── Shop by Occasion (Diwali, Valentine's)                  │
├─────────────────────────────────────────────────────────────────┤
│  3. DYNAMIC PRODUCT DISPLAYS (Auto-populated from catalog)      │
│     ├── New Arrivals (products with recent created_at)          │
│     ├── Best Sellers (products with high sales count)           │
│     ├── Under ₹999 (price filter)                               │
│     └── Trending/Recommended (algorithm-driven)                 │
├─────────────────────────────────────────────────────────────────┤
│  4. USER-GENERATED / SOCIAL PROOF                               │
│     ├── Reviews/Testimonials                                    │
│     ├── Instagram/UGC feeds                                     │
│     └── "Shop the Look" (styled product groupings)              │
└─────────────────────────────────────────────────────────────────┘
```

### Content Type Characteristics

| Layer | Update Frequency | Data Source | Managed By |
|-------|-----------------|-------------|------------|
| Static Content | Daily/Weekly | Config/CMS | Marketing Team |
| Navigation Content | Monthly | Medusa Categories/Collections | Merchandising Team |
| Dynamic Product Displays | Real-time | Medusa Products | Auto-populated |
| User-Generated Content | Real-time | Custom Database | Customers + Moderation |

---

## 2. Storage & Query Patterns

### Content Type Reference Table

| Content Type | Storage | Medusa Support | Query Pattern |
|-------------|---------|----------------|---------------|
| **Hero Banner** | Config file / CMS / Database | ❌ Custom needed | `GET /store/homepage/hero` |
| **Category Circles** | Categories table | ✅ Native | `GET /store/product-categories` |
| **Collections** | Collections table | ✅ Native | `GET /store/collections` |
| **New Arrivals** | Products + filter | ✅ Native | `GET /store/products?order-by=created_at` |
| **Best Sellers** | Products + sales data | ⚠️ Partial | Custom query on order data |
| **Price-based (Under ₹999)** | Products + variant prices | ✅ Native | `GET /store/products` + frontend filter |
| **Reviews** | Custom table / external | ❌ Custom needed | Custom API |
| **Shop the Look** | Custom "Look" entity | ❌ Custom needed | Custom API |
| **Announcement Bar** | Config file / CMS | ❌ Custom needed | Config read |

### Query Complexity Analysis

```
SIMPLE (Medusa Native)
├── Get all categories
├── Get products by category ID
├── Get products by collection ID
├── Get product by handle
└── Get cart by ID

MODERATE (Medusa + Custom Logic)
├── Get "New Arrivals" → Native, but needs sorting
├── Get "Under ₹999" → Native products, filter by variant price
├── Get related products → Same category/collection
└── Search products → Native text search

COMPLEX (Custom Implementation Required)
├── Get "Best Sellers" → Aggregate order line items
├── Get personalized recommendations → Algorithm needed
├── Get trending products → Time-series analysis
└── Get "Complete the Look" → Product associations
```

---

## 3. Data Models & Entities

### 3.1 Medusa Native Entities (Use These!)

These entities already exist in Medusa and should be your primary data store:

```typescript
// ============================================
// PRODUCT - Core entity for all jewelry items
// ============================================
interface Product {
  id: string;
  title: string;              // "Golden Aura Bracelet"
  handle: string;             // "golden-aura-bracelet" (URL-friendly)
  description: string;        // HTML or plain text
  thumbnail: string;          // Primary image URL
  images: ProductImage[];     // Gallery images
  variants: ProductVariant[]; // Size, color combinations
  options: ProductOption[];   // Size, Metal Type, etc.
  categories: Category[];     // Navigation structure
  collection: Collection;     // Marketing groupings
  tags: string[];             // ["gift", "personalized", "bridal"]
  metadata: Record<string, any>; // Custom fields
  created_at: Date;           // For "New Arrivals"
  updated_at: Date;
  status: 'draft' | 'proposed' | 'published' | 'rejected';
}

// ============================================
// PRODUCT VARIANT - Specific SKUs
// ============================================
interface ProductVariant {
  id: string;
  title: string;              // "Size M - Gold"
  sku: string;                // "TAT-BRC-001-M-G"
  barcode: string;
  prices: MoneyAmount[];      // INR pricing
  options: ProductOptionValue[]; // Size: M, Color: Gold
  inventory_quantity: number;
  manage_inventory: boolean;
  allow_backorder: boolean;
}

interface MoneyAmount {
  currency_code: string;      // "inr"
  amount: number;             // 129900 (in paise - ₹1,299)
}

// ============================================
// CATEGORY - Navigation structure (your circles)
// ============================================
interface Category {
  id: string;
  name: string;               // "Rings"
  handle: string;             // "rings"
  description: string;
  parent_category_id: string | null;  // For nested: Jewelry → Rings → Engagement
  category_children: Category[];
  metadata: {
    icon?: string;            // "💍" or image URL
    display_order?: number;   // Sort order in circles
    is_featured?: boolean;    // Show in circles?
  };
}

// ============================================
// COLLECTION - Marketing/thematic groupings
// ============================================
interface Collection {
  id: string;
  title: string;              // "Wedding Edit"
  handle: string;             // "wedding-edit"
  description: string;
  metadata: {
    banner_image?: string;
    theme_color?: string;
    display_order?: number;
  };
}
```

### 3.2 Custom Entities (You Need to Build These)

These entities extend Medusa for jewelry-specific features:

```typescript
// ============================================
// HOMEPAGE SECTION - CMS for homepage layout
// ============================================
interface HomepageSection {
  id: string;
  
  // Basic info
  type: 'hero' | 'product_grid' | 'banner' | 'collection_grid' | 
        'testimonials' | 'instagram' | 'shop_the_look';
  name: string;               // Internal name: "valentine_hero_2026"
  title: string;              // Display title: "Valentine Sale"
  subtitle: string;
  
  // Positioning
  display_order: number;      // 0 = first, 1 = second, etc.
  is_active: boolean;
  
  // Content source for product grids
  source_type: 'category' | 'collection' | 'custom_filter' | 'manual' | 'algorithm';
  source_id: string;          // Category ID, Collection ID, or special key
  // Special keys: 'new_arrivals', 'bestsellers', 'trending', 'under_999'
  
  // For manual product selection
  manual_product_ids: string[];
  
  // For banners/hero
  image_url: string;
  mobile_image_url: string;
  cta_text: string;
  cta_link: string;
  
  // Scheduling
  start_date: Date;
  end_date: Date;
  
  // Styling
  theme: 'default' | 'valentine' | 'festive' | 'sale' | 'minimal';
  background_color: string;
  text_color: string;
  
  // Layout options
  layout: 'grid_4' | 'grid_3' | 'horizontal_scroll' | 'full_width';
  show_view_all: boolean;
  view_all_link: string;
}

// ============================================
// SHOP THE LOOK - Styled product groupings
// ============================================
interface ShopTheLook {
  id: string;
  name: string;               // "Bridal Elegance"
  description: string;
  
  // Main image (model wearing the look)
  main_image: string;
  mobile_image: string;
  
  // Product pins on image
  pins: {
    id: string;
    product_id: string;
    position_x: number;       // Percentage 0-100 from left
    position_y: number;       // Percentage 0-100 from top
    label: string;            // "Earrings", "Necklace"
  }[];
  
  // Associated products (for "Get the Look" section)
  products: string[];         // Product IDs
  
  // Tags for filtering
  tags: string[];             // ["bridal", "gold", "traditional"]
  
  is_active: boolean;
  display_order: number;
}

// ============================================
// REVIEW - Customer product reviews
// ============================================
interface Review {
  id: string;
  product_id: string;
  customer_id: string | null; // Null for guest reviews
  
  // Review content
  rating: number;             // 1-5 stars
  title: string;
  content: string;
  images: string[];           // Customer photos
  
  // Verification
  is_verified_purchase: boolean;  // Did they buy it?
  order_id: string | null;
  
  // Moderation
  status: 'pending' | 'approved' | 'rejected';
  moderation_notes: string;
  moderated_by: string;
  moderated_at: Date;
  
  // Engagement
  helpful_count: number;
  not_helpful_count: number;
  
  // Metadata
  created_at: Date;
  updated_at: Date;
}

// ============================================
// PRODUCT VIEW STATS - For "Trending" and analytics
// ============================================
interface ProductViewStats {
  id: string;
  product_id: string;
  date: Date;                 // Daily aggregation
  view_count: number;
  add_to_cart_count: number;
  purchase_count: number;
}

// ============================================
// BEST SELLER SNAPSHOT - Cached aggregation
// ============================================
interface BestSellerSnapshot {
  id: string;
  product_id: string;
  period: 'daily' | 'weekly' | 'monthly' | 'all_time';
  period_start: Date;
  period_end: Date;
  units_sold: number;
  revenue: number;
  rank: number;               // Position in bestseller list
  updated_at: Date;
}
```

### 3.3 Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         ENTITY RELATIONSHIPS                         │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Category   │────▶│   Product    │◀────│  Collection  │
│   (Rings)    │     │  (Jewelry)   │     │(Wedding Edit)│
└──────────────┘     └──────┬───────┘     └──────────────┘
                            │
           ┌────────────────┼────────────────┐
           │                │                │
           ▼                ▼                ▼
    ┌────────────┐   ┌────────────┐   ┌────────────┐
    │  Variant   │   │   Review   │   │View Stats  │
    │ (Size M)   │   │  (5 stars) │   │(Trending)  │
    └────────────┘   └────────────┘   └────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                      CUSTOM ENTITIES                                 │
├─────────────────────────────────────────────────────────────────────┤
│  HomepageSection ──▶ references ──▶ Category/Collection/Product    │
│  ShopTheLook ──────▶ contains ────▶ Products (with positions)      │
│  Review ───────────▶ references ──▶ Product + Customer             │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 4. Query Patterns by Context

### 4.1 Frontend (Customer-Facing) Queries

#### Homepage Data Fetching

```typescript
// ============================================
// PATTERN: Get complete homepage data
// ============================================
async function getHomepageData(): Promise<HomepageData> {
  // Fetch all sections in parallel
  const [sections, categories] = await Promise.all([
    fetch('/store/homepage/sections').then(r => r.json()),
    getCategories(), // Medusa native
  ]);
  
  // For each section, fetch its products if needed
  const sectionsWithProducts = await Promise.all(
    sections.map(async (section: HomepageSection) => {
      if (section.type === 'product_grid') {
        const products = await getSectionProducts(section);
        return { ...section, products };
      }
      return section;
    })
  );
  
  return {
    sections: sectionsWithProducts,
    categories,
  };
}

// ============================================
// PATTERN: Resolve section to products
// ============================================
async function getSectionProducts(section: HomepageSection): Promise<Product[]> {
  switch (section.source_type) {
    case 'category':
      // Fetch products from specific category
      const { products } = await getProducts({ 
        category_id: section.source_id, 
        limit: section.limit || 4 
      });
      return products;
    
    case 'collection':
      // Fetch products from collection
      const { products } = await getProducts({ 
        collection_id: section.source_id, 
        limit: section.limit || 4 
      });
      return products;
    
    case 'custom_filter':
      // Handle special filters
      if (section.source_id === 'new_arrivals') {
        return getNewArrivals(section.limit || 4);
      }
      if (section.source_id === 'bestsellers') {
        return getBestSellers(section.limit || 4);
      }
      if (section.source_id === 'under_999') {
        return getBudgetProducts(99900, section.limit || 4);
      }
      break;
    
    case 'manual':
      // Fetch specific products by ID
      return Promise.all(
        section.manual_product_ids.map(id => getProductById(id))
      );
  }
  
  return [];
}

// ============================================
// PATTERN: Get new arrivals (sort by date)
// ============================================
async function getNewArrivals(limit: number = 4): Promise<Product[]> {
  const { products } = await getProducts({ 
    limit,
    order: '-created_at',  // Newest first
  });
  return products;
}

// ============================================
// PATTERN: Get bestsellers (requires custom table)
// ============================================
async function getBestSellers(limit: number = 4): Promise<Product[]> {
  // Option 1: If you have BestSellerSnapshot table
  const snapshot = await fetch(`/store/bestsellers?limit=${limit}`).then(r => r.json());
  const productIds = snapshot.map((s: BestSellerSnapshot) => s.product_id);
  return Promise.all(productIds.map(getProductById));
  
  // Option 2: Fallback to "featured" tag if no sales data yet
  // const { products } = await getProducts({ tag: 'bestseller', limit });
  // return products;
}

// ============================================
// PATTERN: Get budget products (price filter)
// ============================================
async function getBudgetProducts(maxPrice: number, limit: number = 4): Promise<Product[]> {
  // Note: Medusa doesn't have direct price filtering in v2 yet
  // Fetch more products and filter client-side
  const { products } = await getProducts({ limit: 20 });
  
  return products
    .filter(product => {
      const minPrice = Math.min(
        ...product.variants.flatMap(v => 
          v.prices.filter(p => p.currency_code === 'inr').map(p => p.amount)
        )
      );
      return minPrice <= maxPrice;
    })
    .slice(0, limit);
}
```

#### Category Page

```typescript
// ============================================
// PATTERN: Category page with filters
// ============================================
async function getCategoryPage(
  handle: string, 
  filters: {
    priceMin?: number;
    priceMax?: number;
    sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'bestselling';
  }
): Promise<CategoryPageData> {
  // 1. Get category details
  const { product_categories } = await getCategories();
  const category = product_categories.find(c => c.handle === handle);
  
  if (!category) throw new Error('Category not found');
  
  // 2. Get products with sorting
  const sortMapping = {
    'price_asc': 'variants.prices.amount',
    'price_desc': '-variants.prices.amount',
    'newest': '-created_at',
    'bestselling': '-metadata.sales_count', // If you track this
  };
  
  const { products, count } = await getProducts({
    category_id: category.id,
    limit: 24,
    order: sortMapping[filters.sortBy] || '-created_at',
  });
  
  // 3. Client-side price filtering (if needed)
  const filteredProducts = filters.priceMin || filters.priceMax
    ? products.filter(p => {
        const price = getMinPrice(p);
        if (filters.priceMin && price < filters.priceMin) return false;
        if (filters.priceMax && price > filters.priceMax) return false;
        return true;
      })
    : products;
  
  // 4. Get subcategories for sidebar
  const subcategories = product_categories.filter(
    c => c.parent_category_id === category.id
  );
  
  return {
    category,
    products: filteredProducts,
    subcategories,
    totalCount: count,
  };
}
```

#### Product Detail Page

```typescript
// ============================================
// PATTERN: Product detail with related items
// ============================================
async function getProductDetail(handle: string): Promise<ProductDetailData> {
  // 1. Get main product
  const product = await getProductByHandle(handle);
  
  // 2. Get related products (same category, excluding current)
  const { products: relatedProducts } = await getProducts({
    category_id: product.categories[0]?.id,
    limit: 4,
  });
  const related = relatedProducts.filter(p => p.id !== product.id).slice(0, 4);
  
  // 3. Get reviews (custom entity)
  const reviews = await fetch(`/store/products/${product.id}/reviews`).then(r => r.json());
  
  // 4. Get "Complete the Look" if available
  const looks = await fetch(`/store/shop-the-look?product_id=${product.id}`).then(r => r.json());
  
  return {
    product,
    related,
    reviews,
    looks,
  };
}
```

### 4.2 Backoffice (Admin) Queries

```typescript
// ============================================
// PATTERN: Dashboard analytics
// ============================================
async function getDashboardStats(dateRange: { start: Date; end: Date }) {
  return Promise.all([
    // Sales metrics (Medusa native)
    getTotalRevenue(dateRange),
    getOrderCount(dateRange),
    getAverageOrderValue(dateRange),
    
    // Product performance (custom)
    getTopSellingProducts(10),
    getLowStockProducts(),
    
    // Customer metrics (Medusa + custom)
    getNewCustomers(dateRange),
    getRepeatCustomerRate(),
    
    // Content metrics (custom)
    getPendingReviewCount(),
    getActivePromotionCount(),
  ]);
}

// ============================================
// PATTERN: Order management with filtering
// ============================================
async function getOrdersForFulfillment(status: 'pending' | 'processing' | 'shipped') {
  // Medusa admin API
  return fetch(`/admin/orders?fulfillment_status=${status}&limit=50`);
}

// ============================================
// PATTERN: Review moderation queue
// ============================================
async function getPendingReviews(): Promise<Review[]> {
  return fetch('/admin/reviews?status=pending&limit=20').then(r => r.json());
}

async function moderateReview(reviewId: string, action: 'approve' | 'reject') {
  return fetch(`/admin/reviews/${reviewId}`, {
    method: 'POST',
    body: JSON.stringify({ 
      status: action === 'approve' ? 'approved' : 'rejected',
      moderated_at: new Date().toISOString(),
    }),
  });
}

// ============================================
// PATTERN: Homepage content management
// ============================================
async function updateHomepageSection(sectionId: string, updates: Partial<HomepageSection>) {
  return fetch(`/admin/homepage/sections/${sectionId}`, {
    method: 'POST',
    body: JSON.stringify(updates),
  });
}

async function reorderSections(sectionIds: string[]) {
  return fetch('/admin/homepage/sections/reorder', {
    method: 'POST',
    body: JSON.stringify({ section_ids: sectionIds }),
  });
}
```

---

## 5. Medusa Native vs Custom Features

### 5.1 Fully Supported by Medusa (Use These!)

| Feature | Medusa Support | Notes |
|---------|---------------|-------|
| **Product Catalog** | ✅ Complete | Products, variants, options, images |
| **Categories** | ✅ Complete | Hierarchical, multiple per product |
| **Collections** | ✅ Complete | Thematic groupings |
| **Inventory** | ✅ Complete | Multi-location, reservations |
| **Pricing** | ✅ Complete | Multiple currencies, price lists |
| **Cart Management** | ✅ Complete | Add, update, remove items |
| **Checkout Flow** | ✅ Complete | Shipping, payment sessions |
| **Order Management** | ✅ Complete | Fulfillment, returns, swaps |
| **Customer Accounts** | ✅ Complete | Registration, auth, addresses |
| **Regions** | ✅ Complete | Currency, tax, payment per region |
| **Tax Calculation** | ✅ Complete | Automatic tax provider integration |
| **Shipping Options** | ✅ Complete | Multiple providers, profiles |
| **Payment Providers** | ✅ Complete | Stripe, Razorpay, PayPal, etc. |
| **Admin Dashboard** | ✅ Complete | Full CRUD for all entities |
| **API & Webhooks** | ✅ Complete | REST API, event webhooks |

### 5.2 Partially Supported (Needs Custom Work)

| Feature | Medusa Support | What's Missing |
|---------|---------------|----------------|
| **Search** | ⚠️ Basic | Full-text search works, but no faceted search |
| **Product Relations** | ⚠️ Metadata only | No native "related products" or "cross-sell" |
| **Price Filtering** | ⚠️ Limited | Limited price range queries |
| **Sales Analytics** | ⚠️ Raw data | No aggregated reports (bestsellers, etc.) |
| **Customer Segments** | ⚠️ Metadata | No native segmentation engine |
| **Promotions** | ⚠️ Standard | Complex rules need custom logic |

### 5.3 Not Supported (Build Custom)

| Feature | Custom Work Required | Complexity |
|---------|---------------------|------------|
| **Reviews & Ratings** | Full custom module | Medium |
| **Homepage CMS** | Content management system | Medium |
| **Shop the Look** | Image pin positioning | Medium |
| **Bestsellers** | Sales aggregation job | Low |
| **Wishlist** | Can use metadata (simple) or custom table (advanced) | Low-Medium |
| **Personalized Recommendations** | ML/algorithm integration | High |
| **Visual Search** | Image recognition | High |
| **AR Try-On** | 3D/AR integration | High |
| **Multi-vendor** | Vendor management | High |
| **Subscription** | Recurring billing | High |
| **Blog/CMS** | Content pages | Medium |
| **SEO Management** | Meta tags, redirects | Low |
| **Email Templates** | Transactional emails | Medium |
| **Real-time Chat** | Customer support | Medium |

---

## 6. Recommended Architecture

### 6.1 Option A: Config-File Based (Current - Good for MVP)

**Best for:** Early stage, technical team manages content

```typescript
// storefront/src/lib/homepage-config.ts

export const homepageConfig = {
  // 1. Hero Banner - Fully configurable
  hero: {
    enabled: true,
    type: 'promotional',
    title: "Valentine Sale",
    subtitle: "Happy Valentine's Day",
    discountText: "25% OFF",
    ctaText: "Shop the Sale",
    ctaLink: "/category/new-arrivals",
    theme: 'valentine',
    backgroundImage: "https://...",
    startDate: '2026-02-01',
    endDate: '2026-02-28',
  },
  
  // 2. Category Circles - Must match Medusa category handles
  categories: {
    enabled: true,
    type: 'navigation',
    items: [
      { name: "New In", handle: "new-arrivals", icon: "✨" },
      { name: "Gift Store", handle: "gifts", icon: "🎁" },
      { name: "Personalized", handle: "personalized", icon: "💎" },
      { name: "Bracelets", handle: "bracelets", icon: "💫" },
      { name: "Necklaces", handle: "necklaces", icon: "📿" },
      { name: "Earrings", handle: "earrings", icon: "👂" },
      { name: "Rings", handle: "rings", icon: "💍" },
      { name: "Bestsellers", handle: "best-sellers", icon: "🔥" },
      { name: "Combos", handle: "combos", icon: "🛍️" },
    ],
  },
  
  // 3. New Arrivals - Dynamic
  newArrivals: {
    enabled: true,
    type: 'product_grid',
    source: { type: 'filter', filter: 'newest', limit: 4 },
    title: "Fresh Drops",
    subtitle: "Just In",
    showViewAll: true,
    viewAllLink: "/category/new-arrivals",
  },
  
  // 4. Best Sellers - Dynamic (requires sales tracking)
  bestSellers: {
    enabled: true,
    type: 'reels', // Instagram-style horizontal scroll
    source: { type: 'filter', filter: 'bestseller', limit: 8 },
    title: "Trending Now",
  },
  
  // 5. Wedding Edit - Featured collection
  weddingEdit: {
    enabled: true,
    type: 'featured_collection',
    collectionHandle: 'wedding-collection',
    title: "The Wedding Edit",
    description: "Handcrafted perfection for your special day...",
    layout: 'split', // Banner left, products right
  },
  
  // 6. Collections Grid - Static display
  collections: {
    enabled: true,
    type: 'collection_grid',
    items: [
      { name: "Daily Wear", handle: "daily-wear", color: "bg-[#FDF8F8]", itemCount: "120+" },
      { name: "Occasion", handle: "occasion", color: "bg-[#FEF2F2]", itemCount: "80+" },
      { name: "Office Edit", handle: "office", color: "bg-[#F5F5F5]", itemCount: "45+" },
      { name: "Gift Sets", handle: "gift-sets", color: "bg-primary/5", itemCount: "30+" },
    ],
  },
  
  // 7. Shop the Look
  shopTheLook: {
    enabled: true,
    type: 'shop_the_look',
    looks: [
      { id: "bridal-elegance", name: "Bridal Elegance", image: "...", productCount: 5 },
      { id: "minimal-chic", name: "Minimal Chic", image: "...", productCount: 3 },
    ],
  },
  
  // 8. Gifts - Horizontal scroll
  gifts: {
    enabled: true,
    type: 'product_grid',
    source: { type: 'category', handle: 'gifts', limit: 5 },
    title: "Gifts for Her",
    layout: 'horizontal_scroll',
  },
  
  // 9. Budget Finds
  budgetFinds: {
    enabled: true,
    type: 'product_grid',
    source: { type: 'filter', maxPrice: 99900, limit: 4 },
    title: "Under ₹999",
    badge: "Steal Deals",
  },
  
  // 10. Testimonials
  testimonials: {
    enabled: true,
    type: 'testimonials',
    source: 'static', // Or 'api' if from review system
    items: [...], // Or fetch from reviews API
  },
};
```

**Pros:**
- Fast to implement
- Version controlled
- No database migrations needed

**Cons:**
- Requires code deployment for content changes
- Non-technical team can't update
- No scheduling/AB testing

### 6.2 Option B: Database-Backed CMS (Recommended for Production)

**Best for:** Active store with marketing team

Create a custom Medusa module:

```
backend/src/modules/homepage/
├── models/
│   ├── homepage-section.ts       # Section definitions
│   ├── shop-the-look.ts          # Lookbook entries
│   └── banner-schedule.ts        # Time-based banner rules
├── services/
│   ├── homepage-service.ts       # Business logic
│   └── banner-scheduler.ts       # Cron job for scheduling
├── api/
│   ├── store/homepage/
│   │   └── route.ts             # GET /store/homepage/sections
│   └── admin/homepage/
│       ├── sections/route.ts    # CRUD for sections
│       └── reorder/route.ts     # Reordering endpoint
├── admin/
│   └── widgets/
│       └── homepage-widget.tsx  # Admin dashboard widget
└── jobs/
    └── update-bestsellers.ts    # Daily aggregation job
```

**Database Schema:**

```sql
-- Homepage sections table
CREATE TABLE homepage_section (
  id UUID PRIMARY KEY,
  type VARCHAR(50) NOT NULL, -- 'hero', 'product_grid', etc.
  name VARCHAR(255) NOT NULL,
  title VARCHAR(255),
  subtitle VARCHAR(255),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  
  -- Content source
  source_type VARCHAR(50), -- 'category', 'collection', 'filter', 'manual'
  source_id VARCHAR(255),  -- Category ID, collection handle, or filter key
  
  -- For manual selection
  manual_product_ids TEXT[], -- Array of product IDs
  
  -- Banner fields
  image_url TEXT,
  mobile_image_url TEXT,
  cta_text VARCHAR(255),
  cta_link VARCHAR(500),
  
  -- Scheduling
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  
  -- Styling
  theme VARCHAR(50) DEFAULT 'default',
  background_color VARCHAR(50),
  layout VARCHAR(50) DEFAULT 'grid_4',
  
  -- Metadata
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Shop the Look table
CREATE TABLE shop_the_look (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  main_image TEXT NOT NULL,
  mobile_image TEXT,
  products JSONB NOT NULL, -- Array of {product_id, x, y, label}
  tags TEXT[],
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Product view stats (for trending)
CREATE TABLE product_view_stats (
  id UUID PRIMARY KEY,
  product_id UUID REFERENCES product(id),
  date DATE NOT NULL,
  view_count INTEGER DEFAULT 0,
  add_to_cart_count INTEGER DEFAULT 0,
  purchase_count INTEGER DEFAULT 0,
  UNIQUE(product_id, date)
);

-- Bestseller snapshot (pre-calculated)
CREATE TABLE bestseller_snapshot (
  id UUID PRIMARY KEY,
  product_id UUID REFERENCES product(id),
  period VARCHAR(20) NOT NULL, -- 'daily', 'weekly', 'monthly', 'all_time'
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  units_sold INTEGER DEFAULT 0,
  revenue INTEGER DEFAULT 0, -- in smallest currency unit
  rank INTEGER NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(product_id, period, period_start)
);
```

**API Endpoints:**

```typescript
// Storefront API
GET  /store/homepage/sections           // Get active sections
GET  /store/homepage/hero               // Get current hero
GET  /store/bestsellers?period=weekly   // Get bestseller list
GET  /store/shop-the-look               // Get all looks
GET  /store/shop-the-look/:id           // Get specific look
GET  /store/products/:id/reviews        // Get product reviews
POST /store/products/:id/reviews        // Submit review

// Admin API
GET    /admin/homepage/sections
POST   /admin/homepage/sections
POST   /admin/homepage/sections/:id
DELETE /admin/homepage/sections/:id
POST   /admin/homepage/sections/reorder

GET    /admin/reviews?status=pending
POST   /admin/reviews/:id/moderate

GET    /admin/analytics/dashboard
GET    /admin/analytics/bestsellers
```

**Pros:**
- Non-technical team can manage content
- Scheduling and AB testing possible
- No code deployment for content changes
- Better performance with caching

**Cons:**
- More complex initial setup
- Requires database migrations
- Need to build admin UI

---

## 7. Implementation Roadmap

### Phase 1: Foundation (Week 1-2)
- [ ] Audit current Medusa categories and collections
- [ ] Standardize category handles (rings, earrings, necklaces, etc.)
- [ ] Create marketing collections (wedding-edit, best-sellers, new-arrivals)
- [ ] Ensure all products are properly categorized
- [ ] Set up config-based homepage (current approach)

### Phase 2: Dynamic Content (Week 3-4)
- [ ] Implement "New Arrivals" query (sort by created_at)
- [ ] Implement "Under ₹999" filter (client-side price filtering)
- [ ] Create category pages with product grids
- [ ] Build search functionality
- [ ] Add product detail pages with related products

### Phase 3: Customer Features (Week 5-6)
- [ ] Reviews system (custom table)
- [ ] Wishlist (using customer metadata initially)
- [ ] Customer account pages
- [ ] Order history

### Phase 4: Advanced Features (Week 7-8)
- [ ] Bestseller tracking (daily aggregation job)
- [ ] Shop the Look feature
- [ ] Homepage CMS module (if needed)
- [ ] Analytics dashboard

### Phase 5: Optimization (Ongoing)
- [ ] Add caching layer (Redis)
- [ ] Implement CDN for images
- [ ] SEO optimization
- [ ] Performance monitoring

---

## 8. Quick Reference: Categories vs Collections

### The Golden Rule

| Aspect | Categories | Collections |
|--------|-----------|-------------|
| **Purpose** | Organize products hierarchically | Group products for marketing |
| **Analogy** | File system folders | Playlist or album |
| **Example** | Jewelry > Rings > Engagement | "Valentine's Day Gifts" |
| **Required?** | Yes (navigation) | No (optional) |
| **Multiple?** | Yes (product can be in multiple) | Yes (product can be in multiple) |
| **Hierarchy?** | Yes (parent/child) | No (flat) |
| **Use for** | Browse navigation, SEO structure | Campaigns, landing pages, themes |

### Tatva Examples

**Categories (Your Navigation):**
```
Jewelry (root)
├── Rings
│   ├── Engagement Rings
│   ├── Cocktail Rings
│   └── Daily Wear Rings
├── Earrings
│   ├── Studs
│   ├── Danglers
│   └── Jhumkas
├── Necklaces
├── Bracelets
└── Sets

Gifts (root)
├── For Her
├── For Mom
└── Under ₹999
```

**Collections (Your Marketing):**
- Wedding Edit
- Best Sellers
- New Arrivals
- Valentine's Special
- Office Edit
- Festival Collection
- Personalized Gifts

### When to Use What?

| Scenario | Use | Reason |
|----------|-----|--------|
| User wants to browse all rings | Category | Hierarchical browsing |
| User clicks "Wedding Edit" banner | Collection | Themed grouping |
| Show "New Arrivals" | Collection or Filter | Time-based grouping |
| URL: /category/rings | Category | SEO & structure |
| URL: /collections/wedding-edit | Collection | Campaign landing |
| Filter by price | Filter | Dynamic criteria |

---

## 9. Common Pitfalls & Best Practices

### ❌ Pitfall 1: Confusing Categories with Collections
**Problem:** Creating a "Wedding" category when it's actually a theme.
**Solution:** Categories = permanent structure, Collections = temporary campaigns.

### ❌ Pitfall 2: Hardcoding Product IDs
**Problem:** Putting specific product IDs in code.
**Solution:** Use filters (newest, bestseller) or manual selection via admin.

### ❌ Pitfall 3: Not Considering Mobile
**Problem:** Desktop-only homepage layouts.
**Solution:** Design mobile-first, use horizontal scroll for product rows.

### ❌ Pitfall 4: Ignoring Performance
**Problem:** Fetching all homepage data sequentially.
**Solution:** Use Promise.all() for parallel fetching, implement caching.

### ✅ Best Practice 1: Consistent Handles
Use URL-friendly handles: `wedding-collection`, not `Wedding Collection` or `wedding_collection`.

### ✅ Best Practice 2: Lazy Load Below Fold
Don't fetch "Gifts for Her" until user scrolls down.

### ✅ Best Practice 3: Graceful Degradation
If "Bestsellers" query fails, fall back to "New Arrivals".

### ✅ Best Practice 4: Cache Aggressively
Homepage data changes infrequently - cache for 5-15 minutes.

---

## Appendix: Query Examples

### Get Homepage Data (GraphQL-style pseudo-code)

```graphql
query Homepage {
  sections {
    id
    type
    title
    products {
      id
      title
      thumbnail
      price {
        amount
        currency
      }
    }
  }
  categories {
    name
    handle
    thumbnail
  }
}
```

### Get Category Page

```graphql
query CategoryPage($handle: String!, $filters: ProductFilters) {
  category(handle: $handle) {
    name
    description
    products(filters: $filters) {
      items {
        id
        title
        variants {
          prices {
            amount
          }
        }
      }
      totalCount
    }
    subcategories {
      name
      handle
    }
  }
}
```

---

## Resources

- **Medusa Documentation:** https://docs.medusajs.com/
- **Medusa API Reference:** https://docs.medusajs.com/api/store
- **Category vs Collection:** https://docs.medusajs.com/resources/commerce-modules/product

---

*Document Version: 1.0*
*Last Updated: February 2026*
*For: Tatva Jewelry E-Commerce Platform*
