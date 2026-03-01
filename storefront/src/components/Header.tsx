"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, User, Heart, ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
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
  { label: "New Arrivals", href: "/category/new-arrivals" },
  { label: "Shop by Look", href: "/category/shop-by-look" },
  { label: "Bracelets", href: "/category/bracelets" },
  { label: "Necklaces", href: "/category/necklaces" },
  { label: "Earrings", href: "/category/earrings" },
  { label: "Rings", href: "/category/rings" },
  { label: "Best Sellers", href: "/category/best-sellers" },
];

const Header = () => {
  const { toggleCart, itemCount } = useCart();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 w-full bg-white transition-all duration-300",
        isScrolled ? "shadow-md" : "border-b border-border"
      )}
    >
      {/* Top Header */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Mobile Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <button 
                className="lg:hidden text-foreground p-2 -ml-2 hover:bg-muted rounded-md transition-colors"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0">
              <SheetHeader className="p-6 border-b border-border">
                <SheetTitle className="text-2xl font-serif italic text-primary tracking-tight">
                  TATVA
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col py-4">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-6 py-3.5 text-sm font-medium tracking-wide text-foreground hover:bg-muted hover:text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-border space-y-3">
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
          <Link 
            href="/" 
            className="flex-shrink-0 group"
          >
            <h1 className="text-2xl lg:text-3xl font-serif italic text-primary tracking-tight group-hover:opacity-80 transition-opacity">
              TATVA
            </h1>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="w-full relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for jewelry..."
                className="w-full pl-4 pr-12 py-2.5 bg-muted border border-transparent rounded-full text-sm 
                         focus:outline-none focus:border-primary/50 focus:bg-white transition-all
                         placeholder:text-muted-foreground"
              />
              <button 
                type="submit" 
                className="absolute right-1 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-primary transition-colors"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Mobile Search Toggle */}
            <button 
              className="lg:hidden text-foreground hover:text-primary transition-colors p-2 hover:bg-muted rounded-md"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              aria-label="Toggle search"
            >
              {isSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
            </button>

            {/* Account */}
            <Link 
              href="/account" 
              className="hidden sm:flex text-foreground hover:text-primary transition-colors p-2 hover:bg-muted rounded-md"
              aria-label="My account"
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Wishlist */}
            <Link 
              href="/wishlist" 
              className="text-foreground hover:text-primary transition-colors p-2 hover:bg-muted rounded-md relative"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              <span className="absolute top-0.5 right-0.5 bg-primary text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-medium">
                0
              </span>
            </Link>

            {/* Cart */}
            <button 
              onClick={toggleCart}
              className="text-foreground hover:text-primary transition-colors p-2 hover:bg-muted rounded-md relative"
              aria-label="Shopping cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-primary text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-medium animate-in zoom-in duration-200">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div 
        className={cn(
          "lg:hidden overflow-hidden transition-all duration-300 ease-in-out",
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
              className="w-full pl-4 pr-10 py-2.5 bg-muted border border-border rounded-full text-sm 
                       focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
              autoFocus={isSearchOpen}
            />
            <button 
              type="submit" 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Navigation Links - Desktop */}
      <nav className="hidden lg:block border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-8 py-3">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-foreground-muted hover:text-primary transition-colors relative group py-1"
              >
                {item.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-primary transition-all duration-300 ease-out group-hover:w-full" />
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
