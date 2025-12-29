"use client"

import * as React from "react"
import Autoplay from "embla-carousel-autoplay"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import Image from "next/image"

const HERO_SLIDES = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=2000&auto=format&fit=crop",
        title: "Timeless Elegance",
        subtitle: "Discover our new collection of handcrafted jewellery.",
        cta: "Shop Now",
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1576723444512-ebdf753bdcc9?q=80&w=2000&auto=format&fit=crop",
        title: "Modern Sophistication",
        subtitle: "Pieces that speak to your soul.",
        cta: "View Collections",
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=2000&auto=format&fit=crop",
        title: "Gold & Glory",
        subtitle: "Celebrate every moment with 22k gold.",
        cta: "Shop Gold",
    },
]

export function HeroSection() {
    const plugin = React.useRef(
        Autoplay({ delay: 4000, stopOnInteraction: false })
    )

    return (
        <section className="w-full relative">
            <Carousel
                plugins={[plugin.current]}
                className="w-full"
                opts={{
                    loop: true,
                }}
            >
                <CarouselContent>
                    {HERO_SLIDES.map((slide) => (
                        <CarouselItem key={slide.id}>
                            <div className="relative w-full h-[60vh] md:h-[80vh]">
                                {/* Background Image */}
                                <Image
                                    src={slide.image}
                                    alt={slide.title}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                                {/* Overlay */}
                                <div className="absolute inset-0 bg-black/20" />

                                {/* Content */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
                                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-4 tracking-tight drop-shadow-md animate-in fade-in slide-in-from-bottom-6 duration-1000">
                                        {slide.title}
                                    </h2>
                                    <p className="text-lg md:text-2xl font-sans mb-8 max-w-2xl drop-shadow-sm animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                                        {slide.subtitle}
                                    </p>
                                    <Button
                                        size="lg"
                                        className="bg-white text-black hover:bg-gold hover:text-white border-0 text-base px-8 py-6 uppercase tracking-widest font-medium transition-all duration-300 animate-in fade-in zoom-in duration-1000 delay-300"
                                    >
                                        {slide.cta}
                                    </Button>
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="left-4 bg-transparent border-white text-white hover:bg-white hover:text-black hidden md:flex" />
                <CarouselNext className="right-4 bg-transparent border-white text-white hover:bg-white hover:text-black hidden md:flex" />
            </Carousel>
        </section>
    )
}
