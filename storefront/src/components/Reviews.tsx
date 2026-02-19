"use client";

import React from "react";
import { Star, Quote } from "lucide-react";

const reviews = [
    {
        name: "Ananya R.",
        rating: 5,
        text: "The quality of the jewelry is exceptional. I bought the Golden Aura Bracelet and it looks even better in person than in the photos! Highly recommend.",
        product: "Golden Aura Bracelet",
        date: "Feb 12, 2026"
    },
    {
        name: "Priya S.",
        rating: 5,
        text: "Tatva never disappoints. The packaging was beautiful and the delivery was so fast. The Celestial Star Earrings are my new favorites.",
        product: "Celestial Star Earrings",
        date: "Feb 10, 2026"
    },
    {
        name: "Meera K.",
        rating: 4,
        text: "Elegant and affordable. I wear the Infinity Love Ring every day and it still looks brand new. Amazing craftsmanship.",
        product: "Infinity Love Ring",
        date: "Feb 05, 2026"
    },
];

const Reviews = () => {
    return (
        <section className="py-24 bg-[#FEF9F9] overflow-hidden relative">
            {/* Decorative Quote Icon Background */}
            <Quote className="absolute top-12 left-12 w-32 h-32 text-primary/5 -rotate-12" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16 space-y-4">
                    <span className="text-primary text-[10px] lg:text-[11px] font-bold tracking-[0.4em] uppercase">Testimonials</span>
                    <h2 className="text-4xl lg:text-5xl font-serif text-primary italic">What the Tribe Says</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {reviews.map((rev, i) => (
                        <div key={i} className="bg-white p-8 lg:p-10 shadow-sm border border-border flex flex-col space-y-6 hover:shadow-md transition-shadow">
                            <div className="flex space-x-1">
                                {[...Array(5)].map((_, idx) => (
                                    <Star
                                        key={idx}
                                        className={`w-4 h-4 ${idx < rev.rating ? "text-primary fill-primary" : "text-zinc-200"}`}
                                    />
                                ))}
                            </div>
                            <p className="text-zinc-600 leading-relaxed italic text-lg">"{rev.text}"</p>
                            <div className="pt-4 border-t border-border flex justify-between items-center">
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-foreground">{rev.name}</span>
                                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest">{rev.date}</span>
                                </div>
                                <div className="text-[10px] font-bold text-primary uppercase tracking-widest hidden lg:block">
                                    Verified Buyer
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <button className="bg-white border border-primary text-primary hover:bg-primary hover:text-white transition-all px-10 py-3 tracking-widest uppercase font-bold text-xs">
                        Write a Review
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Reviews;
