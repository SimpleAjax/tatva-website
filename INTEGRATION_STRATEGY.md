# TATVA Website - Storefront & Medusa Backend Integration Strategy

## Executive Summary

This document outlines the complete strategy for integrating the TATVA storefront (Next.js) with the Medusa backend, along with creating appropriate dummy data for a jewelry e-commerce experience.

---

## Current State Analysis

### Backend (Medusa v2.13.1)
- **Location**: `/backend`
- **Port**: 9111
- **Database**: PostgreSQL (localhost:5444)
- **Existing Seed Script**: `src/scripts/seed.ts`
- **Current Data**: Fashion items (T-shirts, Sweatshirts, Sweatpants, Shorts) - NOT jewelry
- **Categories**: Shirts, Sweatshirts, Pants, Merch
- **Publishable API Key**: Already created and linked to sales channel

### Storefront (Next.js 16.1.6)
- **Location**: `/storefront`
- **Port**: 3002
- **Medusa Client**: `src/lib/medusa.ts` - Fully implemented with all core API functions
- **Cart System**: Complete with context, drawer, and checkout flow
- **Product Display**: ProductCard supports both Medusa products and legacy mock data
- **Environment**: Configured with backend URL and publishable API key

### What's Working
✅ Medusa API client with all core endpoints  
✅ Cart management (create, read, update, delete items)  
✅ Product listing and detail pages  
✅ Checkout flow (shipping, delivery selection)  
✅ Cart drawer with item management  

---

## Phase 1: Backend Data Transformation (PRIORITY: HIGH)

### 1.1 Update Seed Script for Jewelry Products

**Current Issue**: Backend has fashion items, but storefront is a jewelry store.

**Actions Required**:
```
backend/src/scripts/seed.ts
```

**New Categories to Create**:
- Bracelets (Kundan Bracelets, Pearl Bracelets, Charm Bracelets)
- Necklaces (Chokers, Long Necklaces, Pendants)
- Earrings (Studs, Danglers, Hoops, Jhumkas)
- Rings (Engagement, Cocktail, Daily Wear)
- Wedding Collection (Bridal Sets, Maang Tikka, Nath)
- Best Sellers
- New Arrivals

**New Products to Create** (15-20 sample products):
| Product | Category | Price (INR) | Variants |
|---------|----------|-------------|----------|
| Golden Aura Bracelet | Bracelets | ₹1,299 | Size: S, M, L |
| Elegance Pearl Necklace | Necklaces | ₹2,499 | Length: 16", 18", 20" |
| Celestial Star Earrings | Earrings | ₹999 | Color: Gold, Silver |
| Infinity Love Ring | Rings | ₹1,599 | Size: 5-10 |
| Bridal Kundan Set | Wedding | ₹15,999 | Set Type: Full, Half |
| Traditional Jhumka | Earrings | ₹1,299 | Color: Red, Green, Blue |
| Rose Gold Pendant | Necklaces | ₹2,199 | Chain: With/Without |
| Diamond Studs | Earrings | ₹3,499 | Carat: 0.1, 0.2 |

**Configuration Changes**:
- Update region to include India (IN) as primary country
- Add INR currency support
- Update shipping options for India

### 1.2 Run the Seed Script

```bash
cd backend
yarn seed
```

---

## Phase 2: Storefront API Integration (PRIORITY: HIGH)

### 2.1 Product Listing Enhancements

**File**: `storefront/src/app/page.tsx`

**Current State**: All sections call same `getProducts()` without filtering

**Required Changes**:
```typescript
// Add category-based fetching
async function getProductsByCategory(categoryHandle: string): Promise<Product[]> {
  try {
    const { product_categories } = await getCategories();
    const category = product_categories.find(cat => cat.handle === categoryHandle);
    if (!category) return [];
    
    const { products } = await getProducts({ 
      limit: 4,
      category_id: category.id 
    });
    return products;
  } catch (error) {
    console.error(`Failed to fetch products for ${categoryHandle}:`, error);
    return [];
  }
}

// Add collection-based fetching
async function getProductsByCollection(collectionHandle: string): Promise<Product[]> {
  try {
    const { collections } = await getCollections();
    const collection = collections.find(col => col.handle === collectionHandle);
    if (!collection) return [];
    
    const { products } = await getProducts({ 
      limit: 4,
      collection_id: collection.id 
    });
    return products;
  } catch (error) {
    console.error(`Failed to fetch products for ${collectionHandle}:`, error);
    return [];
  }
}
```

### 2.2 Update Homepage Sections

Replace hardcoded data with dynamic fetches:

| Section | Current | Target |
|---------|---------|--------|
| New Arrivals | All products | Products with "new-arrivals" tag/category |
| Best Sellers | Hardcoded reels | Products from "best-sellers" collection |
| Wedding Edit | All products | Products from "wedding" category |
| Under ₹999 | All products | Products with price < ₹999 |
| Gifts for Her | All products | Products from "gifts" collection |

### 2.3 Category Pages

**New Files to Create**:
```
storefront/src/app/category/[handle]/page.tsx
storefront/src/app/collection/[handle]/page.tsx
storefront/src/app/search/page.tsx
```

**Category Page Structure**:
```typescript
// app/category/[handle]/page.tsx
import { getCategories, getProducts } from "@/lib/medusa";
import ProductCard from "@/components/ProductCard";

export default async function CategoryPage({ 
  params 
}: { 
  params: { handle: string } 
}) {
  const { handle } = await params;
  
  // Fetch category and products
  const { product_categories } = await getCategories();
  const category = product_categories.find(cat => cat.handle === handle);
  
  if (!category) return notFound();
  
  const { products } = await getProducts({ 
    category_id: category.id,
    limit: 100 
  });
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-serif italic mb-8">{category.name}</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
```

### 2.4 Search Functionality

**New File**: `storefront/src/app/search/page.tsx`

```typescript
"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getProducts } from "@/lib/medusa";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    if (query) {
      getProducts({ q: query, limit: 50 }).then(({ products }) => {
        setProducts(products);
      });
    }
  }, [query]);
  
  // Render search results...
}
```

---

## Phase 3: Additional Features (PRIORITY: MEDIUM)

### 3.1 Customer Authentication

**New Files**:
```
storefront/src/app/account/page.tsx
storefront/src/app/account/login/page.tsx
storefront/src/app/account/register/page.tsx
storefront/src/lib/medusa-customer.ts
```

**API Functions to Add**:
```typescript
// Customer authentication
export async function registerCustomer(data: {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
}): Promise<{ customer: any }> {
  return fetchFromMedusa("/store/customers", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function loginCustomer(email: string, password: string): Promise<{ customer: any }> {
  return fetchFromMedusa("/store/auth", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function getCurrentCustomer(): Promise<{ customer: any }> {
  return fetchFromMedusa("/store/customers/me");
}
```

### 3.2 Order History

**New File**: `storefront/src/app/account/orders/page.tsx`

```typescript
export async function getCustomerOrders(): Promise<{ orders: any[] }> {
  return fetchFromMedusa("/store/customers/me/orders");
}
```

### 3.3 Wishlist Feature

**Options**:
1. Use Medusa's customer metadata to store wishlist
2. Use localStorage for non-logged in users
3. Create custom wishlist module in backend

**Recommended**: Option 1 + 2 (hybrid approach)

---

## Phase 4: Payment Integration (PRIORITY: HIGH)

### 4.1 Payment Provider Setup (Backend)

**Options for India**:
1. **Razorpay** - Recommended for Indian market
2. **Stripe** - International support
3. **Cash on Delivery** - Manual flow

**Backend Environment Configuration** (`.env`):
```env
# Payment Provider Flags
ENABLE_RAZORPAY=true                     # Enable Razorpay provider
ENABLE_STRIPE=false                      # Enable Stripe provider
ENABLE_COD=true                          # Enable Cash on Delivery

# Razorpay Configuration (required if ENABLE_RAZORPAY=true)
RAZORPAY_KEY_ID=rzp_test_xxx
RAZORPAY_KEY_SECRET=xxx
RAZORPAY_WEBHOOK_SECRET=xxx

# Stripe Configuration (required if ENABLE_STRIPE=true)
STRIPE_API_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxx
```

**Dynamic Provider Registration** (`medusa-config.ts`):
```typescript
// Build providers array based on flags
const paymentProviders = [];

if (process.env.ENABLE_RAZORPAY === "true") {
  paymentProviders.push({
    resolve: "@medusajs/payment-razorpay",
    options: {
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
      webhook_secret: process.env.RAZORPAY_WEBHOOK_SECRET,
    },
  });
}

if (process.env.ENABLE_STRIPE === "true") {
  paymentProviders.push({
    resolve: "@medusajs/payment-stripe",
    options: {
      api_key: process.env.STRIPE_API_KEY,
      webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
      publishable_key: process.env.STRIPE_PUBLISHABLE_KEY,
    },
  });
}

// COD is handled by the system provider (no config needed)

module.exports = defineConfig({
  // ... other config
  modules: {
    payment: {
      options: {
        providers: paymentProviders,
      },
    },
  },
});
```

**Installation**:
```bash
# Install only needed providers
cd backend

# If ENABLE_RAZORPAY=true
yarn add @medusajs/payment-razorpay

# If ENABLE_STRIPE=true  
yarn add @medusajs/payment-stripe
```

### 4.2 Flag-Based Payment System

**Purpose**: Enable/disable payment methods via environment flags for testing, development, and production scenarios.

**Configuration File**: Create `storefront/src/lib/payment-config.ts`

```typescript
// Payment feature flags - configure via environment variables
export const PAYMENT_FLAGS = {
  // Enable/disable specific payment methods
  ENABLE_COD: process.env.NEXT_PUBLIC_ENABLE_COD === "true" || true,
  ENABLE_RAZORPAY: process.env.NEXT_PUBLIC_ENABLE_RAZORPAY === "true" || false,
  ENABLE_STRIPE: process.env.NEXT_PUBLIC_ENABLE_STRIPE === "true" || false,
  ENABLE_UPI: process.env.NEXT_PUBLIC_ENABLE_UPI === "true" || true,
  
  // Payment flow modes
  PAYMENT_MODE: (process.env.NEXT_PUBLIC_PAYMENT_MODE || "demo") as 
    "demo" | "sandbox" | "production",
  
  // Demo mode - simulates successful payment without actual charge
  DEMO_AUTO_SUCCESS: process.env.NEXT_PUBLIC_DEMO_AUTO_SUCCESS === "true" || true,
  
  // Skip payment step entirely (for testing checkout flow)
  SKIP_PAYMENT: process.env.NEXT_PUBLIC_SKIP_PAYMENT === "true" || false,
};

// Payment method definitions
export interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: string;
  enabled: boolean;
  requiresRedirect: boolean;
  sandboxConfig?: {
    testCardNumber?: string;
    testUpiId?: string;
  };
}

export const AVAILABLE_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "cod",
    name: "Cash on Delivery",
    description: "Pay when your order is delivered",
    icon: "Banknote",
    enabled: PAYMENT_FLAGS.ENABLE_COD,
    requiresRedirect: false,
  },
  {
    id: "razorpay",
    name: "Razorpay",
    description: "Credit/Debit Card, UPI, NetBanking via Razorpay",
    icon: "CreditCard",
    enabled: PAYMENT_FLAGS.ENABLE_RAZORPAY,
    requiresRedirect: true,
    sandboxConfig: {
      testCardNumber: "5267 3181 8797 5449",
      testUpiId: "success@razorpay",
    },
  },
  {
    id: "stripe",
    name: "Stripe",
    description: "Secure card payment via Stripe",
    icon: "CreditCard",
    enabled: PAYMENT_FLAGS.ENABLE_STRIPE,
    requiresRedirect: false,
    sandboxConfig: {
      testCardNumber: "4242 4242 4242 4242",
    },
  },
  {
    id: "upi",
    name: "UPI",
    description: "Pay via UPI apps (GPay, PhonePe, Paytm)",
    icon: "Smartphone",
    enabled: PAYMENT_FLAGS.ENABLE_UPI,
    requiresRedirect: false,
    sandboxConfig: {
      testUpiId: "test@upi",
    },
  },
];

// Get enabled payment methods
export function getEnabledPaymentMethods(): PaymentMethod[] {
  return AVAILABLE_PAYMENT_METHODS.filter(method => method.enabled);
}

// Check if specific method is enabled
export function isPaymentMethodEnabled(methodId: string): boolean {
  return AVAILABLE_PAYMENT_METHODS.some(
    method => method.id === methodId && method.enabled
  );
}

// Payment flow mode helpers
export const isDemoMode = () => PAYMENT_FLAGS.PAYMENT_MODE === "demo";
export const isSandboxMode = () => PAYMENT_FLAGS.PAYMENT_MODE === "sandbox";
export const isProductionMode = () => PAYMENT_FLAGS.PAYMENT_MODE === "production";

// Get payment button text based on mode
export function getPaymentButtonText(): string {
  if (PAYMENT_FLAGS.SKIP_PAYMENT) return "Place Order (Skip Payment)";
  if (isDemoMode()) return "Place Order (Demo Mode)";
  if (isSandboxMode()) return "Place Order (Test Mode)";
  return "Place Order";
}
```

### 4.3 Frontend Payment Flow with Flags

**Update**: `storefront/src/app/checkout/page.tsx`

```typescript
"use client";

import { 
  PAYMENT_FLAGS, 
  getEnabledPaymentMethods, 
  isPaymentMethodEnabled,
  isDemoMode,
  isSandboxMode,
  getPaymentButtonText 
} from "@/lib/payment-config";
import { Badge } from "@/components/ui/badge";

// ... existing imports ...

export default function CheckoutPage() {
  // ... existing state ...
  
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>(() => {
    // Auto-select first enabled method
    const enabled = getEnabledPaymentMethods();
    return enabled[0]?.id || "";
  });
  
  const enabledMethods = getEnabledPaymentMethods();

  const handlePlaceOrder = async () => {
    // Skip payment flow entirely if flag is set
    if (PAYMENT_FLAGS.SKIP_PAYMENT) {
      // Directly complete the cart without payment
      const { order } = await completeCart(cart.id);
      router.push(`/order/confirmed/${order.id}?mode=skipped`);
      return;
    }

    // Demo mode - simulate payment without actual charge
    if (isDemoMode()) {
      if (PAYMENT_FLAGS.DEMO_AUTO_SUCCESS) {
        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        const { order } = await completeCart(cart.id);
        router.push(`/order/confirmed/${order.id}?mode=demo`);
        return;
      }
    }

    // Sandbox mode - use test credentials
    if (isSandboxMode()) {
      switch (selectedPaymentMethod) {
        case "razorpay":
          await initializeRazorpayPayment(cart.id, { testMode: true });
          break;
        case "stripe":
          await initializeStripePayment(cart.id, { testMode: true });
          break;
        case "cod":
          const { order } = await completeCart(cart.id);
          router.push(`/order/confirmed/${order.id}?mode=sandbox`);
          break;
      }
      return;
    }

    // Production mode - real payment processing
    switch (selectedPaymentMethod) {
      case "razorpay":
        await initializeRazorpayPayment(cart.id, { testMode: false });
        break;
      case "stripe":
        await initializeStripePayment(cart.id, { testMode: false });
        break;
      case "cod":
        const { order: codOrder } = await completeCart(cart.id);
        router.push(`/order/confirmed/${codOrder.id}`);
        break;
      case "upi":
        await initializeUpiPayment(cart.id);
        break;
    }
  };

  // Payment Step UI with conditional rendering
  {currentStep === "payment" && (
    <div className="space-y-6">
      {/* Mode Indicator */}
      {(isDemoMode() || isSandboxMode()) && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-none">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <span className="font-medium text-amber-800">
              {isDemoMode() ? "Demo Mode Active" : "Sandbox/Test Mode Active"}
            </span>
          </div>
          <p className="text-sm text-amber-700 mt-1">
            {isDemoMode() 
              ? "Payments will be simulated. No actual charges will occur." 
              : "Use test credentials. No real money will be charged."}
          </p>
        </div>
      )}

      {/* Payment Methods - Only Show Enabled */}
      <div className="space-y-3">
        {enabledMethods.map((method) => (
          <PaymentMethodCard
            key={method.id}
            method={method}
            selected={selectedPaymentMethod === method.id}
            onSelect={() => setSelectedPaymentMethod(method.id)}
            testCredentials={isSandboxMode() ? method.sandboxConfig : undefined}
          />
        ))}
        
        {enabledMethods.length === 0 && (
          <div className="text-center py-8 bg-muted">
            <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              No payment methods available. Please contact support.
            </p>
          </div>
        )}
      </div>

      {/* Conditional Payment Forms */}
      {selectedPaymentMethod === "card" && isPaymentMethodEnabled("card") && (
        <CardPaymentForm testMode={isSandboxMode()} />
      )}
      
      {selectedPaymentMethod === "upi" && isPaymentMethodEnabled("upi") && (
        <UpiPaymentForm 
          testMode={isSandboxMode()}
          testUpiId={enabledMethods.find(m => m.id === "upi")?.sandboxConfig?.testUpiId}
        />
      )}

      {/* Place Order Button */}
      <Button
        onClick={handlePlaceOrder}
        disabled={!selectedPaymentMethod || enabledMethods.length === 0}
        className="w-full bg-primary hover:bg-primary/90 text-white rounded-none py-6"
      >
        {getPaymentButtonText()}
        <Lock className="w-4 h-4 ml-2" />
      </Button>
    </div>
  )}
}
```

### 4.4 Payment API Functions

**Add to** `storefront/src/lib/medusa.ts`:

```typescript
// ============================================
// Payment API Functions
// ============================================

/**
 * Initialize payment session for a cart
 * Creates a payment session with the selected provider
 */
export async function initializePayment(
  cartId: string, 
  providerId: string
): Promise<{ cart: Cart }> {
  return fetchFromMedusa(`/store/carts/${cartId}/payment-sessions`, {
    method: "POST",
    body: JSON.stringify({ provider_id: providerId }),
  });
}

/**
 * Update existing payment session
 * Use when cart totals change or payment method needs refresh
 */
export async function updatePaymentSession(
  cartId: string, 
  providerId: string
): Promise<{ cart: Cart }> {
  return fetchFromMedusa(`/store/carts/${cartId}/payment-sessions/${providerId}`, {
    method: "POST",
  });
}

/**
 * Authorize payment session
 * Called after collecting payment details (card, UPI, etc.)
 */
export async function authorizePaymentSession(
  cartId: string,
  providerId: string,
  data?: Record<string, any>
): Promise<{ cart: Cart }> {
  return fetchFromMedusa(`/store/carts/${cartId}/payment-sessions/${providerId}/authorize`, {
    method: "POST",
    body: JSON.stringify(data || {}),
  });
}

/**
 * Complete cart and create order
 * Final step after payment is authorized
 */
export async function completeCart(cartId: string): Promise<{ order: any; cart?: Cart }> {
  return fetchFromMedusa(`/store/carts/${cartId}/complete`, {
    method: "POST",
  });
}

/**
 * Get available payment providers
 * Returns list of configured payment methods from backend
 */
export async function getPaymentProviders(regionId?: string): Promise<{ 
  payment_providers: Array<{
    id: string;
    is_installed: boolean;
  }> 
}> {
  const params = regionId ? `?region_id=${regionId}` : "";
  return fetchFromMedusa(`/store/payment-providers${params}`);
}
```

### 4.5 Payment Method Components

**New File**: `storefront/src/components/payment/PaymentMethodCard.tsx`

```typescript
"use client";

import { CreditCard, Banknote, Smartphone, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaymentMethodCardProps {
  method: {
    id: string;
    name: string;
    description: string;
    icon: string;
  };
  selected: boolean;
  onSelect: () => void;
  testCredentials?: {
    testCardNumber?: string;
    testUpiId?: string;
  };
}

const iconMap = {
  CreditCard,
  Banknote,
  Smartphone,
};

export function PaymentMethodCard({ 
  method, 
  selected, 
  onSelect,
  testCredentials 
}: PaymentMethodCardProps) {
  const Icon = iconMap[method.icon as keyof typeof iconMap] || CreditCard;
  
  return (
    <label
      className={cn(
        "flex flex-col gap-2 p-4 border cursor-pointer transition-colors",
        selected
          ? "border-primary bg-primary/5"
          : "border-border hover:border-muted-foreground/50"
      )}
    >
      <div className="flex items-center gap-4">
        <input
          type="radio"
          name="payment"
          value={method.id}
          checked={selected}
          onChange={onSelect}
          className="w-4 h-4 accent-primary"
        />
        <Icon className="w-5 h-5 text-muted-foreground" />
        <div className="flex-1">
          <p className="font-medium">{method.name}</p>
          <p className="text-sm text-muted-foreground">{method.description}</p>
        </div>
      </div>
      
      {/* Test Credentials in Sandbox Mode */}
      {testCredentials && (
        <div className="ml-8 mt-2 p-3 bg-amber-50 border border-amber-200 text-xs">
          <p className="font-medium text-amber-800 mb-1">Test Credentials:</p>
          {testCredentials.testCardNumber && (
            <p className="text-amber-700">Card: {testCredentials.testCardNumber}</p>
          )}
          {testCredentials.testUpiId && (
            <p className="text-amber-700">UPI ID: {testCredentials.testUpiId}</p>
          )}
        </div>
      )}
    </label>
  );
}
```

---

## Phase 5: Content & CMS (PRIORITY: LOW)

### 5.1 Hero Banner Management

**Options**:
1. **Medusa CMS Plugin** - Use admin to manage banners
2. **Strapi/Contentful** - Headless CMS integration
3. **Hardcoded with env vars** - Simple but less flexible

**Recommended**: Start with option 3, migrate to option 1 or 2 later

### 5.2 Reviews & Ratings

**Implementation Options**:
1. Extend Medusa product with reviews
2. Use third-party service (Judge.me, Yotpo)
3. Custom module

---

## Implementation Roadmap

### Week 1: Foundation
- [ ] Update seed script with jewelry products
- [ ] Add INR currency and India region
- [ ] Run seed and verify data
- [ ] Test basic product fetching

### Week 2: Product Display
- [ ] Implement category-based product fetching
- [ ] Create category pages
- [ ] Update homepage with dynamic sections
- [ ] Implement search functionality

### Week 3: Cart & Checkout
- [ ] Verify cart functionality end-to-end
- [ ] Create payment flag configuration system
- [ ] Implement flag-based payment method selection
- [ ] Integrate payment provider (Razorpay) with sandbox support
- [ ] Complete checkout flow with all modes (demo/sandbox/production)
- [ ] Add order confirmation page with mode indicators

### Week 4: Customer Features
- [ ] Customer registration/login
- [ ] Account page
- [ ] Order history
- [ ] Wishlist feature

### Week 5: Polish
- [ ] SEO optimization (metadata, structured data)
- [ ] Error handling and loading states
- [ ] Performance optimization
- [ ] Testing and bug fixes

---

## Environment Configuration

### Backend `.env`
```env
MEDUSA_ADMIN_ONBOARDING_TYPE=default
STORE_CORS=http://localhost:8000,http://localhost:3002,https://docs.medusajs.com
ADMIN_CORS=http://localhost:5173,http://localhost:9111,https://docs.medusajs.com
AUTH_CORS=http://localhost:5173,http://localhost:9111,http://localhost:8000,http://localhost:3002,https://docs.medusajs.com
REDIS_URL=redis://localhost:6379
JWT_SECRET=supersecret
COOKIE_SECRET=supersecret
DATABASE_URL=postgres://tatva_dev:pwd@localhost:5444/tatva
PORT=9111

# Payment (Razorpay)
RAZORPAY_KEY_ID=rzp_test_xxx
RAZORPAY_KEY_SECRET=xxx
```

### Storefront `.env.local`
```env
# Core Medusa Configuration
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9111
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_API_KEY=pk_xxx
NEXT_PUBLIC_STOREFRONT_URL=http://localhost:3002

# Razorpay (required if ENABLE_RAZORPAY=true)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxx

# ============================================
# PAYMENT FEATURE FLAGS
# ============================================

# Payment Mode: "demo" | "sandbox" | "production"
# demo: Simulates payments without any processing
# sandbox: Uses test credentials with payment providers
# production: Real payment processing
NEXT_PUBLIC_PAYMENT_MODE=demo

# Enable/disable specific payment methods (true/false)
NEXT_PUBLIC_ENABLE_COD=true              # Cash on Delivery
NEXT_PUBLIC_ENABLE_RAZORPAY=false        # Razorpay integration
NEXT_PUBLIC_ENABLE_STRIPE=false          # Stripe integration
NEXT_PUBLIC_ENABLE_UPI=true              # UPI payments

# Demo Mode Settings
NEXT_PUBLIC_DEMO_AUTO_SUCCESS=true       # Auto-succeed in demo mode (no manual confirmation)

# Development/Testing Flags
NEXT_PUBLIC_SKIP_PAYMENT=false           # Skip payment entirely (for checkout flow testing)
```

---

## Key Files Summary

| File | Purpose | Status |
|------|---------|--------|
| `backend/src/scripts/seed.ts` | Dummy data creation | NEEDS UPDATE |
| `storefront/src/lib/medusa.ts` | API client | ✅ Complete |
| `storefront/src/lib/payment-config.ts` | Payment flags & config | ⬜ To Create |
| `storefront/src/context/CartContext.tsx` | Cart state management | ✅ Complete |
| `storefront/src/app/page.tsx` | Homepage | Needs category filters |
| `storefront/src/app/product/[handle]/page.tsx` | Product detail | ✅ Complete |
| `storefront/src/app/checkout/page.tsx` | Checkout flow | Needs payment integration |
| `storefront/src/components/ProductCard.tsx` | Product display | ✅ Complete |
| `storefront/src/components/CartDrawer.tsx` | Cart drawer | ✅ Complete |

---

## Testing Checklist

### Backend
- [ ] Seed script runs without errors
- [ ] All products have proper variants and prices
- [ ] Inventory levels are set correctly
- [ ] Shipping options are configured for India
- [ ] Payment provider is working

### Storefront
- [ ] Products load on homepage
- [ ] Category pages show correct products
- [ ] Product detail pages work
- [ ] Add to cart functionality works
- [ ] Cart drawer updates correctly
- [ ] Checkout flow completes
- [ ] Search returns relevant results
- [ ] Mobile responsiveness

### Payment Flow (Test Each Configuration)

**Test Configuration 1: Demo Mode**
```env
NEXT_PUBLIC_PAYMENT_MODE=demo
NEXT_PUBLIC_ENABLE_COD=true
NEXT_PUBLIC_ENABLE_RAZORPAY=false
NEXT_PUBLIC_DEMO_AUTO_SUCCESS=true
```
- [ ] Place order succeeds without payment
- [ ] Order confirmation shows demo badge

**Test Configuration 2: Sandbox Mode with Razorpay**
```env
NEXT_PUBLIC_PAYMENT_MODE=sandbox
NEXT_PUBLIC_ENABLE_COD=true
NEXT_PUBLIC_ENABLE_RAZORPAY=true
```
- [ ] Test card credentials displayed
- [ ] Razorpay test checkout opens
- [ ] Payment succeeds with test card

**Test Configuration 3: COD Only**
```env
NEXT_PUBLIC_PAYMENT_MODE=production
NEXT_PUBLIC_ENABLE_COD=true
NEXT_PUBLIC_ENABLE_RAZORPAY=false
NEXT_PUBLIC_ENABLE_UPI=false
```
- [ ] Only COD option shown
- [ ] Order places successfully

**Test Configuration 4: Skip Payment (Dev Testing)**
```env
NEXT_PUBLIC_SKIP_PAYMENT=true
```
- [ ] Payment step skipped entirely
- [ ] Order completes immediately

---

## Next Steps

1. **Immediate**: Update the seed script with jewelry products
2. **This Week**: Implement category-based filtering on homepage
3. **Next Week**: Complete checkout with payment integration
4. **Following**: Add customer authentication

---

## Resources

- [Medusa Store API Reference](https://docs.medusajs.com/api/store)
- [Medusa JS SDK](https://docs.medusajs.com/js-sdk)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Razorpay Integration Guide](https://razorpay.com/docs/payments/payment-gateway/web-integration/)
