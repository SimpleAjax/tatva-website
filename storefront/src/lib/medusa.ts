// Medusa API Client
const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9111";
const MEDUSA_PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_API_KEY || "";

// Types based on Medusa API
export interface Product {
  id: string;
  title: string;
  handle: string;
  description: string;
  thumbnail: string | null;
  images: { url: string }[];
  variants: ProductVariant[];
  options: ProductOption[];
  tags: { value: string }[];
  collection: Collection | null;
  categories: Category[];
  metadata: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

export interface ProductVariant {
  id: string;
  title: string;
  sku: string;
  barcode: string | null;
  ean: string | null;
  upc: string | null;
  allow_backorder: boolean;
  manage_inventory: boolean;
  hs_code: string | null;
  origin_country: string | null;
  mid_code: string | null;
  material: string | null;
  weight: number | null;
  length: number | null;
  height: number | null;
  width: number | null;
  options: ProductVariantOption[];
  prices: MoneyAmount[];
  original_price?: number;
  calculated_price?: number;
  inventory_quantity: number;
  metadata: Record<string, any> | null;
}

export interface ProductVariantOption {
  id: string;
  option_id: string;
  option: ProductOption;
  value: string;
}

export interface ProductOption {
  id: string;
  title: string;
  values: ProductOptionValue[];
}

export interface ProductOptionValue {
  id: string;
  value: string;
}

export interface MoneyAmount {
  id: string;
  currency_code: string;
  amount: number;
  min_quantity: number | null;
  max_quantity: number | null;
}

export interface Collection {
  id: string;
  title: string;
  handle: string;
}

export interface Category {
  id: string;
  name: string;
  handle: string;
}

export interface Cart {
  id: string;
  email: string | null;
  billing_address: Address | null;
  shipping_address: Address | null;
  items: LineItem[];
  region: Region | null;
  region_id: string | null;
  currency_code: string;
  gift_cards: any[];
  discounts: any[];
  shipping_methods: ShippingMethod[];
  payment_session: PaymentSession | null;
  payment_sessions: PaymentSession[];
  metadata: Record<string, any> | null;
  subtotal: number;
  tax_total: number;
  shipping_total: number;
  discount_total: number;
  gift_card_total: number;
  total: number;
  item_total: number;
  completed_at?: string | null;
}

export interface LineItem {
  id: string;
  cart_id: string;
  order_id: string | null;
  swap_id: string | null;
  claim_order_id: string | null;
  original_item_id: string | null;
  title: string;
  description: string | null;
  thumbnail: string | null;
  is_return: boolean;
  is_giftcard: boolean;
  should_merge: boolean;
  allow_discounts: boolean;
  has_shipping: boolean;
  unit_price: number;
  variant?: ProductVariant;
  variant_id?: string;
  quantity: number;
  fulfilled_quantity: number | null;
  returned_quantity: number | null;
  shipped_quantity: number | null;
  metadata: Record<string, any> | null;
  adjustments: any[];
  tax_lines: any[];
  subtotal: number;
  tax_total: number;
  total: number;
  original_total: number;
  discount_total: number;
  raw_discount_total: number;
}

export interface Address {
  id: string;
  customer_id: string | null;
  company: string | null;
  first_name: string;
  last_name: string;
  address_1: string;
  address_2: string | null;
  city: string;
  country_code: string;
  province: string | null;
  postal_code: string;
  phone: string | null;
  metadata: Record<string, any> | null;
}

export interface Region {
  id: string;
  name: string;
  currency_code: string;
  tax_rate: number;
  tax_code: string | null;
  gift_cards_taxable: boolean;
  automatic_taxes: boolean;
  tax_provider_id: string | null;
  metadata: Record<string, any> | null;
  countries: Country[];
  payment_providers: PaymentProvider[];
  fulfillment_providers: FulfillmentProvider[];
}

export interface Country {
  id: number;
  iso_2: string;
  iso_3: string;
  num_code: number;
  name: string;
  display_name: string;
  region_id: string;
}

export interface PaymentProvider {
  id: string;
  is_installed: boolean;
}

export interface FulfillmentProvider {
  id: string;
  is_installed: boolean;
}

export interface ShippingMethod {
  id: string;
  shipping_option_id: string;
  order_id: string | null;
  claim_order_id: string | null;
  cart_id: string;
  swap_id: string | null;
  return_id: string | null;
  price: number;
  data: Record<string, any>;
  subtotal: number;
  total: number;
  shipping_option: ShippingOption;
}

export interface ShippingOption {
  id: string;
  name: string;
  region_id: string;
  profile_id: string;
  provider_id: string;
  price_type: string;
  amount: number | null;
  is_return: boolean;
  admin_only: boolean;
  data: Record<string, any>;
  metadata: Record<string, any> | null;
}

export interface PaymentSession {
  id: string;
  cart_id: string;
  provider_id: string;
  is_selected: boolean | null;
  is_initiated: boolean;
  status: string;
  data: Record<string, any>;
  idempotency_key: string | null;
  amount: number;
  payment_authorized_at: string | null;
}

export interface ShippingOptionWithPrice {
  id: string;
  name: string;
  amount: number;
  price_type: string;
}

// API Helper functions
async function fetchFromMedusa(endpoint: string, options: RequestInit = {}) {
  const url = `${MEDUSA_BACKEND_URL}${endpoint}`;
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers as Record<string, string>,
  };
  
  // Add publishable API key if available
  if (MEDUSA_PUBLISHABLE_API_KEY) {
    headers["x-publishable-api-key"] = MEDUSA_PUBLISHABLE_API_KEY;
  }
  
  console.log(`[Medusa API] ${options.method || 'GET'} ${url}`);
  
  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    console.error(`[Medusa API] Error:`, error);
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Cart API
export async function createCart(regionId?: string): Promise<{ cart: Cart }> {
  const body: any = {};
  if (regionId) body.region_id = regionId;
  
  return fetchFromMedusa("/store/carts", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function getCart(cartId: string): Promise<{ cart: Cart }> {
  return fetchFromMedusa(`/store/carts/${cartId}`);
}

export async function addToCart(
  cartId: string,
  variantId: string,
  quantity: number
): Promise<{ cart: Cart }> {
  return fetchFromMedusa(`/store/carts/${cartId}/line-items`, {
    method: "POST",
    body: JSON.stringify({
      variant_id: variantId,
      quantity,
    }),
  });
}

export async function updateLineItem(
  cartId: string,
  lineItemId: string,
  quantity: number
): Promise<{ cart: Cart }> {
  return fetchFromMedusa(`/store/carts/${cartId}/line-items/${lineItemId}`, {
    method: "POST",
    body: JSON.stringify({ quantity }),
  });
}

export async function removeLineItem(
  cartId: string,
  lineItemId: string
): Promise<{ cart: Cart }> {
  return fetchFromMedusa(`/store/carts/${cartId}/line-items/${lineItemId}`, {
    method: "DELETE",
  });
}

export async function updateCart(cartId: string, data: Partial<Cart>): Promise<{ cart: Cart }> {
  return fetchFromMedusa(`/store/carts/${cartId}`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function addShippingMethod(
  cartId: string,
  optionId: string
): Promise<{ cart: Cart }> {
  return fetchFromMedusa(`/store/carts/${cartId}/shipping-methods`, {
    method: "POST",
    body: JSON.stringify({ option_id: optionId }),
  });
}

export async function createPaymentSessions(cartId: string): Promise<{ cart: Cart }> {
  return fetchFromMedusa(`/store/carts/${cartId}/payment-sessions`, {
    method: "POST",
  });
}

// Product API
export async function getProducts(params?: {
  limit?: number;
  offset?: number;
  category_id?: string;
  collection_id?: string;
  handle?: string;
  q?: string;
}): Promise<{ products: Product[]; count: number; offset: number; limit: number }> {
  const searchParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) searchParams.append(key, String(value));
    });
  }
  
  return fetchFromMedusa(`/store/products?${searchParams.toString()}`);
}

export async function getProductByHandle(handle: string): Promise<{ product: Product }> {
  const response = await getProducts({ handle });
  if (response.products.length === 0) {
    throw new Error("Product not found");
  }
  return { product: response.products[0] };
}

export async function getProductById(id: string): Promise<{ product: Product }> {
  return fetchFromMedusa(`/store/products/${id}`);
}

// Region API
export async function getRegions(): Promise<{ regions: Region[] }> {
  return fetchFromMedusa("/store/regions");
}

export async function getRegion(id: string): Promise<{ region: Region }> {
  return fetchFromMedusa(`/store/regions/${id}`);
}

// Shipping Options API
export async function getShippingOptions(cartId: string): Promise<{ shipping_options: ShippingOptionWithPrice[] }> {
  return fetchFromMedusa(`/store/shipping-options/${cartId}`);
}

// Collections API
export async function getCollections(): Promise<{ collections: Collection[] }> {
  return fetchFromMedusa("/store/collections");
}

// Categories API
export async function getCategories(): Promise<{ product_categories: Category[] }> {
  return fetchFromMedusa("/store/product-categories");
}

// Helper function to format price
export function formatPrice(amount: number, currencyCode: string = "INR"): string {
  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return formatter.format(amount / 100); // Medusa stores amounts in smallest currency unit
}

// Calculate price for a variant
export function getVariantPrice(variant: ProductVariant, currencyCode: string = "inr"): number | null {
  if (!variant?.prices || !Array.isArray(variant.prices)) {
    return null;
  }
  const price = variant.prices.find(p => p.currency_code?.toLowerCase() === currencyCode.toLowerCase());
  return price ? price.amount : null;
}
