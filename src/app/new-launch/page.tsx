import { ProductCard } from "@/components/product/product-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const NEW_PRODUCTS = Array.from({ length: 12 }).map((_, i) => ({
    id: `new-${i + 1}`,
    name: `New Collection ${i + 1}`,
    price: 3999 + i * 300,
    originalPrice: 5999 + i * 300,
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600&auto=format&fit=crop",
    category: "new-arrivals",
    isNew: true,
}))

export default function NewLaunchPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Hero Section */}
            <section className="relative h-[50vh] w-full bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center">
                <div className="text-center space-y-4 px-4">
                    <span className="text-sm font-bold tracking-widest text-gold uppercase">Just Dropped</span>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold">New Launch</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Discover our latest collection of handcrafted jewellery, designed to make every moment special.
                    </p>
                </div>
            </section>

            {/* Products Grid */}
            <section className="py-16 md:py-24 px-4 container mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <p className="text-muted-foreground">Showing {NEW_PRODUCTS.length} new arrivals</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                    {NEW_PRODUCTS.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </section>
        </div>
    )
}
