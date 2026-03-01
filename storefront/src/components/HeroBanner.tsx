"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  defaultHeroBanner, 
  isHeroBannerActive, 
  heroThemes 
} from "@/lib/content-config";
import { cn } from "@/lib/utils";

const HeroBanner = () => {
  const config = defaultHeroBanner;
  
  // Check if banner should be shown
  if (!isHeroBannerActive(config)) {
    return null;
  }
  
  const theme = heroThemes[config.theme] || heroThemes.valentine;

  return (
    <section className={cn(
      "relative w-full overflow-hidden",
      "aspect-[4/5] sm:aspect-[16/9] lg:aspect-[16/7] xl:aspect-[16/6]",
      theme.bg
    )}>
      {/* Background Image with Overlay */}
      {config.backgroundImage ? (
        <div className="absolute inset-0 z-0">
          <Image
            src={config.backgroundImage}
            alt={config.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />
        </div>
      ) : (
        /* Decorative Background Pattern */
        <>
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent" />
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl" />
        </>
      )}
      
      {/* Content Container - Full Center on Mobile */}
      <div className="relative z-10 h-full container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-between h-full py-12 lg:py-0 gap-8">
          
          {/* Left: Featured Image Cards (Desktop Only) */}
          <div className="hidden lg:flex w-1/4 items-center justify-center">
            <div className="relative">
              <div className="relative w-48 h-60 bg-white shadow-xl -rotate-6 border-4 border-white overflow-hidden
                            hover:rotate-0 transition-transform duration-500 ease-out group">
                <Image
                  src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&q=80"
                  alt="Featured Collection"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="absolute -bottom-4 -right-8 w-36 h-44 bg-white shadow-lg rotate-12 border-4 border-white overflow-hidden
                            hover:rotate-0 transition-transform duration-500 ease-out delay-100 group">
                <Image
                  src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&q=80"
                  alt="New Collection"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>

          {/* Center: Main Content - Always Centered */}
          <div className="flex-1 w-full max-w-2xl text-center flex flex-col items-center justify-center">
            {/* Overline */}
            <span className={cn(
              "inline-block text-xs sm:text-sm font-semibold tracking-[0.3em] uppercase mb-4",
              config.backgroundImage ? "text-white/90" : theme.accent
            )}>
              {config.subtitle}
            </span>
            
            {/* Title */}
            <h2 className={cn(
              "text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-serif italic mb-6",
              config.backgroundImage ? "text-white" : theme.text
            )}>
              {config.title}
            </h2>
            
            {/* Discount/Promo Section */}
            <div className="flex flex-col items-center mb-8">
              <span className={cn(
                "text-sm sm:text-base font-medium uppercase tracking-widest mb-1",
                config.backgroundImage ? "text-white/80" : "text-foreground-muted"
              )}>
                Up To
              </span>
              <span className={cn(
                "text-6xl sm:text-7xl lg:text-8xl font-bold leading-none mb-1",
                config.backgroundImage ? "text-white" : theme.text
              )}>
                {config.discountText}
              </span>
              <span className={cn(
                "text-sm sm:text-base font-medium uppercase tracking-widest",
                config.backgroundImage ? "text-white/80" : "text-foreground-muted"
              )}>
                Sitewide
              </span>
            </div>
            
            {/* CTA Button */}
            <Link href={config.ctaLink}>
              <Button 
                className={cn(
                  "group rounded-none px-8 py-6 text-sm font-bold uppercase tracking-widest transition-all duration-300",
                  "bg-white text-primary hover:bg-primary hover:text-white",
                  "shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                )}
              >
                {config.ctaText}
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {/* Right: Showcase Image (Desktop Only) */}
          <div className="hidden lg:flex w-1/4 items-center justify-center">
            <div className="relative w-56 h-72 bg-white shadow-xl rotate-3 border-4 border-white overflow-hidden
                          hover:rotate-0 transition-transform duration-500 ease-out group">
              <Image
                src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80"
                alt="Best Sellers"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                <span className="text-white text-xs font-semibold uppercase tracking-wider">Best Sellers</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent z-10" />
    </section>
  );
};

export default HeroBanner;
