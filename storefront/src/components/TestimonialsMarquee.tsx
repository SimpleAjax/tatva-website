"use client";

import React from "react";
import { Star, Quote } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  location: string;
  text: string;
  rating: number;
  avatar?: string;
  product?: string;
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Priya Sharma",
    location: "Mumbai",
    text: "Absolutely in love with my Kundan set! The craftsmanship is exquisite and it arrived beautifully packaged. Perfect for my sister's wedding!",
    rating: 5,
    product: "Bridal Kundan Set",
  },
  {
    id: "2",
    name: "Ananya Patel",
    location: "Delhi",
    text: "The Golden Aura Bracelet is stunning! I wear it every day and get so many compliments. The quality exceeded my expectations.",
    rating: 5,
    product: "Golden Aura Bracelet",
  },
  {
    id: "3",
    name: "Meera Reddy",
    location: "Bangalore",
    text: "TATVA has become my go-to for all jewelry gifts. The Celestial Star Earrings were a hit with my best friend. Fast delivery too!",
    rating: 5,
    product: "Celestial Star Earrings",
  },
  {
    id: "4",
    name: "Kavita Gupta",
    location: "Pune",
    text: "The pearl necklace is elegant and timeless. I've worn it to three weddings already and it goes with everything. Highly recommend!",
    rating: 5,
    product: "Elegance Pearl Necklace",
  },
  {
    id: "5",
    name: "Radhika Iyer",
    location: "Chennai",
    text: "Bought the Infinity Love Ring for my anniversary. My wife hasn't taken it off since! Beautiful packaging and lovely handwritten note.",
    rating: 5,
    product: "Infinity Love Ring",
  },
  {
    id: "6",
    name: "Sneha Malhotra",
    location: "Hyderabad",
    text: "The traditional jhumkas are gorgeous! Perfect for festive occasions. The attention to detail is remarkable. Will definitely order again!",
    rating: 5,
    product: "Traditional Jhumka",
  },
  {
    id: "7",
    name: "Divya Krishnan",
    location: "Kochi",
    text: "I was skeptical about buying jewelry online, but TATVA proved me wrong. The diamond studs sparkle beautifully and the fit is perfect.",
    rating: 5,
    product: "Diamond Stud Earrings",
  },
  {
    id: "8",
    name: "Nisha Aggarwal",
    location: "Jaipur",
    text: "The cocktail ring is a statement piece! Wore it to a party and everyone asked where I got it. TATVA is now my secret!",
    rating: 5,
    product: "Cocktail Statement Ring",
  },
];

// Duplicate testimonials for seamless infinite scroll
const duplicatedTestimonials = [...testimonials, ...testimonials];

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="flex-shrink-0 w-[400px] bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-rose-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Quote Icon */}
      <Quote className="w-8 h-8 text-rose-200 mb-4" />
      
      {/* Stars */}
      <div className="flex gap-1 mb-3">
        {[...Array(5)].map((_, idx) => (
          <Star
            key={idx}
            className={`w-4 h-4 ${
              idx < testimonial.rating
                ? "text-amber-400 fill-amber-400"
                : "text-zinc-200"
            }`}
          />
        ))}
      </div>
      
      {/* Review Text */}
      <p className="text-zinc-700 leading-relaxed mb-4 line-clamp-4">
        &ldquo;{testimonial.text}&rdquo;
      </p>
      
      {/* Product Tag */}
      {testimonial.product && (
        <span className="inline-block px-3 py-1 bg-rose-50 text-rose-600 text-xs font-medium rounded-full mb-4">
          {testimonial.product}
        </span>
      )}
      
      {/* Author */}
      <div className="flex items-center gap-3 pt-4 border-t border-zinc-100">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center text-white font-bold text-sm">
          {testimonial.name.charAt(0)}
        </div>
        <div>
          <p className="font-semibold text-zinc-900 text-sm">{testimonial.name}</p>
          <p className="text-zinc-500 text-xs">{testimonial.location}</p>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsMarquee() {
  return (
    <section className="py-20 bg-gradient-to-b from-rose-50/50 via-white to-rose-50/30 overflow-hidden">
      <div className="container mx-auto px-4 mb-12">
        <div className="text-center space-y-4">
          <span className="text-primary text-[10px] lg:text-[11px] font-bold tracking-[0.4em] uppercase">
            Testimonials
          </span>
          <h2 className="text-4xl lg:text-5xl font-serif text-primary italic">
            What the Tribe Says
          </h2>
          <p className="text-zinc-500 max-w-xl mx-auto">
            Real stories from our beloved customers who became part of the TATVA family
          </p>
        </div>
      </div>

      {/* First Row - Left to Right */}
      <div className="relative mb-6">
        {/* Gradient Overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-rose-50/50 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-rose-50/50 to-transparent z-10 pointer-events-none" />
        
        <div className="flex gap-6 animate-marquee-left">
          {duplicatedTestimonials.map((testimonial, idx) => (
            <TestimonialCard key={`left-${testimonial.id}-${idx}`} testimonial={testimonial} />
          ))}
        </div>
      </div>

      {/* Second Row - Right to Left */}
      <div className="relative">
        {/* Gradient Overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-rose-50/50 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-rose-50/50 to-transparent z-10 pointer-events-none" />
        
        <div className="flex gap-6 animate-marquee-right">
          {[...duplicatedTestimonials].reverse().map((testimonial, idx) => (
            <TestimonialCard key={`right-${testimonial.id}-${idx}`} testimonial={testimonial} />
          ))}
        </div>
      </div>

      {/* Trust Badges */}
      <div className="container mx-auto px-4 mt-16">
        <div className="flex flex-wrap justify-center items-center gap-8 text-zinc-400">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            <span className="text-sm font-medium">4.9/5 Rating</span>
          </div>
          <div className="w-px h-4 bg-zinc-300 hidden sm:block" />
          <div className="text-sm font-medium">10,000+ Happy Customers</div>
          <div className="w-px h-4 bg-zinc-300 hidden sm:block" />
          <div className="text-sm font-medium">Pan India Delivery</div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        @keyframes marquee-right {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }
        
        .animate-marquee-left {
          animation: marquee-left 40s linear infinite;
        }
        
        .animate-marquee-right {
          animation: marquee-right 40s linear infinite;
        }
        
        .animate-marquee-left:hover,
        .animate-marquee-right:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
