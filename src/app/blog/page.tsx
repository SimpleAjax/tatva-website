import Image from "next/image"
import Link from "next/link"
import { Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

const BLOG_POSTS = [
    {
        id: 1,
        title: "5 Timeless Jewellery Pieces Every Woman Should Own",
        excerpt: "Discover the essential pieces that transcend trends and remain elegant for years to come. From classic pearl studs to delicate gold chains.",
        image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop",
        date: "Dec 20, 2024",
        category: "Style Guide"
    },
    {
        id: 2,
        title: "How to Layer Necklaces Like a Pro",
        excerpt: "Master the art of necklace layering with our expert tips and styling tricks. Learn about chain lengths, pendant sizes, and color coordination.",
        image: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=800&auto=format&fit=crop",
        date: "Dec 18, 2024",
        category: "Styling Tips"
    },
    {
        id: 3,
        title: "The Ultimate Guide to Choosing Wedding Jewellery",
        excerpt: "Everything you need to know about selecting the perfect pieces for your big day. From traditional to contemporary styles.",
        image: "https://images.unsplash.com/photo-1626784215021-2e39ccf971cd?q=80&w=800&auto=format&fit=crop",
        date: "Dec 15, 2024",
        category: "Wedding"
    },
    {
        id: 4,
        title: "Caring for Your Gold-Plated Jewellery",
        excerpt: "Simple tips to keep your favourite pieces looking brand new for years. Storage, cleaning, and maintenance advice from experts.",
        image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop",
        date: "Dec 12, 2024",
        category: "Care Tips"
    },
    {
        id: 5,
        title: "Trending: Minimalist Jewellery for Modern Women",
        excerpt: "Explore the minimalist movement and find pieces that make a statement with simplicity. Less is more in contemporary design.",
        image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop",
        date: "Dec 10, 2024",
        category: "Trends"
    },
    {
        id: 6,
        title: "Understanding Gemstone Quality and Certification",
        excerpt: "Learn how to evaluate gemstones and understand certification standards. Make informed decisions for your jewellery purchases.",
        image: "https://images.unsplash.com/photo-1602751584552-8ba43ea5187a?q=80&w=800&auto=format&fit=crop",
        date: "Dec 8, 2024",
        category: "Education"
    },
]

export default function BlogPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Hero Section */}
            <section className="py-16 md:py-24 px-4 bg-secondary/30">
                <div className="container mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">The Tatva Journal</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Stories, inspiration, and expert advice from the world of fine jewellery.
                    </p>
                </div>
            </section>

            {/* Blog Grid */}
            <section className="py-16 md:py-24 px-4">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {BLOG_POSTS.map((post) => (
                            <Link
                                key={post.id}
                                href={`/blog/${post.id}`}
                                className="group"
                            >
                                <article className="space-y-4">
                                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-secondary">
                                        <Image
                                            src={post.image}
                                            alt={post.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <span className="uppercase tracking-wider font-medium text-gold">
                                                {post.category}
                                            </span>
                                            <span>•</span>
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                <span>{post.date}</span>
                                            </div>
                                        </div>

                                        <h2 className="font-serif font-bold text-xl leading-tight group-hover:text-primary transition-colors">
                                            {post.title}
                                        </h2>

                                        <p className="text-muted-foreground text-sm leading-relaxed">
                                            {post.excerpt}
                                        </p>

                                        <Button
                                            variant="link"
                                            className="p-0 h-auto font-medium"
                                        >
                                            Read More →
                                        </Button>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
