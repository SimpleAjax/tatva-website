"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Plus, Minus, ShoppingBag, ArrowRight, Truck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/medusa";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    closeCart,
    itemCount,
    updateItem,
    removeItem,
    isLoading,
  } = useCart();

  return (
    <Sheet open={isCartOpen} onOpenChange={closeCart}>
      <SheetContent className="flex flex-col w-full sm:max-w-lg bg-background">
        <SheetHeader className="space-y-2.5 pb-4">
          <SheetTitle className="flex items-center gap-2 text-lg font-serif">
            <ShoppingBag className="w-5 h-5 text-primary" />
            Your Cart
            {itemCount > 0 && (
              <span className="text-sm font-sans font-normal text-muted-foreground">
                ({itemCount} {itemCount === 1 ? "item" : "items"})
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {!cart?.items || cart.items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-4 text-center">
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
              <ShoppingBag className="w-10 h-10 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Your cart is empty</h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                Looks like you haven&apos;t added anything to your cart yet.
              </p>
            </div>
            <Button
              onClick={closeCart}
              className="bg-primary hover:bg-primary/90 text-white rounded-none px-8"
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-6">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    {/* Product Image */}
                    <div className="relative w-20 h-24 bg-muted flex-shrink-0 overflow-hidden">
                      {item.thumbnail ? (
                        <Image
                          src={item.thumbnail}
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                          No Image
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <h4 className="text-sm font-medium leading-tight line-clamp-2">
                        {item.title}
                      </h4>
                      {item.variant?.title && item.variant.title !== "Default variant" && (
                        <p className="text-xs text-muted-foreground">
                          {item.variant.title}
                        </p>
                      )}
                      <p className="text-sm font-semibold text-primary">
                        {formatPrice(item.unit_price)}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 pt-2">
                        <div className="flex items-center border border-border">
                          <button
                            onClick={() => updateItem(item.id, item.quantity - 1)}
                            disabled={isLoading || item.quantity <= 1}
                            className="w-7 h-7 flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-50"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <button
                            onClick={() => updateItem(item.id, item.quantity + 1)}
                            disabled={isLoading || item.quantity >= 10}
                            className="w-7 h-7 flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-50"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          disabled={isLoading}
                          className="text-xs text-muted-foreground hover:text-destructive transition-colors underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    {/* Item Total */}
                    <div className="text-right">
                      <p className="text-sm font-semibold">
                        {formatPrice(item.subtotal)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <SheetFooter className="flex-col space-y-4 pt-4 border-t">
              {/* Free Shipping Progress */}
              {cart.subtotal < 500000 && (
                <div className="bg-muted p-3 text-center">
                  <p className="text-xs text-muted-foreground">
                    Add {formatPrice(500000 - cart.subtotal)} more for free shipping
                  </p>
                  <div className="mt-2 h-1 bg-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${Math.min((cart.subtotal / 500000) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}
              {cart.subtotal >= 500000 && (
                <div className="bg-primary/10 p-3 text-center flex items-center justify-center gap-2">
                  <Truck className="w-4 h-4 text-primary" />
                  <span className="text-xs text-primary font-medium">
                    You qualify for free shipping!
                  </span>
                </div>
              )}

              {/* Cart Summary */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{formatPrice(cart.subtotal)}</span>
                </div>
                {cart.discount_total > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatPrice(cart.discount_total)}</span>
                  </div>
                )}
                {cart.shipping_total > 0 && (
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span>{formatPrice(cart.shipping_total)}</span>
                  </div>
                )}
                {cart.tax_total > 0 && (
                  <div className="flex justify-between text-muted-foreground">
                    <span>Tax</span>
                    <span>{formatPrice(cart.tax_total)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-base font-semibold">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(cart.total)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <Link href="/checkout" onClick={closeCart} className="block">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white rounded-none py-6 text-sm tracking-[0.15em] uppercase font-bold h-auto">
                    Proceed to Checkout
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={closeCart}
                  className="w-full rounded-none py-6 text-sm tracking-[0.15em] uppercase font-bold h-auto border-2"
                >
                  Continue Shopping
                </Button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
