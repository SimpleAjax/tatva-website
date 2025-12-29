"use client"

import Link from "next/link"
import Image from "next/image"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Product {
    id: string | number
    name: string
    price: number
    originalPrice?: number
    image: string
    category: string
    isNew?: boolean
    isSale?: boolean
}

interface ProductCardProps {
    product: Product
    className?: string
}

export function ProductCard({ product, className }: ProductCardProps) {
    return (
        <div className={cn("group relative", className)}>
            {/* Image Container */}
            <div className="aspect-[3/4] w-full bg-secondary relative overflow-hidden mb-3">
                <Link href={`/product/${product.id}`} className="block h-full w-full">
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                </Link>

                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {product.isNew && <Badge className="bg-white text-black hover:bg-white/90">NEW</Badge>}
                    {product.isSale && <Badge variant="destructive">SALE</Badge>}
                </div>

                {/* Wishlist Button */}
                <button className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white text-black transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
                    <Heart className="h-4 w-4" />
                    <span className="sr-only">Add to Wishlist</span>
                </button>

                {/* Quick Add (Optional - can be sticky on mobile) */}
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <Button className="w-full bg-white text-black hover:bg-gold hover:text-white font-serif uppercase tracking-wider">
                        Quick Add
                    </Button>
                </div>
            </div>

            {/* Details */}
            <div className="space-y-1">
                <Link href={`/product/${product.id}`}>
                    <h3 className="font-medium font-serif text-lg leading-tight group-hover:text-primary transition-colors">
                        {product.name}
                    </h3>
                </Link>
                <div className="flex items-center gap-2">
                    <span className="font-sans font-medium">₹{product.price.toLocaleString()}</span>
                    {product.originalPrice && (
                        <span className="font-sans text-sm text-muted-foreground line-through">
                            ₹{product.originalPrice.toLocaleString()}
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}
