"use client";

import React from "react";
import NextImage from "next/image";
import { ArrowRight } from "lucide-react";

const collections = [
    { name: "Daily Wear", items: "120+ Items", color: "bg-[#FDF8F8]" },
    { name: "Occasion", items: "80+ Items", color: "bg-[#FEF2F2]" },
    { name: "Office Edit", items: "45+ Items", color: "bg-[#F5F5F5]" },
    { name: "Gift Sets", items: "30+ Items", color: "bg-primary/5" },
];

const Collections = () => {
    return (
        <section className="py-10 container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                <div className="space-y-4">
                    <span className="text-primary text-[10px] lg:text-[11px] font-bold tracking-[0.4em] uppercase">Categories</span>
                    <h2 className="text-4xl lg:text-5xl font-serif text-primary italic">Our Collections</h2>
                </div>
                <button className="flex items-center space-x-2 text-primary font-bold text-xs tracking-widest uppercase hover:translate-x-1 transition-transform">
                    <span>View All Collections</span>
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {collections.map((col) => (
                    <div key={col.name} className={`${col.color} p-8 group cursor-pointer transition-all duration-500 hover:shadow-xl relative overflow-hidden`}>
                        <div className="relative z-10 space-y-4">
                            <h3 className="text-2xl font-serif text-primary italic">{col.name}</h3>
                            <p className="text-xs tracking-widest uppercase text-muted-foreground font-bold">{col.items}</p>
                            <div className="w-10 h-0.5 bg-primary transition-all duration-500 group-hover:w-full" />
                        </div>

                        {/* Mock visual element */}
                        <div className="absolute -bottom-4 -right-4 w-32 h-32 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                            <div className="w-full h-full rounded-full border-4 border-primary" />
                        </div>

                        <button className="absolute bottom-8 left-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-[10px] font-bold tracking-widest uppercase text-primary flex items-center">
                            Shop Now <ArrowRight className="w-3 h-3 ml-2" />
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Collections;
