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
            className="relative w-full aspect-[9/16] bg-black overflow-hidden rounded-2xl shadow-2xl group border border-zinc-800"
        >
            {/* Poster Image (shown while loading or on error) */}
            {(videoState === 'loading' || videoState === 'error') && thumbnailUrl && (
                <div className="absolute inset-0 z-0">
                    <NextImage
                        src={thumbnailUrl}
                        alt={productName}
                        fill
                        className={cn(
                            "object-cover transition-opacity duration-500",
                            videoState === 'playing' ? "opacity-0" : "opacity-100"
                        )}
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
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
            )}

            {/* Error State with Retry */}
            {videoState === 'error' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 z-20">
                    <p className="text-white/80 text-sm mb-2">Video unavailable</p>
                    <button 
                        onClick={handleRetry}
                        className="px-4 py-2 bg-primary text-white text-xs rounded-full hover:bg-primary/80 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* No Video Fallback */}
            {!videoUrl && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-zinc-900 to-black">
                    <div className="text-center p-4">
                        <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-zinc-800 flex items-center justify-center">
                            <span className="text-2xl">💎</span>
                        </div>
                        <p className="text-white/60 text-xs">{productName}</p>
                    </div>
                </div>
            )}

            {/* Overlay Gradients */}
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/40 to-transparent pointer-events-none z-10" />
            <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none z-10" />

            {/* Top Header */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full border-2 border-primary bg-white flex items-center justify-center text-[10px] font-bold text-primary">T</div>
                    <span className="text-white text-xs font-bold tracking-widest shadow-sm">TATVA.TRIBE</span>
                </div>
                <MoreVertical className="text-white w-5 h-5 cursor-pointer" />
            </div>

            {/* Right Action Icons (Instagram Style) */}
            <div className="absolute right-3 bottom-24 flex flex-col items-center space-y-6 z-20">
                <div className="flex flex-col items-center group/action cursor-pointer" onClick={() => setIsLiked(!isLiked)}>
                    <Heart className={cn("w-7 h-7 transition-all", isLiked ? "fill-primary text-primary scale-110" : "text-white fill-none")} />
                    <span className="text-white text-[10px] font-bold mt-1 shadow-sm">{likes}</span>
                </div>

                <div className="flex flex-col items-center group/action cursor-pointer">
                    <Eye className="text-white w-7 h-7 shadow-sm" />
                    <span className="text-white text-[10px] font-bold mt-1 shadow-sm">{views}</span>
                </div>

                <div className="flex flex-col items-center group/action cursor-pointer">
                    <Share2 className="text-white w-7 h-7 shadow-sm" />
                    <span className="text-white text-[10px] font-bold mt-1 shadow-sm">{shares}</span>
                </div>
            </div>

            {/* Bottom Product Overlay */}
            <div className="absolute left-3 bottom-4 right-16 z-20 flex items-end space-x-3">
                {/* Round Product Image */}
                <div className="w-14 h-14 rounded-full border-2 border-primary bg-white flex-shrink-0 overflow-hidden relative shadow-lg">
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
                            <span className="text-xs text-muted-foreground">{productName.charAt(0)}</span>
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="flex flex-col min-w-0">
                    <h3 className="text-white text-xs lg:text-sm font-bold tracking-wide truncate shadow-sm mb-1">{productName}</h3>
                    <div className="flex items-center space-x-2">
                        <span className="text-primary font-bold text-sm lg:text-base drop-shadow-md">{price}</span>
                        <span className="text-white/60 text-[10px] line-through decoration-white/40">{originalPrice}</span>
                        <span className="text-green-400 text-[10px] font-bold uppercase tracking-widest">{discount} OFF</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReelCard;
