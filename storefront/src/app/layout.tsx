import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";

// Primary font for body text - clean and highly readable
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Elegant serif font for headings - timeless and sophisticated
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0A0A" },
  ],
};

export const metadata: Metadata = {
  title: {
    default: "TATVA | Handcrafted Jewelry That Tells Your Story",
    template: "%s | TATVA",
  },
  description:
    "Discover exquisite handcrafted jewelry at TATVA. Shop our collection of bracelets, necklaces, earrings, and rings designed for the modern woman. Free shipping on orders above ₹999.",
  keywords: [
    "jewelry",
    "handcrafted jewelry",
    "bracelets",
    "necklaces",
    "earrings",
    "rings",
    "indian jewelry",
    "artisan jewelry",
    "tatva",
    "fine jewelry",
  ],
  authors: [{ name: "TATVA" }],
  creator: "TATVA",
  publisher: "TATVA",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://tatvajewelry.com",
    siteName: "TATVA",
    title: "TATVA | Handcrafted Jewelry That Tells Your Story",
    description:
      "Discover exquisite handcrafted jewelry at TATVA. Shop our collection of bracelets, necklaces, earrings, and rings.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "TATVA Jewelry Collection",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TATVA | Handcrafted Jewelry That Tells Your Story",
    description:
      "Discover exquisite handcrafted jewelry at TATVA. Shop our collection of bracelets, necklaces, earrings, and rings.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://tatvajewelry.com",
  },
  category: "jewelry",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased`}
      >
        <CartProvider>
          <div className="flex min-h-screen flex-col">
            {children}
            <CartDrawer />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
