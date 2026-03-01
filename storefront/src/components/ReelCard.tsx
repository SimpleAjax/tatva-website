"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import NextImage from "next/image";
import { Heart, Share2, MoreVertical, Eye, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getImageUrl, getVideoUrl, getProductThumbnail } from "@/lib/imagekit";

interface ReelCardProps {
    productName: string;
    price: string;
    originalPrice: string;
    discount: string;
    likes: string;
    views: string;
    shares: string;
    videoPath?: string;
    imagePath?: string;
    priority?: boolean; // Load immediately if true
    compact?: boolean; // Smaller size for horizontal scroll
}

const ReelCard = ({
    productName,
    price,
    originalPrice,
    discount,
    likes,
    views,
    shares,
    videoPath,
    imagePath,
    priority = false,
    compact = false,
}: ReelCardProps) => {
    const [isLiked, setIsLiked] = useState(false);
    const [videoState, setVideoState] = useState<'loading' | 'playing' | 'error'>('loading');
    const [retryCount, setRetryCount] = useState(0);
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Get ImageKit URLs
    const videoUrl = videoPath ? getVideoUrl(videoPath) : null;
    const thumbnailUrl = imagePath ? getProductThumbnail(imagePath) : null;

    // Intersection Observer to only load video when visible (unless priority)
    useEffect(() => {
        if (priority && videoRef.current) {
            // Load immediately if priority
            videoRef.current.load();
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && videoRef.current) {
                        // Start loading video when visible
                        videoRef.current.load();
                    }
                });
            },
            { threshold: 0.1, rootMargin: '50px' }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, [priority]);

    // Try to play video
    const tryPlayVideo = useCallback(async () => {
        if (!videoRef.current || !videoUrl) return;

        try {
            videoRef.current.muted = true;
            await videoRef.current.play();
            setVideoState('playing');
        } catch (err) {
            console.log("Video play failed, will retry:", err);
            // Retry up to 3 times
            if (retryCount < 3) {
                setTimeout(() => {
                    setRetryCount(prev => prev + 1);
                    tryPlayVideo();
                }, 1000 * (retryCount + 1));
            } else {
                setVideoState('error');
            }
        }
    }, [videoUrl, retryCount]);

    // Handle video loaded and ready to play
    const handleCanPlay = () => {
        console.log("Video can play:", productName);
        tryPlayVideo();
    };

    // Handle video playing
    const handlePlaying = () => {
        setVideoState('playing');
    };

    // Handle video error
    const handleError = (e: React.SyntheticEvent<HTMLVideoElement>) => {
        console.error("Video error:", productName, e);
        setVideoState('error');
    };

    // Handle retry manually
    const handleRetry = () => {
        setRetryCount(0);
        setVideoState('loading');
        if (videoRef.current) {
            videoRef.current.load();
        }
    };

    return (
        <div 
            ref={containerRef}
            className={cn(
                "relative w-full bg-black overflow-hidden group border border-zinc-800",
                compact 
                    ? "aspect-[9/16] rounded-xl shadow-lg" 
                    : "aspect-[9/16] rounded-2xl shadow-2xl"
            )}
        >
            {/* Poster Image (shown while loading or on error) */}
            {(videoState === 'loading' || videoState === 'error') && thumbnailUrl && (
                <div className="absolute inset-0 z-0">
                    <NextImage
                        src={thumbnailUrl}
                        alt={productName}
                        fill
                        className="object-cover opacity-100"
                        priority
                    />
                </div>
            )}

            {/* Video Element */}
            {videoUrl && (
                <video
                    ref={videoRef}
                    src={videoUrl}
                    poster={thumbnailUrl || undefined}
                    className={cn(
                        "absolute inset-0 w-full h-full object-cover transition-opacity duration-700",
                        videoState === 'playing' ? "opacity-100" : "opacity-0"
                    )}
                    loop
                    playsInline
                    muted
                    autoPlay={priority}
                    preload={priority ? "auto" : "metadata"}
                    crossOrigin="anonymous"
                    onCanPlay={handleCanPlay}
                    onPlaying={handlePlaying}
                    onError={handleError}
                />
            )}

            {/* Loading State */}
            {videoState === 'loading' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                    <Loader2 className={cn("text-white animate-spin", compact ? "w-5 h-5" : "w-8 h-8")} />
                </div>
            )}

            {/* Error State with Retry */}
            {videoState === 'error' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 z-20">
                    <p className={cn("text-white/80 mb-2", compact ? "text-[10px]" : "text-sm")}>Video unavailable</p>
                    <button 
                        onClick={handleRetry}
                        className={cn("bg-primary text-white rounded-full hover:bg-primary/80 transition-colors", compact ? "px-2 py-1 text-[8px]" : "px-4 py-2 text-xs")}
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* No Video Fallback */}
            {!videoUrl && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-zinc-900 to-black">
                    <div className={cn("text-center", compact ? "p-2" : "p-4")}>
                        <div className={cn("mx-auto mb-2 rounded-full bg-zinc-800 flex items-center justify-center", compact ? "w-8 h-8" : "w-16 h-16")}>
                            <span className={compact ? "text-base" : "text-2xl"}>💎</span>
                        </div>
                        <p className={cn("text-white/60", compact ? "text-[8px]" : "text-xs")}>{productName}</p>
                    </div>
                </div>
            )}

            {/* Overlay Gradients */}
            <div className={cn("absolute inset-x-0 top-0 bg-gradient-to-b from-black/40 to-transparent pointer-events-none z-10", compact ? "h-12" : "h-24")} />
            <div className={cn("absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none z-10", compact ? "h-24" : "h-48")} />

            {/* Top Header - Hidden in compact mode for cleaner look */}
            {!compact && (
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full border-2 border-primary bg-white flex items-center justify-center text-[10px] font-bold text-primary">T</div>
                        <span className="text-white text-xs font-bold tracking-widest shadow-sm">TATVA.TRIBE</span>
                    </div>
                    <MoreVertical className="text-white w-5 h-5 cursor-pointer" />
                </div>
            )}

            {/* Right Action Icons (Instagram Style) */}
            <div className={cn("absolute right-2 flex flex-col items-center z-20", compact ? "bottom-16 space-y-2" : "bottom-24 space-y-6")}>
                <div className="flex flex-col items-center group/action cursor-pointer" onClick={() => setIsLiked(!isLiked)}>
                    <Heart className={cn("transition-all", isLiked ? "fill-primary text-primary scale-110" : "text-white fill-none", compact ? "w-4 h-4" : "w-7 h-7")} />
                    <span className={cn("text-white font-bold shadow-sm", compact ? "text-[8px] mt-0.5" : "text-[10px] mt-1")}>{likes}</span>
                </div>

                <div className="flex flex-col items-center group/action cursor-pointer">
                    <Eye className={cn("text-white shadow-sm", compact ? "w-4 h-4" : "w-7 h-7")} />
                    <span className={cn("text-white font-bold shadow-sm", compact ? "text-[8px] mt-0.5" : "text-[10px] mt-1")}>{views}</span>
                </div>

                <div className="flex flex-col items-center group/action cursor-pointer">
                    <Share2 className={cn("text-white shadow-sm", compact ? "w-4 h-4" : "w-7 h-7")} />
                    <span className={cn("text-white font-bold shadow-sm", compact ? "text-[8px] mt-0.5" : "text-[10px] mt-1")}>{shares}</span>
                </div>
            </div>

            {/* Bottom Product Overlay */}
            <div className={cn("absolute left-2 z-20 flex items-end", compact ? "bottom-2 right-10 space-x-1.5" : "bottom-4 right-16 space-x-3")}>
                {/* Round Product Image */}
                <div className={cn("rounded-full border-2 border-primary bg-white flex-shrink-0 overflow-hidden relative shadow-lg", compact ? "w-7 h-7" : "w-14 h-14")}>
                    {thumbnailUrl ? (
                        <NextImage 
                            src={thumbnailUrl} 
                            alt={productName} 
                            fill
                            className="object-cover"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                            }}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted">
                            <span className={cn("text-muted-foreground", compact ? "text-[8px]" : "text-xs")}>{productName.charAt(0)}</span>
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="flex flex-col min-w-0">
                    <h3 className={cn("text-white font-bold tracking-wide truncate shadow-sm", compact ? "text-[8px] mb-0" : "text-xs lg:text-sm mb-1")}>{productName}</h3>
                    <div className={cn("flex items-center", compact ? "space-x-1" : "space-x-2")}>
                        <span className={cn("text-primary font-bold drop-shadow-md", compact ? "text-[10px]" : "text-sm lg:text-base")}>{price}</span>
                        {originalPrice && (
                            <span className={cn("text-white/60 line-through decoration-white/40", compact ? "text-[7px]" : "text-[10px]")}>{originalPrice}</span>
                        )}
                        {discount && (
                            <span className={cn("text-green-400 font-bold uppercase tracking-wider", compact ? "text-[6px]" : "text-[10px]")}>{discount} OFF</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReelCard;
