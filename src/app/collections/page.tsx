import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const COLLECTIONS = [
    {
        id: 1,
        name: "The Wedding Edit",
        description: "Timeless pieces for your special day",
        image: "https://images.unsplash.com/photo-1626784215021-2e39ccf971cd?q=80&w=800&auto=format&fit=crop",
        href: "/shop/wedding"
    },
    {
        id: 2,
        name: "Daily Luxe",
        description: "Elegant essentials for everyday wear",
        image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop",
        href: "/shop/daily"
    },
    {
        id: 3,
        name: "Temple Collection",
        description: "Traditional designs with a modern touch",
        image: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=800&auto=format&fit=crop",
        href: "/shop/temple"
    },
    {
        id: 4,
        name: "Minimalist",
        description: "Clean lines, maximum impact",
        image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop",
        href: "/shop/minimalist"
    },
    {
        id: 5,
        name: "Statement Pieces",
        description: "Bold designs for special occasions",
        image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop",
        href: "/shop/statement"
    },
    {
        id: 6,
        name: "Vintage Revival",
        description: "Inspired by timeless classics",
        image: "https://images.unsplash.com/photo-1602751584552-8ba43ea5187a?q=80&w=800&auto=format&fit=crop",
        href: "/shop/vintage"
    },
]

export default function CollectionsPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Hero Section */}
            <section className="py-16 md:py-24 px-4 container mx-auto text-center">
                <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">Our Collections</h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Explore our curated collections, each telling a unique story through design and craftsmanship.
                </p>
            </section>

            {/* Collections Grid */}
            <section className="pb-24 px-4 container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {COLLECTIONS.map((collection) => (
                        <Link
                            key={collection.id}
                            href={collection.href}
                            className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow"
                        >
                            <div className="relative aspect-[4/5]">
                                <Image
                                    src={collection.image}
                                    alt={collection.name}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                <h3 className="text-2xl font-serif font-bold mb-2">{collection.name}</h3>
                                <p className="text-sm text-white/90 mb-4">{collection.description}</p>
                                <Button
                                    variant="outline"
                                    className="border-white text-white hover:bg-white hover:text-black rounded-none"
                                >
                                    Explore Collection
                                </Button>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    )
}
