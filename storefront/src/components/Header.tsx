"use client";

import React from "react";
import Link from "next/link";
import { Search, User, Heart, ShoppingBag, Menu } from "lucide-react";

const Header = () => {
    return (
        <header className="sticky top-0 z-50 w-full bg-white border-b border-border">
            {/* Top Header */}
            <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
                {/* Mobile Menu */}
                <button className="lg:hidden text-foreground">
                    <Menu className="w-6 h-6" />
                </button>

                {/* Logo */}
                <Link href="/" className="flex-shrink-0">
                    <h1 className="text-2xl lg:text-3xl font-bold tracking-tighter text-primary">
                        TATVA
                    </h1>
                </Link>

                {/* Search Bar - Desktop */}
                <div className="hidden lg:flex flex-grow max-w-md items-center relative">
                    <input
                        type="text"
                        placeholder="Search for jewelry..."
                        className="w-full pl-4 pr-10 py-2 bg-muted border border-border rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <Search className="absolute right-3 w-4 h-4 text-muted-foreground" />
                </div>

                {/* Icons */}
                <div className="flex items-center space-x-4 lg:space-x-6">
                    <button className="text-foreground hover:text-primary transition-colors">
                        <User className="w-5 h-5 lg:w-6 h-6" />
                    </button>
                    <button className="text-foreground hover:text-primary transition-colors relative">
                        <Heart className="w-5 h-5 lg:w-6 h-6" />
                        <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">0</span>
                    </button>
                    <button className="text-foreground hover:text-primary transition-colors relative">
                        <ShoppingBag className="w-5 h-5 lg:w-6 h-6" />
                        <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">0</span>
                    </button>
                </div>
            </div>

            {/* Navigation Links - Desktop */}
            <nav className="hidden lg:flex items-center justify-center space-x-8 py-3 border-t border-border bg-white">
                {["NEW ARRIVALS", "SHOP BY LOOK", "BRACELETS", "NECKLACES", "EARRINGS", "RINGS", "BEST SELLERS"].map((item) => (
                    <Link
                        key={item}
                        href={`/category/${item.toLowerCase().replace(/\s+/g, '-')}`}
                        className="text-[11px] font-semibold tracking-[0.2em] text-foreground hover:text-primary transition-colors"
                    >
                        {item}
                    </Link>
                ))}
            </nav>
        </header>
    );
};

export default Header;
