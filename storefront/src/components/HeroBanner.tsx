"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const HeroBanner = () => {
    return (
        <section className="relative w-full aspect-[16/6] md:aspect-[16/5] bg-[#FFF5F5] overflow-hidden">
            {/* Product Group Showcase */}
            <div className="container mx-auto h-full flex items-center justify-between px-4 lg:px-12 relative z-10">
                {/* Left Side: Product Spread (Mocked as a Styled Div for now) */}
                <div className="hidden md:flex w-1/3 h-full items-center justify-center">
                    <div className="relative w-64 h-64 bg-white shadow-xl rotate-[-3deg] border-4 border-white p-2">
                        <div className="w-full h-full bg-muted flex items-center justify-center text-xs text-muted-foreground uppercase tracking-widest">
                            Jewelry Collection
                        </div>
                    </div>
                </div>

                {/* Center: Sale Content */}
                <div className="w-full md:w-1/3 flex flex-col items-center text-center space-y-4">
                    <span className="text-primary text-sm lg:text-base font-medium tracking-[0.3em] uppercase">Happy Valentine's Day</span>
                    <h2 className="text-4xl lg:text-6xl font-serif text-primary italic">Valentine Sale</h2>
                    <div className="flex flex-col items-center">
                        <span className="text-lg lg:text-2xl font-light text-foreground uppercase tracking-wider">UP TO</span>
                        <span className="text-6xl lg:text-8xl font-bold text-primary">25% OFF</span>
                        <span className="text-lg lg:text-2xl font-light text-foreground uppercase tracking-wider">SITEWIDE</span>
                    </div>
                    <Button className="mt-4 bg-primary hover:bg-primary/90 text-white rounded-none px-8 py-6 text-xs tracking-widest font-bold uppercase">
                        Shop the Sale
                    </Button>
                </div>

                {/* Right Side: Showcase (Mocked) */}
                <div className="hidden md:flex w-1/3 h-full items-center justify-center">
                    <div className="relative w-48 h-48 bg-white shadow-lg rotate-[5deg] border-4 border-white">
                        <div className="w-full h-full bg-muted/50 flex items-center justify-center text-xs text-muted-foreground uppercase tracking-widest">
                            New Arrivals
                        </div>
                    </div>
                </div>
            </div>

            {/* Background Decorative Circles (as seen in screenshot) */}
            <div className="absolute top-[-10%] left-[-5%] w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        </section>
    );
};

export default HeroBanner;
