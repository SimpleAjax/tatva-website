"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  defaultHeroBanner, 
  isHeroBannerActive, 
  heroThemes 
} from "@/lib/content-config";

const HeroBanner = () => {
  const config = defaultHeroBanner;
  
  // Check if banner should be shown
  if (!isHeroBannerActive(config)) {
    return null;
  }
  
  const theme = heroThemes[config.theme] || heroThemes.valentine;

  return (
    <section className={`relative w-full aspect-[16/6] md:aspect-[16/5] ${theme.bg} overflow-hidden`}>
      {/* Background Image (if provided) */}
      {config.backgroundImage && (
        <div className="absolute inset-0 z-0">
          <Image
            src={config.backgroundImage}
            alt={config.title}
            fill
            className="object-cover opacity-30"
            priority
          />
        </div>
      )}
      
      {/* Product Group Showcase */}
      <div className="container mx-auto h-full flex items-center justify-between px-4 lg:px-12 relative z-10">
        {/* Left Side: Product Spread */}
        <div className="hidden md:flex w-1/3 h-full items-center justify-center">
          <div className="relative w-64 h-64 bg-white shadow-xl rotate-[-3deg] border-4 border-white p-2 hover:rotate-0 transition-transform duration-500">
            <div className="w-full h-full bg-muted flex items-center justify-center text-xs text-muted-foreground uppercase tracking-widest">
              <Image
                src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&q=80"
                alt="Featured Collection"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Center: Sale Content */}
        <div className="w-full md:w-1/3 flex flex-col items-center text-center space-y-4">
          <span className={`${theme.accent} text-sm lg:text-base font-medium tracking-[0.3em] uppercase`}>
            {config.subtitle}
          </span>
          <h2 className={`text-4xl lg:text-6xl font-serif ${theme.text} italic`}>
            {config.title}
          </h2>
          <div className="flex flex-col items-center">
            <span className="text-lg lg:text-2xl font-light text-foreground uppercase tracking-wider">UP TO</span>
            <span className={`text-6xl lg:text-8xl font-bold ${theme.text}`}>
              {config.discountText}
            </span>
            <span className="text-lg lg:text-2xl font-light text-foreground uppercase tracking-wider">SITEWIDE</span>
          </div>
          <Link href={config.ctaLink}>
            <Button className={`mt-4 ${theme.button} text-white rounded-none px-8 py-6 text-xs tracking-widest font-bold uppercase`}>
              {config.ctaText}
            </Button>
          </Link>
        </div>

        {/* Right Side: Showcase */}
        <div className="hidden md:flex w-1/3 h-full items-center justify-center">
          <div className="relative w-48 h-48 bg-white shadow-lg rotate-[5deg] border-4 border-white hover:rotate-0 transition-transform duration-500">
            <div className="w-full h-full bg-muted/50 flex items-center justify-center text-xs text-muted-foreground uppercase tracking-widest">
              <Image
                src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80"
                alt="New Arrivals"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Background Decorative Circles */}
      <div className="absolute top-[-10%] left-[-5%] w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
    </section>
  );
};

export default HeroBanner;
