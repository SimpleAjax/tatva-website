"use client"

import * as React from "react"
import { useParams } from "next/navigation"
import { FilterSidebar, MobileFilterSheet } from "@/components/shop/filter-sidebar"
import { ProductCard } from "@/components/product/product-card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

// Dummy Data
const PRODUCTS = Array.from({ length: 12 }).map((_, i) => ({
    id: i + 1,
    name: `Elegant Piece ${i + 1}`,
    price: 1500 + i * 100,
    originalPrice: 2000 + i * 100,
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=600&auto=format&fit=crop",
    category: "necklaces",
    isNew: i % 3 === 0,
    isSale: i % 4 === 0,
}))

export default function ShopCategoryPage() {
    const params = useParams()
    const category = (params?.category as string) || "all"

    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="flex flex-col gap-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b pb-6">
                    <div className="space-y-2">
                        <h1 className="text-4xl md:text-5xl font-serif font-bold capitalize">{category.replace("-", " ")}</h1>
                        <p className="text-muted-foreground">Showing {PRODUCTS.length} results</p>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <MobileFilterSheet />
                        <Select defaultValue="featured">
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Sort By" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="featured">Featured</SelectItem>
                                <SelectItem value="newest">Newest</SelectItem>
                                <SelectItem value="price-low">Price: Low to High</SelectItem>
                                <SelectItem value="price-high">Price: High to Low</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex gap-8">
                    {/* Sidebar (Desktop) */}
                    <FilterSidebar />

                    {/* Product Grid */}
                    <div className="flex-1">
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
                            {PRODUCTS.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
