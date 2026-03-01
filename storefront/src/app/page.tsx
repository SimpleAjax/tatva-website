import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import CategoryCircles from "@/components/CategoryCircles";
import ProductCard from "@/components/ProductCard";
import InfoBar from "@/components/InfoBar";
import Collections from "@/components/Collections";
import TestimonialsMarquee from "@/components/TestimonialsMarquee";
import Footer from "@/components/Footer";
import BestSellersReels from "@/components/BestSellersReels";
import { getProducts, getCategories, Product } from "@/lib/medusa";
import { getDefaultRegionId } from "@/lib/regions";
import { bestSellersData } from "@/lib/imagekit";
import Link from "next/link";
import { ArrowRight, Sparkles, Gift, Gem } from "lucide-react";

// ===========================================
// Data Fetching Functions
// ===========================================

async function getNewArrivals(regionId?: string): Promise<Product[]> {
  try {
    const { product_categories } = await getCategories();
    const category = product_categories.find(cat => cat.handle === "new-arrivals");
    
    if (!category) {
      const { products } = await getProducts({ limit: 4, region_id: regionId });
      return products;
    }
    
    const { products } = await getProducts({ 
      limit: 4,
      category_id: category.id,
      region_id: regionId
    });
    return products;
  } catch (error) {
    console.error("[Home] Failed to fetch new arrivals:", error);
    return [];
  }
}

async function getBestSellers(regionId?: string): Promise<Product[]> {
  try {
    const { product_categories } = await getCategories();
    const category = product_categories.find(cat => cat.handle === "best-sellers");
    
    if (!category) {
      const { products } = await getProducts({ limit: 4, region_id: regionId });
      return products;
    }
    
    const { products } = await getProducts({ 
      limit: 4,
      category_id: category.id,
      region_id: regionId
    });
    return products;
  } catch (error) {
    console.error("Failed to fetch best sellers:", error);
    return [];
  }
}

async function getWeddingProducts(regionId?: string): Promise<Product[]> {
  try {
    const { product_categories } = await getCategories();
    const category = product_categories.find(cat => cat.handle === "wedding-collection");
    
    if (!category) {
      const { products } = await getProducts({ limit: 4, region_id: regionId });
      return products;
    }
    
    const { products } = await getProducts({ 
      limit: 4,
      category_id: category.id,
      region_id: regionId
    });
    return products;
  } catch (error) {
    console.error("Failed to fetch wedding products:", error);
    return [];
  }
}

async function getBudgetProducts(regionId?: string): Promise<Product[]> {
  try {
    const { products } = await getProducts({ limit: 20, region_id: regionId });
    return products.filter(product => {
      const cheapestVariant = product.variants?.reduce((min, variant) => {
        const price = variant.prices?.find(p => p.currency_code === 'inr')?.amount || Infinity;
        return price < min ? price : min;
      }, Infinity);
      return cheapestVariant <= 99900;
    }).slice(0, 4);
  } catch (error) {
    console.error("Failed to fetch budget products:", error);
    return [];
  }
}

async function getGiftProducts(regionId?: string): Promise<Product[]> {
  try {
    const { product_categories } = await getCategories();
    const category = product_categories.find(cat => cat.handle === "gifts");
    
    if (!category) {
      const { products } = await getProducts({ limit: 5, region_id: regionId });
      return products;
    }
    
    const { products } = await getProducts({ 
      limit: 5,
      category_id: category.id,
      region_id: regionId
    });
    return products;
  } catch (error) {
    console.error("Failed to fetch gift products:", error);
    return [];
  }
}

// ===========================================
// Page Component
// ===========================================

export default async function Home() {
  const regionId = await getDefaultRegionId();

  const [newArrivals, bestSellers, weddingProducts, budgetProducts, giftProducts] = await Promise.all([
    getNewArrivals(regionId),
    getBestSellers(regionId),
    getWeddingProducts(regionId),
    getBudgetProducts(regionId),
    getGiftProducts(regionId),
  ]);

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      <AnnouncementBar />
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <HeroBanner />
        
        {/* Category Circles */}
        <CategoryCircles />

        {/* Info Bar */}
        <InfoBar />

        {/* ===========================================
            New Arrivals Section
            =========================================== */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 lg:mb-12">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-primary">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-[11px] font-semibold tracking-[0.2em] uppercase">Just In</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-serif italic text-primary">
                  Fresh Drops
                </h2>
              </div>
              <Link 
                href="/category/new-arrivals" 
                className="group inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors"
              >
                <span className="uppercase tracking-widest border-b border-current pb-0.5">View All</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Products Grid */}
            {newArrivals.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
                {newArrivals.map((product, index) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-background-cream rounded-sm">
                <p className="text-muted-foreground">
                  No products available. Please check your Medusa backend connection.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Best Sellers Reels Section */}
        <BestSellersReels reels={bestSellersData} />

        {/* ===========================================
            Wedding Edit Section
            =========================================== */}
        <section className="py-16 lg:py-24 bg-background-cream">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
              {/* Left: Banner */}
              <div className="w-full lg:w-2/5">
                <div className="relative bg-primary p-8 lg:p-12 h-full min-h-[400px] lg:min-h-[500px] flex flex-col justify-between overflow-hidden group">
                  {/* Decorative Border */}
                  <div className="absolute inset-4 border border-white/20 pointer-events-none" />
                  
                  {/* Background Pattern */}
                  <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-white/5" />
                  <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white/5" />
                  
                  {/* Content */}
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 text-white/80 mb-4">
                      <Gem className="w-4 h-4" />
                      <span className="text-[11px] font-semibold tracking-[0.2em] uppercase">Bridal Collection</span>
                    </div>
                    <h2 className="text-4xl lg:text-5xl xl:text-6xl font-serif italic text-white mb-6">
                      The Wedding<br />Edit
                    </h2>
                    <p className="text-white/80 text-sm leading-relaxed max-w-xs">
                      Handcrafted perfection for your special day. Explore our exclusive bridal collection featuring Kundan, Polki, and Antique Gold designs.
                    </p>
                  </div>
                  
                  {/* CTA */}
                  <div className="relative z-10">
                    <Link 
                      href="/category/wedding-collection"
                      className="inline-flex items-center gap-3 bg-white text-primary px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-white/90 transition-colors group/btn"
                    >
                      Shop Bridal
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Right: Products Grid */}
              <div className="w-full lg:w-3/5">
                {weddingProducts.length > 0 ? (
                  <div className="grid grid-cols-2 gap-6 lg:gap-8">
                    {weddingProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center bg-white rounded-sm py-16">
                    <p className="text-muted-foreground">No products available.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Collections Section */}
        <Collections />

        {/* ===========================================
            Gifts for Her Section
            =========================================== */}
        <section className="py-16 lg:py-24 bg-background-warm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="flex items-center justify-center gap-2 text-primary mb-3">
                <Gift className="w-4 h-4" />
                <span className="text-[11px] font-semibold tracking-[0.2em] uppercase">Perfect Presents</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-serif italic text-primary mb-4">
                Gifts for Her
              </h2>
              <p className="text-muted-foreground text-sm">
                Curated sets for every occasion. Make her feel special with our thoughtfully designed gift collections.
              </p>
            </div>

            {/* Horizontal Scroll Products */}
            {giftProducts.length > 0 ? (
              <div className="relative">
                <div 
                  className="flex overflow-x-auto gap-6 pb-4 -mx-4 px-4 snap-x snap-mandatory no-scrollbar"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {giftProducts.map((product) => (
                    <div 
                      key={product.id} 
                      className="min-w-[200px] md:min-w-[240px] lg:min-w-[280px] snap-start"
                    >
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
                
                {/* Fade Edges */}
                <div className="absolute left-0 top-0 bottom-4 w-8 bg-gradient-to-r from-background-warm to-transparent pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-background-warm to-transparent pointer-events-none" />
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-sm">
                <p className="text-muted-foreground">No products available.</p>
              </div>
            )}
          </div>
        </section>

        {/* ===========================================
            Shop the Look Section
            =========================================== */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
              {/* Left: Image */}
              <div className="w-full lg:w-1/2 relative">
                <div className="relative aspect-[4/5] bg-background-cream overflow-hidden group">
                  {/* Placeholder - replace with actual image */}
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-rose/50 to-champagne/50">
                    <span className="text-foreground-muted italic">Model Showcase Image</span>
                  </div>
                  
                  {/* Product Pins */}
                  <div className="absolute top-1/4 left-1/4 group/pin">
                    <div className="w-8 h-8 rounded-full bg-white shadow-lg cursor-pointer flex items-center justify-center animate-pulse border-2 border-primary hover:scale-110 transition-transform">
                      <span className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                  </div>
                  <div className="absolute bottom-1/3 right-1/4 group/pin">
                    <div className="w-8 h-8 rounded-full bg-white shadow-lg cursor-pointer flex items-center justify-center animate-pulse border-2 border-primary hover:scale-110 transition-transform delay-300">
                      <span className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Content */}
              <div className="w-full lg:w-1/2 space-y-8">
                <div className="space-y-4">
                  <span className="text-primary text-[11px] font-semibold tracking-[0.3em] uppercase">
                    Style Guide
                  </span>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif italic text-primary">
                    Shop the Look
                  </h2>
                </div>
                
                <p className="text-lg text-foreground-muted leading-relaxed font-light max-w-lg">
                  Effortlessly transition from day to night with our curated sets. Each piece is designed to complement the other, creating a cohesive and stunning ensemble that captures the essence of Tatva.
                </p>

                {/* Style Tags */}
                <div className="flex flex-wrap gap-3">
                  {["Minimalist", "Bohemian", "Classic", "Glamour"].map((tag) => (
                    <span 
                      key={tag} 
                      className="px-5 py-2.5 bg-white border border-border text-xs font-semibold tracking-widest uppercase text-foreground-muted hover:border-primary hover:text-primary transition-colors cursor-pointer"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <Link 
                  href="/category/shop-by-look"
                  className="inline-flex items-center gap-3 bg-primary text-white px-10 py-5 text-xs font-bold uppercase tracking-widest hover:bg-primary-dark transition-all hover:shadow-lg hover:-translate-y-0.5"
                >
                  Explore Styles
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ===========================================
            Budget Friendly Section
            =========================================== */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 bg-primary text-white px-4 py-1.5 text-[10px] font-bold tracking-widest uppercase rounded-full mb-4">
                <Sparkles className="w-3 h-3" />
                Steal Deals
              </span>
              <h2 className="text-3xl md:text-4xl font-serif italic text-primary">
                Under ₹999
              </h2>
            </div>

            {/* Products Grid */}
            {budgetProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
                {budgetProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-background-cream rounded-sm">
                <p className="text-muted-foreground">No products available.</p>
              </div>
            )}

            {/* View All Link */}
            <div className="mt-12 text-center">
              <Link 
                href="/category/under-999" 
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-dark transition-colors uppercase tracking-widest border-b-2 border-primary pb-1"
              >
                View All Budget Buys
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <TestimonialsMarquee />
      </main>

      <Footer />
    </div>
  );
}
