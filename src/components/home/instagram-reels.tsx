"use client"

import * as React from "react"
import { Play } from "lucide-react"
import { useRef, useState, useEffect } from "react"
import { cn } from "@/lib/utils"

const REELS = [
    {
        id: 1,
        video: "https://videos.pexels.com/video-files/5359719/5359719-hd_1080_1920_25fps.mp4", // Woman showing rings
        thumbnail: "https://images.pexels.com/photos/5359719/pexels-photo-5359719.jpeg?auto=compress&cs=tinysrgb&w=800",
        title: "Stacking Essentials",
    },
    {
        id: 2,
        video: "https://videos.pexels.com/video-files/6995180/6995180-hd_1080_1920_30fps.mp4", // Necklace closeup
        thumbnail: "https://images.pexels.com/photos/6995180/pexels-photo-6995180.jpeg?auto=compress&cs=tinysrgb&w=800",
        title: "Daily Wear Gold",
    },
    {
        id: 3,
        video: "https://videos.pexels.com/video-files/7650537/7650537-hd_1080_1920_30fps.mp4", // Earring try-on
        thumbnail: "https://images.pexels.com/photos/7650537/pexels-photo-7650537.jpeg?auto=compress&cs=tinysrgb&w=800",
        title: "Wedding Edit",
    },
    {
        id: 4,
        video: "https://videos.pexels.com/video-files/4231641/4231641-hd_1080_1920_25fps.mp4", // Bracelet styling
        thumbnail: "https://images.pexels.com/photos/4231641/pexels-photo-4231641.jpeg?auto=compress&cs=tinysrgb&w=800",
        title: "Office Chic",
    },
]

export function InstagramReels() {
    const [playingId, setPlayingId] = useState<number | null>(null)

    return (
        <section className="py-16 md:py-24 bg-stone-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Shop Our Best Sellers</h2>
                    <p className="text-muted-foreground">Seen on Instagram. Loved by you.</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {REELS.map((reel) => (
                        <div
                            key={reel.id}
                            className="relative aspect-[9/16] rounded-xl overflow-hidden cursor-pointer group shadow-lg"
                            onMouseEnter={() => setPlayingId(reel.id)}
                            onMouseLeave={() => setPlayingId(null)}
                        >
                            {/* Video / Thumbnail */}
                            {playingId === reel.id ? (
                                <video
                                    src={reel.video}
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                            ) : (
                                <img
                                    src={reel.thumbnail}
                                    alt={reel.title}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            )}

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />

                            {/* Play Icon (Hide when playing) */}
                            <div className={cn(
                                "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-opacity duration-300",
                                playingId === reel.id ? "opacity-0" : "opacity-100"
                            )}>
                                <Play className="h-5 w-5 fill-white text-white ml-1" />
                            </div>

                            {/* Text Content */}
                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
                                <p className="font-medium text-sm md:text-base">{reel.title}</p>
                                <p className="text-xs text-white/80 mt-1">Shop Now &rarr;</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
