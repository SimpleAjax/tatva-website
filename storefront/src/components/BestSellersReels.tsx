"use client";

import React, { useEffect, useState } from "react";
import ReelCard from "./ReelCard";
import { Loader2 } from "lucide-react";
import { getVideoUrl } from "@/lib/imagekit";

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
    <section className="py-8 lg:py-10 bg-zinc-50 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-primary text-[10px] lg:text-[11px] font-bold tracking-[0.4em] uppercase">
            Trending Now
          </span>
          <h2 className="text-4xl font-serif text-primary italic mt-2">Best Sellers</h2>
          <div className="w-24 h-0.5 bg-primary/20 mx-auto mt-4" />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <span className="ml-3 text-muted-foreground">Loading videos...</span>
          </div>
        )}

        {/* Reels Horizontal Scroll - Smaller size, ~7 visible */}
        <div className={cn(
          "flex overflow-x-auto gap-3 pb-4 no-scrollbar snap-x snap-mandatory",
          isLoading ? "opacity-0" : "opacity-100 transition-opacity duration-500"
        )}>
          {reels.map((reel, i) => (
            <div 
              key={i} 
              className="flex-shrink-0 w-[140px] sm:w-[160px] lg:w-[180px] snap-start"
            >
              <ReelCard 
                {...reel} 
                compact // Pass compact prop for smaller styling
                priority={i < 2} // Priority load first 2 videos
              />
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <a 
            href="/category/best-sellers" 
            className="bg-primary hover:bg-primary/90 text-white transition-all px-12 py-4 tracking-widest uppercase font-bold text-xs shadow-lg rounded-full inline-block"
          >
            Explore Best Sellers
          </a>
        </div>
      </div>
    </section>
  );
}

// Helper for className
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
