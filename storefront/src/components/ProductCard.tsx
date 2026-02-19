"use client";

import React from "react";
import Image from "next/image";
import { Heart, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
    name: string;
    price: string;
    originalPrice?: string;
    discount?: string;
    isNew?: boolean;
    image?: string;
}

const ProductCard = ({ name, price, originalPrice, discount, isNew, image }: ProductCardProps) => {
    return (
        <div className="group flex flex-col space-y-3">
            {/* Image Container */}
            <div className="relative aspect-[3/4] bg-[#F5F5F5] overflow-hidden">
                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-2 z-10">
                    {discount && (
                        <Badge className="bg-primary text-white border-none rounded-none px-2 py-0.5 text-[10px] uppercase font-bold">
                            {discount} OFF
                        </Badge>
                    )}
                    {isNew && (
                        <Badge className="bg-black text-white border-none rounded-none px-2 py-0.5 text-[10px] uppercase font-bold">
                            New
                        </Badge>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="absolute top-2 right-2 flex flex-col gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm hover:text-primary transition-colors">
                        <Heart className="w-4 h-4" />
                    </button>
                </div>

                {/* Product Image (Placeholder) */}
                <div className="w-full h-full flex items-center justify-center italic text-muted-foreground/50 text-xs">
                    {name}
                </div>

                {/* Quick Add Button */}
                <div className="absolute bottom-0 left-0 w-full translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white rounded-none py-6 text-[10px] tracking-[0.2em] uppercase font-bold">
                        Add to Cart
                    </Button>
                </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col space-y-1 text-center lg:text-left">
                <h3 className="text-xs font-bold tracking-widest uppercase text-foreground line-clamp-1">{name}</h3>
                <div className="flex items-center justify-center lg:justify-start space-x-2">
                    <span className="text-sm font-bold text-primary">{price}</span>
                    {originalPrice && (
                        <span className="text-xs text-muted-foreground line-through decoration-muted-foreground/50">{originalPrice}</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
