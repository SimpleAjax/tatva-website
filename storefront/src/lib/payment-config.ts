// ============================================
// Payment Feature Flags & Configuration
// ============================================

/**
 * Payment feature flags - configure via environment variables
 * These flags allow flexible control over payment methods without code changes
 */
export const PAYMENT_FLAGS = {
  // Enable/disable specific payment methods
  ENABLE_COD: process.env.NEXT_PUBLIC_ENABLE_COD === "true" || true,
  ENABLE_RAZORPAY: process.env.NEXT_PUBLIC_ENABLE_RAZORPAY === "true" || false,
  ENABLE_STRIPE: process.env.NEXT_PUBLIC_ENABLE_STRIPE === "true" || false,
  ENABLE_UPI: process.env.NEXT_PUBLIC_ENABLE_UPI === "true" || true,
  
  // Payment flow modes: "demo" | "sandbox" | "production"
  // demo: Simulates payments without any processing
  // sandbox: Uses test credentials with payment providers
  // production: Real payment processing
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

// Get payment mode badge text
export function getPaymentModeBadge(): { text: string; variant: "default" | "secondary" | "destructive" | "outline" | "warning" } {
  if (PAYMENT_FLAGS.SKIP_PAYMENT) {
    return { text: "Payment Skipped", variant: "warning" };
  }
  if (isDemoMode()) {
    return { text: "Demo Mode", variant: "secondary" };
  }
  if (isSandboxMode()) {
    return { text: "Test Mode", variant: "warning" };
  }
  return { text: "Secure", variant: "default" };
}

// Get payment mode description
export function getPaymentModeDescription(): string {
  if (PAYMENT_FLAGS.SKIP_PAYMENT) {
    return "Payment step is skipped. Order will be placed immediately.";
  }
  if (isDemoMode()) {
    return "Demo Mode: Payments will be simulated. No actual charges will occur.";
  }
  if (isSandboxMode()) {
    return "Test Mode: Use test credentials. No real money will be charged.";
  }
  return "Your payment information is secure and encrypted.";
}
