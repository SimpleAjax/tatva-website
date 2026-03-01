"use client";

import React from "react";
import { Truck, RotateCcw, ShieldCheck, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const features: Feature[] = [
  { 
    icon: <Truck className="w-5 h-5" />, 
    title: "Free Shipping",
    description: "On orders above ₹999"
  },
  { 
    icon: <RotateCcw className="w-5 h-5" />, 
    title: "Easy Returns",
    description: "15-day hassle free"
  },
  { 
    icon: <ShieldCheck className="w-5 h-5" />, 
    title: "Secure Checkout",
    description: "100% protected"
  },
  { 
    icon: <CreditCard className="w-5 h-5" />, 
    title: "COD Available",
    description: "Pay on delivery"
  },
];

const InfoBar = () => {
  return (
    <section className="w-full bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-0 py-5 lg:py-6">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={cn(
                "flex flex-col sm:flex-row items-center justify-center gap-3 lg:gap-4 text-center sm:text-left",
                "group cursor-default px-4",
                index < features.length - 1 && "lg:border-r lg:border-white/20"
              )}
            >
              {/* Icon Container */}
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center
                            group-hover:bg-white/20 transition-colors duration-300">
                <div className="text-white/90 group-hover:text-white transition-colors">
                  {feature.icon}
                </div>
              </div>
              
              {/* Text Content */}
              <div className="flex flex-col items-center sm:items-start">
                <span className="text-xs lg:text-sm font-semibold text-white tracking-wide">
                  {feature.title}
                </span>
                <span className="text-[10px] lg:text-xs text-white/70 mt-0.5">
                  {feature.description}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InfoBar;
