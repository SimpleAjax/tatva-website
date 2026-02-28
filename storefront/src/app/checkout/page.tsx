"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

// Component for cart item image with error handling
function CartItemImage({ thumbnail, title }: { thumbnail: string | null; title: string }) {
  const [error, setError] = useState(false);
  
  if (!thumbnail || error) {
    return (
      <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground bg-muted">
        No Image
      </div>
    );
  }
  
  return (
    <Image
      src={thumbnail}
      alt={title}
      fill
      className="object-cover"
      sizes="64px"
      onError={() => setError(true)}
    />
  );
}
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Truck,
  CreditCard,
  MapPin,
  Check,
  Package,
  ShieldCheck,
  Lock,
  AlertTriangle,
  AlertCircle,
  Smartphone,
  Banknote,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice, type Address, initializePayment, completeCart, getPaymentProviders } from "@/lib/medusa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  PAYMENT_FLAGS, 
  getEnabledPaymentMethods, 
  isPaymentMethodEnabled,
  isDemoMode,
  isSandboxMode,
  getPaymentButtonText,
  getPaymentModeBadge,
  getPaymentModeDescription,
  PaymentMethod,
} from "@/lib/payment-config";
import { PaymentMethodCard } from "@/components/payment/PaymentMethodCard";

type CheckoutStep = "shipping" | "delivery" | "payment";

interface ShippingFormData {
  email: string;
  first_name: string;
  last_name: string;
  address_1: string;
  address_2: string;
  city: string;
  province: string;
  postal_code: string;
  country_code: string;
  phone: string;
}

const INITIAL_SHIPPING_DATA: ShippingFormData = {
  email: "",
  first_name: "",
  last_name: "",
  address_1: "",
  address_2: "",
  city: "",
  province: "",
  postal_code: "",
  country_code: "IN",
  phone: "",
};

const COUNTRIES = [
  { code: "IN", name: "India" },
  { code: "US", name: "United States" },
  { code: "UK", name: "United Kingdom" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
];

// Initialize Razorpay payment
async function initializeRazorpayPayment(cartId: string, options: { testMode: boolean }) {
  // This would integrate with Razorpay SDK
  // For now, we'll simulate the flow
  console.log("Initializing Razorpay payment:", { cartId, testMode: options.testMode });
  
  // Initialize payment session with Razorpay provider
  const { cart } = await initializePayment(cartId, "razorpay");
  
  // In a real implementation, this would open the Razorpay checkout
  // and handle the payment authorization
  return cart;
}

// Initialize Stripe payment
async function initializeStripePayment(cartId: string, options: { testMode: boolean }) {
  console.log("Initializing Stripe payment:", { cartId, testMode: options.testMode });
  const { cart } = await initializePayment(cartId, "stripe");
  return cart;
}

// Initialize UPI payment
async function initializeUpiPayment(cartId: string, upiId: string) {
  console.log("Initializing UPI payment:", { cartId, upiId });
  // UPI payments would typically be handled through a provider like Razorpay
  // or through a direct UPI integration
  const { cart } = await initializePayment(cartId, "manual");
  return cart;
}

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cart,
    isLoading,
    setShippingAddress,
    setBillingAddress,
    setShippingMethod,
    setEmail,
    shippingOptions,
    refreshShippingOptions,
  } = useCart();

  const [currentStep, setCurrentStep] = useState<CheckoutStep>("shipping");
  const [shippingData, setShippingData] = useState<ShippingFormData>(INITIAL_SHIPPING_DATA);
  const [selectedShippingOption, setSelectedShippingOption] = useState<string>("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>(() => {
    // Auto-select first enabled method
    const enabled = getEnabledPaymentMethods();
    return enabled[0]?.id || "";
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ShippingFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [upiId, setUpiId] = useState("");
  const [orderError, setOrderError] = useState<string | null>(null);

  const enabledMethods = getEnabledPaymentMethods();
  const paymentBadge = getPaymentModeBadge();

  // Redirect to home if cart is empty
  useEffect(() => {
    if (cart && cart.items.length === 0) {
      router.push("/");
    }
  }, [cart, router]);

  // Pre-fill shipping data from cart if available
  useEffect(() => {
    if (cart?.shipping_address) {
      const addr = cart.shipping_address;
      setShippingData({
        email: cart.email || "",
        first_name: addr.first_name || "",
        last_name: addr.last_name || "",
        address_1: addr.address_1 || "",
        address_2: addr.address_2 || "",
        city: addr.city || "",
        province: addr.province || "",
        postal_code: addr.postal_code || "",
        country_code: addr.country_code || "IN",
        phone: addr.phone || "",
      });
    } else if (cart?.email) {
      setShippingData((prev) => ({ ...prev, email: cart.email || "" }));
    }
  }, [cart]);

  // Pre-select shipping option if cart has one
  useEffect(() => {
    if (cart?.shipping_methods?.[0]?.shipping_option_id) {
      setSelectedShippingOption(cart.shipping_methods[0].shipping_option_id);
    }
  }, [cart]);

  const validateShippingForm = (): boolean => {
    const newErrors: Partial<Record<keyof ShippingFormData, string>> = {};

    if (!shippingData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!shippingData.first_name.trim()) {
      newErrors.first_name = "First name is required";
    }
    if (!shippingData.last_name.trim()) {
      newErrors.last_name = "Last name is required";
    }
    if (!shippingData.address_1.trim()) {
      newErrors.address_1 = "Address is required";
    }
    if (!shippingData.city.trim()) {
      newErrors.city = "City is required";
    }
    if (!shippingData.postal_code.trim()) {
      newErrors.postal_code = "Postal code is required";
    }
    if (!shippingData.country_code) {
      newErrors.country_code = "Country is required";
    }
    if (!shippingData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleShippingSubmit = async () => {
    if (!validateShippingForm()) return;

    setIsSubmitting(true);
    setOrderError(null);
    try {
      // Update email
      await setEmail(shippingData.email);

      // Update shipping address
      const addressData: Partial<Address> = {
        first_name: shippingData.first_name,
        last_name: shippingData.last_name,
        address_1: shippingData.address_1,
        address_2: shippingData.address_2 || null,
        city: shippingData.city,
        province: shippingData.province || null,
        postal_code: shippingData.postal_code,
        country_code: shippingData.country_code,
        phone: shippingData.phone,
      };

      await setShippingAddress(addressData);

      // If billing same as shipping, update billing address too
      if (billingSameAsShipping) {
        await setBillingAddress(addressData);
      }

      // Refresh shipping options after address update
      await refreshShippingOptions();

      setCurrentStep("delivery");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Failed to save shipping details:", error);
      setOrderError("Failed to save shipping details. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeliverySubmit = async () => {
    if (!selectedShippingOption) return;

    setIsSubmitting(true);
    setOrderError(null);
    try {
      await setShippingMethod(selectedShippingOption);
      setCurrentStep("payment");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Failed to set shipping method:", error);
      setOrderError("Failed to set shipping method. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!cart?.id) return;
    
    setIsSubmitting(true);
    setOrderError(null);

    try {
      // Skip payment flow entirely if flag is set
      if (PAYMENT_FLAGS.SKIP_PAYMENT) {
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
            // In sandbox, we simulate success after provider initialization
            await new Promise(resolve => setTimeout(resolve, 1000));
            const { order: sandboxOrder } = await completeCart(cart.id);
            router.push(`/order/confirmed/${sandboxOrder.id}?mode=sandbox`);
            break;
          case "stripe":
            await initializeStripePayment(cart.id, { testMode: true });
            await new Promise(resolve => setTimeout(resolve, 1000));
            const { order: stripeOrder } = await completeCart(cart.id);
            router.push(`/order/confirmed/${stripeOrder.id}?mode=sandbox`);
            break;
          case "cod":
          case "upi":
            const { order: codOrder } = await completeCart(cart.id);
            router.push(`/order/confirmed/${codOrder.id}?mode=sandbox`);
            break;
          default:
            const { order: defaultOrder } = await completeCart(cart.id);
            router.push(`/order/confirmed/${defaultOrder.id}?mode=sandbox`);
        }
        return;
      }

      // Production mode - real payment processing
      switch (selectedPaymentMethod) {
        case "razorpay":
          await initializeRazorpayPayment(cart.id, { testMode: false });
          const { order: rzOrder } = await completeCart(cart.id);
          router.push(`/order/confirmed/${rzOrder.id}`);
          break;
        case "stripe":
          await initializeStripePayment(cart.id, { testMode: false });
          const { order: stOrder } = await completeCart(cart.id);
          router.push(`/order/confirmed/${stOrder.id}`);
          break;
        case "cod":
          const { order: codOrderProd } = await completeCart(cart.id);
          router.push(`/order/confirmed/${codOrderProd.id}`);
          break;
        case "upi":
          if (!upiId.trim()) {
            setOrderError("Please enter a valid UPI ID");
            setIsSubmitting(false);
            return;
          }
          await initializeUpiPayment(cart.id, upiId);
          const { order: upiOrder } = await completeCart(cart.id);
          router.push(`/order/confirmed/${upiOrder.id}`);
          break;
        default:
          const { order: defaultOrderProd } = await completeCart(cart.id);
          router.push(`/order/confirmed/${defaultOrderProd.id}`);
      }
    } catch (error) {
      console.error("Failed to place order:", error);
      setOrderError("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof ShippingFormData, value: string) => {
    setShippingData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const steps: { id: CheckoutStep; label: string; icon: React.ReactNode }[] = [
    { id: "shipping", label: "Shipping", icon: <MapPin className="w-4 h-4" /> },
    { id: "delivery", label: "Delivery", icon: <Truck className="w-4 h-4" /> },
    { id: "payment", label: "Payment", icon: <CreditCard className="w-4 h-4" /> },
  ];

  if (!cart) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Loading checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xl font-serif tracking-wider">
              TATVA
            </Link>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="rounded-none uppercase tracking-wider text-xs">
                <Lock className="w-3 h-3 mr-1" />
                Secure Checkout
              </Badge>
              {(isDemoMode() || isSandboxMode() || PAYMENT_FLAGS.SKIP_PAYMENT) && (
                <Badge 
                  variant={paymentBadge.variant === "warning" ? "outline" : "secondary"}
                  className={cn(
                    "rounded-none uppercase tracking-wider text-xs",
                    paymentBadge.variant === "warning" && "border-amber-500 text-amber-600"
                  )}
                >
                  {paymentBadge.text}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center max-w-2xl mx-auto">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <button
                  onClick={() => {
                    // Only allow navigating to previous steps or current step
                    const currentIndex = steps.findIndex((s) => s.id === currentStep);
                    if (index <= currentIndex) {
                      setCurrentStep(step.id);
                    }
                  }}
                  className={cn(
                    "flex items-center gap-2 transition-colors",
                    currentStep === step.id
                      ? "text-primary"
                      : index < steps.findIndex((s) => s.id === currentStep)
                      ? "text-foreground hover:text-primary"
                      : "text-muted-foreground cursor-default"
                  )}
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors",
                      currentStep === step.id
                        ? "border-primary bg-primary text-white"
                        : index < steps.findIndex((s) => s.id === currentStep)
                        ? "border-primary bg-primary text-white"
                        : "border-border bg-background text-muted-foreground"
                    )}
                  >
                    {index < steps.findIndex((s) => s.id === currentStep) ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      step.icon
                    )}
                  </div>
                  <span className="text-sm font-medium uppercase tracking-wider hidden sm:block">
                    {step.label}
                  </span>
                </button>
                {index < steps.length - 1 && (
                  <div className="flex-1 h-px bg-border mx-4" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Error Message */}
            {orderError && (
              <div className="bg-destructive/10 border border-destructive p-4 rounded-none">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-destructive" />
                  <span className="text-destructive font-medium">{orderError}</span>
                </div>
              </div>
            )}

            {/* Shipping Step */}
            {currentStep === "shipping" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-medium mb-1">Shipping Address</h2>
                  <p className="text-sm text-muted-foreground">
                    Enter your shipping details to continue
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Email */}
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-[0.15em] mb-2">
                      Email Address *
                    </label>
                    <Input
                      type="email"
                      value={shippingData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="your@email.com"
                      className={cn(
                        "rounded-none h-11",
                        errors.email && "border-destructive focus-visible:ring-destructive"
                      )}
                    />
                    {errors.email && (
                      <p className="text-xs text-destructive mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* First Name */}
                    <div>
                      <label className="block text-xs font-medium uppercase tracking-[0.15em] mb-2">
                        First Name *
                      </label>
                      <Input
                        value={shippingData.first_name}
                        onChange={(e) => handleInputChange("first_name", e.target.value)}
                        placeholder="John"
                        className={cn(
                          "rounded-none h-11",
                          errors.first_name && "border-destructive focus-visible:ring-destructive"
                        )}
                      />
                      {errors.first_name && (
                        <p className="text-xs text-destructive mt-1">{errors.first_name}</p>
                      )}
                    </div>

                    {/* Last Name */}
                    <div>
                      <label className="block text-xs font-medium uppercase tracking-[0.15em] mb-2">
                        Last Name *
                      </label>
                      <Input
                        value={shippingData.last_name}
                        onChange={(e) => handleInputChange("last_name", e.target.value)}
                        placeholder="Doe"
                        className={cn(
                          "rounded-none h-11",
                          errors.last_name && "border-destructive focus-visible:ring-destructive"
                        )}
                      />
                      {errors.last_name && (
                        <p className="text-xs text-destructive mt-1">{errors.last_name}</p>
                      )}
                    </div>
                  </div>

                  {/* Address Line 1 */}
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-[0.15em] mb-2">
                      Address Line 1 *
                    </label>
                    <Input
                      value={shippingData.address_1}
                      onChange={(e) => handleInputChange("address_1", e.target.value)}
                      placeholder="123 Main Street"
                      className={cn(
                        "rounded-none h-11",
                        errors.address_1 && "border-destructive focus-visible:ring-destructive"
                      )}
                    />
                    {errors.address_1 && (
                      <p className="text-xs text-destructive mt-1">{errors.address_1}</p>
                    )}
                  </div>

                  {/* Address Line 2 */}
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-[0.15em] mb-2">
                      Address Line 2 (Optional)
                    </label>
                    <Input
                      value={shippingData.address_2}
                      onChange={(e) => handleInputChange("address_2", e.target.value)}
                      placeholder="Apt 4B, Floor 2"
                      className="rounded-none h-11"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* City */}
                    <div>
                      <label className="block text-xs font-medium uppercase tracking-[0.15em] mb-2">
                        City *
                      </label>
                      <Input
                        value={shippingData.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        placeholder="Mumbai"
                        className={cn(
                          "rounded-none h-11",
                          errors.city && "border-destructive focus-visible:ring-destructive"
                        )}
                      />
                      {errors.city && (
                        <p className="text-xs text-destructive mt-1">{errors.city}</p>
                      )}
                    </div>

                    {/* Province/State */}
                    <div>
                      <label className="block text-xs font-medium uppercase tracking-[0.15em] mb-2">
                        State / Province
                      </label>
                      <Input
                        value={shippingData.province}
                        onChange={(e) => handleInputChange("province", e.target.value)}
                        placeholder="Maharashtra"
                        className="rounded-none h-11"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Postal Code */}
                    <div>
                      <label className="block text-xs font-medium uppercase tracking-[0.15em] mb-2">
                        Postal Code *
                      </label>
                      <Input
                        value={shippingData.postal_code}
                        onChange={(e) => handleInputChange("postal_code", e.target.value)}
                        placeholder="400001"
                        className={cn(
                          "rounded-none h-11",
                          errors.postal_code && "border-destructive focus-visible:ring-destructive"
                        )}
                      />
                      {errors.postal_code && (
                        <p className="text-xs text-destructive mt-1">{errors.postal_code}</p>
                      )}
                    </div>

                    {/* Country */}
                    <div>
                      <label className="block text-xs font-medium uppercase tracking-[0.15em] mb-2">
                        Country *
                      </label>
                      <select
                        value={shippingData.country_code}
                        onChange={(e) => handleInputChange("country_code", e.target.value)}
                        className={cn(
                          "w-full h-11 px-3 bg-transparent border border-input rounded-md text-sm transition-colors focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none",
                          "rounded-none",
                          errors.country_code && "border-destructive"
                        )}
                      >
                        {COUNTRIES.map((country) => (
                          <option key={country.code} value={country.code}>
                            {country.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-[0.15em] mb-2">
                      Phone Number *
                    </label>
                    <Input
                      type="tel"
                      value={shippingData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+91 98765 43210"
                      className={cn(
                        "rounded-none h-11",
                        errors.phone && "border-destructive focus-visible:ring-destructive"
                      )}
                    />
                    {errors.phone && (
                      <p className="text-xs text-destructive mt-1">{errors.phone}</p>
                    )}
                  </div>

                  {/* Billing Same as Shipping */}
                  <div className="flex items-center gap-3 pt-2">
                    <input
                      type="checkbox"
                      id="billing-same"
                      checked={billingSameAsShipping}
                      onChange={(e) => setBillingSameAsShipping(e.target.checked)}
                      className="w-4 h-4 border-border rounded accent-primary"
                    />
                    <label htmlFor="billing-same" className="text-sm text-muted-foreground">
                      Billing address same as shipping address
                    </label>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between pt-6">
                  <Link
                    href="/"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Return to Shopping
                  </Link>
                  <Button
                    onClick={handleShippingSubmit}
                    disabled={isSubmitting || isLoading}
                    className="bg-primary hover:bg-primary/90 text-white rounded-none px-8 py-6 text-sm tracking-[0.15em] uppercase font-bold h-auto"
                  >
                    {isSubmitting ? "Saving..." : "Continue to Delivery"}
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Delivery Step */}
            {currentStep === "delivery" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-medium mb-1">Delivery Method</h2>
                  <p className="text-sm text-muted-foreground">
                    Select your preferred shipping option
                  </p>
                </div>

                {/* Shipping Address Summary */}
                <div className="bg-muted p-4 rounded-none">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium">Shipping to:</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {shippingData.first_name} {shippingData.last_name}
                        <br />
                        {shippingData.address_1}
                        {shippingData.address_2 && <>, {shippingData.address_2}</>}
                        <br />
                        {shippingData.city}, {shippingData.province} {shippingData.postal_code}
                        <br />
                        {COUNTRIES.find((c) => c.code === shippingData.country_code)?.name}
                      </p>
                    </div>
                    <button
                      onClick={() => setCurrentStep("shipping")}
                      className="text-xs text-primary hover:underline"
                    >
                      Change
                    </button>
                  </div>
                </div>

                {/* Shipping Options */}
                <div className="space-y-3">
                  {shippingOptions.length === 0 ? (
                    <div className="text-center py-8 bg-muted">
                      <Truck className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        No shipping options available for this address.
                      </p>
                    </div>
                  ) : (
                    shippingOptions.map((option) => (
                      <label
                        key={option.id}
                        className={cn(
                          "flex items-center gap-4 p-4 border cursor-pointer transition-colors",
                          selectedShippingOption === option.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-muted-foreground/50"
                        )}
                      >
                        <input
                          type="radio"
                          name="shipping"
                          value={option.id}
                          checked={selectedShippingOption === option.id}
                          onChange={() => setSelectedShippingOption(option.id)}
                          className="w-4 h-4 accent-primary"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{option.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {option.price_type === "flat_rate"
                              ? "Standard delivery"
                              : "Calculated at checkout"}
                          </p>
                        </div>
                        <p className="font-semibold text-primary">
                          {option.amount ? formatPrice(option.amount) : "Free"}
                        </p>
                      </label>
                    ))
                  )}
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between pt-6">
                  <button
                    onClick={() => setCurrentStep("shipping")}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back to Shipping
                  </button>
                  <Button
                    onClick={handleDeliverySubmit}
                    disabled={isSubmitting || isLoading || !selectedShippingOption}
                    className="bg-primary hover:bg-primary/90 text-white rounded-none px-8 py-6 text-sm tracking-[0.15em] uppercase font-bold h-auto"
                  >
                    {isSubmitting ? "Saving..." : "Continue to Payment"}
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Payment Step */}
            {currentStep === "payment" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-medium mb-1">Payment</h2>
                  <p className="text-sm text-muted-foreground">
                    {getPaymentModeDescription()}
                  </p>
                </div>

                {/* Mode Indicator */}
                {(isDemoMode() || isSandboxMode() || PAYMENT_FLAGS.SKIP_PAYMENT) && (
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-none">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                      <span className="font-medium text-amber-800">
                        {PAYMENT_FLAGS.SKIP_PAYMENT 
                          ? "Payment Step Skipped" 
                          : isDemoMode() 
                            ? "Demo Mode Active" 
                            : "Sandbox/Test Mode Active"}
                      </span>
                    </div>
                    <p className="text-sm text-amber-700 mt-1">
                      {PAYMENT_FLAGS.SKIP_PAYMENT
                        ? "Payment will be skipped and order will be placed immediately."
                        : isDemoMode() 
                          ? "Payments will be simulated. No actual charges will occur." 
                          : "Use test credentials shown below. No real money will be charged."}
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

                {/* UPI Form (shown only when UPI is selected) */}
                {selectedPaymentMethod === "upi" && isPaymentMethodEnabled("upi") && (
                  <div className="border border-border p-4 space-y-4">
                    <div>
                      <label className="block text-xs font-medium uppercase tracking-[0.15em] mb-2">
                        UPI ID
                      </label>
                      <Input
                        placeholder="yourname@upi"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="rounded-none h-11"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Enter your UPI ID (e.g., yourname@okaxis, yourname@paytm)
                      </p>
                    </div>
                  </div>
                )}

                {/* Card Form (shown only when card is selected in demo/production without redirect) */}
                {selectedPaymentMethod === "card" && isPaymentMethodEnabled("card") && (
                  <div className="border border-border p-4 space-y-4">
                    <div>
                      <label className="block text-xs font-medium uppercase tracking-[0.15em] mb-2">
                        Card Number
                      </label>
                      <Input
                        placeholder="1234 5678 9012 3456"
                        className="rounded-none h-11"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium uppercase tracking-[0.15em] mb-2">
                          Expiry Date
                        </label>
                        <Input placeholder="MM / YY" className="rounded-none h-11" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium uppercase tracking-[0.15em] mb-2">
                          CVV
                        </label>
                        <Input placeholder="123" className="rounded-none h-11" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium uppercase tracking-[0.15em] mb-2">
                        Name on Card
                      </label>
                      <Input placeholder="JOHN DOE" className="rounded-none h-11" />
                    </div>
                  </div>
                )}

                {/* Security Notice */}
                {!isDemoMode() && !isSandboxMode() && !PAYMENT_FLAGS.SKIP_PAYMENT && (
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <ShieldCheck className="w-5 h-5 text-primary" />
                    <span>Your payment information is secure and encrypted</span>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between pt-6">
                  <button
                    onClick={() => setCurrentStep("delivery")}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back to Delivery
                  </button>
                  <Button
                    onClick={handlePlaceOrder}
                    disabled={!selectedPaymentMethod || enabledMethods.length === 0 || isSubmitting}
                    className="bg-primary hover:bg-primary/90 text-white rounded-none px-8 py-6 text-sm tracking-[0.15em] uppercase font-bold h-auto"
                  >
                    {isSubmitting ? "Processing..." : getPaymentButtonText()}
                    <Lock className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-muted p-6 sticky top-6">
              <h3 className="text-sm font-medium uppercase tracking-[0.15em] mb-4">
                Order Summary
              </h3>

              {/* Cart Items */}
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative w-16 h-16 bg-background flex-shrink-0 overflow-hidden">
                      <CartItemImage thumbnail={item.thumbnail} title={item.title} />
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs flex items-center justify-center">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-1">{item.title}</p>
                      {item.variant?.title && item.variant.title !== "Default variant" && (
                        <p className="text-xs text-muted-foreground">
                          {item.variant.title}
                        </p>
                      )}
                      <p className="text-sm font-semibold mt-1">
                        {formatPrice(item.subtotal)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              {/* Cost Breakdown */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{formatPrice(cart.subtotal)}</span>
                </div>
                {cart.discount_total > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatPrice(cart.discount_total)}</span>
                  </div>
                )}
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>
                    {cart.shipping_total > 0
                      ? formatPrice(cart.shipping_total)
                      : "Calculated at next step"}
                  </span>
                </div>
                {cart.tax_total > 0 && (
                  <div className="flex justify-between text-muted-foreground">
                    <span>Tax</span>
                    <span>{formatPrice(cart.tax_total)}</span>
                  </div>
                )}
              </div>

              <Separator className="my-4" />

              {/* Total */}
              <div className="flex justify-between items-center">
                <span className="text-base font-medium">Total</span>
                <span className="text-xl font-semibold text-primary">
                  {formatPrice(cart.total)}
                </span>
              </div>

              {/* Free Shipping Progress */}
              {cart.subtotal < 500000 && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Truck className="w-4 h-4" />
                    <span>
                      Add {formatPrice(500000 - cart.subtotal)} more for free shipping
                    </span>
                  </div>
                  <div className="mt-2 h-1 bg-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${Math.min((cart.subtotal / 500000) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}
              {cart.subtotal >= 500000 && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center justify-center gap-2 text-xs text-primary">
                    <Truck className="w-4 h-4" />
                    <span className="font-medium">You qualify for free shipping!</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
