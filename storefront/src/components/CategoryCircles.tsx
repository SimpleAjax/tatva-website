"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const categories = [
    { name: "New In", icon: "✨" },
    { name: "Gift Store", icon: "🎁" },
    { name: "Personalized", icon: "💎" },
    { name: "Bracelets", icon: "💫" },
    { name: "Necklaces", icon: "📿" },
    { name: "Earrings", icon: "👂" },
    { name: "Rings", icon: "💍" },
    { name: "Bestsellers", icon: "🔥" },
    { name: "Combos", icon: "🛍️" },
];

const CategoryCircles = () => {
    return (
        <div className="w-full py-8 lg:py-12 bg-[#FEF9F9]">
            <div className="container mx-auto px-4 overflow-x-auto no-scrollbar">
                <div className="flex items-center justify-start lg:justify-center space-x-6 lg:space-x-12 min-w-max">
                    {categories.map((cat) => (
                        <Link
                            key={cat.name}
                            href={`/category/${cat.name.toLowerCase().replace(/\s+/g, '-')}`}
                            className="flex flex-col items-center group space-y-3"
                        >
                            <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-white border border-border flex items-center justify-center text-2xl shadow-sm group-hover:border-primary group-hover:shadow-md transition-all duration-300 overflow-hidden relative">
                                {/* Mock background pattern or image placeholder */}
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-50" />
                                <span className="relative z-10">{cat.icon}</span>
                            </div>
                            <span className="text-[10px] lg:text-[11px] font-bold tracking-widest uppercase text-foreground group-hover:text-primary transition-colors text-center w-full">
                                {cat.name}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategoryCircles;
