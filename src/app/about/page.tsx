import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Hero Section */}
            <section className="relative h-[60vh] w-full flex items-center justify-center overflow-hidden">
                <Image
                    src="https://images.unsplash.com/photo-1626784215021-2e39ccf971cd?q=80&w=2000&auto=format&fit=crop"
                    alt="About Tatva"
                    fill
                    className="object-cover opacity-60"
                />
                <div className="relative z-10 text-center space-y-4 px-4 max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-black drop-shadow-sm">Our Story</h1>
                    <p className="text-lg md:text-2xl font-serif text-black/80 max-w-2xl mx-auto">
                        Crafting timeless elegance for the modern soul.
                    </p>
                </div>
            </section>

            {/* Narrative Section */}
            <section className="py-16 md:py-24 px-4">
                <div className="container max-w-4xl mx-auto space-y-12 text-center md:text-left">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-serif font-bold text-center">The Essence of Tatva</h2>
                        <p className="text-muted-foreground leading-relaxed text-lg">
                            "Tatva" denotes element, essence, or reality. In Indian philosophy, it represents the fundamental elements that the universe is made of. Our brand is built on this very principle—bringing you jewellery that is elemental, essential, and crafted with a purity of design and intent.
                        </p>
                        <p className="text-muted-foreground leading-relaxed text-lg">
                            Born from a desire to bridge the gap between traditional craftsmanship and contemporary aesthetics, Tatva offers pieces that are not just accessories, but extensions of your personality. We believe that jewellery should be wearable art—distinctive, expressive, and enduring.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="relative aspect-[4/5] bg-secondary rounded-lg overflow-hidden">
                            <Image
                                src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop"
                                alt="Craftsmanship"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="space-y-6">
                            <h3 className="text-2xl font-serif font-bold">Our Craftsmanship</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Every piece at Tatva is a labor of love. We collaborate with skilled artisans who have inherited generations of knowledge in metalwork and stone setting. By combining these age-old techniques with modern design sensibilities, we create jewellery that feels both familiar and refreshingly new.
                            </p>
                            <p className="text-muted-foreground leading-relaxed">
                                We use premium quality brass and sterling silver, plated with 18k and 22k gold, ensuring that our pieces not only look luxurious but stand the test of time.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="bg-secondary/30 py-16 px-4">
                <div className="container mx-auto">
                    <h2 className="text-3xl font-serif font-bold text-center mb-12">Our Values</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: "Quality", desc: "Uncompromising attention to detail and materials." },
                            { title: "Transparency", desc: "Honest pricing and ethical sourcing practices." },
                            { title: "Individuality", desc: "Designs that celebrate your unique style." }
                        ].map((val, i) => (
                            <div key={i} className="text-center space-y-4 p-6 bg-background rounded-lg shadow-sm border">
                                <h3 className="text-xl font-serif font-bold">{val.title}</h3>
                                <p className="text-muted-foreground">{val.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
