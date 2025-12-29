"use client"

import { ProductGallery } from "@/components/product/product-gallery"
import { ProductInfo } from "@/components/product/product-info"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"

// Mock Images
const IMAGES = [
    "https://images.unsplash.com/photo-1596944924616-00f3f204fa6f?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1617038224558-2834a2d1dfc7?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=800&auto=format&fit=crop",
]

export default function ProductDetailPage() {
    return (
        <div className="min-h-screen bg-background text-foreground pb-20">
            <div className="container mx-auto px-4 py-8 md:py-12">

                {/* Top Section: Gallery + Info */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                    <ProductGallery images={IMAGES} />
                    <ProductInfo />
                </div>

                {/* Reviews Section */}
                <div className="max-w-4xl mx-auto">
                    <h3 className="font-serif font-bold text-2xl text-center mb-8">Customer Reviews</h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        {/* Summary */}
                        <div className="md:col-span-1 bg-secondary/30 p-6 rounded-lg text-center h-fit">
                            <div className="text-5xl font-bold mb-2">4.8</div>
                            <div className="flex justify-center mb-2">
                                {[1, 2, 3, 4, 5].map(s => <Star key={s} className="fill-black text-black h-5 w-5" />)}
                            </div>
                            <p className="text-muted-foreground">Based on 45 reviews</p>
                            <Button className="w-full mt-6" variant="outline">Write a Review</Button>
                        </div>

                        {/* Reviews List */}
                        <div className="md:col-span-2 space-y-6">
                            {[1, 2, 3].map((r) => (
                                <div key={r} className="space-y-3 pb-6 border-b last:border-0">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarFallback>JD</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h4 className="font-medium text-sm">Jane Doe</h4>
                                                <div className="flex">
                                                    {[1, 2, 3, 4, 5].map(s => <Star key={s} className="fill-black text-black h-3 w-3" />)}
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-xs text-muted-foreground">2 days ago</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Absolutely beautiful ring! The quality is amazing for the price. I've been wearing it daily and it still shines like new.
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
