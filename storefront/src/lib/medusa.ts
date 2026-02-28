// Medusa API Client
const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9111";
const MEDUSA_PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_API_KEY || "";

// Direct backend calls - CORS should be configured on backend
const API_BASE_URL = MEDUSA_BACKEND_URL;

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

export interface CalculatedPrice {
  id: string;
  calculated_amount: number;
  original_amount: number;
  currency_code: string;
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
  calculated_price?: CalculatedPrice;
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
  description?: string;
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
  const url = `${API_BASE_URL}${endpoint}`;
  
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
  region_id?: string;
}): Promise<{ products: Product[]; count: number; offset: number; limit: number }> {
  const searchParams = new URLSearchParams();
  
  // Add params
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) searchParams.append(key, String(value));
    });
  }
  
  return fetchFromMedusa(`/store/products?${searchParams.toString()}`);
}

// Get products with automatic region resolution for pricing
export async function getProductsWithPricing(params?: Omit<Parameters<typeof getProducts>[0], 'region_id'>): Promise<{ products: Product[]; count: number; offset: number; limit: number }> {
  // Dynamic import to avoid circular dependency
  const { getDefaultRegionId } = await import('./regions');
  const regionId = await getDefaultRegionId();
  
  return getProducts({
    ...params,
    region_id: regionId,
  });
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

// ============================================
// Customer Authentication API
// ============================================

export interface Customer {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  billing_address?: Address;
  shipping_addresses?: Address[];
  orders?: Order[];
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
}

export interface Order {
  id: string;
  status: string;
  fulfillment_status: string;
  payment_status: string;
  display_id: string;
  total: number;
  subtotal: number;
  tax_total: number;
  shipping_total: number;
  discount_total: number;
  currency_code: string;
  created_at: string;
  updated_at: string;
  items: LineItem[];
  shipping_address?: Address;
  billing_address?: Address;
}

export interface AuthResponse {
  customer: Customer;
}

export async function registerCustomer(data: {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
}): Promise<AuthResponse> {
  return fetchFromMedusa("/store/customers", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function loginCustomer(data: {
  email: string;
  password: string;
}): Promise<{ customer: Customer; token?: string }> {
  // First authenticate to get session
  const authResponse = await fetchFromMedusa("/store/auth", {
    method: "POST",
    body: JSON.stringify(data),
  });
  
  // Then get customer data
  const customerResponse = await getCurrentCustomer();
  
  return { ...authResponse, ...customerResponse };
}

export async function logoutCustomer(): Promise<void> {
  return fetchFromMedusa("/store/auth", {
    method: "DELETE",
  });
}

export async function getCurrentCustomer(): Promise<AuthResponse> {
  return fetchFromMedusa("/store/customers/me");
}

export async function updateCustomer(data: Partial<Customer>): Promise<AuthResponse> {
  return fetchFromMedusa("/store/customers/me", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getCustomerOrders(): Promise<{ orders: Order[] }> {
  return fetchFromMedusa("/store/customers/me/orders");
}

export async function addCustomerAddress(data: Partial<Address>): Promise<{ customer: Customer }> {
  return fetchFromMedusa("/store/customers/me/addresses", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateCustomerAddress(addressId: string, data: Partial<Address>): Promise<{ customer: Customer }> {
  return fetchFromMedusa(`/store/customers/me/addresses/${addressId}`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function deleteCustomerAddress(addressId: string): Promise<void> {
  return fetchFromMedusa(`/store/customers/me/addresses/${addressId}`, {
    method: "DELETE",
  });
}

// ============================================
// Wishlist API (using customer metadata)
// ============================================

export async function getWishlist(): Promise<string[]> {
  try {
    const { customer } = await getCurrentCustomer();
    return customer.metadata?.wishlist || [];
  } catch {
    return [];
  }
}

export async function addToWishlist(productId: string): Promise<void> {
  const { customer } = await getCurrentCustomer();
  const wishlist = customer.metadata?.wishlist || [];
  
  if (!wishlist.includes(productId)) {
    wishlist.push(productId);
    await updateCustomer({
      metadata: { ...customer.metadata, wishlist }
    });
  }
}

export async function removeFromWishlist(productId: string): Promise<void> {
  const { customer } = await getCurrentCustomer();
  const wishlist = customer.metadata?.wishlist || [];
  
  const updatedWishlist = wishlist.filter((id: string) => id !== productId);
  await updateCustomer({
    metadata: { ...customer.metadata, wishlist: updatedWishlist }
  });
}

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
export async function completeCart(cartId: string): Promise<{ order: Order; cart?: Cart }> {
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

/**
 * Get order by ID
 * Used on order confirmation page
 */
export async function getOrder(orderId: string): Promise<{ order: Order }> {
  return fetchFromMedusa(`/store/orders/${orderId}`);
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
  // Medusa v2 returns calculated_price object when region_id is passed
  if (variant?.calculated_price?.calculated_amount && variant.calculated_price.calculated_amount > 0) {
    return variant.calculated_price.calculated_amount;
  }
  
  // Fallback to prices array
  if (!variant?.prices || !Array.isArray(variant.prices)) {
    return null;
  }
  const price = variant.prices.find(p => p.currency_code?.toLowerCase() === currencyCode.toLowerCase());
  return price ? price.amount : null;
}
