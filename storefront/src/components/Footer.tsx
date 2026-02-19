"use client";

import React from "react";
import Link from "next/link";
import NextImage from "next/image";
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-[#1D1D1D] text-white pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
                    {/* Brand Info */}
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold tracking-tighter text-white">TATVA</h2>
                        <p className="text-sm text-zinc-400 leading-relaxed max-w-xs">
                            Handcrafted jewelry that tells your story. Elegant, timeless, and uniquely you. Join the Tatva Tribe today.
                        </p>
                        <div className="flex space-x-4">
                            <Link href="#" className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-primary transition-colors">
                                <Instagram className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-primary transition-colors">
                                <Facebook className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-primary transition-colors">
                                <Twitter className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-6">
                        <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-zinc-500">Shop</h3>
                        <ul className="space-y-4">
                            {["New Arrivals", "Best Sellers", "Bracelets", "Necklaces", "Earrings", "Rings"].map((link) => (
                                <li key={link}>
                                    <Link href="#" className="text-sm text-zinc-400 hover:text-white transition-colors">{link}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div className="space-y-6">
                        <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-zinc-500">Support</h3>
                        <ul className="space-y-4">
                            {["Track Order", "Returns & Exchanges", "Shipping Policy", "Privacy Policy", "Terms of Service", "FAQs"].map((link) => (
                                <li key={link}>
                                    <Link href="#" className="text-zinc-400 hover:text-white transition-colors text-sm">{link}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="space-y-6">
                        <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-zinc-500">Stay in Touch</h3>
                        <p className="text-sm text-zinc-400">Subscribe for early access and exclusive offers.</p>
                        <div className="flex flex-col space-y-3">
                            <input
                                type="email"
                                placeholder="email@example.com"
                                className="bg-zinc-800 border-none rounded-none px-4 py-3 text-sm focus:ring-1 focus:ring-primary outline-none"
                            />
                            <button className="bg-primary hover:bg-primary/90 text-white font-bold py-3 text-xs tracking-widest uppercase transition-colors">
                                Subscribe
                            </button>
                        </div>
                        <div className="pt-4 space-y-3">
                            <div className="flex items-center space-x-3 text-zinc-400 text-sm">
                                <Mail className="w-4 h-4 text-primary" />
                                <span>support@tatvajewelry.com</span>
                            </div>
                            <div className="flex items-center space-x-3 text-zinc-400 text-sm">
                                <Phone className="w-4 h-4 text-primary" />
                                <span>+91 98765 43210</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-zinc-800 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <p className="text-xs text-zinc-500">
                        © 2026 Tatva Jewelry. Built with ❤️ for the Tatva Tribe.
                    </p>
                    <div className="flex items-center space-x-6">
                        <NextImage src="/payment-icons.png" alt="Payments" width={200} height={30} className="opacity-50 grayscale brightness-200" />
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
