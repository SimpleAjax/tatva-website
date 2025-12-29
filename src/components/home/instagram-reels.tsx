"use client"

import * as React from "react"
import { Play } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

const REELS = [
    {
        id: 1,
        video: "https://videos.pexels.com/video-files/5359719/5359719-hd_1080_1920_25fps.mp4",
        thumbnail: "https://images.pexels.com/photos/5359719/pexels-photo-5359719.jpeg?auto=compress&cs=tinysrgb&w=800",
        title: "Stacking Essentials",
    },
    {
        id: 2,
        video: "https://videos.pexels.com/video-files/6995180/6995180-hd_1080_1920_30fps.mp4",
        thumbnail: "https://images.pexels.com/photos/6995180/pexels-photo-6995180.jpeg?auto=compress&cs=tinysrgb&w=800",
        title: "Daily Wear Gold",
    },
    {
        id: 3,
        video: "https://videos.pexels.com/video-files/7650537/7650537-hd_1080_1920_30fps.mp4",
        thumbnail: "https://images.pexels.com/photos/7650537/pexels-photo-7650537.jpeg?auto=compress&cs=tinysrgb&w=800",
        title: "Wedding Edit",
    },
    {
        id: 4,
        video: "https://videos.pexels.com/video-files/4231641/4231641-hd_1080_1920_25fps.mp4",
        thumbnail: "https://images.pexels.com/photos/4231641/pexels-photo-4231641.jpeg?auto=compress&cs=tinysrgb&w=800",
        title: "Office Chic",
    },
]

function ReelCard({ reel }: { reel: typeof REELS[0] }) {
    const [isPlaying, setIsPlaying] = useState(false)

    return (
        <div
            className="relative aspect-[9/16] rounded-xl overflow-hidden cursor-pointer group shadow-lg"
            onMouseEnter={() => setIsPlaying(true)}
            onMouseLeave={() => setIsPlaying(false)}
            onClick={() => setIsPlaying(!isPlaying)}
        >
            {/* Video / Thumbnail */}
            {isPlaying ? (
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

            {/* Play Icon */}
            <div className={cn(
                "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-opacity duration-300",
                isPlaying ? "opacity-0" : "opacity-100"
            )}>
                <Play className="h-5 w-5 fill-white text-white ml-1" />
            </div>

            {/* Text Content */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
                <p className="font-medium text-sm md:text-base">{reel.title}</p>
                <p className="text-xs text-white/80 mt-1">Shop Now &rarr;</p>
            </div>
        </div>
    )
}

export function InstagramReels() {
    return (
        <section className="py-16 md:py-24 bg-stone-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Shop Our Best Sellers</h2>
                    <p className="text-muted-foreground">Seen on Instagram. Loved by you.</p>
                </div>

                {/* Desktop: Grid */}
                <div className="hidden md:grid grid-cols-4 gap-6">
                    {REELS.map((reel) => (
                        <ReelCard key={reel.id} reel={reel} />
                    ))}
                </div>

                {/* Mobile: Carousel */}
                <div className="md:hidden">
                    <Carousel
                        opts={{
                            align: "start",
                            loop: true,
                        }}
                        className="w-full"
                    >
                        <CarouselContent className="-ml-4">
                            {REELS.map((reel) => (
                                <CarouselItem key={reel.id} className="pl-4 basis-1/2">
                                    <ReelCard reel={reel} />
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                </div>
            </div>
        </section>
    )
}
