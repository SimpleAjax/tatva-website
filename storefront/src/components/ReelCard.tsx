"use client";

import React, { useState, useRef, useEffect } from "react";
import NextImage from "next/image";
import { Heart, MessageCircle, Share2, MoreVertical, Play, Pause, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReelCardProps {
    productName: string;
    price: string;
    originalPrice: string;
    discount: string;
    likes: string;
    views: string;
    shares: string;
    videoUrl?: string; // Placeholder for actual video source
    thumbnail?: string;
}

const ReelCard = ({
    productName,
    price,
    originalPrice,
    discount,
    likes,
    views,
    shares,
    videoUrl = "https://assets.mixkit.co/videos/preview/mixkit-jewelry-in-a-box-41589-large.mp4",
    thumbnail = "/api/placeholder/400/700",
}: ReelCardProps) => {
    const [isPlaying, setIsPlaying] = useState(true);
    const [isLiked, setIsLiked] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.play().catch(() => setIsPlaying(false));
        }
    }, []);

    return (
        <div className="relative w-full aspect-[9/16] bg-black overflow-hidden rounded-2xl shadow-2xl group border border-zinc-800">
            {/* Video Background */}
            <video
                ref={videoRef}
                src={videoUrl}
                className="absolute inset-0 w-full h-full object-cover cursor-pointer"
                loop
                playsInline
                muted
                onClick={togglePlay}
            />

            {/* Overlay Gradients */}
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

            {/* Top Header Placeholder */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full border-2 border-primary bg-white flex items-center justify-center text-[10px] font-bold text-primary">T</div>
                    <span className="text-white text-xs font-bold tracking-widest shadow-sm">TATVA.TRIBE</span>
                </div>
                <MoreVertical className="text-white w-5 h-5 cursor-pointer" />
            </div>

            {/* Center Play/Pause Indicator (Hidden by default) */}
            {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                    <Pause className="text-white/60 w-12 h-12" />
                </div>
            )}

            {/* Right Action Icons (Instagram Style) */}
            <div className="absolute right-3 bottom-24 flex flex-col items-center space-y-6 z-10">
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

            {/* Bottom Product Overlay (The requested part) */}
            <div className="absolute left-3 bottom-4 right-16 z-10 flex items-end space-x-3">
                {/* Round Product Image */}
                <div className="w-14 h-14 rounded-full border-2 border-primary bg-white flex-shrink-0 overflow-hidden relative shadow-lg">
                    <NextImage src={thumbnail} alt={productName} layout="fill" objectFit="cover" />
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

            {/* View Details Button */}
            <div className="absolute bottom-4 right-3 z-10">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shadow-xl animate-pulse cursor-pointer">
                    <Play className="w-4 h-4 fill-white" />
                </div>
            </div>
        </div>
    );
};

export default ReelCard;
