"use client"

import Image from "next/image"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import { useCartStore } from "@/lib/store/cart-store"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"

export function CartDrawer() {
    const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal } = useCartStore()

    return (
        <Sheet open={isOpen} onOpenChange={closeCart}>
            <SheetContent className="w-full sm:w-[400px] flex flex-col p-0">
                <SheetHeader className="px-4 py-4 border-b">
                    <SheetTitle className="font-serif text-xl flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5" />
                        Shopping Cart ({items.length})
                    </SheetTitle>
                </SheetHeader>

                {items.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
                        <div className="h-16 w-16 bg-secondary/50 rounded-full flex items-center justify-center">
                            <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div>
                            <h3 className="font-medium text-lg">Your cart is empty</h3>
                            <p className="text-muted-foreground text-sm">Looks like you haven't added anything yet.</p>
                        </div>
                        <Button onClick={closeCart} variant="outline" className="mt-4">
                            Continue Shopping
                        </Button>
                    </div>
                ) : (
                    <>
                        <ScrollArea className="flex-1 px-4">
                            <div className="space-y-4 py-4">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border bg-secondary">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex flex-1 flex-col justify-between">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-serif font-medium line-clamp-2 text-sm">{item.name}</h4>
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-muted-foreground hover:text-destructive transition-colors ml-2"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                            <p className="text-sm font-medium">₹{item.price.toLocaleString()}</p>

                                            <div className="flex items-center gap-3 mt-2">
                                                <div className="flex items-center border rounded-sm h-8">
                                                    <button
                                                        className="px-2 hover:bg-secondary h-full flex items-center justify-center"
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </button>
                                                    <span className="w-8 text-center text-xs font-medium">{item.quantity}</span>
                                                    <button
                                                        className="px-2 hover:bg-secondary h-full flex items-center justify-center"
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>

                        <div className="border-t p-4 space-y-4 bg-background">
                            <div className="space-y-1.5">
                                <div className="flex justify-between text-base">
                                    <span className="font-medium text-muted-foreground">Subtotal</span>
                                    <span className="font-bold">₹{subtotal().toLocaleString()}</span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Shipping and taxes calculated at checkout.
                                </p>
                            </div>
                            <Button className="w-full h-12 text-base bg-black text-white hover:bg-gold uppercase tracking-wider">
                                Checkout
                            </Button>
                        </div>
                    </>
                )}
            </SheetContent>
        </Sheet>
    )
}
