"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Heart, 
  Share2, 
  Truck, 
  ShieldCheck, 
  RefreshCcw, 
  ChevronRight,
  Minus,
  Plus,
  Check,

  Loader2,
  Star
} from "lucide-react";
import { Product, ProductVariant, formatPrice, getVariantPrice } from "@/lib/medusa";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnnouncementBar from "@/components/AnnouncementBar";
import Reviews from "@/components/Reviews";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility for tailwind class merging
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ProductDetailClientProps {
  product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { addItem, isLoading: cartLoading } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [mainImageError, setMainImageError] = useState(false);
  const [thumbnailErrors, setThumbnailErrors] = useState<Record<number, boolean>>({});
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    // Initialize with first value of each option
    const initial: Record<string, string> = {};
    if (product.options) {
      product.options.forEach((option) => {
        if (option.values && option.values.length > 0) {
          initial[option.id] = option.values[0].value;
        }
      });
    }
    return initial;
  });
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  // Find the matching variant based on selected options
  const selectedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) return null;
    return product.variants.find((variant) => {
      if (!variant.options) return false;
      return variant.options.every(
        (opt) => selectedOptions[opt.option_id] === opt.value
      );
    });
  }, [product.variants, selectedOptions]);

  // Calculate price
  const price = selectedVariant ? getVariantPrice(selectedVariant) : null;
  const originalPrice = selectedVariant?.original_price || null;
  const discount = originalPrice && price && originalPrice > price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : null;

  // Handle option selection
  const handleOptionSelect = (optionId: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [optionId]: value }));
  };

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!selectedVariant || isAdding) return;
    
    setIsAdding(true);
    try {
      await addItem(selectedVariant.id, quantity);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    } catch (error) {
      console.error("Failed to add to cart:", error);
      alert("Failed to add item to cart. Please try again.");
    } finally {
      setIsAdding(false);
    }
  };

  // Increment/decrement quantity
  const incrementQuantity = () => setQuantity((q) => Math.min(q + 1, 10));
  const decrementQuantity = () => setQuantity((q) => Math.max(q - 1, 1));



  return (
    <div className="min-h-screen bg-background font-sans">
      <AnnouncementBar />
      <Header />
      
      <main className="flex-grow">
        {/* Breadcrumb */}
        <div className="border-b border-border">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3" />
              {product.collection && (
                <>
                  <Link href={`/collections/${product.collection.handle}`} className="hover:text-primary transition-colors">
                    {product.collection.title}
                  </Link>
                  <ChevronRight className="w-3 h-3" />
                </>
              )}
              <span className="text-foreground font-medium truncate">{product.title}</span>
            </nav>
          </div>
        </div>

        {/* Product Section */}
        <section className="py-8 lg:py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Image Gallery */}
              <div className="space-y-4">
                {/* Main Image */}
                <div className="relative aspect-[4/5] bg-muted overflow-hidden">
                  {(product.thumbnail || product.images?.[selectedImage]?.url) && !mainImageError ? (
                    <Image
                      src={product.images?.[selectedImage]?.url || product.thumbnail || ""}
                      alt={product.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority
                      onError={() => setMainImageError(true)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                      <span className="text-muted-foreground text-center px-4">
                        {product.title}
                      </span>
                    </div>
                  )}
                  
                  {/* Discount Badge */}
                  {discount && (
                    <Badge className="absolute top-4 left-4 bg-primary text-white border-none rounded-none px-3 py-1 text-xs uppercase font-bold">
                      {discount}% OFF
                    </Badge>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <button 
                      onClick={() => setIsWishlisted(!isWishlisted)}
                      className={cn(
                        "w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md transition-all duration-300",
                        isWishlisted ? "text-red-500" : "text-foreground hover:text-primary"
                      )}
                    >
                      <Heart className={cn("w-5 h-5", isWishlisted && "fill-current")} />
                    </button>
                    <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md text-foreground hover:text-primary transition-colors">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Thumbnail Gallery */}
                {product.images && product.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {product.images.map((image, index) => (
                      <button
                        key={image.url}
                        onClick={() => {
                          setSelectedImage(index);
                          setMainImageError(false);
                        }}
                        className={cn(
                          "relative w-20 h-20 flex-shrink-0 overflow-hidden border-2 transition-colors",
                          selectedImage === index 
                            ? "border-primary" 
                            : "border-transparent hover:border-primary/50"
                        )}
                      >
                        {!thumbnailErrors[index] ? (
                          <Image
                            src={image.url}
                            alt={`${product.title} - ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="80px"
                            onError={() => setThumbnailErrors(prev => ({ ...prev, [index]: true }))}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-muted">
                            <span className="text-[10px] text-muted-foreground text-center px-1">
                              {index + 1}
                            </span>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="lg:pl-8 space-y-6">
                {/* Collection Tag */}
                {product.collection && (
                  <span className="text-primary text-[10px] font-bold tracking-[0.3em] uppercase">
                    {product.collection.title}
                  </span>
                )}

                {/* Title */}
                <h1 className="text-3xl lg:text-4xl font-serif text-foreground leading-tight">
                  {product.title}
                </h1>

                {/* Reviews Summary */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={cn(
                          "w-4 h-4",
                          star <= 4
                            ? "fill-amber-400 text-amber-400"
                            : "text-muted-foreground"
                        )}
                      />
                    ))}
                  </div>
                  <Link href="#reviews" className="text-sm text-muted-foreground hover:text-primary">
                    See reviews
                  </Link>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-primary">
                    {price ? formatPrice(price) : "Price unavailable"}
                  </span>
                  {originalPrice && originalPrice !== price && (
                    <span className="text-lg text-muted-foreground line-through">
                      {formatPrice(originalPrice)}
                    </span>
                  )}
                </div>

                <Separator />

                {/* Options */}
                {product.options && product.options.map((option) => (
                  <div key={option.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-foreground">
                        {option.title}
                      </label>
                      <span className="text-sm text-muted-foreground">
                        Selected: {selectedOptions[option.id]}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {option.values.map((value) => (
                        <button
                          key={value.id}
                          onClick={() => handleOptionSelect(option.id, value.value)}
                          className={cn(
                            "px-4 py-2 text-sm border-2 transition-all duration-200",
                            selectedOptions[option.id] === value.value
                              ? "border-primary bg-primary/5 text-primary font-medium"
                              : "border-border hover:border-primary/50 text-foreground"
                          )}
                        >
                          {value.value}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Quantity */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">Quantity</label>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-border">
                      <button
                        onClick={decrementQuantity}
                        disabled={quantity <= 1}
                        className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-50"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center font-medium">{quantity}</span>
                      <button
                        onClick={incrementQuantity}
                        disabled={quantity >= 10}
                        className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-50"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    {selectedVariant && selectedVariant.inventory_quantity < 10 && (
                      <span className="text-sm text-amber-600">
                        Only {selectedVariant.inventory_quantity} left
                      </span>
                    )}
                  </div>
                </div>

                {/* Add to Cart Button */}
                <div className="flex gap-3">
                  {product.variants && product.variants.length > 0 ? (
                    <Button
                      onClick={handleAddToCart}
                      disabled={!selectedVariant || isAdding || cartLoading || selectedVariant.inventory_quantity === 0}
                      className={cn(
                        "flex-1 rounded-none py-6 text-sm tracking-[0.2em] uppercase font-bold h-auto transition-colors",
                        isAdded 
                          ? "bg-green-600 hover:bg-green-600 text-white" 
                          : "bg-primary hover:bg-primary/90 text-white"
                      )}
                    >
                      {isAdding || cartLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Adding...
                        </>
                      ) : isAdded ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Added to Cart
                        </>
                      ) : selectedVariant?.inventory_quantity === 0 ? (
                        "Out of Stock"
                      ) : (
                        "Add to Cart"
                      )}
                    </Button>
                  ) : (
                    <div className="flex-1 py-6 text-center text-muted-foreground border border-border">
                      Product unavailable
                    </div>
                  )}
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-4 py-4">
                  <div className="flex flex-col items-center text-center gap-2">
                    <Truck className="w-6 h-6 text-primary" />
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Free Shipping</span>
                  </div>
                  <div className="flex flex-col items-center text-center gap-2">
                    <ShieldCheck className="w-6 h-6 text-primary" />
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Secure Payment</span>
                  </div>
                  <div className="flex flex-col items-center text-center gap-2">
                    <RefreshCcw className="w-6 h-6 text-primary" />
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Easy Returns</span>
                  </div>
                </div>

                <Separator />

                {/* Description */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold tracking-widest uppercase">Description</h3>
                  <div className={cn(
                    "text-muted-foreground text-sm leading-relaxed",
                    !showFullDescription && "line-clamp-4"
                  )}>
                    {product.description || "No description available."}
                  </div>
                  {product.description && product.description.length > 200 && (
                    <button
                      onClick={() => setShowFullDescription(!showFullDescription)}
                      className="text-primary text-xs font-bold uppercase tracking-wider hover:underline"
                    >
                      {showFullDescription ? "Show Less" : "Read More"}
                    </button>
                  )}
                </div>

                {/* Product Details */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold tracking-widest uppercase">Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {selectedVariant?.sku && (
                      <div>
                        <span className="text-muted-foreground">SKU:</span>
                        <span className="ml-2">{selectedVariant.sku}</span>
                      </div>
                    )}
                    {selectedVariant?.material && (
                      <div>
                        <span className="text-muted-foreground">Material:</span>
                        <span className="ml-2 capitalize">{selectedVariant.material}</span>
                      </div>
                    )}
                    {selectedVariant?.weight && (
                      <div>
                        <span className="text-muted-foreground">Weight:</span>
                        <span className="ml-2">{selectedVariant.weight}g</span>
                      </div>
                    )}
                    {product.tags && product.tags.length > 0 && (
                      <div className="col-span-2">
                        <span className="text-muted-foreground">Tags:</span>
                        <span className="ml-2">{product.tags.map(t => t.value).join(", ")}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <Reviews productName={product.title} productHandle={product.handle} />
      </main>

      <Footer />
    </div>
  );
}
