"use client"

import Link from "next/link"
import Image from "next/image"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

const CATEGORIES = [
    { id: 1, name: "Rings", image: "https://images.unsplash.com/photo-1622398925373-3f91b1e275f5?q=80&w=400&auto=format&fit=crop" },
    { id: 2, name: "Necklaces", image: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=400&auto=format&fit=crop" },
    { id: 3, name: "Earrings", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=400&auto=format&fit=crop" },
    { id: 4, name: "Bracelets", image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=400&auto=format&fit=crop" },
    { id: 5, name: "Pendants", image: "https://images.unsplash.com/photo-1602751584552-8ba43ea5187a?q=80&w=400&auto=format&fit=crop" },
]

export function CategoryRail() {
    return (
        <section className="py-12 bg-secondary/30">
            <div className="container mx-auto px-4">
                <h3 className="text-2xl font-serif font-bold text-center mb-8">Shop By Category</h3>

                {/* Desktop: Flex layout */}
                <div className="hidden md:flex flex-wrap justify-center gap-8 md:gap-12">
                    {CATEGORIES.map((cat) => (
                        <Link key={cat.id} href={`/shop/${cat.name.toLowerCase()}`} className="group flex flex-col items-center gap-3">
                            <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-transparent group-hover:border-gold transition-colors shadow-sm">
                                <Image
                                    src={cat.image}
                                    alt={cat.name}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>
                            <span className="font-medium text-base tracking-wide uppercase group-hover:text-primary transition-colors">
                                {cat.name}
                            </span>
                        </Link>
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
                            {CATEGORIES.map((cat) => (
                                <CarouselItem key={cat.id} className="pl-4 basis-1/3">
                                    <Link href={`/shop/${cat.name.toLowerCase()}`} className="group flex flex-col items-center gap-3">
                                        <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-transparent group-active:border-gold transition-colors shadow-sm">
                                            <Image
                                                src={cat.image}
                                                alt={cat.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <span className="font-medium text-xs tracking-wide uppercase text-center">
                                            {cat.name}
                                        </span>
                                    </Link>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                </div>
            </div>
        </section>
    )
}
