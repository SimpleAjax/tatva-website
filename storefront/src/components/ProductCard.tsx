"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Check, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Product, formatPrice, getVariantPrice } from "@/lib/medusa";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";

// Props for Medusa product
interface MedusaProductCardProps {
  product: Product;
  className?: string;
}

// Props for legacy/mock product data
interface LegacyProductCardProps {
  name: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  isNew?: boolean;
  image?: string;
  handle?: string;
}

type ProductCardProps = MedusaProductCardProps | LegacyProductCardProps;

// Type guard to check if it's a Medusa product
function isMedusaProduct(props: ProductCardProps): props is MedusaProductCardProps {
  return "product" in props;
}

const ProductCard = (props: ProductCardProps) => {
  const { addItem, isLoading: cartLoading } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Handle Medusa product
  if (isMedusaProduct(props)) {
    const { product, className } = props;
    
    // Check if product has variants
    if (!product.variants || product.variants.length === 0) {
      return (
        <div className={cn("group flex flex-col space-y-3 opacity-50", className)}>
          <div className="relative aspect-[3/4] bg-[#F5F5F5] overflow-hidden">
            <div className="w-full h-full flex items-center justify-center italic text-muted-foreground/50 text-xs">
              No variants
            </div>
          </div>
          <div className="flex flex-col space-y-1 text-center lg:text-left">
            <h3 className="text-xs font-bold tracking-widest uppercase text-foreground line-clamp-1">
              {product.title}
            </h3>
            <span className="text-sm text-muted-foreground">Unavailable</span>
          </div>
        </div>
      );
    }
    
    // Get the cheapest variant price
    const cheapestVariant = product.variants.reduce((cheapest, variant) => {
      const price = getVariantPrice(variant);
      const cheapestPrice = getVariantPrice(cheapest);
      if (price && (!cheapestPrice || price < cheapestPrice)) {
        return variant;
      }
      return cheapest;
    }, product.variants[0]);

    const price = cheapestVariant ? getVariantPrice(cheapestVariant) : null;
    const originalPrice = cheapestVariant?.original_price || null;
    const discount = originalPrice && price && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : null;

    // Generate product URL
    const productUrl = `/product/${product.handle}`;

    // Handle add to cart
    const handleAddToCart = async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (!cheapestVariant || isAdding || cartLoading) return;
      
      setIsAdding(true);
      try {
        await addItem(cheapestVariant.id, 1);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
      } catch (error) {
        console.error("Failed to add to cart:", error);
      } finally {
        setIsAdding(false);
      }
    };

    return (
      <div className={cn("group flex flex-col space-y-3", className)}>
        {/* Image Container */}
        <Link href={productUrl} className="relative aspect-[3/4] bg-[#F5F5F5] overflow-hidden block">
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-2 z-10">
            {discount && (
              <Badge className="bg-primary text-white border-none rounded-none px-2 py-0.5 text-[10px] uppercase font-bold">
                {discount}% OFF
              </Badge>
            )}
            {product.tags?.some(tag => tag.value.toLowerCase() === "new") && (
              <Badge className="bg-black text-white border-none rounded-none px-2 py-0.5 text-[10px] uppercase font-bold">
                New
              </Badge>
            )}
          </div>

          {/* Action Buttons */}
          <div className="absolute top-2 right-2 flex flex-col gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsWishlisted(!isWishlisted);
              }}
              className={cn(
                "w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm transition-colors",
                isWishlisted ? "text-red-500" : "text-foreground hover:text-primary"
              )}
            >
              <Heart className={cn("w-4 h-4", isWishlisted && "fill-current")} />
            </button>
          </div>

          {/* Product Image */}
          {product.thumbnail ? (
            <Image
              src={product.thumbnail}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center italic text-muted-foreground/50 text-xs">
              {product.title}
            </div>
          )}

          {/* Quick Add Button */}
          <div 
            className="absolute bottom-0 left-0 w-full translate-y-full group-hover:translate-y-0 transition-transform duration-300"
            onClick={(e) => e.preventDefault()}
          >
            <Button 
              onClick={handleAddToCart}
              disabled={isAdding || cartLoading || !cheapestVariant}
              className={cn(
                "w-full rounded-none py-6 text-[10px] tracking-[0.2em] uppercase font-bold transition-colors",
                isAdded 
                  ? "bg-green-600 hover:bg-green-600 text-white" 
                  : "bg-primary hover:bg-primary/90 text-white"
              )}
            >
              {isAdding ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : isAdded ? (
                <Check className="w-4 h-4 mr-2" />
              ) : (
                <ShoppingCart className="w-4 h-4 mr-2" />
              )}
              {isAdding ? "Adding..." : isAdded ? "Added" : "Quick Add"}
            </Button>
          </div>
        </Link>

        {/* Product Info */}
        <Link href={productUrl} className="flex flex-col space-y-1 text-center lg:text-left">
          {product.collection && (
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              {product.collection.title}
            </span>
          )}
          <h3 className="text-xs font-bold tracking-widest uppercase text-foreground line-clamp-1">
            {product.title}
          </h3>
          <div className="flex items-center justify-center lg:justify-start space-x-2">
            <span className="text-sm font-bold text-primary">
              {price ? formatPrice(price) : "Price unavailable"}
            </span>
            {originalPrice && originalPrice !== price && (
              <span className="text-xs text-muted-foreground line-through decoration-muted-foreground/50">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>
        </Link>
      </div>
    );
  }

  // Handle legacy/mock product
  const { name, price, originalPrice, discount, isNew, image, handle } = props as LegacyProductCardProps;
  
  // Generate product URL from handle or name
  const productUrl = handle 
    ? `/product/${handle}` 
    : `/product/${name.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className="group flex flex-col space-y-3">
      <Link href={productUrl} className="relative aspect-[3/4] bg-[#F5F5F5] overflow-hidden block">
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
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm hover:text-primary transition-colors"
          >
            <Heart className="w-4 h-4" />
          </button>
        </div>

        {/* Product Image (Placeholder or actual) */}
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center italic text-muted-foreground/50 text-xs">
            {name}
          </div>
        )}

        {/* Quick Add Button */}
        <div 
          className="absolute bottom-0 left-0 w-full translate-y-full group-hover:translate-y-0 transition-transform duration-300"
          onClick={(e) => e.preventDefault()}
        >
          <Button className="w-full bg-primary hover:bg-primary/90 text-white rounded-none py-6 text-[10px] tracking-[0.2em] uppercase font-bold">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Quick Add
          </Button>
        </div>
      </Link>

      {/* Product Info */}
      <Link href={productUrl} className="flex flex-col space-y-1 text-center lg:text-left">
        <h3 className="text-xs font-bold tracking-widest uppercase text-foreground line-clamp-1">{name}</h3>
        <div className="flex items-center justify-center lg:justify-start space-x-2">
          <span className="text-sm font-bold text-primary">{price}</span>
          {originalPrice && (
            <span className="text-xs text-muted-foreground line-through decoration-muted-foreground/50">
              {originalPrice}
            </span>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
