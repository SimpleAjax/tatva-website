"use client"

import Link from "next/link"
import { ProductCard } from "@/components/product/product-card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

const NEW_ARRIVALS = Array.from({ length: 8 }).map((_, i) => ({
    id: `new-${i + 1}`,
    name: `Celestial Charm ${i + 1}`,
    price: 2999 + i * 500,
    image: "https://images.unsplash.com/photo-1629224316810-9d8805b95076?q=80&w=600&auto=format&fit=crop",
    category: "earrings",
    isNew: true,
}))

const TRENDING_NOW = Array.from({ length: 8 }).map((_, i) => ({
    id: `trend-${i + 1}`,
    name: `Royal Heritage ${i + 1}`,
    price: 4999 + i * 500,
    image: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=600&auto=format&fit=crop",
    category: "necklaces",
    isSale: i % 2 === 0,
}))

export function MultipleProductSections() {
    return (
        <>
            {/* New Arrivals Section */}
            <section className="py-16 md:py-24 px-4 container mx-auto">
                <div className="flex justify-between items-end mb-8 md:mb-12">
                    <div className="space-y-2">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold">New Arrivals</h2>
                        <p className="text-muted-foreground hidden md:block">Fresh from our artisans to your collection.</p>
                    </div>
                    <Link href="/shop/new-arrivals" className="text-sm font-medium underline underline-offset-4 hover:text-primary transition-colors">
                        View All
                    </Link>
                </div>

                {/* Desktop: Grid */}
                <div className="hidden md:grid grid-cols-4 gap-6 md:gap-8">
                    {NEW_ARRIVALS.slice(0, 4).map((product) => (
                        <ProductCard key={product.id} product={product} />
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
                            {NEW_ARRIVALS.map((product) => (
                                <CarouselItem key={product.id} className="pl-4 basis-1/2">
                                    <ProductCard product={product} />
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                </div>
            </section>

            {/* Trending Now Section */}
            <section className="py-16 md:py-24 px-4 bg-stone-50">
                <div className="container mx-auto">
                    <div className="flex flex-col items-center text-center space-y-4 mb-12">
                        <span className="text-sm font-bold tracking-widest text-gold uppercase">Trending Now</span>
                        <h2 className="text-3xl md:text-5xl font-serif font-bold">Necklace Edit</h2>
                    </div>

                    {/* Desktop: Grid */}
                    <div className="hidden md:grid grid-cols-4 gap-6 md:gap-8">
                        {TRENDING_NOW.slice(0, 4).map((product) => (
                            <ProductCard key={product.id} product={product} />
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
                                {TRENDING_NOW.map((product) => (
                                    <CarouselItem key={product.id} className="pl-4 basis-1/2">
                                        <ProductCard product={product} />
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                        </Carousel>
                    </div>

                    <div className="mt-12 text-center">
                        <Link href="/shop/necklaces" className="inline-block border-b border-black pb-1 hover:border-gold hover:text-gold transition-colors uppercase tracking-widest text-sm font-medium">
                            Shop Necklaces
                        </Link>
                    </div>
                </div>
            </section>
        </>
    )
}
