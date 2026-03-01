"use client";

import React, { useEffect, useState } from "react";
import ReelCard from "./ReelCard";
import { Loader2, TrendingUp } from "lucide-react";
import { getVideoUrl } from "@/lib/imagekit";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ReelData {
  productName: string;
  price: string;
  originalPrice: string;
  discount: string;
  likes: string;
  views: string;
  shares: string;
  videoPath?: string;
  imagePath?: string;
}

interface BestSellersReelsProps {
  reels: ReelData[];
}

export default function BestSellersReels({ reels }: BestSellersReelsProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [loadedVideos, setLoadedVideos] = useState<Set<string>>(new Set());

  // Preload first 2 videos immediately
  useEffect(() => {
    const preloadVideos = async () => {
      const videosToPreload = reels.slice(0, 2);
      
      const promises = videosToPreload.map(async (reel) => {
        if (!reel.videoPath) return;
        
        const videoUrl = getVideoUrl(reel.videoPath);
        
        return new Promise<void>((resolve) => {
          const video = document.createElement('video');
          video.preload = 'metadata';
          video.muted = true;
          
          video.addEventListener('loadedmetadata', () => {
            setLoadedVideos(prev => new Set(prev).add(reel.videoPath!));
            resolve();
          });
          
          video.addEventListener('error', () => {
            resolve(); // Resolve even on error so we don't block
          });
          
          // Timeout after 5 seconds
          setTimeout(() => resolve(), 5000);
          
          video.src = videoUrl;
        });
      });

      await Promise.all(promises);
      setIsLoading(false);
    };

    preloadVideos();
  }, [reels]);

  return (
    <section className="py-16 lg:py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10 lg:mb-12">
          <div className="flex items-center justify-center gap-2 text-primary mb-3">
            <TrendingUp className="w-4 h-4" />
            <span className="text-[11px] font-semibold tracking-[0.2em] uppercase">
              Trending Now
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-serif italic text-primary">
            Best Sellers
          </h2>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <span className="ml-3 text-muted-foreground text-sm">Loading videos...</span>
          </div>
        )}

        {/* Reels Horizontal Scroll */}
        <div className={cn(
          "relative",
          isLoading ? "opacity-0" : "opacity-100 transition-opacity duration-500"
        )}>
          <div 
            className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 snap-x snap-mandatory no-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {reels.map((reel, i) => (
              <div 
                key={i} 
                className="flex-shrink-0 w-[140px] sm:w-[160px] lg:w-[180px] snap-start"
              >
                <ReelCard 
                  {...reel} 
                  compact
                  priority={i < 2}
                />
              </div>
            ))}
          </div>
          
          {/* Fade Edges */}
          <div className="absolute left-0 top-0 bottom-4 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none" />
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link 
            href="/category/best-sellers" 
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-10 py-4 text-xs font-bold uppercase tracking-widest transition-all hover:shadow-lg hover:-translate-y-0.5"
          >
            Explore Best Sellers
          </Link>
        </div>
      </div>
    </section>
  );
}
