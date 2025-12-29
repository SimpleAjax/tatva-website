"use client"

import * as React from "react"
import { Star } from "lucide-react"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"

const REVIEWS = [
    {
        id: 1,
        name: "Priya S.",
        rating: 5,
        text: "The quality is absolutely stunning. I bought the Kundan necklace set for my sister's wedding and she got so many compliments!",
        location: "Mumbai"
    },
    {
        id: 2,
        name: "Anjali M.",
        rating: 5,
        text: "Tatva never disappoints. The packaging was beautiful and the ring fits perfectly. Will definitely order again.",
        location: "Delhi"
    },
    {
        id: 3,
        name: "Meera K.",
        rating: 4,
        text: "Loved the earrings! They are lightweight yet look heavy and premium. Shipping took a day longer but worth the wait.",
        location: "Bangalore"
    },
    {
        id: 4,
        name: "Sarah J.",
        rating: 5,
        text: "Finally found a brand that blends modern design with Indian aesthetics perfectly. My go-to for daily wear jewellery.",
        location: "Hyderabad"
    },
    {
        id: 5,
        name: "Roshni D.",
        rating: 5,
        text: "Excellent customer service. I had a query about sizing and they helped me out instantly. The bracelet is gorgeous.",
        location: "Pune"
    },
]

export function CustomerReviews() {
    return (
        <section className="py-16 md:py-24">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-12">Customer Love</h2>

                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    className="w-full max-w-6xl mx-auto"
                >
                    <CarouselContent className="-ml-4">
                        {REVIEWS.map((review) => (
                            <CarouselItem key={review.id} className="pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                                <div className="p-1">
                                    <Card className="border-none shadow-sm bg-secondary/20 h-full">
                                        <CardContent className="flex flex-col items-center text-center p-8 space-y-4 min-h-[300px]">
                                            <div className="flex gap-1">
                                                {[...Array(review.rating)].map((_, i) => (
                                                    <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                                                ))}
                                            </div>
                                            <p className="text-muted-foreground italic leading-relaxed flex-1 flex items-center justify-center">
                                                "{review.text}"
                                            </p>
                                            <div className="space-y-1">
                                                <h4 className="font-serif font-bold">{review.name}</h4>
                                                <p className="text-xs text-muted-foreground uppercase tracking-widest">{review.location}</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="hidden md:flex -left-12" />
                    <CarouselNext className="hidden md:flex -right-12" />
                </Carousel>
            </div>
        </section>
    )
}
