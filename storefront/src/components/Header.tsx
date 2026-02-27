"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, User, Heart, ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/medusa";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "NEW ARRIVALS", href: "/category/new-arrivals" },
  { label: "SHOP BY LOOK", href: "/category/shop-by-look" },
  { label: "BRACELETS", href: "/category/bracelets" },
  { label: "NECKLACES", href: "/category/necklaces" },
  { label: "EARRINGS", href: "/category/earrings" },
  { label: "RINGS", href: "/category/rings" },
  { label: "BEST SELLERS", href: "/category/best-sellers" },
];

const Header = () => {
  const { toggleCart, itemCount, cart } = useCart();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const cartTotal = cart?.total || 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-border">
      {/* Top Header */}
      <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
        {/* Mobile Menu */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <button className="lg:hidden text-foreground p-2 -ml-2">
              <Menu className="w-6 h-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0">
            <SheetHeader className="p-6 border-b">
              <SheetTitle className="text-2xl font-bold tracking-tighter text-primary">
                TATVA
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col py-4">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-6 py-3 text-[11px] font-semibold tracking-[0.2em] text-foreground hover:bg-muted transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="absolute bottom-0 left-0 right-0 p-6 border-t space-y-3">
              <Link href="/account" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full rounded-none">
                  <User className="w-4 h-4 mr-2" />
                  My Account
                </Button>
              </Link>
            </div>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tighter text-primary">
            TATVA
          </h1>
        </Link>

        {/* Search Bar - Desktop */}
        <div className="hidden lg:flex flex-grow max-w-md items-center relative">
          <form onSubmit={handleSearch} className="w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for jewelry..."
              className="w-full pl-4 pr-10 py-2 bg-muted border border-border rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
              <Search className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
            </button>
          </form>
        </div>

        {/* Icons */}
        <div className="flex items-center space-x-2 lg:space-x-4">
          {/* Mobile Search Toggle */}
          <button 
            className="lg:hidden text-foreground hover:text-primary transition-colors p-2"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Account */}
          <Link 
            href="/account" 
            className="hidden sm:flex text-foreground hover:text-primary transition-colors p-2"
          >
            <User className="w-5 h-5 lg:w-6 lg:h-6" />
          </Link>

          {/* Wishlist */}
          <Link 
            href="/wishlist" 
            className="text-foreground hover:text-primary transition-colors p-2 relative"
          >
            <Heart className="w-5 h-5 lg:w-6 lg:h-6" />
            <span className="absolute top-0 right-0 bg-primary text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
              0
            </span>
          </Link>

          {/* Cart */}
          <button 
            onClick={toggleCart}
            className="text-foreground hover:text-primary transition-colors p-2 relative"
          >
            <ShoppingBag className="w-5 h-5 lg:w-6 lg:h-6" />
            {itemCount > 0 && (
              <span className="absolute top-0 right-0 bg-primary text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full animate-in zoom-in duration-200">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div 
        className={cn(
          "lg:hidden overflow-hidden transition-all duration-300",
          isSearchOpen ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="container mx-auto px-4 pb-4">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for jewelry..."
              className="w-full pl-4 pr-10 py-2 bg-muted border border-border rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              autoFocus={isSearchOpen}
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
              <Search className="w-4 h-4 text-muted-foreground" />
            </button>
          </form>
        </div>
      </div>

      {/* Navigation Links - Desktop */}
      <nav className="hidden lg:flex items-center justify-center space-x-8 py-3 border-t border-border bg-white">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-[11px] font-semibold tracking-[0.2em] text-foreground hover:text-primary transition-colors relative group"
          >
            {item.label}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
          </Link>
        ))}
      </nav>
    </header>
  );
};

export default Header;
