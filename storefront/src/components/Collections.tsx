"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Collection {
  name: string;
  handle: string;
  itemCount: string;
  description: string;
  color: string;
  textColor: string;
}

const collections: Collection[] = [
    { 
      name: "Daily Wear", 
      handle: "daily-wear",
      itemCount: "120+", 
      description: "Subtle elegance for everyday moments",
      color: "bg-rose",
      textColor: "text-primary"
    },
    { 
      name: "Occasion", 
      handle: "occasion",
      itemCount: "80+", 
      description: "Statement pieces for special events",
      color: "bg-primary-light",
      textColor: "text-primary"
    },
    { 
      name: "Office Edit", 
      handle: "office-edit",
      itemCount: "45+", 
      description: "Professional sophistication",
      color: "bg-champagne",
      textColor: "text-foreground"
    },
    { 
      name: "Gift Sets", 
      handle: "gift-sets",
      itemCount: "30+", 
      description: "Curated collections for loved ones",
      color: "bg-muted",
      textColor: "text-foreground"
    },
];

const Collections = () => {
    return (
        <section className="py-16 lg:py-24 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12 lg:mb-16">
                    <div className="space-y-2">
                        <span className="text-primary text-[11px] font-semibold tracking-[0.2em] uppercase">
                            Curated For You
                        </span>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif italic text-primary">
                            Our Collections
                        </h2>
                    </div>
                    <Link 
                        href="/collections" 
                        className="group inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors"
                    >
                        <span className="uppercase tracking-widest">View All</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Collections Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {collections.map((collection, index) => (
                        <Link
                            key={collection.name}
                            href={`/category/${collection.handle}`}
                            className={cn(
                                "group relative p-8 lg:p-10 min-h-[280px] flex flex-col justify-between",
                                "transition-all duration-500 ease-out overflow-hidden",
                                collection.color
                            )}
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {/* Background Decoration */}
                            <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full border-4 border-current opacity-5 group-hover:opacity-10 group-hover:scale-125 transition-all duration-700" />
                            
                            {/* Content */}
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <span className={cn(
                                        "text-xs font-bold uppercase tracking-widest opacity-60",
                                        collection.textColor
                                    )}>
                                        {collection.itemCount} Items
                                    </span>
                                    <div className="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                                        <ArrowUpRight className={cn("w-4 h-4", collection.textColor)} />
                                    </div>
                                </div>
                                
                                <h3 className={cn(
                                    "text-2xl lg:text-3xl font-serif italic mb-2",
                                    collection.textColor
                                )}>
                                    {collection.name}
                                </h3>
                                
                                <p className={cn(
                                    "text-sm opacity-70 max-w-[200px]",
                                    collection.textColor
                                )}>
                                    {collection.description}
                                </p>
                            </div>

                            {/* Bottom Line Animation */}
                            <div className="relative z-10 mt-6">
                                <div className={cn(
                                    "h-0.5 w-12 bg-current opacity-40 group-hover:w-full transition-all duration-500",
                                    collection.textColor
                                )} />
                            </div>

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Collections;
