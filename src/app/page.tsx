import { HeroSection } from "@/components/home/hero-section";
import { CategoryRail } from "@/components/home/category-rail";
import { Button } from "@/components/ui/button";
import { InstagramReels } from "@/components/home/instagram-reels";
import { MultipleProductSections } from "@/components/home/product-sections";
import { CustomerReviews } from "@/components/home/customer-reviews";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <HeroSection />

      <CategoryRail />

      {/* Featured / Best Sellers (Instagram Style) */}
      <InstagramReels />

      {/* New Arrivals & Trending */}
      <MultipleProductSections />

      {/* Banner Section */}
      <section className="relative h-[60vh] w-full bg-stone-900 text-white flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1626784215021-2e39ccf971cd?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center" />
        <div className="relative z-10 text-center space-y-6 px-4">
          <span className="uppercase tracking-[0.2em] text-sm md:text-base font-medium text-gold">The Wedding Edit</span>
          <h2 className="text-4xl md:text-6xl font-serif font-bold">For Your Special Day</h2>
          <Button size="lg" className="bg-white text-black hover:bg-gold hover:text-white border-0 mt-4 rounded-none px-8">Discover Collection</Button>
        </div>
      </section>

      {/* Reviews */}
      <CustomerReviews />

    </main>
  );
}
