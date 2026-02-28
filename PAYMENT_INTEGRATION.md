# Payment Integration Guide

This document provides detailed information about the payment integration implemented in Phase 4 of the TATVA website.

## Overview

The payment system supports multiple payment methods with configurable feature flags, allowing you to:
- Enable/disable payment methods via environment variables
- Switch between demo, sandbox, and production modes
- Test checkout flows without real payments
- Support multiple payment providers (Razorpay, Stripe, COD, UPI)

## Payment Modes

### 1. Demo Mode (Default for Development)
- **Purpose**: Test the complete checkout flow without any payment processing
- **Behavior**: Automatically completes orders with simulated payment
- **Use Case**: Development, UI testing, demo presentations

```env
NEXT_PUBLIC_PAYMENT_MODE=demo
NEXT_PUBLIC_DEMO_AUTO_SUCCESS=true
```

### 2. Sandbox Mode
- **Purpose**: Test with real payment provider APIs using test credentials
- **Behavior**: Uses test keys, displays test card/UPI credentials
- **Use Case**: Integration testing with payment providers

```env
NEXT_PUBLIC_PAYMENT_MODE=sandbox
NEXT_PUBLIC_ENABLE_RAZORPAY=true
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxx
```

### 3. Production Mode
- **Purpose**: Real payment processing
- **Behavior**: Uses live credentials, actual charges
- **Use Case**: Live store

```env
NEXT_PUBLIC_PAYMENT_MODE=production
NEXT_PUBLIC_ENABLE_RAZORPAY=true
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxx
```

## Payment Methods

### Cash on Delivery (COD)
- Always available (unless explicitly disabled)
- No payment processing required
- Order completes immediately

### UPI
- Manual UPI ID entry form
- In sandbox/demo mode, accepts any valid format
- In production, would integrate with payment provider

### Razorpay
- Supports cards, UPI, netbanking via Razorpay checkout
- Requires Razorpay account and API keys
- Test card: `5267 3181 8797 5449`

### Stripe
- Secure card payments
- Requires Stripe account and API keys
- Test card: `4242 4242 4242 4242`

## Configuration

### Frontend Environment Variables

```env
# Payment Mode
NEXT_PUBLIC_PAYMENT_MODE=demo              # demo | sandbox | production

# Enable Payment Methods
NEXT_PUBLIC_ENABLE_COD=true                # Cash on Delivery
NEXT_PUBLIC_ENABLE_RAZORPAY=false          # Razorpay
NEXT_PUBLIC_ENABLE_STRIPE=false            # Stripe
NEXT_PUBLIC_ENABLE_UPI=true                # UPI

# Demo Settings
NEXT_PUBLIC_DEMO_AUTO_SUCCESS=true         # Auto-complete orders in demo

# Testing
NEXT_PUBLIC_SKIP_PAYMENT=false             # Skip payment step entirely

# Provider Keys (for sandbox/production)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
```

### Backend Environment Variables

```env
# Enable Payment Providers
ENABLE_RAZORPAY=false
ENABLE_STRIPE=false

# Razorpay Credentials
RAZORPAY_KEY_ID=rzp_test_xxx
RAZORPAY_KEY_SECRET=xxx
RAZORPAY_WEBHOOK_SECRET=xxx

# Stripe Credentials
STRIPE_API_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxx
```

## Setup Instructions

### For Development (Demo Mode)

1. Set payment mode to demo:
```env
NEXT_PUBLIC_PAYMENT_MODE=demo
NEXT_PUBLIC_ENABLE_COD=true
```

2. Orders will complete without any payment processing

### For Testing with Razorpay Sandbox

1. Create a Razorpay account at https://razorpay.com/
2. Get test keys from the dashboard
3. Update environment variables:

**Backend `.env`:**
```env
ENABLE_RAZORPAY=true
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=your_test_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
```

**Frontend `.env.local`:**
```env
NEXT_PUBLIC_PAYMENT_MODE=sandbox
NEXT_PUBLIC_ENABLE_RAZORPAY=true
NEXT_PUBLIC_ENABLE_COD=true
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxx
```

4. Install Razorpay provider (if not already installed):
```bash
cd backend
yarn add @medusajs/payment-razorpay
```

5. Restart both backend and frontend

### For Production

1. Get live credentials from your payment providers
2. Update environment variables with live keys
3. Set payment mode to production:
```env
NEXT_PUBLIC_PAYMENT_MODE=production
```
4. Disable demo/testing flags:
```env
NEXT_PUBLIC_DEMO_AUTO_SUCCESS=false
NEXT_PUBLIC_SKIP_PAYMENT=false
```

## File Structure

```
storefront/
├── src/
│   ├── lib/
│   │   ├── payment-config.ts          # Payment flags & configuration
│   │   └── medusa.ts                  # Payment API functions
│   ├── components/
│   │   └── payment/
│   │       ├── PaymentMethodCard.tsx  # Payment method UI component
│   │       └── index.ts               # Component exports
│   └── app/
│       ├── checkout/
│       │   └── page.tsx               # Checkout with payment flow
│       └── order/
│           └── confirmed/
│               └── [orderId]/
│                   └── page.tsx       # Order confirmation page

backend/
├── medusa-config.ts                   # Payment provider configuration
└── .env.template                      # Environment template
```

## API Functions

### Payment Session Management

```typescript
// Initialize payment session
initializePayment(cartId: string, providerId: string)

// Update payment session
updatePaymentSession(cartId: string, providerId: string)

// Authorize payment
authorizePaymentSession(cartId: string, providerId: string, data: object)

// Complete cart and create order
completeCart(cartId: string)

// Get available payment providers
getPaymentProviders(regionId?: string)

// Get order details
getOrder(orderId: string)
```

## Testing Checklist

### Demo Mode
- [ ] Place order succeeds without payment
- [ ] Order confirmation shows demo badge
- [ ] All enabled payment methods are displayed

### Sandbox Mode
- [ ] Test credentials are displayed
- [ ] Payment method selection works
- [ ] Order completes successfully
- [ ] Order confirmation shows test badge

### COD Only
- [ ] Only COD option shown
- [ ] Order places successfully
- [ ] Correct payment status in order

### Production Mode
- [ ] No test badges shown
- [ ] Real payment flow works
- [ ] Webhooks handle payment events

## Troubleshooting

### Order not completing
- Check browser console for errors
- Verify cart has shipping address
- Verify shipping method is selected

### Payment provider not showing
- Check environment flags are set correctly
- Verify backend has provider enabled
- Check for console errors

### "No payment methods available"
- Ensure at least one payment method is enabled
- Check payment mode configuration
- Verify getEnabledPaymentMethods() returns methods

## Security Considerations

1. **Never commit real API keys** to version control
2. **Use environment variables** for all sensitive configuration
3. **Webhook secrets** should be kept secure
4. **Validate payment amounts** on the backend
5. **Use HTTPS** in production for all payment flows

## Future Enhancements

- [ ] Razorpay SDK integration for hosted checkout
- [ ] Stripe Elements integration
- [ ] Saved payment methods for logged-in customers
- [ ] Payment retry flow for failed payments
- [ ] Refund functionality
- [ ] Payment analytics dashboard
