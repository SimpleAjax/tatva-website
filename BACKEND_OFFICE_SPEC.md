# Tatva Backend Office Management - Comprehensive Specification

> **A Detailed Technical Specification for Wholesaler Management, SKU Operations, P&L Tracking, Catalog Generation, Product Lifecycle Tracking, and Admin Dashboard**
> 
> **Version**: 1.0  
> **Date**: March 2026  
> **Platform**: Medusa.js v2 + Next.js  
> **Current Focus**: Anti-Tarnish Jewelry (Rings, Necklaces, Earrings, Bracelets)  
> **Future Ready**: Extensible to Watches, Purses, Accessories & More

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Architecture Overview](#2-architecture-overview)
3. [Module 1: Wholesaler Management](#3-module-1-wholesaler-management)
4. [Module 2: SKU Management](#4-module-2-sku-management)
5. [Module 3: SKU-Level P&L Tracking](#5-module-3-sku-level-pl-tracking)
6. [Module 4: Catalog Generator](#6-module-4-catalog-generator)
7. [Module 5: Product Lifecycle Tracking](#7-module-5-product-lifecycle-tracking)
8. [Module 6: Admin Dashboard & Reporting](#8-module-6-admin-dashboard--reporting)
9. [Integration Architecture](#9-integration-architecture)
10. [Implementation Roadmap](#10-implementation-roadmap)
11. [Appendix: Data Models](#appendix-data-models)

---

## 1. Executive Summary

### 1.1 Purpose

This document defines the complete technical specification for Tatva's backend office management system — a suite of custom Medusa modules designed specifically for **anti-tarnish jewelry** operations, with an extensible architecture ready to support future product categories like watches, purses, and accessories. The system bridges the gap between generic e-commerce platforms and the unique requirements of jewelry inventory management.

### 1.2 Key Differentiators

```
┌─────────────────────────────────────────────────────────────────┐
│              TATVA BACKEND OFFICE CAPABILITIES                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  CURRENT FOCUS: Anti-Tarnish Jewelry                            │
│  • Rings • Necklaces • Earrings • Bracelets • Anklets           │
│                                                                  │
│  FUTURE READY: Extensible Category System                       │
│  • Watches • Purses • Handbags • Accessories • [Add More]       │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│  🔴 INBOUND FLOW (We Buy)     🟢 OUTBOUND FLOW (We Sell)        │
│  ════════════════════════     ═════════════════════════         │
│                                                                  │
│  Wholesaler ───────▶ Tatva    Tatva ───────▶ Customer           │
│                                                                  │
│  Modules:                     Modules:                          │
│  • Wholesaler Management      • Catalog Generator               │
│  • SKU Management (create)    • P&L Tracking                    │
│  • Purchase Orders            • Product Lifecycle               │
│                               • SKU Management (sell)           │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│  CORE VALUE: Complete traceability from source to customer      │
│                                                                  │
│  For every SKU we know:                                         │
│  🔴 WHERE it came from (which wholesaler, at what cost)         │
│  🟢 WHAT happened when we sold it (delivery, review, return)    │
│  💰 HOW much profit we made (true net margin)                   │
│  📦 WHEN to reorder (based on velocity and lead times)          │
│  ✨ TARNISH RESISTANCE quality tracking (anti-tarnish focus)    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 1.3 Module Summary

| Module | Direction | Purpose | Key Value |
|--------|-----------|---------|-----------|
| **Wholesaler Management** | 🔴 INBOUND | Manage suppliers who sell TO us | Make data-driven supplier decisions |
| **SKU Management** | 📦 BOTH | Standardized numbering — **Jewelry now, extensible to Watches/Purses** | Eliminate inventory chaos |
| **P&L Tracking** | 🟢 OUTBOUND | True cost and profit when we sell | Know actual margins, not guesswork |
| **Catalog Generator** | 🟢 OUTBOUND | Beautiful catalogs — **Multi-category ready** | Sales enablement |
| **Product Lifecycle** | 🟢 OUTBOUND | Track products we ship TO customers | Complete post-sale visibility |
| **Admin Dashboard** | 📦 BOTH | Unified view — **Current: Jewelry, Future: Multi-category** | Single source of truth |

> **✨ Anti-Tarnish Focus**: All jewelry-specific features (material tracking, quality inspection, tarnish resistance ratings) are designed for anti-tarnish products first, with easy extension to other categories.

### Inbound vs Outbound - What This Means

```
┌─────────────────────────────────────────────────────────────────────┐
│                    TWO BUSINESS FLOWS                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  🔴 INBOUND FLOW (We are the BUYER)                                 │
│  ═══════════════════════════════════                                │
│                                                                      │
│  Wholesaler (Supplier)  ───────▶  Tatva (Us)  ───────▶  Inventory   │
│  (Shree Jewels Jaipur)           (Tatva Store)        (Our Warehouse)│
│                                                                      │
│  Modules tracking this:                                             │
│  • Wholesaler Management - Who we buy from                          │
│  • SKU Management - What we bought, at what cost                    │
│  • Purchase Orders - Orders WE place with suppliers                 │
│                                                                      │
│  Key Metrics: Purchase Value, Lead Time, Quality Rating             │
│                                                                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  🟢 OUTBOUND FLOW (We are the SELLER)                               │
│  ═════════════════════════════════════                              │
│                                                                      │
│  Tatva (Us)  ───────▶  Customer  ───────▶  Delivery/Review/Return   │
│  (Tatva Store)         (End Buyer)        (Post-sale lifecycle)     │
│                                                                      │
│  Modules tracking this:                                             │
│  • Catalog Generator - How we showcase to customers                 │
│  • P&L Tracking - Profit when we sell                               │
│  • Product Lifecycle - Delivery, reviews, returns                   │
│  • Orders - Orders CUSTOMERS place with us                          │
│                                                                      │
│  Key Metrics: Revenue, Margin, Customer Satisfaction, Return Rate   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 1.4 Terminology Clarification

To avoid confusion throughout this document, we use specific terms for each direction of business flow:

| Term | Direction | Meaning | Example |
|------|-----------|---------|---------|
| **Purchase Order (PO)** | 🔴 INBOUND | Order WE place with a supplier to BUY inventory | "We sent PO #123 to Shree Jewels for 50 rings" |
| **Customer Order** | 🟢 OUTBOUND | Order a CUSTOMER places with us to BUY products | "Customer placed Order #456 for 2 necklaces" |
| **Wholesaler / Supplier** | 🔴 INBOUND | Company that SELLS TO us | Shree Jewels, Royal Gems |
| **Customer / Buyer** | 🟢 OUTBOUND | Person who BUYS FROM us | Priya, Rahul (end consumers) |
| **Buy Cost** | 🔴 INBOUND | What WE pay to acquire inventory | ₹500 per ring (from wholesaler) |
| **Selling Price** | 🟢 OUTBOUND | What CUSTOMERS pay to buy from us | ₹1,299 per ring (customer pays) |
| **Inbound Delivery** | 🔴 INBOUND | Shipping from Wholesaler → Tatva | Shree Jewels ships to our warehouse |
| **Outbound Delivery** | 🟢 OUTBOUND | Shipping from Tatva → Customer | We ship to customer's home |

### 1.5 Product Lifecycle Tracking - NEW

The Product Lifecycle Tracking module adds complete **post-sale visibility** to the system:

```
┌─────────────────────────────────────────────────────────────────┐
│            PRODUCT LIFECYCLE CAPABILITIES                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  📦 SHIPMENT                    ⭐ REVIEW                        │
│  ├── Courier integration        ├── Automated collection         │
│  ├── Real-time tracking         ├── Moderation workflow          │
│  ├── Customer notifications     ├── Photo reviews                │
│  └── Delivery confirmation      └── Response management          │
│                                                                  │
│  🔄 RETURNS & EXCHANGE                                           │
│  ├── Return request workflow    🔍 QUALITY                       │
│  ├── Pickup scheduling              INSPECTION                   │
│  ├── Quality inspection         ├── Condition assessment         │
│  ├── Refund processing          ├── Restocking decisions         │
│  └── Analytics & insights       └── Vendor feedback              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Architecture Overview

### 2.1 Medusa Module Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              MEDUSA BACKEND (Port 9111)                          │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐         │
│  │                     FLOW DIRECTION LEGEND                            │         │
│  │  🔴 INBOUND = We BUY from Wholesalers → Inventory comes IN          │         │
│  │  🟢 OUTBOUND = We SELL to Customers → Products go OUT               │         │
│  │  📦 BOTH = Universal functions serving both flows                   │         │
│  └─────────────────────────────────────────────────────────────────────┘         │
│                                                                                  │
│  NATIVE MEDUSA MODULES                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                           │
│  │   PRODUCT    │  │    ORDER     │  │   CUSTOMER   │                           │
│  │   MODULE     │  │    MODULE    │  │   MODULE     │                           │
│  │   (📦 BOTH)  │  │  (🟢 OUT)    │  │  (🟢 OUT)    │                           │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘                           │
│         │                 │                 │                                     │
│         └─────────────────┼─────────────────┘                                     │
│                           │                                                       │
│  CUSTOM MODULES                                                                  │
│  ┌────────────────────────┴────────────────────────┐                              │
│  │                                                  │                              │
│  │  🔴 INBOUND MODULES (Supplier Management)        │                              │
│  │  ┌─────────────────────────────────────────┐     │                              │
│  │  │  WHOLESALER MANAGEMENT MODULE           │     │                              │
│  │  │  • Track suppliers we buy FROM          │     │                              │
│  │  │  • Purchase orders we PLACE             │     │                              │
│  │  │  • Quality & lead time tracking         │     │                              │
│  │  └─────────────────────────────────────────┘     │                              │
│  │                                                  │                              │
│  │  📦 UNIVERSAL MODULES (Inventory)                │                              │
│  │  ┌─────────────────────────────────────────┐     │                              │
│  │  │  SKU MANAGEMENT MODULE                  │     │                              │
│  │  │  • Created when we BUY (inbound)        │     │                              │
│  │  │  • Sold when we SELL (outbound)         │     │                              │
│  │  │  • Tracks stock levels 📦               │     │                              │
│  │  └─────────────────────────────────────────┘     │                              │
│  │                                                  │                              │
│  │  🟢 OUTBOUND MODULES (Customer Sales)            │                              │
│  │  ┌─────────────────────────────────────────┐     │                              │
│  │  │  P&L TRACKING MODULE                    │     │                              │
│  │  │  • Profit when we SELL                  │     │                              │
│  │  │  • Costs: buy + ship + ads + fees       │     │                              │
│  │  └─────────────────────────────────────────┘     │                              │
│  │  ┌─────────────────────────────────────────┐     │                              │
│  │  │  CATALOG GENERATOR MODULE               │     │                              │
│  │  │  • Showcase products TO customers       │     │                              │
│  │  │  • Sales & marketing tool               │     │                              │
│  │  └─────────────────────────────────────────┘     │                              │
│  │  ┌─────────────────────────────────────────┐     │                              │
│  │  │  PRODUCT LIFECYCLE MODULE               │     │                              │
│  │  │  • Ship TO customer                     │     │                              │
│  │  │  • Delivery, review, return tracking    │     │                              │
│  │  └─────────────────────────────────────────┘     │                              │
│  │                                                  │                              │
│  └──────────────────────────────────────────────────┘                              │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐         │
│  │                         DATABASE (PostgreSQL)                        │         │
│  │  • Purchase Orders (INBOUND)                                         │         │
│  │  • Inventory/SKUs (BOTH)                                             │         │
│  │  • Customer Orders (OUTBOUND)                                        │         │
│  │  • Shipments/Reviews/Returns (OUTBOUND)                              │         │
│  └─────────────────────────────────────────────────────────────────────┘         │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Entity Relationship Overview

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         ENTITY RELATIONSHIPS BY FLOW                             │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  🔴 INBOUND FLOW (We BUY from Wholesalers)                                       │
│  ══════════════════════════════════════════                                      │
│                                                                                  │
│  ┌────────────────┐         ┌──────────────┐         ┌────────────────┐         │
│  │  WHOLESALER    │────────▶│  PURCHASE    │────────▶│  INVENTORY     │         │
│  │  (Supplier)    │  places │  ORDER       │ creates │  (Stock IN)    │         │
│  │  ──────────    │         │  ──────────  │         │  ───────────   │         │
│  │  Shree Jewels  │         │  PO #001     │         │  SKU created   │         │
│  │  Royal Gems    │         │  50 rings    │         │  Cost: ₹500    │         │
│  └────────────────┘         └──────────────┘         └────────────────┘         │
│                                                                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  🟢 OUTBOUND FLOW (We SELL to Customers)                                         │
│  ════════════════════════════════════════                                        │
│                                                                                  │
│  ┌────────────────┐         ┌──────────────┐         ┌────────────────┐         │
│  │  INVENTORY     │────────▶│  CUSTOMER    │────────▶│  SHIPMENT      │         │
│  │  (Stock)       │ fulfills│  ORDER       │ creates │  (Stock OUT)   │         │
│  │  ───────────   │         │  ──────────  │         │  ───────────   │         │
│  │  SKU: RNG-001  │         │  Order #123  │         │  Tracking #    │         │
│  │  Qty: 1        │         │  ₹12,999     │         │  Courier       │         │
│  └────────────────┘         └──────┬───────┘         └────────┬───────┘         │
│                                    │                          │                  │
│                                    ▼                          ▼                  │
│                           ┌────────────────┐      ┌──────────────────┐          │
│                           │  P&L CALC      │      │  POST-SALE       │          │
│                           │  ──────────    │      │  ────────────    │          │
│                           │  Revenue       │      │  Delivery        │          │
│                           │  Costs         │      │  Review          │          │
│                           │  Net Profit    │      │  Return          │          │
│                           └────────────────┘      └──────────────────┘          │
│                                                                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  📦 SKU: THE BRIDGE BETWEEN FLOWS                                                │
│  ════════════════════════════════                                                │
│                                                                                  │
│          🔴 INBOUND                    🟢 OUTBOUND                               │
│                                                                                  │
│      Wholesaler A sells          Customer buys                                   │
│      SKU: RNG-001                SKU: RNG-001                                    │
│      at: ₹500                    at: ₹12,999                                     │
│           │                           │                                          │
│           └───────────┬───────────────┘                                          │
│                       │                                                          │
│                       ▼                                                          │
│              ┌─────────────────┐                                                 │
│              │  PROFIT = ₹7,249│  (Net after all costs)                          │
│              └─────────────────┘                                                 │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Module 1: Wholesaler Management

> **🔴 INBOUND FLOW** — Managing suppliers who sell inventory TO Tatva  
> **Question Answered**: "Who do we buy from, and how good are they?"

### 3.1 Overview

The Wholesaler Management Module tracks our **inbound supply chain** — the suppliers (wholesalers/manufacturers) from whom Tatva purchases jewelry inventory. Every product in our warehouse can be traced back to its source wholesaler, complete with historical performance data on quality, pricing, and reliability.

```
INBOUND FLOW REPRESENTATION:

   Shree Jewels (Jaipur)         Tatva Warehouse
   ┌───────────────┐             ┌───────────────┐
   │  Supplier/    │  ───────▶   │    Buyer      │
   │  Wholesaler   │   PO #001   │   (Tatva)     │
   └───────────────┘             └───────────────┘
          │
          ├── Sends: 50 rings
          ├── At: ₹500/unit  
          ├── Quality: ★★★★☆
          └── Lead time: 7 days
```

### 3.2 Core Features

> **All features in this section track our INBOUND purchasing from suppliers**

#### 3.2.1 Wholesaler Onboarding

**Purpose**: Record details of suppliers we BUY inventory FROM

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `id` | UUID | Unique identifier | `whl_abc123` |
| `name` | String | **Supplier** Business name | "Shree Jewels Jaipur" |
| `contact_person` | String | Who we negotiate with | "Rajesh Kumar" |
| `phone` | String | Contact for orders | "+91-98765-43210" |
| `email` | String | For POs and invoices | "rajesh@shreejewels.in" |
| `address` | JSON | Where we send payments | `{street, city, state, pincode}` |
| `location` | String | Sourcing region | "Johari Bazaar, Jaipur" |
| `categories` | Array | What they sell us | `["rings", "necklaces"]` |
| `gst_number` | String | Their tax ID | "08ABCDE1234F1Z5" |
| `bank_details` | JSON | Where we pay | `{account, ifsc, bank_name}` |
| `created_at` | Date | When we started buying | 2026-01-15 |

#### 3.2.2 Quality Rating System

```typescript
interface QualityMetrics {
  // Overall rating (1-5 stars, calculated)
  overall_rating: number;
  
  // Component ratings
  ratings: {
    product_quality: number;      // Craftsmanship, finish
    packaging_quality: number;    // How well items are packed
    communication: number;        // Response time, clarity
    delivery_reliability: number; // On-time delivery %
    price_competitiveness: number; // Value for money
  };
  
  // Historical trend
  rating_history: {
    month: string;
    rating: number;
    review_count: number;
  }[];
  
  // Statistics
  total_orders: number;
  total_items_delivered: number;
  defective_returns: number;
  return_rate: number; // percentage
}
```

**Rating Flow:**
```
Order Received → Quality Check → Rate Wholesaler → Update Aggregate
                     │
                     ▼
            ┌────────────────┐
            │ Quality Check  │
            │   Worksheet    │
            ├────────────────┤
            □ Material match │
            □ Finish quality │
            □ Stone quality  │
            □ Weight accuracy│
            □ Packaging      │
            └────────────────┘
```

#### 3.2.3 Business Rules Per Wholesaler

| Rule Type | Description | Use Case |
|-----------|-------------|----------|
| `min_order_quantity` | Minimum items per order | Wholesaler A requires 50+ pieces |
| `min_order_value` | Minimum order amount (INR) | ₹25,000 minimum for orders |
| `price_tiers` | Volume-based pricing | 1-10: ₹100, 11-50: ₹90, 51+: ₹80 |
| `lead_time_days` | Standard delivery time | 7-10 days for Jaipur suppliers |
| `payment_terms` | Credit/prepay requirements | "50% advance, 50% on delivery" |
| `shipping_zones` | Areas they deliver to | Pan-India, North-India only |

```typescript
interface WholesalerRules {
  // Minimums
  min_order_quantity: number;     // Default: 1
  min_order_value: number;        // In paise (INR * 100)
  
  // Pricing
  price_tiers: PriceTier[];
  
  // Logistics
  lead_time_days: {               // By priority
    standard: number;             // Default lead time
    rush: number;                 // Express orders (+cost)
  };
  
  // Payment
  payment_terms: {
    type: 'advance_full' | 'advance_partial' | 'cod' | 'credit';
    advance_percentage?: number;  // For partial advance
    credit_days?: number;         // For credit terms
  };
  
  // Categories they specialize in
  category_specializations: {
    category: string;
    min_quantity: number;
    price_adjustment: number;     // +/- percentage
  }[];
}
```

#### 3.2.4 Lead Time Tracking

```typescript
interface LeadTimeRecord {
  id: string;
  wholesaler_id: string;
  order_placed_at: Date;
  order_received_at: Date;
  actual_lead_days: number;
  promised_lead_days: number;
  variance_days: number;          // + means late, - means early
  
  // Context for analysis
  order_size: number;             // Number of items
  order_value: number;
  category_mix: string[];         // Categories in order
  
  // Performance flags
  was_delayed: boolean;
  delay_reason?: string;
}

// Analytics view
interface LeadTimeAnalytics {
  wholesaler_id: string;
  period: string;                 // "2026-02"
  avg_lead_time: number;
  on_time_delivery_rate: number;  // percentage
  avg_delay_days: number;         // When delayed
  trend: 'improving' | 'stable' | 'worsening';
}
```

#### 3.2.5 Low Inventory Alerts & Auto-Suggestions

```typescript
interface InventoryAlert {
  id: string;
  sku_id: string;
  product_title: string;
  current_stock: number;
  reorder_point: number;          // Threshold
  suggested_reorder_qty: number;  // Based on velocity
  
  // Wholesaler suggestions (ranked)
  wholesaler_suggestions: {
    wholesaler_id: string;
    wholesaler_name: string;
    rating: number;
    unit_cost: number;            // Historical avg
    lead_time_days: number;
    can_fulfill: boolean;         // Has stock?
    last_ordered: Date;
    score: number;                // Composite ranking
  }[];
  
  // Projected stockout
  days_until_stockout: number;    // Based on sales velocity
  urgency: 'low' | 'medium' | 'high' | 'critical';
}

// Alert triggers
const ALERT_TRIGGERS = {
  REORDER_POINT: 'stock_at_reorder_threshold',
  VELOCITY_SPIKE: 'selling_faster_than_forecast',
  SEASONAL_PREP: 'upcoming_season_demand',
  SUPPLIER_DELAY: 'wholesaler_reported_delay',
};
```

**Alert Workflow:**
```
Inventory Check (Daily Cron)
         │
         ▼
┌─────────────────┐
│ Stock < 20% of  │
│ reorder point?  │
└────────┬────────┘
         │ YES
         ▼
┌─────────────────┐
│ Calculate       │
│ velocity &      │
│ suggest Qty     │
└────────┬────────┘
         ▼
┌─────────────────┐
│ Rank suppliers  │
│ by: cost +      │
│ quality + avail │
└────────┬────────┘
         ▼
┌─────────────────┐
│ Create alert    │
│ Send to admin   │
└─────────────────┘
```

#### 3.2.6 Wholesaler ↔ SKU Linkage

Every SKU in the system maintains a link to its source:

```typescript
interface SkuWholesalerLink {
  id: string;
  
  // SKU identification
  sku: string;                    // "RNG-001-GOLD"
  product_id: string;             // Medusa product ID
  variant_id: string;             // Medusa variant ID
  
  // Wholesaler reference
  wholesaler_id: string;
  wholesaler_sku?: string;        // Their internal code
  
  // Batch tracking
  batch_id: string;               // Purchase batch reference
  purchase_order_id: string;
  
  // Cost at purchase
  unit_cost: number;              // In paise
  quantity_purchased: number;
  purchase_date: Date;
  
  // For inventory valuation (FIFO/LIFO/Weighted)
  remaining_quantity: number;
  is_fully_sold: boolean;
}

// Query: "Show me all items from Shree Jewels in last 3 months"
// Query: "Which wholesaler gave us the best margin on rings?"
```

#### 3.2.7 Wholesaler History & Performance

> **⚠️ IMPORTANT DISTINCTION**: This tracks **Purchase Orders** (INBOUND - we buy FROM them)  
> **NOT Customer Orders** (OUTBOUND - we sell TO customers)

```typescript
interface WholesalerHistory {
  // Purchase Orders WE placed with this supplier (INBOUND)
  total_purchases: {
    purchase_order_count: number; // NOT customer orders
    total_items_bought: number;   // From this wholesaler
    total_value_spent: number;    // INR we paid them
    avg_purchase_order_value: number;
  };
  
  // Timeline of all orders
  orders: {
    order_id: string;
    date: Date;
    items_count: number;
    total_value: number;
    status: 'completed' | 'partial' | 'cancelled';
  }[];
  
  // SKU-level history
  sku_performance: {
    sku: string;
    total_ordered: number;
    avg_unit_cost: number;
    price_trend: number[];        // Last 6 months
  }[];
  
  // Quality feedback log
  quality_feedback: {
    date: Date;
    order_id: string;
    rating: number;
    notes: string;
    issues?: string[];
  }[];
}
```

### 3.3 Admin UI Design

```
┌─────────────────────────────────────────────────────────────────────┐
│ WHOLESALERS LIST                              [+ Add Wholesaler]   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ 🔍 Search...    [Filter ▼]    [Export]    [Bulk Actions ▼]     │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                     │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ ★★★★☆  Shree Jewels Jaipur                     Active    [Edit] │ │
│ │         📍 Jaipur, Rajasthan  |  💍 Rings, Necklaces            │ │
│ │         📦 12 orders  |  ₹4.2L total  |  7-day avg lead time    │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ ★★★★★  Royal Gems Delhi                        Active    [Edit] │ │
│ │         📍 Chandni Chowk, Delhi  |  👑 Bridal Sets              │ │
│ │         📦 8 orders  |  ₹6.8L total  |  5-day avg lead time     │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.4 Additional Possibilities

| Feature | Description | Impact |
|---------|-------------|--------|
| **Negotiation Tracker** | Log quote history, counter-offers, final prices | Better bargaining power |
| **Supplier Scorecards** | Auto-generated monthly performance reports | Objective supplier reviews |
| **Multi-location Support** | Track which supplier location shipped which batch | Better logistics planning |
| **Contract Management** | Store MOU, agreements, rate contracts | Compliance & audit |
| **Supplier Portal** | Limited access for suppliers to see orders, invoices | Self-service, reduce emails |
| **Price Comparison** | See quotes from multiple suppliers for same SKU | Cost optimization |

---

## 4. Module 2: SKU Management

### 4.1 Overview

SKU Management brings order to inventory chaos. It defines a standardized numbering system, enables intelligent categorization, and provides tools for bulk operations and deduplication.

### 4.2 SKU Numbering System

#### 4.2.1 Standard Format

> **Current Categories**: Anti-Tarnish Jewelry  
> **Future Ready**: Watches, Purses, Accessories (add new codes as needed)

```
┌─────────────────────────────────────────────────────────────────────┐
│                    SKU FORMAT: XXX-NNNN-CCC-SSS                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  XXX   = Category Code (3 letters) — EXTENSIBLE                     │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  CURRENT: Anti-Tarnish Jewelry (Primary Focus)                │  │
│  │  • RNG = Rings                                               │  │
│  │  • NCK = Necklaces                                           │  │
│  │  • EAR = Earrings                                            │  │
│  │  • BRA = Bracelets                                           │  │
│  │  • ANK = Anklets                                             │  │
│  │  • BRD = Bridal Sets                                         │  │
│  ├───────────────────────────────────────────────────────────────┤  │
│  │  FUTURE: Easy to Add                                         │  │
│  │  • WTC = Watches                                             │  │
│  │  • PUR = Purses                                              │  │
│  │  • HBG = Handbags                                            │  │
│  │  • BEL = Belts                                               │  │
│  │  • SCA = Scarves                                             │  │
│  │  • [Your new category]                                       │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  NNNN  = Sequence Number (4 digits, auto-increment)                 │
│          0001, 0002, 0003...                                        │
│                                                                      │
│  CCC   = Material Code (3 letters) — Category-specific              │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  JEWELRY MATERIALS (Current)                                  │  │
│  │  • ATG = Anti-Tarnish Gold                                    │  │
│  │  • ATS = Anti-Tarnish Silver                                  │  │
│  │  • ATR = Anti-Tarnish Rose Gold                               │  │
│  │  • OXD = Oxidized (Decorative)                                │  │
│  │  • GLD = Pure Gold                                            │  │
│  │  • SLV = Pure Silver                                          │  │
│  ├───────────────────────────────────────────────────────────────┤  │
│  │  FUTURE MATERIALS (Examples)                                  │  │
│  │  • LTR = Leather (for Purses/Watches)                         │  │
│  │  • FAB = Fabric (for Scarves)                                 │  │
│  │  • MTL = Metal (for Watches)                                  │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  SSS   = Size/Variant Code (optional, 2-3 chars)                    │
│          S/M/L for sizes                                            │
│          16/18/20 for necklace lengths                              │
│          05-12 for ring sizes                                       │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘

EXAMPLES:
RNG-0042-ATG-08    = Ring #42, Anti-Tarnish Gold, Size 8
NCK-0103-ATS-18    = Necklace #103, Anti-Tarnish Silver, 18 inch
EAR-0234-OXD       = Earring #234, Oxidized (no size)
BRD-0005-ATR       = Bridal Set #5, Anti-Tarnish Rose Gold

FUTURE EXAMPLES:
WTC-0001-MTL-42    = Watch #1, Metal, 42mm face
PUR-0050-LTR-BLK   = Purse #50, Leather, Black
```

#### 4.2.2 Auto-Generation Rules

```typescript
interface SkuGenerationRules {
  // Category codes — EXTENSIBLE for future categories
  // Current: Anti-tarnish jewelry | Future: Watches, Purses, etc.
  category_codes: {
    // Jewelry (Current Focus)
    RNG: 'Rings',
    NCK: 'Necklaces',
    EAR: 'Earrings',
    BRA: 'Bracelets',
    ANK: 'Anklets',
    BRD: 'Bridal Sets',
    
    // Future Categories (Easy to add)
    // WTC: 'Watches',
    // PUR: 'Purses',
    // HBG: 'Handbags',
    // BEL: 'Belts',
    // SCA: 'Scarves',
  };
  
  // Material detection keywords — Category-specific
  material_keywords: {
    // Anti-Tarnish Jewelry (Current)
    anti_tarnish_gold: ['anti-tarnish gold', 'atg', 'tarnish-free gold'],
    anti_tarnish_silver: ['anti-tarnish silver', 'ats', 'tarnish-free silver'],
    anti_tarnish_rose: ['anti-tarnish rose gold', 'atr'],
    oxidized: ['oxidized', 'black silver', 'tribal', 'vintage oxidized'],
    
    // Traditional metals
    gold: ['gold', '18k', '22k', '916', 'hallmark gold'],
    silver: ['silver', '925', 'sterling'],
    rose_gold: ['rose gold', 'pink gold'],
    
    // Future materials (examples)
    // leather: ['leather', 'genuine leather', 'faux leather'],
    // fabric: ['cotton', 'silk', 'wool', 'linen'],
    // metal_watch: ['stainless steel', 'alloy'],
  };
  
  // Sequence management
  sequence: {
    category_prefix: string;
    last_number: number;
    padding: number;            // Minimum digits (4)
  }[];
  
  // Validation rules
  validation: {
    unique: true;
    format_regex: /^[A-Z]{3}-\d{4}-[A-Z]{3}(-[A-Z0-9]{2,3})?$/;
    reserved_prefixes: string[];
  };
}
```

### 4.3 Image-Based SKU Ingest

#### 4.3.1 Smart Product Onboarding

```
┌─────────────────────────────────────────────────────────────────────┐
│                    IMAGE-BASED INGEST FLOW                           │
└─────────────────────────────────────────────────────────────────────┘

Upload Image(s)
      │
      ▼
┌─────────────────┐
│ Visual Analysis │  ◄── AI/ML (Google Vision, AWS Rekognition, or
│                 │       custom model trained on jewelry)
│ • Detect type   │       (ring, necklace, earring, etc.)
│ • Detect metal  │
│ • Detect stones │
│ • Estimate style│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Similar Search  │  ◄── Find visually similar products online
│                 │       to suggest pricing & category
│ • Pinterest API │
│ • Google Lens   │
│ • Internal DB   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Auto-Tagging    │
│                 │
│ Category: Ring  │
│ Material: Gold  │
│ Style: Vintage  │
│ Stones: Ruby    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ SKU Generation  │  ◄── Based on detected attributes
│                 │
│ Suggested:      │
│ RNG-0043-GLD    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Admin Review    │  ◄── One-click confirm or edit
│ & Confirm       │
└─────────────────┘
```

#### 4.3.2 Technical Implementation

```typescript
interface ImageIngestService {
  // Step 1: Analyze uploaded image
  analyzeImage(imageUrl: string): Promise<VisualAnalysis>;
  
  // Step 2: Search for similar products
  findSimilarProducts(analysis: VisualAnalysis): Promise<SimilarProduct[]>;
  
  // Step 3: Generate suggestions
  generateSuggestions(
    analysis: VisualAnalysis,
    similar: SimilarProduct[]
  ): Promise<SkuSuggestion>;
}

interface VisualAnalysis {
  category: {
    detected: string;
    confidence: number;
    alternatives: string[];
  };
  material: {
    detected: string;
    confidence: number;
    color_hex?: string;
  };
  stones: {
    type: string;
    color: string;
    confidence: number;
  }[];
  style_tags: string[];
  estimated_price_range: {
    min: number;
    max: number;
    currency: string;
  };
}

interface SkuSuggestion {
  suggested_sku: string;
  suggested_category: string;
  suggested_material: string;
  suggested_tags: string[];
  suggested_price: number;
  confidence_score: number;
  requires_review: boolean;
}
```

### 4.4 Bulk SKU Upload

#### 4.4.1 CSV/Excel Import

```typescript
interface BulkUploadConfig {
  // Supported formats
  formats: ['csv', 'xlsx'];
  
  // Template structure
  template: {
    required_columns: [
      'product_name',
      'category',
      'material',
      'base_price',
      'initial_quantity'
    ];
    optional_columns: [
      'description',
      'weight_grams',
      'size_options',
      'stone_type',
      'wholesaler_id',
      'wholesaler_sku',
      'buy_cost',
      'images'
    ];
  };
  
  // Validation rules
  validation: {
    price_min: 100;              // ₹1 minimum
    price_max: 10000000;         // ₹1L max
    quantity_max: 10000;
    category_must_exist: true;
    auto_create_missing: false;  // Require manual category creation
  };
  
  // Processing options
  options: {
    generate_skus: true;         // Auto-generate if not provided
    skip_duplicates: 'error' | 'skip' | 'update';
    batch_size: 50;              // Process 50 at a time
    send_email_on_complete: true;
  };
}
```

#### 4.4.2 Upload Process Flow

```
Upload File
     │
     ▼
┌─────────────────┐
│ Parse & Validate│ ──▶ Error Report (if invalid)
│                 │      • Missing required fields
│ • Structure     │      • Invalid categories
│ • Data types    │      • Price out of range
│ • Duplicates    │
└────────┬────────┘
         │ Valid
         ▼
┌─────────────────┐
│ Preview Mode    │
│                 │
│ Showing 10/150  │
│ items:          │
│ ✓ Row 1: RNG-0001 (New)
│ ✓ Row 2: RNG-0002 (New)
│ ⚠ Row 3: RNG-0001 (Duplicate - will skip)
│ ...             │
└────────┬────────┘
         │ Confirm
         ▼
┌─────────────────┐
│ Process Import  │ ──▶ Progress: 45/150
│                 │ ──▶ Background job
│ • Create SKUs   │
│ • Link to Whl   │
│ • Set inventory │
│ • Upload images │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Import Complete │ ──▶ Email notification
│                 │      with summary report
│ ✓ 145 created   │
│ ⚠ 5 duplicates  │
│ ✗ 0 errors      │
└─────────────────┘
```

### 4.5 SKU Attributes for Jewelry

#### 4.5.1 Complete Attribute Schema

> **Extensible Design**: Current attributes support Anti-Tarnish Jewelry. Category-specific attributes can be added for Watches, Purses, etc.

```typescript
interface SkuAttributes {
  // === BASIC INFO ===
  sku: string;
  product_name: string;
  description: string;
  
  // === CATEGORIZATION (EXTENSIBLE) ===
  category: {
    primary: string;            // "rings" | "watches" | "purses"
    subcategory?: string;       // "engagement" | "analog" | "clutch"
    collection?: string;        // "wedding-edit" | "sport" | "evening"
    product_type: 'jewelry' | 'watch' | 'purse' | 'accessory' | string;
    tags: string[];             // ["bridal", "anti-tarnish"]
  };
  
  // === MATERIAL (Category-Specific) ===
  material: {
    // Current: Anti-Tarnish Jewelry
    primary: string;            // "anti-tarnish-gold", "anti-tarnish-silver"
    purity?: string;            // "22k", "925", "18k"
    plating?: string;           // "rhodium", "gold-plated"
    finish: 'polished' | 'matte' | 'brushed' | 'hammered';
    
    // Anti-Tarnish Specific
    tarnish_resistance: {
      is_anti_tarnish: boolean;           // true for current focus
      coating_type?: string;               // "e-coating", "lacquer", "rhodium"
      warranty_months?: number;            // e.g., 6 months, 1 year
      care_instructions: string;          // Special care for anti-tarnish
    };
    
    // Future: Watches could add: case_material, strap_material
    // Future: Purses could add: exterior_material, interior_material
  };
  
  // === STONES (Jewelry-Specific, Optional for other categories) ===
  stones: {
    has_stones: boolean;
    stone_type?: string;        // "diamond", "ruby", "pearl", "kundan"
    stone_color?: string;
    stone_shape?: string;       // "round", "oval", "pear"
    total_carat?: number;
    stone_count?: number;
    is_lab_grown?: boolean;
    certification?: string;     // GIA, IGI, etc.
  };
  
  // === DIMENSIONS (Category-Specific) ===
  dimensions: {
    // Jewelry measurements
    weight_grams: number;
    length_mm?: number;
    width_mm?: number;
    height_mm?: number;
    ring_size?: number;         // US size 5-12
    necklace_length?: number;   // inches
    adjustable: boolean;
    
    // Future: Watches could add: case_diameter_mm, strap_width_mm
    // Future: Purses could add: length_cm, width_cm, depth_cm, strap_drop_cm
  };
  
  // === CATEGORY-SPECIFIC ATTRIBUTES (Extensible) ===
  category_specific?: {
    // For Jewelry (Current)
    jewelry?: {
      style: 'traditional' | 'contemporary' | 'fusion' | 'minimal';
      occasion: 'daily-wear' | 'party' | 'wedding' | 'festive';
      closure_type?: string;    // "hook", "clasp", "stud"
    };
    
    // For Future Watches
    // watch?: {
    //   movement: 'quartz' | 'automatic' | 'mechanical';
    //   water_resistance: string;
    //   dial_color: string;
    // };
    
    // For Future Purses
    // purse?: {
    //   style: 'tote' | 'clutch' | 'crossbody';
    //   compartments: number;
    //   closure: 'zipper' | 'magnet' | 'clasp';
    // };
  };
  
  // === VARIANTS ===
  variants: {
    has_variants: boolean;
    variant_options: {
      name: string;             // "Size", "Color", "Material"
      values: string[];         // ["S", "M", "L"]
    }[];
    sku_suffix_pattern: string; // "-SIZE-COLOR"
  };
  
  // === CARE & ORIGIN ===
  care_instructions: string;      // Anti-tarnish care tips
  country_of_origin: string;
  is_handmade: boolean;
  is_hallmarked: boolean;
  hallmark_details?: string;
  
  // Quality & Authenticity
  quality_certification?: {
    has_certificate: boolean;
    certificate_type?: string;   // "BIS", "IGI", etc.
    certificate_number?: string;
  };
  
  // === SOURCE ===
  source: {
    wholesaler_id: string;
    wholesaler_sku?: string;
    batch_id: string;
    manufacture_date?: Date;
  };
}
```

### 4.6 SKU Deduplication

#### 4.6.1 Duplicate Detection Algorithm

```typescript
interface DuplicateDetectionConfig {
  // Matching criteria (weighted)
  criteria: {
    exact_sku_match: { weight: 1.0; action: 'block' };
    similar_images: { weight: 0.8; threshold: 0.95 };
    similar_name: { weight: 0.6; threshold: 0.85 };
    same_wholesaler_sku: { weight: 0.9; action: 'flag' };
    same_specs: { weight: 0.7; };  // weight + material + stones
  };
  
  // Actions
  actions: {
    block: 'Prevent creation, show existing';
    flag: 'Allow but warn admin';
    suggest_merge: 'Show as potential duplicate';
  };
}

// Example matches
const DUPLICATE_SCENARIOS = {
  EXACT_DUPLICATE: {
    scenario: 'Same SKU from same batch',
    action: 'BLOCK - Show existing SKU',
    example: 'Uploading RNG-0042 that already exists'
  },
  CROSS_BATCH_DUPLICATE: {
    scenario: 'Same item, different purchase batch',
    action: 'ALLOW - Add new batch to existing SKU',
    example: 'Buying more of RNG-0042 from same supplier'
  },
  SIMILAR_PRODUCT: {
    scenario: 'Looks same, different wholesaler',
    action: 'FLAG - Admin review required',
    example: 'RNG-0042 and RNG-0108 look identical'
  },
  WHOLESALER_SKU_COLLISION: {
    scenario: 'Different items, same wholesaler SKU',
    action: 'ALLOW with warning',
    example: 'Supplier reused their internal code'
  }
};
```

### 4.7 Admin UI Design

```
┌─────────────────────────────────────────────────────────────────────┐
│ SKU MANAGEMENT                                      [+ New SKU]    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ 🔍 Search SKU...  [Category ▼]  [Material ▼]  [Stock Status ▼] │ │
│ │                                                                 │ │
│ │ [📤 Bulk Upload]  [📥 Export]  [🖼️ Image Ingest]  [🔍 Dups]    │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                     │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │                                                                   │ │
│ │ 🖼️  RNG-0042-GLD-08    Golden Halo Ring                [Edit]  │ │
│ │     📁 Rings → Engagement    💰 ₹12,999    📦 45 in stock        │ │
│ │     🏭 Shree Jewels Jaipur    ⭐ 4.8 rating    💵 ₹8,500 cost    │ │
│ │                                                                   │ │
│ ├─────────────────────────────────────────────────────────────────┤ │
│ │                                                                   │ │
│ │ 🖼️  NCK-0103-SLV       Silver Moon Necklace            [Edit]  │ │
│ │     📁 Necklaces → Chains    💰 ₹2,499     📦 12 in stock        │ │
│ │     ⚠️ LOW STOCK (reorder suggested)                             │ │
│ │                                                                   │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 4.8 Additional Possibilities

| Feature | Description | Impact |
|---------|-------------|--------|
| **AI Description Generator** | Auto-write product descriptions from images | Save copywriting time |
| **Size Guide Generator** | Auto-create size charts per category | Reduce returns |
| **SEO Auto-Optimizer** | Generate meta titles, descriptions | Better search ranking |
| **Price Suggestions** | AI-suggested pricing based on similar items | Optimal pricing |
| **Virtual Try-On Prep** | Generate 3D models from 2D images | Enhanced shopping |
| **Barcode/QR Generator** | Print labels with SKU QR codes | Faster warehouse ops |
| **🆕 Category Expansion Module** | Add Watches, Purses, Accessories seamlessly | Business growth ready |
| **🆕 Category-Specific Inspection** | Custom quality checks per product type | Watches: water resistance, Purses: stitching |

---

## 5. Module 3: SKU-Level P&L Tracking

> **🟢 OUTBOUND FLOW** — Profitability when we SELL to customers  
> **Question Answered**: "How much do we actually make when we sell this item?"

### 5.1 Overview

The P&L Tracking Module tracks profitability for our **outbound sales** — when we sell jewelry to end customers. It calculates true net profit per SKU by accounting for ALL costs (not just the purchase price from wholesalers), including packaging, shipping, ads, and payment fees.

```
OUTBOUND PROFIT CALCULATION:

   Customer Order              P&L Calculation
   ┌─────────────┐            ┌──────────────────────────────┐
   │ Buys:       │            │ Selling Price:     ₹ 12,999  │
   │ RNG-001     │            │ ──────────────────────────── │
   │ Price:      │            │ Buy Cost:          ₹  5,000  │ ← From INBOUND
   │ ₹12,999     │            │ Packaging:         ₹     45  │
   └─────────────┘            │ Shipping:          ₹    120  │
                              │ Payment Fee:       ₹    260  │
                              │ Ads Cost:          ₹    325  │
                              │ ──────────────────────────── │
                              │ NET PROFIT:        ₹  7,249  │
                              └──────────────────────────────┘
```

### 5.2 Cost Structure

#### 5.2.1 Complete Cost Breakdown

```
┌─────────────────────────────────────────────────────────────────────┐
│                    SKU-LEVEL P&L CALCULATION                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  SELLING PRICE                    ₹ 12,999                           │
│  ─────────────────────────────────────────                           │
│                                                                      │
│  COST OF GOODS SOLD (COGS)                                           │
│  ├── Buy Cost (from wholesaler)      ₹ 8,500                         │
│  └── Inbound Delivery (allocated)    ₹    85    (₹850/10 items)      │
│  ─────────────────────────────────────────                           │
│  GROSS MARGIN                        ₹ 4,414                         │
│  ─────────────────────────────────────────                           │
│                                                                      │
│  VARIABLE COSTS                                                      │
│  ├── Ads Spend (allocated)           ₹   325    (campaign cost/conv) │
│  ├── Packaging                       ₹    45    (box + wrap + tissue)│
│  ├── Outbound Shipping               ₹   120    (to customer)        │
│  └── Payment Gateway (2%)            ₹   260                         │
│  ─────────────────────────────────────────                           │
│  TOTAL VARIABLE COSTS                ₹   750                         │
│  ─────────────────────────────────────────                           │
│                                                                      │
│  NET PROFIT                          ₹ 3,664                         │
│  NET MARGIN                          28.2%                           │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

#### 5.2.2 Cost Components Detail

```typescript
interface SkuCostBreakdown {
  // Revenue
  selling_price: number;
  discount_given: number;
  net_revenue: number;            // After discounts
  
  // Cost of Goods Sold
  cogs: {
    buy_cost_per_unit: number;    // From wholesaler
    inbound_delivery_allocated: number;  // Per unit share
    packaging_materials: number;  // Box, wrap, etc.
    total_cogs: number;
  };
  
  // Operating Costs (allocated per sale)
  operating_costs: {
    ads_spend_allocated: number;  // Campaign cost / conversions
    shipping_outbound: number;    // Customer delivery
    payment_gateway_fees: number; // % of transaction
    platform_fees: number;        // Marketplace fees if any
    customer_support: number;     // Estimated per-order
    warehouse_handling: number;   // Picking, packing labor
  };
  
  // Profit metrics
  profit: {
    gross_profit: number;         // Revenue - COGS
    gross_margin_percent: number;
    net_profit: number;           // Revenue - All costs
    net_margin_percent: number;
    contribution_margin: number;  // Revenue - Variable costs
  };
}
```

### 5.3 Automatic P&L Computation

#### 5.3.1 Event-Driven Calculation

```typescript
// When an order is placed, compute P&L for each line item
interface OrderPlnCalculation {
  order_id: string;
  calculated_at: Date;
  
  line_items: {
    line_item_id: string;
    sku: string;
    quantity: number;
    
    // Revenue side
    unit_price: number;
    subtotal: number;
    discount_allocation: number;  // Pro-rated discount
    net_revenue: number;
    
    // Cost side
    unit_buy_cost: number;        // From SKU-Wholesaler link
    unit_cogs: number;            // Includes allocated inbound
    unit_operating_costs: number;
    total_cost: number;
    
    // Profit
    gross_profit: number;
    net_profit: number;
    margin_percent: number;
  }[];
  
  // Order totals
  total_net_revenue: number;
  total_cogs: number;
  total_operating_costs: number;
  total_net_profit: number;
  blended_margin_percent: number;
}
```

#### 5.3.2 Cost Allocation Strategies

```typescript
interface CostAllocationRules {
  // Inbound delivery allocation
  inbound_delivery: {
    method: 'equal_split' | 'value_based' | 'weight_based';
    // equal_split: Total cost / number of items
    // value_based: Proportional to item value
    // weight_based: Proportional to item weight
  };
  
  // Ads spend allocation
  ads_spend: {
    method: 'last_touch' | 'linear' | 'time_decay';
    // last_touch: Full credit to last clicked SKU
    // linear: Split across all SKUs in cart
    // time_decay: Weighted by recency
    attribution_window_days: number;
  };
  
  // Campaign-level to SKU-level
  campaign_allocation: {
    method: 'revenue_share' | 'order_count' | 'custom_weights';
    // How to split campaign cost across SKUs
  };
}
```

### 5.4 Profit Trend Dashboard

#### 5.4.1 Dashboard Views

```
┌─────────────────────────────────────────────────────────────────────┐
│ PROFIT DASHBOARD                             [Period: Last 30 Days]│
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌────────────┐ │
│  │ Total Sales │  │ Net Profit  │  │ Avg Margin  │  │ Loss-making│ │
│  │   ₹12.4L    │  │   ₹3.2L     │  │   25.8%     │  │    8 SKUs  │ │
│  │   ↑ 12%     │  │   ↑ 8%      │  │   ↓ 2%      │  │   ↑ 3      │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └────────────┘ │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    PROFIT TREND CHART                        │   │
│  │                                                              │   │
│  │  ₹50K ┤                              ╭────╮                 │   │
│  │       │                    ╭────────╯      ╰──╮             │   │
│  │  ₹40K ┤         ╭────────╯                      ╰──╮        │   │
│  │       │  ╭────╯                                    ╰──╮     │   │
│  │  ₹30K ┤──╯                                             ╰──  │   │
│  │       └────┬────┬────┬────┬────┬────┬────┬────            │   │
│  │           W1   W2   W3   W4   W5   W6   W7                 │   │
│  │                                                              │   │
│  │   Revenue ████████  COGS ▓▓▓▓▓▓▓  Net Profit ░░░░░░░       │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────┐  ┌─────────────────────────────────┐  │
│  │   TOP PROFIT MAKERS     │  │    PROFIT BY CATEGORY           │  │
│  │   ─────────────────     │  │    ──────────────────           │  │
│  │   1. RNG-0042  ₹45K     │  │    💍 Rings      32%  ████████  │  │
│  │   2. NCK-0103  ₹38K     │  │    📿 Necklaces  28%  ██████    │  │
│  │   3. BRD-0005  ₹32K     │  │    👂 Earrings   25%  █████     │  │
│  │   4. EAR-0234  ₹28K     │  │    💫 Bracelets  15%  ███       │  │
│  │   5. RNG-0018  ₹24K     │  │                                 │  │
│  │                         │  │                                 │  │
│  └─────────────────────────┘  └─────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

#### 5.4.2 Drill-Down Capabilities

```typescript
interface DrillDownViews {
  // By SKU
  sku_view: {
    sku: string;
    product_name: string;
    units_sold: number;
    total_revenue: number;
    total_profit: number;
    avg_margin_percent: number;
    trend: 'up' | 'down' | 'stable';
  };
  
  // By Category
  category_view: {
    category: string;
    sku_count: number;
    total_revenue: number;
    total_profit: number;
    avg_margin_percent: number;
    top_performer: string;
    worst_performer: string;
  };
  
  // By Collection
  collection_view: {
    collection: string;
    revenue: number;
    profit: number;
    margin: number;
    marketing_spend: number;
    roas: number;                 // Return on ad spend
  };
  
  // By Wholesaler
  wholesaler_view: {
    wholesaler: string;
    skus_sourced: number;
    total_revenue: number;
    total_profit: number;
    avg_margin: number;
    profit_per_rupee_spent: number;
  };
  
  // Time series
  time_series: {
    period: string;               // "2026-W05"
    revenue: number;
    cogs: number;
    operating_costs: number;
    net_profit: number;
    margin_percent: number;
  }[];
}
```

### 5.5 Break-Even Calculator

#### 5.5.1 Per-SKU Break-Even Analysis

```typescript
interface BreakEvenAnalysis {
  sku: string;
  
  // Fixed costs for this SKU (if any)
  fixed_costs: {
    photoshoot: number;           // One-time per SKU
    listing_setup: number;        // Platform fees
    initial_marketing: number;    // Launch promotion
  };
  
  // Variable costs per unit
  variable_costs: {
    cogs: number;
    packaging: number;
    shipping: number;
    payment_fees_percent: number;
    ads_spend_per_unit: number;
  };
  
  // Break-even calculation
  selling_price: number;
  contribution_margin: number;    // Price - Variable Costs
  
  break_even: {
    units_to_break_even: number;  // Fixed costs / Contribution margin
    days_to_break_even: number;   // Based on sales velocity
    revenue_to_break_even: number;
  };
  
  // Scenarios
  scenarios: {
    price_increase_10_percent: {
      new_break_even_units: number;
      impact: 'faster_break_even' | 'slower_break_even';
    };
    volume_discount_20_percent: {
      new_variable_cost: number;
      new_break_even_units: number;
    };
  };
}
```

#### 5.5.2 Break-Even Visualization

```
┌─────────────────────────────────────────────────────────────────────┐
│ BREAK-EVEN ANALYSIS: RNG-0042-GOLD                                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Current Price: ₹12,999    Variable Cost: ₹9,750    Margin: ₹3,249  │
│                                                                      │
│  Fixed Costs:                                                        │
│  ├── Photoshoot          ₹5,000                                     │
│  └── Listing Setup       ₹2,000                                     │
│  Total Fixed Costs       ₹7,000                                     │
│                                                                      │
│  Break-Even Point: 3 units (₹7,000 / ₹3,249)                        │
│  At current velocity: 2 days to break even                          │
│                                                                      │
│  Chart:                                                              │
│  Revenue │                    ╱                                     │
│    ₹40K ─┤               ╭───╯                                      │
│          │          ╭───╯                                           │
│    ₹30K ─┤     ╭───╯        ◄── Break-even point (3 units)          │
│          │ ╭───╯                                                    │
│    ₹20K ─┤╱                                                         │
│          ├──────▲────────────────────                               │
│    ₹10K ─┤      │Fixed Costs                                        │
│          └──────┼────┬────┬────┬────                                │
│                 0    2    4    6    8                               │
│                            Units Sold                               │
│                                                                      │
│  ═══════ Revenue  ─ ─ ─ Costs                                       │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 5.6 Loss-Making SKU Alerts

#### 5.6.1 Negative Margin Detection

```typescript
interface LossAlertConfig {
  // Alert triggers
  triggers: {
    negative_margin: {
      enabled: true;
      threshold_percent: 0;       // Alert if margin < 0%
      severity: 'critical';
    };
    low_margin: {
      enabled: true;
      threshold_percent: 10;      // Alert if margin < 10%
      severity: 'warning';
    };
    trending_down: {
      enabled: true;
      lookback_orders: 10;
      margin_decline_percent: 20; // Alert if margin drops 20%
      severity: 'warning';
    };
  };
  
  // Auto-actions
  actions: {
    notify_admin: true;
    suggest_price_increase: true;
    pause_ads: false;             // Optional: stop promoting loss-makers
    flag_for_review: true;
  };
}

interface LossAlert {
  id: string;
  sku: string;
  product_name: string;
  alert_type: 'negative_margin' | 'low_margin' | 'trending_down';
  severity: 'critical' | 'warning';
  
  // Current metrics
  current_margin_percent: number;
  last_margin_percent?: number; // For trending alerts
  
  // Root cause analysis
  root_causes: {
    cost_increase?: boolean;
    price_decrease?: boolean;
    ads_spend_spike?: boolean;
    discounting?: boolean;
  };
  
  // Recommendations
  recommendations: {
    suggested_price?: number;
    potential_impact?: string;
    suggested_actions: string[];
  };
  
  created_at: Date;
  acknowledged_at?: Date;
  resolved_at?: Date;
}
```

### 5.7 Wholesaler Profitability Filter

#### 5.7.1 Supplier Performance by Margin

```
┌─────────────────────────────────────────────────────────────────────┐
│ WHOLESALER PROFITABILITY                                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Rank  Wholesaler              Spent    Revenue   Profit   Margin   │
│  ─────────────────────────────────────────────────────────────────  │
│   1    Royal Gems Delhi       ₹4.2L    ₹8.5L     ₹4.3L     50.6%    │
│   2    Shree Jewels Jaipur    ₹3.8L    ₹6.2L     ₹2.4L     38.7%    │
│   3    Mumbai Traders         ₹2.1L    ₹3.1L     ₹1.0L     32.3%    │
│   4    KC Fashion             ₹1.5L    ₹1.8L     ₹0.3L     16.7%    │
│                                                                      │
│  Insights:                                                           │
│  • Royal Gems gives 2.4x better margins than KC Fashion             │
│  • Consider shifting bridal orders from KC to Royal                 │
│  • Shree Jewels has slower delivery but good quality                │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 5.8 Additional Possibilities

| Feature | Description | Impact |
|---------|-------------|--------|
| **Scenario Planner** | "What if" tool for price/cost changes | Strategic pricing |
| **Automated Pricing** | Auto-adjust prices to maintain target margin | Dynamic profitability |
| **Cost Forecasting** | Predict future costs based on trends | Budget planning |
| **Competitor Price Tracking** | Monitor competitor pricing vs your margins | Competitive positioning |
| **Lifetime Value Analysis** | Track SKU profitability over full lifecycle | Product strategy |
| **Bundle Profitability** | Analyze margin for product bundles | Bundle optimization |

---

## 6. Module 4: Catalog Generator

> **🟢 OUTBOUND FLOW** — Sales tools to showcase products TO customers  
> **Question Answered**: "How do we present our products to potential buyers?"

### 6.1 Overview

The Catalog Generator is an **outbound marketing tool** that creates beautiful, shareable product catalogs to help us sell our inventory to different audiences — retail customers, wholesale buyers, social media followers, and more.

```
OUTBOUND MARKETING TOOL:

   Tatva Catalog               Target Audience
   ┌─────────────┐            ┌────────────────────────────┐
   │ 💍 Rings    │    ───▶    │ • Retail customers         │
   │ 📿 Necklaces│    ───▶    │ • Wholesale buyers         │
   │ 👂 Earrings │    ───▶    │ • Instagram followers      │
   │ 💫 Bracelets│    ───▶    │ • WhatsApp groups          │
   └─────────────┘            └────────────────────────────┘
   
   Purpose: Help us SELL our inventory
   Formats: PDF, Image Grid, Web Link
   Pricing: Can show/hide based on audience
```

### 6.2 Catalog Formats

#### 6.2.1 Image Format Catalog

```typescript
interface ImageCatalogConfig {
  format: 'jpg' | 'png' | 'webp';
  resolution: {
    width: number;              // 1920 for high-res
    height: number;             // Auto-calculate based on content
    dpi: number;                // 300 for print-quality
  };
  
  layout: {
    type: 'grid' | 'masonry' | 'horizontal_scroll';
    columns: 3 | 4 | 5;
    spacing: number;            // Pixels between items
    background_color: string;
  };
  
  product_display: {
    show_price: boolean;
    show_name: boolean;
    show_sku: boolean;
    show_category: boolean;
    price_format: 'with_currency' | 'just_number';
    font_family: string;
    font_size: number;
  };
  
  branding: {
    logo_position: 'top_left' | 'top_center' | 'top_right';
    logo_size: number;          // Percentage of width
    header_text?: string;
    footer_text?: string;
    accent_color: string;
  };
}
```

**Output Example:**
```
┌─────────────────────────────────────────────────────────────────────┐
│                         [TATVA LOGO]                                 │
│                    WEDDING COLLECTION 2026                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │
│  │              │  │              │  │              │               │
│  │   [IMAGE]    │  │   [IMAGE]    │  │   [IMAGE]    │               │
│  │              │  │              │  │              │               │
│  │ Royal Kundan │  │ Pearl Bridal │  │ Golden Nath  │               │
│  │   ₹15,999    │  │   ₹12,499    │  │    ₹8,999    │               │
│  └──────────────┘  └──────────────┘  └──────────────┘               │
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │
│  │              │  │              │  │              │               │
│  │   [IMAGE]    │  │   [IMAGE]    │  │   [IMAGE]    │               │
│  │              │  │              │  │              │               │
│  │ Maang Tikka  │  │ Bridal Set   │  │ Haath Phool  │               │
│  │   ₹6,499     │  │   ₹22,999    │  │    ₹4,999    │               │
│  └──────────────┘  └──────────────┘  └──────────────┘               │
│                                                                      │
│              www.tatva.com | @tatva.jewelry | +91-xxx               │
└─────────────────────────────────────────────────────────────────────┘
```

#### 6.2.2 PDF Format Catalog

```typescript
interface PdfCatalogConfig {
  page_size: 'A4' | 'A5' | 'Letter' | 'Square';
  orientation: 'portrait' | 'landscape';
  
  // Multi-page options
  pagination: {
    enabled: true;
    products_per_page: 6 | 9 | 12;
    cover_page: boolean;
    table_of_contents: boolean;
  };
  
  // Product layout per page
  product_layout: {
    image_size: 'large' | 'medium' | 'small';
    description_length: 'none' | 'short' | 'full';
    show_specifications: boolean;
    show_care_instructions: boolean;
  };
  
  // Styling
  styling: {
    theme: 'minimal' | 'elegant' | 'festive' | 'modern';
    primary_color: string;
    secondary_color: string;
    heading_font: string;
    body_font: string;
  };
  
  // Sections
  sections: {
    cover_page: boolean;
    category_divider: boolean;
    product_pages: boolean;
    contact_page: boolean;
    back_cover: boolean;
  };
}
```

#### 6.2.3 Shareable Link Catalog (Web-Based)

```typescript
interface WebCatalogConfig {
  // Unique shareable link
  slug: string;                   // "wedding-collection-2026"
  password_protection?: string;   // Optional password
  expiry_date?: Date;             // Optional expiry
  
  // Interactive features
  interactivity: {
    allow_filtering: boolean;     // Filter by price, category
    allow_search: boolean;
    show_stock_status: boolean;
    enable_wishlist: boolean;     // Save for later
    enable_inquiry: boolean;      // "I'm interested" button
  };
  
  // Pricing display modes
  pricing_mode: 'show_all' | 'hide_all' | 'show_on_request' | 'login_to_see';
  
  // For wholesale catalogs
  wholesale_mode: {
    enabled: boolean;
    show_moq: boolean;            // Minimum order quantity
    show_tiered_pricing: boolean;
    allow_bulk_order: boolean;    // Add multiple to cart
  };
  
  // Tracking
  analytics: {
    track_views: boolean;
    track_product_clicks: boolean;
    track_inquiries: boolean;
    utm_parameters: Record<string, string>;
  };
}
```

**Web Catalog UI:**
```
┌─────────────────────────────────────────────────────────────────────┐
│  [LOGO]          WEDDING COLLECTION 2026              [🔍] [☰]    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Filter: [All Categories ▼]  [Price: Low to High ▼]  [Material ▼]  │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                                                             │    │
│  │                    [PRODUCT IMAGE]                          │    │
│  │                                                             │    │
│  │  Royal Kundan Necklace Set                                  │    │
│  │  ⭐⭐⭐⭐⭐ (24 reviews)                                    │    │
│  │                                                             │    │
│  │  ₹15,999                                     [❤️] [📋]      │    │
│  │                                                             │    │
│  │  [──────────── Inquiry ────────────]                        │    │
│  │                                                             │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  (Share this catalog: tatva.com/c/wedding-2026)                     │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 6.3 Filtering & Selection

#### 6.3.1 Pre-Generation Filters

```typescript
interface CatalogFilters {
  // Product selection
  selection: {
    type: 'manual' | 'smart_filter';
    manual_selection?: string[];  // SKU array
    smart_filter?: {
      categories?: string[];
      collections?: string[];
      price_min?: number;
      price_max?: number;
      materials?: string[];
      tags?: string[];
      exclude_out_of_stock: boolean;
      limit: number;
    };
  };
  
  // Sorting
  sort: {
    by: 'price_asc' | 'price_desc' | 'name' | 'newest' | 'bestselling';
    custom_order?: string[];      // For manual ordering
  };
  
  // Grouping
  grouping: {
    enabled: boolean;
    group_by: 'category' | 'collection' | 'price_range' | 'material';
    sort_groups_by: 'name' | 'product_count';
  };
}
```

### 6.4 Pricing Toggles

#### 6.4.1 Catalog Versions

```typescript
interface PricingOptions {
  // Version types
  version: 'retail' | 'wholesale' | 'custom';
  
  retail: {
    show_mrp: true;
    show_discounted_price: true;
    show_you_save: true;
  };
  
  wholesale: {
    show_wholesale_price: true;
    show_moq: true;
    show_tiered_pricing: true;
    hide_retail_prices: true;
    require_login: true;
  };
  
  custom: {
    show_prices: boolean;
    price_label?: string;         // "Exclusively for Rahul Stores"
    show_percent_off: boolean;
    custom_message?: string;
  };
}
```

### 6.5 Custom Branding

#### 6.5.1 Brand Configuration

```typescript
interface BrandConfig {
  // Logo
  logo: {
    primary: string;              // URL
    monochrome?: string;          // For colored backgrounds
    favicon: string;
  };
  
  // Colors
  colors: {
    primary: string;              // Main brand color
    secondary: string;
    accent: string;
    text: string;
    background: string;
  };
  
  // Typography
  fonts: {
    heading: string;
    body: string;
    fallback: string;
  };
  
  // Messaging
  messaging: {
    brand_name: string;
    tagline?: string;
    contact_info: {
      phone?: string;
      email?: string;
      website?: string;
      instagram?: string;
      whatsapp?: string;
    };
    footer_text?: string;
  };
  
  // Templates
  templates: {
    cover_page?: string;          // Custom HTML/Markdown
    product_card?: string;
    footer?: string;
  };
}
```

### 6.6 Admin UI Design

```
┌─────────────────────────────────────────────────────────────────────┐
│ CATALOG GENERATOR                                       [+ Create] │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ RECENT CATALOGS                                                     │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ Wedding Collection 2026                                         │ │
│ │ 📄 PDF  |  🖼️ Image  |  🔗 Web    Created: Feb 15, 2026         │ │
│ │ Products: 45  |  Views: 234  |  Inquiries: 12                   │ │
│ │ [Download] [Share] [Duplicate] [Analytics] [Delete]             │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ Summer Essentials                                               │ │
│ │ 📄 PDF  |  🖼️ Image  |  🔗 Web    Created: Feb 10, 2026         │ │
│ │ Products: 32  |  Views: 189  |  Inquiries: 8                    │ │
│ │ [Download] [Share] [Duplicate] [Analytics] [Delete]             │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                     │
│ CREATE NEW CATALOG                                                  │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ Step 1: Select Products                                         │ │
│ │ ○ Manual selection        ● Smart filter                        │ │
│ │                                                                 │ │
│ │ Categories: [Rings ▼] [Necklaces ▼] [All Materials ▼]           │ │
│ │ Price Range: ₹0 — ₹50,000                                       │ │
│ │ Stock: ● In stock only                                          │ │
│ │                                                                 │ │
│ │ Preview: 45 products will be included                           │ │
│ │                                                                 │ │
│ │ [Next: Choose Format ▶]                                         │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 6.7 Additional Possibilities

| Feature | Description | Impact |
|---------|-------------|--------|
| **Video Catalogs** | Auto-generate video slideshows | Social media marketing |
| **AR Catalogs** | View products in AR via catalog | Enhanced engagement |
| **Personalized Catalogs** | "Curated for you" based on history | Higher conversion |
| **Whatsapp Integration** | Direct share with preview | Easier distribution |
| **Print-on-Demand** | Order physical catalog copies | Physical sales tool |
| **Real-time Sync** | Auto-update prices/stock | Always current |
| **A/B Testing** | Test different catalog layouts | Optimize engagement |

---

## 7. Module 5: Product Lifecycle Tracking

> **🟢 OUTBOUND FLOW** — Post-sale tracking for customer orders  
> **Question Answered**: "What happens after we ship to the customer?"

### 7.1 Overview

The Product Lifecycle Tracking Module monitors our **outbound post-sale operations** — what happens after we sell and ship products to customers. It traces every order from shipment through delivery, customer reviews, and potential returns or exchanges.

```
OUTBOUND POST-SALE JOURNEY:

   Tatva Warehouse            Courier              Customer
   ┌─────────────┐           ┌────────┐           ┌─────────┐
   │ Pack Order  │  ───▶     │ Pickup │  ───▶     │ Receive │
   │ RNG-001     │           │ Ship   │           │ Unbox   │
   └─────────────┘           └────────┘           └────┬────┘
                                                       │
                              ┌───────────────────────┼───────┐
                              │                       │       │
                              ▼                       ▼       ▼
                         [Happy]                  [Issue]
                            │                       │
                            ▼                       ▼
                    ┌──────────────┐      ┌──────────────────┐
                    │ Write Review │      │ Request Return   │
                    │ ⭐⭐⭐⭐⭐      │      │ or Exchange      │
                    └──────────────┘      └──────────────────┘
``` This enables quality control, customer satisfaction monitoring, and return analytics.

```
┌─────────────────────────────────────────────────────────────────────┐
│                 PRODUCT LIFECYCLE JOURNEY                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ORDER PLACED                                                        │
│       │                                                              │
│       ▼                                                              │
│  ORDER CONFIRMED ────────▶ Payment Verified                          │
│       │                                                              │
│       ▼                                                              │
│  PACKED ────────────────▶ Quality Check Passed                       │
│       │         └───────▶ Quality Issues Flagged ──▶ Replaced       │
│       ▼                                                              │
│  SHIPPED ───────────────▶ Tracking Number Assigned                   │
│       │         └───────▶ Courier: Shiprocket/Delhivery/etc         │
│       ▼                                                              │
│  IN TRANSIT ────────────▶ Location Updates (Webhook/API)            │
│       │                                                              │
│       ▼                                                              │
│  OUT FOR DELIVERY                                                      │
│       │                                                              │
│       ▼                                                              │
│  DELIVERED ─────────────▶ Delivery Proof (OTP/Photo)                │
│       │                                                              │
│       ├──▶ Customer Satisfied                                        │
│       │       │                                                      │
│       │       ▼                                                      │
│       │    REVIEW SUBMITTED ────▶ ★★★★★ + Photo                     │
│       │                                                              │
│       └──▶ Customer Unsatisfied                                      │
│               │                                                      │
│               ├──▶ RETURN REQUESTED                                  │
│               │       │                                              │
│               │       ├──▶ Pickup Scheduled                          │
│               │       ├──▶ Picked Up                                 │
│               │       ├──▶ Returned to Warehouse                     │
│               │       ├──▶ Quality Inspection                        │
│               │       │       ├──▶ Resellable ────▶ Restock         │
│               │       │       └──▶ Damaged ───────▶ Discard/Repair  │
│               │       └──▶ Refund Processed                          │
│               │                                                      │
│               └──▶ EXCHANGE REQUESTED                                │
│                       └──▶ New Item Shipped                          │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 7.2 Lifecycle Stages & Statuses

#### 7.2.1 Complete Status Map

```typescript
enum LifecycleStage {
  // Pre-shipment
  ORDER_PLACED = 'order_placed',
  PAYMENT_CONFIRMED = 'payment_confirmed',
  ORDER_CONFIRMED = 'order_confirmed',
  
  // Fulfillment
  PICKING = 'picking',                    // Warehouse picking items
  PACKING = 'packing',                    // Being packed
  QUALITY_CHECK = 'quality_check',        // QC in progress
  READY_TO_SHIP = 'ready_to_ship',        // Awaiting courier pickup
  
  // Shipping
  SHIPPED = 'shipped',                    // Handed to courier
  IN_TRANSIT = 'in_transit',              // Moving through network
  OUT_FOR_DELIVERY = 'out_for_delivery',  // With delivery agent
  
  // Delivery
  DELIVERED = 'delivered',                // Successfully delivered
  DELIVERY_FAILED = 'delivery_failed',    // Attempt failed
  
  // Post-delivery
  AWAITING_REVIEW = 'awaiting_review',    // Within review window
  REVIEW_SUBMITTED = 'review_submitted',  // Customer left review
  
  // Returns
  RETURN_REQUESTED = 'return_requested',
  RETURN_APPROVED = 'return_approved',
  PICKUP_SCHEDULED = 'pickup_scheduled',
  PICKED_UP = 'picked_up',
  RETURN_IN_TRANSIT = 'return_in_transit',
  RETURN_RECEIVED = 'return_received',
  QUALITY_INSPECTION = 'quality_inspection',
  REFUND_PROCESSED = 'refund_processed',
  
  // Exchange
  EXCHANGE_REQUESTED = 'exchange_requested',
  EXCHANGE_SHIPPED = 'exchange_shipped',
  EXCHANGE_DELIVERED = 'exchange_delivered',
  
  // Final states
  COMPLETED = 'completed',                // Happy path complete
  CANCELLED = 'cancelled',
  CLOSED = 'closed',                      // Return/exchange resolved
}

// Status groups for filtering
const STATUS_GROUPS = {
  ACTIVE: [                        // Currently in progress
    'picking', 'packing', 'quality_check', 'ready_to_ship',
    'shipped', 'in_transit', 'out_for_delivery'
  ],
  PENDING_ACTION: [               // Needs admin attention
    'delivery_failed', 'return_requested', 'exchange_requested',
    'quality_inspection'
  ],
  COMPLETED: [                    // Successfully finished
    'delivered', 'review_submitted', 'completed', 'exchange_delivered'
  ],
  RETURN_PIPELINE: [              // In return process
    'return_requested', 'return_approved', 'pickup_scheduled',
    'picked_up', 'return_in_transit', 'return_received', 'quality_inspection'
  ]
};
```

### 7.3 Shipment Tracking

#### 7.3.1 Courier Integration

```typescript
interface ShipmentTrackingConfig {
  // Supported couriers
  couriers: {
    shiprocket: {
      enabled: boolean;
      api_key: string;
      api_secret: string;
      webhook_secret: string;
    };
    delhivery: {
      enabled: boolean;
      api_key: string;
    };
    bluedart: {
      enabled: boolean;
      license_key: string;
    };
    india_post: {
      enabled: boolean;
      api_key: string;
    };
    manual: {                      // For self-delivery or other
      enabled: boolean;
    };
  };
  
  // Tracking settings
  tracking: {
    auto_track: boolean;           // Poll courier APIs
    polling_interval_hours: number;
    webhook_enabled: boolean;      // Receive push updates
    customer_notifications: boolean;
  };
}

// Shipment entity
interface Shipment {
  id: string;
  order_id: string;
  order_line_item_id: string;      // Which specific item
  
  // Courier details
  courier: string;                 // "shiprocket", "delhivery"
  tracking_number: string;
  tracking_url: string;
  
  // Package details
  package_details: {
    weight_kg: number;
    dimensions: { length: number; width: number; height: number };
    items_count: number;
    declared_value: number;
  };
  
  // Status
  current_status: LifecycleStage;
  estimated_delivery: Date;
  
  // Timeline
  timeline: TrackingEvent[];
  
  // Delivery
  delivered_at?: Date;
  delivery_proof?: {
    type: 'otp' | 'signature' | 'photo';
    value?: string;                // OTP or signature data
    image_url?: string;            // Delivery photo
    recipient_name?: string;
  };
  
  created_at: Date;
  updated_at: Date;
}

interface TrackingEvent {
  timestamp: Date;
  status: string;                  // "shipped", "in_transit", etc.
  location: string;                // "Mumbai Hub", "Delivery Center"
  description: string;             // Human-readable
  courier_raw_data?: any;          // Original courier response
}
```

#### 7.3.2 Tracking Timeline UI

```
┌─────────────────────────────────────────────────────────────────────┐
│ TRACKING: ORDER #TAT-2026-0042                                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  📦 Golden Halo Ring (RNG-0042-GLD-08)                              │
│  Shiprocket: SHIP1234567890                                         │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                                                               │  │
│  │  ✅ ────▶ ✅ ────▶ ✅ ────▶ ✅ ────▶ ✅ ────▶ ⏳            │  │
│  │ Order   Packed  Shipped Transit  Out for  Delivered          │  │
│  │ Confirmed                    Delivery  (Expected today)       │  │
│  │                                                               │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  Detailed Timeline:                                                  │
│  ─────────────────────────────────────────────────────────────────  │
│  Today, 8:30 AM     Out for Delivery                                │
│                     Your order is with the delivery agent           │
│                                                                      │
│  Today, 6:15 AM     Arrived at Delivery Center                      │
│                     Sector 14, Gurgaon                              │
│                                                                      │
│  Feb 28, 11:45 PM   In Transit                                      │
│                     Left Delhi Hub                                  │
│                                                                      │
│  Feb 28, 8:00 PM    Shipped                                         │
│                     Picked up by Shiprocket                         │
│                                                                      │
│  Feb 28, 5:30 PM    Packed                                          │
│                     Quality check passed, packed                    │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 7.4 Customer Review Collection

#### 7.4.1 Review Lifecycle

```typescript
interface ReviewLifecycle {
  id: string;
  order_id: string;
  line_item_id: string;
  sku: string;
  customer_id: string;
  
  // Review window
  delivered_at: Date;
  review_window_closes_at: Date;   // Typically 30 days
  
  // Review request tracking
  review_requests: {
    sent_at: Date;
    channel: 'email' | 'sms' | 'whatsapp';
    opened_at?: Date;
    clicked_at?: Date;
  }[];
  
  // Submitted review (if any)
  review?: {
    submitted_at: Date;
    rating: number;                // 1-5 stars
    title?: string;
    content?: string;
    images?: string[];
    verified_purchase: boolean;
    
    // Moderation
    status: 'pending' | 'approved' | 'rejected';
    moderated_by?: string;
    moderated_at?: Date;
    rejection_reason?: string;
  };
  
  // Response
  merchant_reply?: {
    content: string;
    replied_at: Date;
    replied_by: string;
  };
  
  // Incentives
  incentive?: {
    type: 'discount_code' | 'loyalty_points' | 'none';
    value?: string;
    claimed: boolean;
  };
}

// Review request automation
interface ReviewRequestConfig {
  // When to send
  trigger: {
    type: 'after_delivery' | 'after_days' | 'manual';
    days_after_delivery: number;   // 7 days default
  };
  
  // Reminder settings
  reminders: {
    enabled: boolean;
    reminder_count: number;        // Max 2 reminders
    reminder_interval_days: number;
  };
  
  // Incentives
  incentive: {
    enabled: boolean;
    type: 'discount_code' | 'loyalty_points';
    value: number;                 // % discount or points
    discount_valid_days: number;
  };
  
  // Channels
  channels: {
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
  };
}
```

#### 7.4.2 Review Management Dashboard

```
┌─────────────────────────────────────────────────────────────────────┐
│ REVIEW MANAGEMENT                                                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Stats:  ⭐ 4.6 Avg Rating  |  245 Reviews  |  12 Pending Approval   │
│                                                                      │
│  PENDING APPROVAL (12)                                              │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │ 🖼️  ⭐⭐⭐⭐⭐  "Absolutely beautiful ring!"                  │ │
│  │     RNG-0042  |  Priya S.  |  2 hours ago               [✓] [✗]│ │
│  │     📷 2 photos attached                                          │ │
│  ├─────────────────────────────────────────────────────────────────┤ │
│  │ 🖼️  ⭐⭐⭐☆☆  "Nice but size was wrong"                      │ │
│  │     NCK-0103  |  Rahul K.  |  5 hours ago               [✓] [✗]│ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│  AWAITING REVIEW (58)                                               │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │ 🖼️  RNG-0018  Golden Band Ring                          [Nudge]│ │
│  │     Delivered: Feb 20  |  Customer: Anjali M.                   │ │
│  │     Reminder sent: 2 days ago                                     │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│  RECENT REVIEWS                                                     │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │ 🖼️  ⭐⭐⭐⭐⭐  "Perfect for my wedding!"  - Sonia T.       │ │
│  │     BRD-0005  |  Approved  |  1 day ago                          │ │
│  │     [Reply]                                                       │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 7.5 Returns & Exchange Management

#### 7.5.1 Return Workflow

```typescript
interface ReturnRequest {
  id: string;
  order_id: string;
  line_item_id: string;
  sku: string;
  customer_id: string;
  
  // Request details
  type: 'return' | 'exchange';
  reason: ReturnReason;
  customer_notes?: string;
  images?: string[];               // Photos of issue
  
  // Reason categories
  reason_category: 
    | 'defective' 
    | 'wrong_item' 
    | 'not_as_described'
    | 'size_issue'
    | 'quality_issue'
    | 'changed_mind'
    | 'other';
  
  // For exchanges
  exchange_for?: {
    sku: string;
    size?: string;
    color?: string;
  };
  
  // Status workflow
  status: ReturnStatus;
  timeline: ReturnEvent[];
  
  // Admin decisions
  approval?: {
    decision: 'approved' | 'rejected';
    approved_by: string;
    approved_at: Date;
    notes?: string;
    refund_amount?: number;
    restocking_fee?: number;
  };
  
  // Pickup
  pickup?: {
    scheduled_date: Date;
    courier: string;
    tracking_number?: string;
    picked_up_at?: Date;
  };
  
  // Inspection
  inspection?: {
    inspected_by: string;
    inspected_at: Date;
    condition: 'new' | 'like_new' | 'damaged' | 'defective';
    resellable: boolean;
    notes?: string;
    photos?: string[];
  };
  
  // Resolution
  resolution?: {
    type: 'refund' | 'exchange' | 'store_credit' | 'replacement';
    processed_at: Date;
    processed_by: string;
    refund_transaction_id?: string;
  };
  
  created_at: Date;
  updated_at: Date;
}

enum ReturnReason {
  DEFECTIVE = 'Item received was damaged/defective',
  WRONG_ITEM = 'Received wrong item',
  NOT_AS_DESCRIBED = 'Product not as described',
  SIZE_ISSUE = 'Size does not fit',
  QUALITY_ISSUE = 'Quality not as expected',
  CHANGED_MIND = 'Changed my mind',
  OTHER = 'Other reason'
}

interface ReturnEvent {
  timestamp: Date;
  status: ReturnStatus;
  description: string;
  actor: 'system' | 'customer' | 'admin' | 'courier';
  metadata?: any;
}
```

#### 7.5.2 Return Analytics

```typescript
interface ReturnAnalytics {
  // Overview
  overview: {
    total_orders: number;
    total_returns: number;
    return_rate: number;           // % of orders returned
    exchange_rate: number;
  };
  
  // By reason
  by_reason: {
    reason: string;
    count: number;
    percentage: number;
    avg_resolution_days: number;
  }[];
  
  // By SKU
  by_sku: {
    sku: string;
    product_name: string;
    units_sold: number;
    returns: number;
    return_rate: number;
    top_reason: string;
    quality_flag: boolean;         // Flag for QC review
  }[];
  
  // By category
  by_category: {
    category: string;
    return_rate: number;
    top_reason: string;
  }[];
  
  // Financial impact
  financial: {
    total_refund_amount: number;
    restocking_value: number;      // Value of resellable returns
    loss_from_damaged: number;
    shipping_cost_borne: number;
  };
  
  // Trends
  trends: {
    period: string;
    return_rate: number;
    vs_previous_period: number;    // percentage change
  }[];
}
```

#### 7.5.3 Returns Management UI

```
┌─────────────────────────────────────────────────────────────────────┐
│ RETURNS MANAGEMENT                                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Return Rate: 4.2% (Industry avg: 8%)  ⬇️ 1.2% vs last month       │
│                                                                      │
│  PENDING ACTION (8)                                                 │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │ ⚠️  RETURN REQUESTED  |  Order #TAT-2026-0038            [View]│ │
│  │     RNG-0042  |  Reason: Size too small  |  2 hours ago         │ │
│  │     [Approve] [Reject] [Request Photos]                          │ │
│  ├─────────────────────────────────────────────────────────────────┤ │
│  │ 🔄 EXCHANGE REQUESTED |  Order #TAT-2026-0035            [View]│ │
│  │     NCK-0103  |  Reason: Want different color  |  5 hours ago   │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│  IN PICKUP (5)                                                      │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │ 🚚  PICKUP SCHEDULED  |  Return #RET-2026-0124           [Track]│ │
│  │     Shiprocket pickup: Feb 28, 2-5 PM                           │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│  QUALITY INSPECTION (3)                                             │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │ 📦  RETURN RECEIVED   |  Return #RET-2026-0120          [Inspect]│ │
│  │     EAR-0234  |  Reason: Defective  |  Received today           │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│  Top Return Reasons:                                                │
│  Size Issue (35%) | Quality Issue (28%) | Changed Mind (20%)       │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 7.6 Quality Inspection Workflow

> **Category-Specific Inspection**: Current checklist is for Anti-Tarnish Jewelry. Different checklists for Watches, Purses, etc. can be configured.

#### 7.6.1 Inspection Checklist

```typescript
interface QualityInspection {
  id: string;
  return_id: string;
  
  // Product category determines checklist
  category: 'jewelry' | 'watch' | 'purse' | 'accessory';
  
  // Inspector
  inspected_by: string;
  inspected_at: Date;
  
  // Item condition assessment
  condition: {
    overall: 'new' | 'like_new' | 'lightly_used' | 'damaged' | 'defective';
    
    // Category-specific checks (selected based on product type)
    checks: InspectionChecks;
    
    // Damage details (if any)
    damage_details?: DamageDetail[];
  };
  
  // Disposition
  disposition: 'restock' | 'refurbish' | 'discount_sale' | 'discard' | 'return_to_vendor';
  
  // Financial
  restocking_fee_applied: number;
  refund_amount: number;
  
  // Notes
  notes?: string;
}

// Category-specific inspection checks
interface InspectionChecks {
  // === ANTI-TARNISH JEWELRY (Current Focus) ===
  jewelry?: {
    packaging_intact: boolean;
    tags_attached: boolean;
    no_scratches: boolean;
    stones_intact: boolean;
    clasp_working: boolean;
    no_tarnish: boolean;              // Critical for anti-tarnish
    original_finish: boolean;
    anti_tarnish_coating_intact: boolean;  // Specific to anti-tarnish
  };
  
  // === FUTURE: WATCHES ===
  // watch?: {
  //   packaging_intact: boolean;
  //   watch_working: boolean;
  //   no_scratches_on_face: boolean;
  //   strap_intact: boolean;
  //   water_resistance_seal: boolean;
  //   battery_working?: boolean;
  // };
  
  // === FUTURE: PURSES ===
  // purse?: {
  //   packaging_intact: boolean;
  //   no_stains: boolean;
  //   stitching_intact: boolean;
  //   zippers_working: boolean;
  //   hardware_not_tarnished: boolean;
  //   shape_retained: boolean;
  // };
}

// Inspection form UI - Category-specific checklists
const INSPECTION_CHECKLISTS = {
  PACKAGING: [
    'Original box present',
    'Jewelry pouch present',
    'Authenticity certificate present',
    'Tags/labels attached'
  ],
  PHYSICAL_CONDITION: [
    'No visible scratches',
    'No discoloration/tarnish',
    'All stones present and secure',
    'Clasp/fastener working properly',
    'Chain/links intact (no breakage)',
    'Original polish/finish maintained'
  ],
  VERIFICATION: [
    'SKU matches return request',
    'Hallmark/stamp visible and matches',
    'Weight matches original specs (±5%)'
  ]
};
```

### 7.7 Customer Communication Automation

#### 7.7.1 Notification Triggers

```typescript
interface LifecycleNotifications {
  // Order confirmation
  order_confirmed: {
    channels: ['email', 'sms'];
    timing: 'immediate';
    template: 'order_confirmation';
  };
  
  // Shipment
  shipped: {
    channels: ['email', 'sms', 'whatsapp'];
    timing: 'immediate';
    include_tracking: true;
  };
  
  // In-transit updates
  in_transit_updates: {
    frequency: 'daily';            // Once per day if status changes
    channels: ['email'];           // Email only to avoid spam
  };
  
  // Out for delivery
  out_for_delivery: {
    channels: ['sms', 'whatsapp']; // Immediate attention needed
    timing: 'immediate';
    include_otp: true;
  };
  
  // Delivered
  delivered: {
    channels: ['email', 'whatsapp'];
    timing: 'immediate';
    include_review_request: false; // Separate flow for review
  };
  
  // Review request (separate from delivery)
  review_request: {
    channels: ['email', 'whatsapp'];
    timing: 'delay';               // 7 days after delivery
    delay_days: 7;
    include_incentive: true;
  };
  
  // Return updates
  return_status_update: {
    channels: ['email', 'sms'];
    trigger_on_status: [
      'return_approved',
      'pickup_scheduled',
      'refund_processed'
    ];
  };
}
```

### 7.8 SKU-Level Lifecycle History

#### 7.8.1 Complete Journey Tracking

```typescript
interface SkuLifecycleHistory {
  sku: string;
  product_name: string;
  
  // All instances of this SKU sold
  instances: {
    line_item_id: string;
    order_id: string;
    customer_id: string;
    sold_at: Date;
    sold_price: number;
    
    // Lifecycle
    lifecycle: {
      stages: LifecycleStage[];
      current_stage: LifecycleStage;
      stage_timestamps: Record<LifecycleStage, Date>;
      
      // Delivery
      delivered_at?: Date;
      days_to_deliver?: number;
      
      // Review
      review?: {
        rating: number;
        content: string;
        submitted_at: Date;
      };
      
      // Return (if applicable)
      return?: {
        requested_at: Date;
        reason: string;
        refund_amount: number;
        final_status: 'refunded' | 'exchanged' | 'rejected';
      };
    };
    
    // Current status
    current_status: 'with_customer' | 'returned' | 'exchanged' | 'refunded';
  }[];
  
  // Aggregated metrics
  metrics: {
    total_sold: number;
    total_delivered: number;
    delivery_success_rate: number;
    avg_delivery_days: number;
    
    review_rate: number;           // % of delivered items reviewed
    avg_rating: number;
    
    return_rate: number;
    top_return_reason: string;
  };
}

// Query examples:
// - "Show me all RNG-0042 units and their current status"
// - "Which SKUs have the highest return rate?"
// - "How many BRD-0005 units are awaiting delivery?"
```

### 7.9 Admin UI Design

```
┌─────────────────────────────────────────────────────────────────────┐
│ PRODUCT LIFECYCLE TRACKER                                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Filters: [Status ▼] [Date Range ▼] [SKU ▼] [Courier ▼]   [Export] │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │ ORDER #TAT-2026-0042                                    [View]  │ │
│  │                                                                   │ │
│  │ 🖼️  RNG-0042-GLD-08  Golden Halo Ring  |  ₹12,999              │ │
│  │                                                                   │ │
│  │ Status: ✅ DELIVERED (Feb 28, 2:34 PM)                          │ │
│  │ Customer: Priya S. (priya@email.com)                              │ │
│  │ Courier: Shiprocket (TRACK: SHIP123456)                           │ │
│  │                                                                   │ │
│  │ Timeline: Order → Packed → Shipped → Transit → Delivered          │ │
│  │                                                                   │ │
│  │ Review: ⭐⭐⭐⭐⭐ "Beautiful ring, perfect fit!"                │ │
│  │ [Reply to Review]                                                 │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │ ORDER #TAT-2026-0040                                    [View]  │ │
│  │                                                                   │ │
│  │ 🖼️  NCK-0103-SLV     Silver Moon Necklace  |  ₹2,499            │ │
│  │                                                                   │ │
│  │ Status: 🚚 IN TRANSIT (Expected: Mar 1)                           │ │
│  │ Current Location: Delhi Hub                                       │ │
│  │                                                                   │ │
│  │ Timeline: Order → Packed → Shipped → Transit ⏳                   │ │
│  │                                                                   │ │
│  │ [Send Update] [Mark Exception]                                    │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │ ORDER #TAT-2026-0038                                    [View]  │ │
│  │                                                                   │ │
│  │ 🖼️  EAR-0234-OXD     Traditional Jhumka  |  ₹1,299              │ │
│  │                                                                   │ │
│  │ Status: 🔄 RETURN IN PROGRESS                                     │ │
│  │ Reason: Size too small                                            │ │
│  │ Return: Approved → Pickup Scheduled (Feb 28, 2-5 PM)              │ │
│  │                                                                   │ │
│  │ [Track Return] [Update Customer]                                  │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 7.10 Additional Possibilities

| Feature | Description | Impact |
|---------|-------------|--------|
| **Predictive Delivery** | ML-based delivery time prediction | Better customer expectations |
| **Delivery Optimization** | Suggest best courier by route | Faster, cheaper shipping |
| **Review Sentiment Analysis** | Auto-analyze review text | Identify issues faster |
| **Photo Reviews Gallery** | Curate customer photos | Social proof for marketing |
| **Return Prevention** | Flag high-risk orders pre-shipment | Reduce return rates |
| **Warranty Tracking** | Track warranty periods per SKU | Service & support |
| **Customer Health Score** | Aggregate satisfaction per customer | Churn prediction |
| **Delivery Heatmaps** | Visualize delivery performance | Logistics optimization |

---

## 8. Module 6: Admin Dashboard & Reporting

> **📦 BOTH FLOWS** — Unified view of INBOUND and OUTBOUND operations  
> **Question Answered**: "How is our business performing overall?"

### 8.1 Overview

The Admin Dashboard provides a unified command center that combines data from both our **inbound** (supplier/purchasing) and **outbound** (customer/sales) operations — giving a complete view of business performance.

```
DASHBOARD UNIFIES BOTH FLOWS:

   ┌───────────────────────────────────────────────────────────────┐
   │                    TATVA ADMIN DASHBOARD                       │
   ├────────────────────────────┬──────────────────────────────────┤
   │     🔴 INBOUND             │         🟢 OUTBOUND              │
   │     (Buying)               │         (Selling)                │
   │                            │                                  │
   │  • Wholesaler spend        │  • Sales revenue                 │
   │  • Purchase orders         │  • Customer orders               │
   │  • Lead times              │  • Profit margins                │
   │  • Quality ratings         │  • Reviews & ratings             │
   │  • Inventory inbound       │  • Returns & exchanges           │
   │                            │                                  │
   │  Question: Did we get      │  Question: Are customers         │
   │  good value from           │  happy? Are we                   │
   │  suppliers?                │  profitable?                     │
   │                            │                                  │
   └────────────────────────────┴──────────────────────────────────┘
```

### 8.2 Sales Overview

#### 8.2.1 Key Metrics

```typescript
interface SalesOverview {
  // Time-based comparisons
  periods: {
    today: DailyMetrics;
    yesterday: DailyMetrics;
    this_week: WeeklyMetrics;
    last_week: WeeklyMetrics;
    this_month: MonthlyMetrics;
    last_month: MonthlyMetrics;
    this_quarter: QuarterlyMetrics;
    ytd: YearMetrics;
  };
  
  // Daily metrics
  daily: {
    date: Date;
    orders_count: number;
    units_sold: number;
    gross_revenue: number;
    discounts: number;
    net_revenue: number;
    refunds: number;
    net_sales: number;
    
    // Hourly breakdown for today's real-time view
    hourly: {
      hour: number;               // 0-23
      orders: number;
      revenue: number;
    }[];
  };
  
  // Trends
  trends: {
    revenue_growth_percent: number;  // vs previous period
    order_growth_percent: number;
    aov_growth_percent: number;
    trend_direction: 'up' | 'down' | 'stable';
  };
}
```

#### 8.2.2 Dashboard Widget

```
┌─────────────────────────────────────────────────────────────────────┐
│ SALES OVERVIEW                              [Today | Week | Month] │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌────────────┐ │
│  │  ₹45,230    │  │    23       │  │  ₹1,967     │  │   ₹12,400  │ │
│  │  Revenue    │  │   Orders    │  │    AOV      │  │  Refunds   │ │
│  │  ↑ 18%      │  │   ↑ 5       │  │   ↑ 8%      │  │   ↓ 2      │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └────────────┘ │
│                                                                      │
│  Hourly Sales (Today)                                                │
│  Revenue │                                                           │
│    ₹8K ─┤                                  ╭────╮                    │
│         │                    ╭────────────╯      ╰──╮                │
│    ₹6K ─┤      ╭───────────╯                        ╰───             │
│         │ ╭───╯                                                     │
│    ₹4K ─┤╱                                                          │
│         └────┬────┬────┬────┬────┬────┬────┬────                    │
│             10   12   14   16   18   20   22                        │
│                              Hour                                    │
│                                                                      │
│  Revenue Breakdown:                                                  │
│  ├── New Customers:     ₹28,400 (63%)                               │
│  ├── Repeat Customers:  ₹16,830 (37%)                               │
│  └── Guest Checkout:    ₹0 (0%)                                     │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 8.3 Top-Performing SKUs

#### 7.2.1 Key Metrics

```typescript
interface SalesOverview {
  // Time-based comparisons
  periods: {
    today: DailyMetrics;
    yesterday: DailyMetrics;
    this_week: WeeklyMetrics;
    last_week: WeeklyMetrics;
    this_month: MonthlyMetrics;
    last_month: MonthlyMetrics;
    this_quarter: QuarterlyMetrics;
    ytd: YearMetrics;
  };
  
  // Daily metrics
  daily: {
    date: Date;
    orders_count: number;
    units_sold: number;
    gross_revenue: number;
    discounts: number;
    net_revenue: number;
    refunds: number;
    net_sales: number;
    
    // Hourly breakdown for today's real-time view
    hourly: {
      hour: number;               // 0-23
      orders: number;
      revenue: number;
    }[];
  };
  
  // Trends
  trends: {
    revenue_growth_percent: number;  // vs previous period
    order_growth_percent: number;
    aov_growth_percent: number;
    trend_direction: 'up' | 'down' | 'stable';
  };
}
```

#### 7.2.2 Dashboard Widget

```
┌─────────────────────────────────────────────────────────────────────┐
│ SALES OVERVIEW                              [Today | Week | Month] │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌────────────┐ │
│  │  ₹45,230    │  │    23       │  │  ₹1,967     │  │   ₹12,400  │ │
│  │  Revenue    │  │   Orders    │  │    AOV      │  │  Refunds   │ │ │
│  │  ↑ 18%      │  │   ↑ 5       │  │   ↑ 8%      │  │   ↓ 2      │ │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └────────────┘ │ │
│                                                                      │
│  Hourly Sales (Today)                                                │
│  Revenue │                                                           │
│    ₹8K ─┤                                  ╭────╮                    │
│         │                    ╭────────────╯      ╰──╮                │
│    ₹6K ─┤      ╭───────────╯                        ╰───             │
│         │ ╭───╯                                                     │
│    ₹4K ─┤╱                                                          │
│         └────┬────┬────┬────┬────┬────┬────┬────                    │
│             10   12   14   16   18   20   22                        │
│                              Hour                                    │
│                                                                      │
│  Revenue Breakdown:                                                  │
│  ├── New Customers:     ₹28,400 (63%)                               │
│  ├── Repeat Customers:  ₹16,830 (37%)                               │
│  └── Guest Checkout:    ₹0 (0%)                                     │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 7.3 Top-Performing SKUs

#### 7.3.1 Performance Rankings

```typescript
interface TopSkuReport {
  // By Revenue
  by_revenue: {
    rank: number;
    sku: string;
    product_name: string;
    total_revenue: number;
    units_sold: number;
    growth_percent: number;
  }[];
  
  // By Profit
  by_profit: {
    rank: number;
    sku: string;
    total_profit: number;
    profit_margin: number;
    units_sold: number;
  }[];
  
  // By Velocity (units/day)
  by_velocity: {
    rank: number;
    sku: string;
    units_per_day: number;
    days_in_stock: number;
    stockout_risk: 'low' | 'medium' | 'high';
  }[];
  
  // Most viewed (but not bought)
  high_views_low_conversion: {
    sku: string;
    views: number;
    cart_adds: number;
    purchases: number;
    conversion_rate: number;
    potential_issue: 'price' | 'description' | 'images' | 'stock';
  }[];
}
```

### 7.4 Inventory at a Glance

#### 7.4.1 Inventory Dashboard

```
┌─────────────────────────────────────────────────────────────────────┐
│ INVENTORY OVERVIEW                                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌────────────┐ │
│  │   1,245     │  │    42       │  │     8       │  │    156     │ │
│  │ Total SKUs  │  │ Low Stock   │  │ Out of Stock│  │ In Transit │ │
│  │             │  │   ⚠️        │  │    🚨       │  │   🚚       │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └────────────┘ │
│                                                                      │
│  Inventory Value: ₹45,60,000                                        │
│  ├── By Category:                                                    │
│  │   💍 Rings:      ₹18,20,000 (40%)  ████████████████████          │
│  │   📿 Necklaces:  ₹13,60,000 (30%)  ███████████████                │
│  │   👂 Earrings:   ₹9,10,000 (20%)   ████████████                   │
│  │   💫 Bracelets:  ₹4,50,000 (10%)   ████████                       │
│  │                                                                   │
│  └── By Material:                                                    │
│      🟡 Gold:      ₹32,50,000                                       │
│      ⚪ Silver:     ₹9,80,000                                       │
│      ⚫ Oxidized:   ₹3,30,000                                       │
│                                                                      │
│  [View Full Inventory]  [Reorder Suggestions]  [Stock Adjust]       │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 7.5 Low Stock Alerts

#### 7.5.1 Alert System

```typescript
interface LowStockAlert {
  id: string;
  sku: string;
  product_name: string;
  current_stock: number;
  reorder_point: number;
  
  // Sales velocity
  avg_daily_sales: number;
  days_until_stockout: number;
  
  // Suggested action
  suggested_reorder_qty: number;
  suggested_wholesaler: string;
  estimated_cost: number;
  
  // Priority
  priority: 'low' | 'medium' | 'high' | 'critical';
  priority_reasons: string[];     // "high_velocity", "long_lead_time"
  
  // Status
  status: 'new' | 'acknowledged' | 'ordered' | 'resolved';
  acknowledged_by?: string;
  acknowledged_at?: Date;
}
```

### 7.6 Order Fulfillment Tracker

#### 7.6.1 Fulfillment Pipeline

```
┌─────────────────────────────────────────────────────────────────────┐
│ ORDER FULFILLMENT STATUS                                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  Pending    Processing    Shipped    Delivered    Cancelled   │ │
│  │    ████        █████        ██         █████         █        │ │
│  │    12          18           5          245          2         │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│  PENDING PAYMENT (12)                                               │
│  ├── Order #TAT-2026-0042    ₹2,499    2 hours ago    [View]       │
│  └── Order #TAT-2026-0041    ₹15,999   5 hours ago    [View]       │
│                                                                      │
│  PROCESSING (18) - Action Required                                  │
│  ⚠️ Order #TAT-2026-0038    ₹4,599    1 day ago       [Pack]       │
│  ⚠️ Order #TAT-2026-0035    ₹1,299    2 days ago      [Pack]       │
│                                                                      │
│  SHIPPED (5)                                                        │
│  🚚 Order #TAT-2026-0040    ₹8,999    Shiprocket      [Track]      │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 7.7 Customer Insights

#### 7.7.1 Customer Analytics

```typescript
interface CustomerInsights {
  // Segmentation
  segments: {
    new_customers: number;        // First order within period
    returning: number;            // 2+ orders
    loyal: number;                // 5+ orders
    at_risk: number;              // No order in 90 days
    lost: number;                 // No order in 180 days
  };
  
  // Top customers
  top_customers: {
    customer_id: string;
    name: string;
    total_orders: number;
    total_spent: number;
    avg_order_value: number;
    last_order_date: Date;
    favorite_category: string;
  }[];
  
  // Repeat purchase metrics
  repeat_metrics: {
    repeat_rate: number;          // % of customers with 2+ orders
    avg_time_between_orders: number; // Days
    avg_orders_per_customer: number;
    customer_lifetime_value: number;
  };
  
  // Geographic distribution
  geography: {
    state: string;
    order_count: number;
    revenue: number;
    top_city: string;
  }[];
}
```

### 7.8 Wholesaler Spend Summary

#### 7.8.1 Supplier Dashboard

```
┌─────────────────────────────────────────────────────────────────────┐
│ WHOLESALER SPEND SUMMARY                            [Feb 2026]     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Total Spend This Month: ₹8,45,000                                  │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                                                             │    │
│  │  Shree Jewels Jaipur  ████████████████████████████  ₹3,20,000│    │
│  │  Royal Gems Delhi     ██████████████████            ₹2,45,000│    │
│  │  Mumbai Traders       ██████████                    ₹1,80,000│    │
│  │  KC Fashion           ██████                          ₹95,000│    │
│  │  Others               ████                            ₹5,000│    │
│  │                                                             │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  Purchase Orders: 12 total | 8 completed | 4 pending                │
│                                                                      │
│  Recent Orders:                                                      │
│  ─────────────────────────────────────────────────────────────────  │
│  PO-2026-0042  Shree Jewels    ₹1,20,000  Delivered  Feb 25        │
│  PO-2026-0041  Royal Gems      ₹85,000    In Transit  Feb 24       │
│  PO-2026-0040  Mumbai Traders  ₹45,000    Ordered     Feb 22       │
│                                                                      │
│  [View All Orders]  [Create PO]  [Download Report]                  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 7.9 Additional Possibilities

| Feature | Description | Impact |
|---------|-------------|--------|
| **AI Forecasting** | Predict sales, inventory needs | Better planning |
| **Anomaly Detection** | Auto-detect unusual patterns | Fraud prevention |
| **Mobile App** | Dashboard on-the-go | Always connected |
| **Scheduled Reports** | Email reports daily/weekly | Stay informed |
| **Custom Alerts** | Set your own alert rules | Proactive management |
| **Data Export** | API access, CSV, Excel | Further analysis |
| **Team Collaboration** | Assign tasks, notes on orders | Team coordination |

---

## 9. Integration Architecture

### 9.1 Module Interactions by Flow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                      MODULE INTEGRATION BY FLOW DIRECTION                        │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  🔴 INBOUND FLOW (We BUY from Suppliers)                                         │
│  ════════════════════════════════════════                                        │
│                                                                                  │
│  ┌─────────────────┐                    ┌─────────────────┐                      │
│  │  WHOLESALER     │───────────────────▶│   PURCHASE      │                      │
│  │  MANAGEMENT     │   We create POs    │   ORDERS        │                      │
│  │  (Suppliers)    │   to buy stock     │   (Inbound)     │                      │
│  └────────┬────────┘                    └─────────────────┘                      │
│           │                                                                      │
│           │ supplies stock to                                                    │
│           ▼                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐                 │
│  │                    SKU MANAGEMENT                            │                 │
│  │              (Inventory tracking - BOTH flows)               │                 │
│  └─────────────────────────────────────────────────────────────┘                 │
│                                                                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  🟢 OUTBOUND FLOW (We SELL to Customers)                                         │
│  ════════════════════════════════════════                                        │
│                                                                                  │
│  ┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐    │
│  │   CATALOG       │         │   CUSTOMER      │         │   PRODUCT       │    │
│  │   GENERATOR     │────────▶│   ORDERS        │────────▶│   LIFECYCLE     │    │
│  │   (Showcase)    │         │   (Sales)       │         │   (Post-sale)   │    │
│  └─────────────────┘         └────────┬────────┘         └─────────────────┘    │
│                                        │                                         │
│                                        │ feeds sales data                         │
│                                        ▼                                         │
│                               ┌─────────────────┐                                │
│                               │   P&L TRACKING  │                                │
│                               │   (Profit calc) │                                │
│                               └─────────────────┘                                │
│                                                                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  📦 SKU MANAGEMENT: THE CENTRAL HUB                                              │
│  ══════════════════════════════════                                              │
│                                                                                  │
│             🔴 INBOUND              🟢 OUTBOUND                                  │
│                                                                                  │
│         ┌─────────────┐          ┌─────────────┐                                 │
│         │  Buy Stock  │─────────▶│   SKU:001   │─────────▶│  Sell Stock  │       │
│         │  at ₹500    │          │  Created    │          │  at ₹1,299   │       │
│         └─────────────┘          └─────────────┘          └─────────────┘       │
│                                          │                                       │
│                                          ▼                                       │
│                                 ┌─────────────────┐                              │
│                                 │  Stock Level    │                              │
│                                 │  Updates        │                              │
│                                 └─────────────────┘                              │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 9.2 Event Flow by Direction

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                      EVENT-DRIVEN WORKFLOWS BY DIRECTION                         │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  🔴 INBOUND EVENTS (Buying from Suppliers)                                       │
│  ═════════════════════════════════════════                                       │
│                                                                                  │
│  1. NEW PURCHASE ORDER CREATED (We order FROM wholesaler)
   └──▶ Update Wholesaler History
   └──▶ Create Pending Inventory
   └──▶ Log expected lead time

2. INVENTORY RECEIVED (From Wholesaler)
   └──▶ Update SKU stock levels
   └──▶ Calculate actual lead time
   └──▶ Update Wholesaler rating (delivery)
   └──▶ Trigger quality review task
   └──▶ Update P&L cost basis

│
│ 🔄 Bridge: Inventory now available for sale
│
▼

🟢 OUTBOUND EVENTS (Selling to Customers)
═══════════════════════════════════════════

3. CUSTOMER ORDER PLACED (Customer buys FROM us)
   └──▶ Reserve inventory
   └──▶ Calculate real-time P&L (sale profit)
   └──▶ Update velocity metrics
   └──▶ Check for low stock alert trigger

4. INBOUND QUALITY REVIEW COMPLETED
   └──▶ Update Wholesaler quality rating
   └──▶ Flag defective items for return TO supplier
   └──▶ Update SKU quality score

5. DAILY CRON JOBS (Both flows)
   └──▶ Aggregate P&L data
   └──▶ Generate low stock alerts
   └──▶ Update bestseller rankings
   └──▶ Cache dashboard metrics

6. OUTBOUND SHIPMENT STATUS UPDATE
   └──▶ Update shipment timeline
   └──▶ Notify customer of status change
   └──▶ Update estimated delivery
   └──▶ Trigger delivery confirmation flow

7. DELIVERY CONFIRMED (Customer received)
   └──▶ Update order status
   └──▶ Schedule review request (7 days later)
   └──▶ Update inventory (if return/exchange)
   └──▶ Update customer purchase history

8. CUSTOMER REVIEW SUBMITTED
   └──▶ Queue for moderation
   └──▶ Update SKU rating aggregate
   └──▶ Send incentive (if configured)
   └──▶ Notify admin of negative review (< 3 stars)

9. CUSTOMER RETURN REQUESTED
   └──▶ Create return workflow
   └──▶ Hold inventory (if exchange)
   └──▶ Calculate eligible refund amount
   └──▶ Queue for admin approval
```

### 8.3 API Structure

```
┌─────────────────────────────────────────────────────────────────────┐
│                      API ENDPOINTS OVERVIEW                          │
└─────────────────────────────────────────────────────────────────────┘

STORE API (Customer-facing)
├── GET  /store/catalogs/:slug              # View public catalog
├── POST /store/catalogs/:slug/inquiry      # Submit inquiry
└── GET  /store/skus/:sku/profitability     # Optional: public margin

ADMIN API (Protected)
│
├── WHOLESALERS
│   ├── GET    /admin/wholesalers
│   ├── POST   /admin/wholesalers
│   ├── GET    /admin/wholesalers/:id
│   ├── POST   /admin/wholesalers/:id
│   ├── DELETE /admin/wholesalers/:id
│   ├── GET    /admin/wholesalers/:id/history
│   ├── GET    /admin/wholesalers/:id/performance
│   └── POST   /admin/wholesalers/:id/rate
│
├── SKU MANAGEMENT
│   ├── GET    /admin/skus
│   ├── POST   /admin/skus/generate
│   ├── POST   /admin/skus/bulk-upload
│   ├── GET    /admin/skus/:sku
│   ├── POST   /admin/skus/:sku
│   ├── POST   /admin/skus/:sku/link-wholesaler
│   ├── GET    /admin/skus/check-duplicates
│   └── POST   /admin/skus/image-ingest
│
├── P&L TRACKING
│   ├── GET    /admin/pln/skus/:sku
│   ├── GET    /admin/pln/dashboard
│   ├── GET    /admin/pln/reports/sales
│   ├── GET    /admin/pln/reports/profit
│   ├── GET    /admin/pln/break-even/:sku
│   └── GET    /admin/pln/alerts
│
├── CATALOG GENERATOR
│   ├── GET    /admin/catalogs
│   ├── POST   /admin/catalogs
│   ├── GET    /admin/catalogs/:id
│   ├── POST   /admin/catalogs/:id/generate
│   ├── GET    /admin/catalogs/:id/download
│   └── GET    /admin/catalogs/:id/analytics
│
├── PRODUCT LIFECYCLE
│   ├── GET    /admin/lifecycle/shipments
│   ├── GET    /admin/lifecycle/shipments/:id
│   ├── POST   /admin/lifecycle/shipments/:id/update-status
│   ├── GET    /admin/lifecycle/shipments/:id/tracking
│   ├── GET    /admin/lifecycle/reviews
│   ├── POST   /admin/lifecycle/reviews/:id/moderate
│   ├── POST   /admin/lifecycle/reviews/:id/reply
│   ├── GET    /admin/lifecycle/returns
│   ├── POST   /admin/lifecycle/returns
│   ├── GET    /admin/lifecycle/returns/:id
│   ├── POST   /admin/lifecycle/returns/:id/approve
│   ├── POST   /admin/lifecycle/returns/:id/reject
│   ├── POST   /admin/lifecycle/returns/:id/schedule-pickup
│   ├── POST   /admin/lifecycle/returns/:id/inspect
│   ├── POST   /admin/lifecycle/returns/:id/process-refund
│   ├── GET    /admin/lifecycle/skus/:sku/history
│   └── GET    /admin/lifecycle/analytics
│
└── DASHBOARD
    ├── GET    /admin/dashboard/sales
    ├── GET    /admin/dashboard/inventory
    ├── GET    /admin/dashboard/top-skus
    ├── GET    /admin/dashboard/customers
    └── GET    /admin/dashboard/wholesalers
```

---

## 10. Implementation Roadmap

### 9.1 Phase 1: Foundation (Weeks 1-2)

| Task | Priority | Effort |
|------|----------|--------|
| Set up Medusa module structure | High | 1 day |
| Create base data models | High | 2 days |
| Set up database migrations | High | 1 day |
| Create API route scaffolding | High | 2 days |
| Basic admin UI setup | High | 3 days |
| **Milestone**: Module skeleton ready | | |

### 9.2 Phase 2: Wholesaler & SKU (Weeks 3-5)

| Task | Priority | Effort |
|------|----------|--------|
| Wholesaler CRUD + ratings | High | 3 days |
| SKU numbering system (Anti-Tarnish focus) | High | 2 days |
| SKU-Wholesaler linkage | High | 2 days |
| Bulk upload functionality | Medium | 3 days |
| Image-based ingest (basic) | Medium | 3 days |
| SKU deduplication | Medium | 2 days |
| Anti-tarnish attribute tracking | High | 2 days |
| Admin UI for both modules | High | 4 days |
| **Milestone**: Can onboard anti-tarnish suppliers & products | | |

### 9.3 Phase 3: P&L Tracking (Weeks 6-7)

| Task | Priority | Effort |
|------|----------|--------|
| Cost tracking models | High | 2 days |
| Order-level P&L calculation | High | 3 days |
| Dashboard aggregation | High | 3 days |
| Break-even calculator | Medium | 2 days |
| Loss alert system | Medium | 2 days |
| Wholesaler profitability view | Medium | 2 days |
| **Milestone**: Full visibility into true margins | | |

### 10.4 Phase 4: Catalog Generator (Weeks 8-9)

| Task | Priority | Effort |
|------|----------|--------|
| Image catalog generator | High | 3 days |
| PDF catalog generator | High | 3 days |
| Web catalog (shareable links) | High | 4 days |
| Filtering & selection UI | Medium | 2 days |
| Branding customization | Medium | 2 days |
| **Milestone**: Can generate & share catalogs | | |

### 10.5 Phase 5: Product Lifecycle Tracking (Weeks 10-12)

| Task | Priority | Effort |
|------|----------|--------|
| Shipment tracking integration | High | 3 days |
| Courier API webhooks (Shiprocket) | High | 2 days |
| Customer review collection system | High | 3 days |
| Review moderation workflow | Medium | 2 days |
| Returns & exchange management | High | 4 days |
| Quality inspection workflow | Medium | 3 days |
| Automated customer notifications | Medium | 2 days |
| Admin UI for lifecycle management | High | 4 days |
| **Milestone**: Complete post-sale visibility | | |

### 10.6 Phase 6: Dashboard & Polish (Weeks 13-14)

| Task | Priority | Effort |
|------|----------|--------|
| Sales overview dashboard | High | 2 days |
| Inventory dashboard | High | 2 days |
| Order fulfillment tracker | High | 2 days |
| Customer insights | Medium | 2 days |
| Wholesaler spend summary | Medium | 1 day |
| Product lifecycle dashboard | High | 2 days |
| Returns analytics | Medium | 2 days |
| Reports & exports | Medium | 3 days |
| Performance optimization | Medium | 3 days |
| **Milestone**: Complete operational dashboard | | |

### 10.7 Phase 7: Advanced Features & Category Expansion (Week 15+)

| Task | Priority | Effort |
|------|----------|--------|
| AI-powered image analysis | Low | 5 days |
| Advanced analytics | Low | 4 days |
| Mobile app | Low | 10 days |
| Supplier portal | Low | 5 days |
| Predictive delivery ML | Low | 5 days |
| **🆕 Category Expansion: Watches** | Future | 10 days |
| **🆕 Category Expansion: Purses/Handbags** | Future | 10 days |
| **🆕 Category-specific inspection modules** | Future | 5 days |
| **Milestone**: Premium features ready, Multi-category capable | | |

---

## Appendix: Data Models

### A.1 Core Entity Definitions

```typescript
// ============================================
// WHOLESALER
// ============================================
interface Wholesaler {
  id: string;
  name: string;
  contact_person: string;
  phone: string;
  email: string;
  address: Address;
  location: string;
  categories: string[];
  gst_number?: string;
  bank_details?: BankDetails;
  
  // Business rules
  min_order_quantity: number;
  min_order_value: number;
  lead_time_days: number;
  payment_terms: PaymentTerms;
  
  // Ratings
  quality_rating: QualityRating;
  
  // Metadata
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

// ============================================
// SKU (Our extension to Medusa ProductVariant)
// ============================================
// EXTENSIBLE: Works for Jewelry (current), Watches, Purses (future)
interface SkuExtension {
  id: string;
  variant_id: string;           // Links to Medusa
  
  // Our custom SKU (may differ from Medusa's)
  tatva_sku: string;
  
  // Category classification
  category: {
    code: string;               // "RNG", "WTC", "PUR"
    name: string;               // "Rings", "Watches", "Purses"
    product_type: 'jewelry' | 'watch' | 'purse' | 'accessory' | string;
  };
  
  // Attributes (category-specific structure)
  attributes: {
    // Current: Anti-Tarnish Jewelry
    material?: MaterialAttributes;
    stones?: StoneAttributes;
    dimensions?: DimensionAttributes;
    anti_tarnish_properties?: {
      is_anti_tarnish: boolean;
      coating_type?: string;
      warranty_months?: number;
    };
    
    // Future: Watches could include
    // watch_movement?: 'quartz' | 'automatic';
    // water_resistance?: string;
    
    // Future: Purses could include
    // bag_style?: 'tote' | 'clutch';
    // compartment_count?: number;
  };
  
  // Source
  primary_wholesaler_id: string;
  
  // Tracking
  batches: InventoryBatch[];
  
  // P&L
  cost_history: CostHistoryEntry[];
  
  created_at: Date;
  updated_at: Date;
}

// ============================================
// INVENTORY BATCH (for FIFO costing)
// ============================================
interface InventoryBatch {
  id: string;
  sku_id: string;
  wholesaler_id: string;
  purchase_order_id: string;
  
  // Quantity tracking
  quantity_received: number;
  quantity_remaining: number;
  
  // Cost
  unit_cost: number;
  inbound_cost_allocated: number;
  total_unit_cost: number;
  
  // Dates
  received_at: Date;
  fully_sold_at?: Date;
}

// ============================================
// SKU PROFIT SNAPSHOT (for fast queries)
// ============================================
interface SkuProfitSnapshot {
  id: string;
  sku_id: string;
  period: string;               // "2026-02"
  
  // Sales
  units_sold: number;
  gross_revenue: number;
  discounts: number;
  net_revenue: number;
  
  // Costs
  total_cogs: number;
  total_operating_costs: number;
  
  // Profit
  gross_profit: number;
  net_profit: number;
  net_margin_percent: number;
  
  updated_at: Date;
}

// ============================================
// SHIPMENT / PRODUCT LIFECYCLE
// ============================================
interface Shipment {
  id: string;
  order_id: string;
  order_line_item_id: string;
  
  // Tracking
  courier: string;
  tracking_number: string;
  tracking_url: string;
  
  // Status
  current_status: LifecycleStage;
  timeline: TrackingEvent[];
  
  // Delivery
  estimated_delivery: Date;
  delivered_at?: Date;
  delivery_proof?: DeliveryProof;
  
  created_at: Date;
  updated_at: Date;
}

interface TrackingEvent {
  timestamp: Date;
  status: string;
  location: string;
  description: string;
}

// ============================================
// REVIEW
// ============================================
interface Review {
  id: string;
  order_id: string;
  line_item_id: string;
  sku: string;
  customer_id: string;
  
  // Content
  rating: number;
  title?: string;
  content?: string;
  images?: string[];
  
  // Moderation
  status: 'pending' | 'approved' | 'rejected';
  moderated_by?: string;
  moderated_at?: Date;
  
  // Response
  merchant_reply?: {
    content: string;
    replied_at: Date;
    replied_by: string;
  };
  
  created_at: Date;
}

// ============================================
// RETURN REQUEST
// ============================================
interface ReturnRequest {
  id: string;
  order_id: string;
  line_item_id: string;
  sku: string;
  customer_id: string;
  
  type: 'return' | 'exchange';
  reason_category: string;
  reason_notes?: string;
  
  status: ReturnStatus;
  timeline: ReturnEvent[];
  
  // Inspection
  inspection?: QualityInspection;
  
  // Resolution
  resolution?: {
    type: 'refund' | 'exchange' | 'store_credit';
    processed_at: Date;
    refund_amount?: number;
  };
  
  created_at: Date;
  updated_at: Date;
}

// ============================================
// CATALOG
// ============================================
interface Catalog {
  id: string;
  name: string;
  slug: string;
  
  // Source
  filter_config: CatalogFilters;
  included_skus: string[];
  
  // Output formats
  formats: {
    image?: { url: string; generated_at: Date };
    pdf?: { url: string; generated_at: Date };
    web?: { url: string; enabled: boolean };
  };
  
  // Settings
  pricing_mode: 'retail' | 'wholesale' | 'custom';
  show_prices: boolean;
  branding_config: BrandConfig;
  
  // Tracking
  view_count: number;
  inquiry_count: number;
  
  created_by: string;
  created_at: Date;
  updated_at: Date;
}
```

---

## Summary

This specification outlines a comprehensive backend office management system for Tatva, currently focused on **Anti-Tarnish Jewelry** (Rings, Necklaces, Earrings, Bracelets, Anklets), with an extensible architecture ready for future categories like **Watches, Purses, Handbags, and Accessories**.

### 🔴 Inbound (Supplier → Tatva) — We BUY Anti-Tarnish Jewelry
1. **Tracks every supplier relationship** with quality metrics and performance history
2. **Manages purchase orders** we place with anti-tarnish jewelry wholesalers
3. **Records buy costs** and lead times for accurate costing
4. **Quality checks** specifically for anti-tarnish properties and coating

### 🟢 Outbound (Tatva → Customer) — We SELL Anti-Tarnish Jewelry  
5. **Showcases products** with beautiful, shareable catalogs highlighting anti-tarnish benefits
6. **Reveals true profitability** at the individual SKU level when we sell
7. **Traces complete product lifecycle** from shipment to delivery, reviews, and returns

### 📦 Both Flows + Future Ready
8. **Brings order to inventory** with intelligent SKU numbering (extensible to Watches: WTC-, Purses: PUR-)
9. **Unifies operations** in a single dashboard with actionable insights
10. **Category-extensible** — Add Watches, Purses later without system redesign

### ✨ Anti-Tarnish Specific Features
- Tarnish resistance tracking in SKU attributes
- Anti-tarnish coating quality checks in returns
- Category-specific inspection checklists
- Warranty tracking for anti-tarnish guarantee

### 🚀 Future Expansion Ready
- SKU format supports new categories (WTC-, PUR-, HBG-)
- Category-specific attributes structure
- Configurable quality inspection per product type
- Material codes ready for leather, fabric, etc.

The architecture is built on Medusa.js v2 modules, ensuring tight integration with your existing e-commerce platform while adding jewelry-specific capabilities that generic platforms cannot provide.

```
┌─────────────────────────────────────────────────────────────────┐
│                    COMPLETE FLOW COVERAGE                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  CURRENT: Anti-Tarnish Jewelry      FUTURE: Multi-Category      │
│  • Rings (RNG-)                     • Watches (WTC-)            │
│  • Necklaces (NCK-)                 • Purses (PUR-)             │
│  • Earrings (EAR-)                  • Handbags (HBG-)           │
│  • Bracelets (BRA-)                 • Accessories (ACC-)        │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  🔴 INBOUND                          🟢 OUTBOUND                 │
│  (We Buy)                            (We Sell)                   │
│                                                                  │
│  Wholesaler ───▶ Tatva ───▶ Inventory ───▶ Customer ───▶ Review │
│              PO              SKU           Order          Return │
│              #001            Mgmt          Ship                 │
│              #002            &             Lifecycle            │
│                              Track                              │
│                                                                  │
│  • Who we buy from              • Who we sell to                │
│  • At what cost                 • At what price                 │
│  • Tarnish resistance ratings   • Delivery tracking             │
│  • Lead times                   • Reviews & returns             │
│                                                                  │
│  PROFIT = Selling Price (OUTBOUND) - Buy Cost (INBOUND) - Costs │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Key Success Metrics

| Metric | Target |
|--------|--------|
| Time to onboard new wholesaler | < 5 minutes |
| Time to add new SKU with image | < 2 minutes |
| P&L calculation accuracy | > 99% |
| Catalog generation time | < 30 seconds |
| Dashboard load time | < 2 seconds |
| Inventory visibility | Real-time |

---

**Document Version**: 1.0  
**Last Updated**: March 2026  
**Next Review**: Post-implementation feedback
