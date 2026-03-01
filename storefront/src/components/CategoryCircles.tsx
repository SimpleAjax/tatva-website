"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Category {
  name: string;
  icon: string;
  handle: string;
  color?: string;
}

const categories: Category[] = [
  { name: "New In", icon: "✨", handle: "new-arrivals" },
  { name: "Gift Store", icon: "🎁", handle: "gifts" },
  { name: "Personalized", icon: "💎", handle: "personalized" },
  { name: "Bracelets", icon: "💫", handle: "bracelets" },
  { name: "Necklaces", icon: "📿", handle: "necklaces" },
  { name: "Earrings", icon: "✨", handle: "earrings" },
  { name: "Rings", icon: "💍", handle: "rings" },
  { name: "Bestsellers", icon: "🔥", handle: "best-sellers" },
  { name: "Combos", icon: "🛍️", handle: "combos" },
];

const CategoryCircles = () => {
  return (
    <section className="w-full py-8 lg:py-12 bg-background-warm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8">
          <span className="text-primary text-[11px] font-semibold tracking-[0.2em] uppercase">
            Explore
          </span>
          <h2 className="text-2xl md:text-3xl font-serif italic text-primary mt-2">
            Shop by Category
          </h2>
        </div>
        
        {/* Categories Scroll Container - Centered on Desktop */}
        <div className="relative">
          {/* Scrollable Container */}
          <div 
            className="flex overflow-x-auto gap-6 lg:gap-10 pb-4 pt-2 no-scrollbar snap-x snap-mandatory justify-start lg:justify-center"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categories.map((cat, index) => (
              <Link
                key={cat.name}
                href={`/category/${cat.handle}`}
                className={cn(
                  "flex flex-col items-center group snap-start flex-shrink-0",
                  "transition-all duration-300"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Circle Container */}
                <div className={cn(
                  "relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full",
                  "bg-white border border-border shadow-sm",
                  "flex items-center justify-center text-2xl sm:text-3xl",
                  "overflow-hidden transition-all duration-300 ease-out",
                  "group-hover:border-primary group-hover:shadow-md group-hover:scale-105",
                  "group-active:scale-95"
                )}>
                  {/* Gradient Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Subtle Ring Animation */}
                  <div className="absolute inset-0 rounded-full border-2 border-primary/0 group-hover:border-primary/20 scale-110 group-hover:scale-100 transition-all duration-300" />
                  
                  {/* Icon */}
                  <span className="relative z-10 transform group-hover:scale-110 transition-transform duration-300">
                    {cat.icon}
                  </span>
                </div>
                
                {/* Label */}
                <span className={cn(
                  "mt-3 text-[10px] sm:text-xs font-medium text-center",
                  "text-foreground-muted group-hover:text-primary",
                  "transition-colors duration-300 tracking-wide uppercase"
                )}>
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
          
          {/* Fade Edges (Mobile Only) */}
          <div className="absolute left-0 top-0 bottom-4 w-8 bg-gradient-to-r from-background-warm to-transparent pointer-events-none lg:hidden" />
          <div className="absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-background-warm to-transparent pointer-events-none lg:hidden" />
        </div>
      </div>
    </section>
  );
};

export default CategoryCircles;
