import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

// CORS Configuration - Allow all for development
const isDev = process.env.NODE_ENV !== 'production';

const STORE_CORS = isDev 
  ? "http://localhost:3002,http://localhost:8000,http://127.0.0.1:3002" 
  : (process.env.STORE_CORS || "http://localhost:3002");
  
const ADMIN_CORS = process.env.ADMIN_CORS || 
  "http://localhost:5173,http://localhost:9111";
  
const AUTH_CORS = process.env.AUTH_CORS || 
  "http://localhost:5173,http://localhost:9111,http://localhost:8000,http://localhost:3002";

// Build payment providers array based on environment flags
const paymentProviders: any[] = [];

// Add Razorpay if enabled
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

// Add Stripe if enabled
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

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: STORE_CORS,
      adminCors: ADMIN_CORS,
      authCors: AUTH_CORS,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    }
  },
  // Only add payment module config if providers are enabled
  ...(paymentProviders.length > 0 && {
    modules: {
      payment: {
        options: {
          providers: paymentProviders,
        },
      },
    },
  }),
})
