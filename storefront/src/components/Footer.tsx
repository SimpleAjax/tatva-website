"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin,
  ArrowRight,
  Heart
} from "lucide-react";
import { cn } from "@/lib/utils";

const shopLinks = [
  { name: "New Arrivals", href: "/category/new-arrivals" },
  { name: "Best Sellers", href: "/category/best-sellers" },
  { name: "Bracelets", href: "/category/bracelets" },
  { name: "Necklaces", href: "/category/necklaces" },
  { name: "Earrings", href: "/category/earrings" },
  { name: "Rings", href: "/category/rings" },
];

const supportLinks = [
  { name: "Track Order", href: "/account/orders" },
  { name: "Returns & Exchanges", href: "/returns" },
  { name: "Shipping Policy", href: "/shipping" },
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms of Service", href: "/terms" },
  { name: "FAQs", href: "/faqs" },
];

const socialLinks = [
  { name: "Instagram", icon: Instagram, href: "#" },
  { name: "Facebook", icon: Facebook, href: "#" },
  { name: "Twitter", icon: Twitter, href: "#" },
  { name: "Youtube", icon: Youtube, href: "#" },
];

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-[#1A1A1A] text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="inline-block">
              <h2 className="text-3xl font-serif italic text-white tracking-tight">
                TATVA
              </h2>
            </Link>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-sm">
              Handcrafted jewelry that tells your story. Elegant, timeless, and uniquely you. 
              Each piece is crafted with love and attention to detail.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:bg-primary hover:text-white transition-all duration-300"
                  aria-label={social.name}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-zinc-500 mb-6">
              Shop
            </h3>
            <ul className="space-y-4">
              {shopLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-sm text-zinc-400 hover:text-white transition-colors inline-flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-primary mr-0 group-hover:mr-2 transition-all duration-300" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-zinc-500 mb-6">
              Support
            </h3>
            <ul className="space-y-4">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-sm text-zinc-400 hover:text-white transition-colors inline-flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-primary mr-0 group-hover:mr-2 transition-all duration-300" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter & Contact */}
          <div className="lg:col-span-4">
            <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-zinc-500 mb-6">
              Stay in Touch
            </h3>
            <p className="text-sm text-zinc-400 mb-6">
              Subscribe for exclusive offers, new arrivals, and insider-only discounts.
            </p>
            
            {/* Newsletter Form */}
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 mb-8">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 bg-zinc-800 border border-zinc-700 px-4 py-3 text-sm text-white placeholder:text-zinc-500
                         focus:outline-none focus:border-primary transition-colors"
                required
              />
              <button 
                type="submit"
                className={cn(
                  "px-6 py-3 text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2",
                  isSubscribed 
                    ? "bg-green-600 text-white" 
                    : "bg-primary text-white hover:bg-primary-dark"
                )}
                disabled={isSubscribed}
              >
                {isSubscribed ? (
                  <>Subscribed</>
                ) : (
                  <>
                    Subscribe
                    <ArrowRight className="w-3 h-3" />
                  </>
                )}
              </button>
            </form>

            {/* Contact Info */}
            <div className="space-y-4 pt-4 border-t border-zinc-800">
              <a 
                href="mailto:support@tatvajewelry.com"
                className="flex items-center gap-3 text-zinc-400 hover:text-white transition-colors group"
              >
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center group-hover:bg-primary transition-colors">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <span className="text-sm">support@tatvajewelry.com</span>
              </a>
              <a 
                href="tel:+919876543210"
                className="flex items-center gap-3 text-zinc-400 hover:text-white transition-colors group"
              >
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center group-hover:bg-primary transition-colors">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <span className="text-sm">+91 98765 43210</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-zinc-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-zinc-500 flex items-center gap-1">
              © {new Date().getFullYear()} Tatva Jewelry. Made with 
              <Heart className="w-3 h-3 text-primary fill-primary" /> 
              for the Tatva Tribe.
            </p>
            
            {/* Payment Icons Placeholder */}
            <div className="flex items-center gap-4">
              <span className="text-xs text-zinc-600">We accept:</span>
              <div className="flex items-center gap-2">
                {["Visa", "Mastercard", "UPI", "COD"].map((method) => (
                  <div 
                    key={method}
                    className="px-2 py-1 bg-zinc-800 rounded text-[10px] text-zinc-400 font-medium"
                  >
                    {method}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
