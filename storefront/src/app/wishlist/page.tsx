"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getWishlist, removeFromWishlist, getProductById, Product, formatPrice } from "@/lib/medusa";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Trash2, ShoppingBag, Loader2, ChevronLeft, X } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function WishlistPage() {
  const router = useRouter();
  const { addItem } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);
  const [adding, setAdding] = useState<string | null>(null);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      const wishlistIds = await getWishlist();
      
      if (wishlistIds.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      // Fetch product details for each wishlist item
      const productPromises = wishlistIds.map(async (id: string) => {
        try {
          const { product } = await getProductById(id);
          return product;
        } catch {
          return null;
        }
      });

      const fetchedProducts = await Promise.all(productPromises);
      setProducts(fetchedProducts.filter(Boolean) as Product[]);
    } catch (err: any) {
      // If not logged in, show empty wishlist with message to login
      if (err.message?.includes("401") || err.message?.includes("Unauthorized")) {
        setProducts([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId: string) => {
    setRemoving(productId);
    try {
      await removeFromWishlist(productId);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch (err) {
      console.error("Failed to remove from wishlist:", err);
    } finally {
      setRemoving(null);
    }
  };

  const handleAddToCart = async (product: Product) => {
    // Find the cheapest variant
    const defaultVariant = product.variants?.[0];
    if (!defaultVariant) return;

    setAdding(product.id);
    try {
      await addItem(defaultVariant.id, 1);
      // Optionally remove from wishlist after adding to cart
      // await handleRemove(product.id);
    } catch (err) {
      console.error("Failed to add to cart:", err);
    } finally {
      setAdding(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Simple Header */}
      <header className="bg-white border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-serif italic text-primary">TATVA</Link>
          <Link href="/account" className="text-sm text-muted-foreground hover:text-primary">
            My Account
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">/</span>
          <span>My Wishlist</span>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/account">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-3xl font-serif italic text-primary">My Wishlist</h1>
            {products.length > 0 && (
              <span className="text-sm text-muted-foreground">({products.length} items)</span>
            )}
          </div>

          {products.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                  <Heart className="w-8 h-8 text-muted-foreground" />
                </div>
                <h2 className="text-lg font-medium mb-2">Your wishlist is empty</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Save items you love to your wishlist and they&apos;ll appear here.
                </p>
                <Link href="/">
                  <Button className="bg-primary hover:bg-primary/90">
                    Continue Shopping
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {products.map((product) => (
                <Card key={product.id} className="overflow-hidden group">
                  <CardContent className="p-0">
                    <div className="flex">
                      {/* Product Image */}
                      <Link 
                        href={`/product/${product.handle}`}
                        className="w-32 h-32 bg-muted flex-shrink-0"
                      >
                        {product.thumbnail ? (
                          <img
                            src={product.thumbnail}
                            alt={product.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Heart className="w-8 h-8 text-muted-foreground" />
                          </div>
                        )}
                      </Link>

                      {/* Product Details */}
                      <div className="flex-1 p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <Link href={`/product/${product.handle}`}>
                              <h3 className="font-medium text-sm hover:text-primary transition-colors line-clamp-2">
                                {product.title}
                              </h3>
                            </Link>
                            <p className="text-xs text-muted-foreground mt-1 capitalize">
                              {product.categories?.[0]?.name}
                            </p>
                          </div>
                          <button
                            onClick={() => handleRemove(product.id)}
                            disabled={removing === product.id}
                            className="p-1 text-muted-foreground hover:text-red-500 transition-colors"
                          >
                            {removing === product.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <X className="w-4 h-4" />
                            )}
                          </button>
                        </div>

                        {/* Price */}
                        <div className="mt-3">
                          {product.variants?.[0]?.prices?.[0] ? (
                            <p className="font-medium">
                              {formatPrice(
                                product.variants[0].prices[0].amount,
                                product.variants[0].prices[0].currency_code
                              )}
                            </p>
                          ) : (
                            <p className="text-sm text-muted-foreground">Price unavailable</p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="mt-4 flex gap-2">
                          <Button
                            size="sm"
                            className="flex-1 bg-primary hover:bg-primary/90"
                            onClick={() => handleAddToCart(product)}
                            disabled={adding === product.id}
                          >
                            {adding === product.id ? (
                              <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            ) : (
                              <ShoppingBag className="w-4 h-4 mr-2" />
                            )}
                            Add to Cart
                          </Button>
                          <Link href={`/product/${product.handle}`}>
                            <Button size="sm" variant="outline">
                              View
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Continue Shopping */}
          {products.length > 0 && (
            <div className="mt-8 text-center">
              <Link href="/">
                <Button variant="outline">Continue Shopping</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
