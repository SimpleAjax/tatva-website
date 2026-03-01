"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Check, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Product, formatPrice, getVariantPrice, addToWishlist, removeFromWishlist, getWishlist } from "@/lib/medusa";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";

import type { HTMLAttributes } from "react";

// Props for Medusa product
interface MedusaProductCardProps extends HTMLAttributes<HTMLDivElement> {
  product: Product;
  className?: string;
}

// Props for legacy/mock product data
interface LegacyProductCardProps extends HTMLAttributes<HTMLDivElement> {
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
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // Handle Medusa product
  if (isMedusaProduct(props)) {
    const { product, className, ...rest } = props;
    const [imageError, setImageError] = useState(false);

    // Check wishlist status on mount
    useEffect(() => {
      const checkWishlist = async () => {
        try {
          const wishlist = await getWishlist();
          setIsWishlisted(wishlist.includes(product.id));
        } catch {
          // Not logged in or error, keep as false
        }
      };
      checkWishlist();
    }, [product.id]);

    // Handle wishlist toggle
    const handleWishlistToggle = async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (wishlistLoading) return;
      
      setWishlistLoading(true);
      try {
        if (isWishlisted) {
          await removeFromWishlist(product.id);
          setIsWishlisted(false);
        } else {
          await addToWishlist(product.id);
          setIsWishlisted(true);
        }
      } catch (err) {
        // If not logged in, redirect to login
        window.location.href = "/account/login";
      } finally {
        setWishlistLoading(false);
      }
    };
    
    // Check if product has variants
    if (!product.variants || product.variants.length === 0) {
      return (
        <div className={cn("group flex flex-col space-y-3 opacity-50", className)}>
          <div className="relative aspect-[3/4] bg-background-cream overflow-hidden">
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
    const originalPrice = cheapestVariant?.calculated_price?.original_amount || null;
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
      <div className={cn("group flex flex-col", className)} {...rest}>
        {/* Image Container */}
        <Link href={productUrl} className="relative aspect-[3/4] bg-background-cream overflow-hidden block">
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
            {discount && (
              <Badge className="bg-primary text-white border-none rounded-none px-2 py-1 text-[10px] uppercase font-bold shadow-sm">
                {discount}% Off
              </Badge>
            )}
            {product.tags?.some(tag => tag.value.toLowerCase() === "new") && (
              <Badge className="bg-foreground text-white border-none rounded-none px-2 py-1 text-[10px] uppercase font-bold shadow-sm">
                New
              </Badge>
            )}
          </div>

          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 z-10 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
            <button 
              onClick={handleWishlistToggle}
              disabled={wishlistLoading}
              className={cn(
                "w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-md transition-all duration-200",
                "hover:scale-110 active:scale-95 disabled:opacity-50",
                isWishlisted ? "text-red-500" : "text-foreground hover:text-primary"
              )}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              {wishlistLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Heart className={cn("w-4 h-4", isWishlisted && "fill-current")} />
              )}
            </button>
          </div>

          {/* Product Image */}
          {product.thumbnail && !imageError ? (
            <Image
              src={product.thumbnail}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <span className="text-xs text-muted-foreground text-center px-4">
                {product.title}
              </span>
            </div>
          )}

          {/* Quick Add Button */}
          <div 
            className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"
            onClick={(e) => e.preventDefault()}
          >
            <Button 
              onClick={handleAddToCart}
              disabled={isAdding || cartLoading || !cheapestVariant}
              className={cn(
                "w-full rounded-none py-6 text-[11px] tracking-[0.15em] uppercase font-bold transition-colors",
                isAdded 
                  ? "bg-green-600 hover:bg-green-600 text-white" 
                  : "bg-primary hover:bg-primary-dark text-white"
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
        <Link href={productUrl} className="flex flex-col space-y-1.5 pt-4">
          {product.collection && (
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
              {product.collection.title}
            </span>
          )}
          <h3 className="text-xs font-semibold tracking-wide uppercase text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {product.title}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-primary">
              {price ? formatPrice(price) : "Price unavailable"}
            </span>
            {originalPrice && originalPrice !== price && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>
        </Link>
      </div>
    );
  }

  // Handle legacy/mock product
  const { name, price, originalPrice, discount, isNew, image, handle, className, ...rest } = props as LegacyProductCardProps;
  const [legacyImageError, setLegacyImageError] = useState(false);
  
  // Generate product URL from handle or name
  const productUrl = handle 
    ? `/product/${handle}` 
    : `/product/${name.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className={cn("group flex flex-col", className)} {...rest}>
      <Link href={productUrl} className="relative aspect-[3/4] bg-background-cream overflow-hidden block">
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          {discount && (
            <Badge className="bg-primary text-white border-none rounded-none px-2 py-1 text-[10px] uppercase font-bold shadow-sm">
              {discount} Off
            </Badge>
          )}
          {isNew && (
            <Badge className="bg-foreground text-white border-none rounded-none px-2 py-1 text-[10px] uppercase font-bold shadow-sm">
              New
            </Badge>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-md text-foreground hover:text-primary transition-all duration-200 hover:scale-110"
            aria-label="Add to wishlist"
          >
            <Heart className="w-4 h-4" />
          </button>
        </div>

        {/* Product Image (Placeholder or actual) */}
        {image && !legacyImageError ? (
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            onError={() => setLegacyImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <span className="text-xs text-muted-foreground text-center px-4">
              {name}
            </span>
          </div>
        )}

        {/* Quick Add Button */}
        <div 
          className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"
          onClick={(e) => e.preventDefault()}
        >
          <Button className="w-full rounded-none py-6 text-[11px] tracking-[0.15em] uppercase font-bold bg-primary hover:bg-primary-dark text-white">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Quick Add
          </Button>
        </div>
      </Link>

      {/* Product Info */}
      <Link href={productUrl} className="flex flex-col space-y-1.5 pt-4">
        <h3 className="text-xs font-semibold tracking-wide uppercase text-foreground line-clamp-1 group-hover:text-primary transition-colors">
          {name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-primary">{price}</span>
          {originalPrice && (
            <span className="text-xs text-muted-foreground line-through">
              {originalPrice}
            </span>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
