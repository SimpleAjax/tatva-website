"use client"

import * as React from "react"
import { Heart, Minus, Plus, Share2, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { useCartStore } from "@/lib/store/cart-store"

export function ProductInfo() {
    const [quantity, setQuantity] = React.useState(1)
    const { addItem } = useCartStore()

    const handleAddToCart = () => {
        addItem({
            id: 1, // This would be dynamic in a real app
            name: "Eternal Gold Ring",
            price: 12499,
            image: "https://images.unsplash.com/photo-1596944924616-00f3f204fa6f?q=80&w=800&auto=format&fit=crop",
            quantity: quantity
        })
    }

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-serif font-bold">Eternal Gold Ring</h1>
                <div className="flex items-center gap-4">
                    <p className="text-2xl font-sans font-medium">₹12,499</p>
                    <p className="text-muted-foreground line-through">₹15,999</p>
                    <span className="text-xs font-bold bg-destructive/10 text-destructive px-2 py-1 rounded">20% OFF</span>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 text-sm">
                    {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-muted-foreground ml-2">(45 reviews)</span>
                </div>
            </div>

            <Separator />

            <p className="text-muted-foreground leading-relaxed">
                Handcrafted with precision, this 22k gold ring features a timeless design that complements both modern and traditional attire. A perfect symbol of elegance and grace.
            </p>

            {/* Actions */}
            <div className="space-y-4 pt-4">

                {/* Quantity */}
                <div className="flex items-center gap-4">
                    <span className="font-medium text-sm">Quantity</span>
                    <div className="flex items-center border rounded-md">
                        <button
                            className="p-2 hover:bg-secondary transition-colors"
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        >
                            <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-10 text-center font-medium">{quantity}</span>
                        <button
                            className="p-2 hover:bg-secondary transition-colors"
                            onClick={() => setQuantity(quantity + 1)}
                        >
                            <Plus className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-4">
                    <Button
                        size="lg"
                        className="flex-1 bg-black text-white hover:bg-gold uppercase tracking-widest h-12"
                        onClick={handleAddToCart}
                    >
                        Add to Cart
                    </Button>
                    <Button size="icon" variant="outline" className="h-12 w-12">
                        <Heart className="h-5 w-5" />
                    </Button>
                    <Button size="icon" variant="outline" className="h-12 w-12">
                        <Share2 className="h-5 w-5" />
                    </Button>
                </div>

                <div className="text-xs text-center text-muted-foreground">
                    Free shipping on orders above ₹2000 | 30-Day Returns
                </div>
            </div>

            <Separator />

            {/* Accordions */}
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="description">
                    <AccordionTrigger className="font-serif">Description</AccordionTrigger>
                    <AccordionContent>
                        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                            <li>Material: 22k Gold Plated Brass</li>
                            <li>Stone: Cubic Zirconia</li>
                            <li>Weight: 12g</li>
                            <li>Nickel-free and Hypoallergenic</li>
                        </ul>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="shipping">
                    <AccordionTrigger className="font-serif">Shipping & Returns</AccordionTrigger>
                    <AccordionContent>
                        We usually ship orders within 24-48 hours. Returns are accepted within 30 days of delivery for unworn items in original packaging.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="care">
                    <AccordionTrigger className="font-serif">Care Instructions</AccordionTrigger>
                    <AccordionContent>
                        Keep away from perfumes, sprays, and water. Store in a zip-lock bag when not in use to prevent tarnishing.
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}
