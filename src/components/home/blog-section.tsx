"use client"

import Image from "next/image"
import Link from "next/link"
import { Calendar, ArrowRight } from "lucide-react"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const BLOG_POSTS = [
    {
        id: 1,
        title: "5 Timeless Jewellery Pieces Every Woman Should Own",
        excerpt: "Discover the essential pieces that transcend trends and remain elegant for years to come.",
        image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop",
        date: "Dec 20, 2024",
        category: "Style Guide"
    },
    {
        id: 2,
        title: "How to Layer Necklaces Like a Pro",
        excerpt: "Master the art of necklace layering with our expert tips and styling tricks.",
        image: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=800&auto=format&fit=crop",
        date: "Dec 18, 2024",
        category: "Styling Tips"
    },
    {
        id: 3,
        title: "The Ultimate Guide to Choosing Wedding Jewellery",
        excerpt: "Everything you need to know about selecting the perfect pieces for your big day.",
        image: "https://images.unsplash.com/photo-1626784215021-2e39ccf971cd?q=80&w=800&auto=format&fit=crop",
        date: "Dec 15, 2024",
        category: "Wedding"
    },
    {
        id: 4,
        title: "Caring for Your Gold-Plated Jewellery",
        excerpt: "Simple tips to keep your favourite pieces looking brand new for years.",
        image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop",
        date: "Dec 12, 2024",
        category: "Care Tips"
    },
    {
        id: 5,
        title: "Trending: Minimalist Jewellery for Modern Women",
        excerpt: "Explore the minimalist movement and find pieces that make a statement with simplicity.",
        image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop",
        date: "Dec 10, 2024",
        category: "Trends"
    },
]

export function BlogSection() {
    return (
        <section className="py-16 md:py-24 bg-background">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-end mb-12">
                    <div className="space-y-2">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold">From Our Journal</h2>
                        <p className="text-muted-foreground hidden md:block">Stories, tips, and inspiration from the world of jewellery.</p>
                    </div>
                    <Link
                        href="/blog"
                        className="hidden md:flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors group"
                    >
                        View All Posts
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Desktop: Grid */}
                <div className="hidden md:grid grid-cols-3 gap-8 mb-8">
                    {BLOG_POSTS.slice(0, 3).map((post) => (
                        <Link key={post.id} href={`/blog/${post.id}`} className="group">
                            <Card className="border-none shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                <div className="relative aspect-[4/3] overflow-hidden">
                                    <Image
                                        src={post.image}
                                        alt={post.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <CardContent className="p-6 space-y-3">
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <span className="uppercase tracking-wider font-medium text-gold">{post.category}</span>
                                        <span>•</span>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            <span>{post.date}</span>
                                        </div>
                                    </div>
                                    <h3 className="font-serif font-bold text-lg leading-tight group-hover:text-primary transition-colors">
                                        {post.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {post.excerpt}
                                    </p>
                                    <div className="flex items-center gap-2 text-sm font-medium pt-2">
                                        Read More
                                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>

                {/* Mobile: Carousel */}
                <div className="md:hidden mb-8">
                    <Carousel
                        opts={{
                            align: "start",
                            loop: true,
                        }}
                        className="w-full"
                    >
                        <CarouselContent className="-ml-4">
                            {BLOG_POSTS.map((post) => (
                                <CarouselItem key={post.id} className="pl-4 basis-full">
                                    <Link href={`/blog/${post.id}`} className="group block">
                                        <Card className="border-none shadow-sm overflow-hidden">
                                            <div className="relative aspect-[16/10] overflow-hidden">
                                                <Image
                                                    src={post.image}
                                                    alt={post.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <CardContent className="p-6 space-y-3">
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <span className="uppercase tracking-wider font-medium text-gold">{post.category}</span>
                                                    <span>•</span>
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        <span>{post.date}</span>
                                                    </div>
                                                </div>
                                                <h3 className="font-serif font-bold text-lg leading-tight">
                                                    {post.title}
                                                </h3>
                                                <p className="text-sm text-muted-foreground line-clamp-2">
                                                    {post.excerpt}
                                                </p>
                                                <div className="flex items-center gap-2 text-sm font-medium pt-2">
                                                    Read More
                                                    <ArrowRight className="h-4 w-4" />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                </div>

                {/* Mobile: View All Link */}
                <div className="md:hidden text-center">
                    <Link href="/blog">
                        <Button variant="outline" className="w-full">
                            View All Blog Posts
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}
