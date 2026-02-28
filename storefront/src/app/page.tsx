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

async function getNewArrivals(regionId?: string): Promise<Product[]> {
  try {
    const { product_categories } = await getCategories();
    const category = product_categories.find(cat => cat.handle === "new-arrivals");
    
    if (!category) {
      // Fallback to all products if category not found
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
    // Get products under ₹999 (99900 paise)
    const { products } = await getProducts({ limit: 20, region_id: regionId });
    // Filter products that have variants with prices under ₹999
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

export default async function Home() {
  // Get default region (India/INR) - cached after first call
  const regionId = await getDefaultRegionId();

  // Fetch products from Medusa with region for pricing
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
        <HeroBanner />
        <CategoryCircles />

        {/* Info Bar */}
        <InfoBar />

        {/* 1. New Arrivals Section */}
        <section className="py-16 container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-primary text-[10px] font-bold tracking-[0.2em] uppercase">Just In</span>
              <h2 className="text-3xl font-serif text-primary italic">Fresh Drops</h2>
            </div>
            <a href="/category/new-arrivals" className="text-xs font-bold uppercase tracking-widest border-b border-primary text-primary pb-1 hover:opacity-80">View All</a>
          </div>
          {newArrivals.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No products available. Please check your Medusa backend connection.
            </div>
          )}
        </section>

        {/* Best Sellers (Instagram Reels Style) Section */}
        <BestSellersReels reels={bestSellersData} />

        {/* 2. The Wedding Edit */}
        <section className="py-20 bg-[#FDF8F8]">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-12">
              {/* Banner */}
              <div className="w-full lg:w-1/3 relative bg-primary/5 min-h-[400px] flex items-center justify-center p-8 text-center">
                <div className="absolute inset-0 border-[1px] border-primary/20 m-4 pointer-events-none" />
                <div className="space-y-6 z-10">
                  <h2 className="text-4xl lg:text-5xl font-serif text-primary italic">The Wedding Edit</h2>
                  <p className="text-zinc-600 text-sm leading-relaxed">
                    Handcrafted perfection for your special day. Explore our exclusive bridal collection featuring Kundan, Polki, and Antique Gold designs.
                  </p>
                  <a href="/category/wedding-collection" className="bg-primary text-white px-8 py-3 text-xs font-bold uppercase tracking-widest shadow-md hover:bg-primary/90 inline-block">
                    Shop Bridal
                  </a>
                </div>
              </div>
              {/* Products Grid */}
              <div className="w-full lg:w-2/3 grid grid-cols-2 gap-6">
                {weddingProducts.length > 0 ? (
                  weddingProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))
                ) : (
                  <div className="col-span-2 text-center py-12 text-muted-foreground">
                    No products available.
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Collections Section */}
        <Collections />

        {/* 3. Gifts for Her (Horizontal Scroll) */}
        <section className="py-16 container mx-auto px-4 overflow-hidden">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-serif text-primary italic">Gifts for Her</h2>
            <p className="text-muted-foreground text-xs uppercase tracking-widest mt-2">Curated sets for every occasion</p>
          </div>
          {giftProducts.length > 0 ? (
            <div className="flex overflow-x-auto space-x-6 pb-8 no-scrollbar -mx-4 px-4 snap-x">
              {giftProducts.map((product) => (
                <div key={product.id} className="min-w-[200px] md:min-w-[250px] snap-start">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No products available.
            </div>
          )}
        </section>

        {/* Shop the Look Section */}
        <section className="py-24 bg-[#FFEFEF]/30">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="w-full lg:w-1/2 relative group">
                <div className="aspect-[4/5] bg-muted overflow-hidden relative">
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground italic bg-zinc-200">
                    Model Showcase Image
                  </div>
                </div>
                {/* Product Pins Overlay Placeholder */}
                <div className="absolute top-1/3 left-1/4 w-4 h-4 rounded-full bg-white shadow-lg cursor-pointer animate-pulse border-2 border-primary" />
                <div className="absolute bottom-1/4 right-1/3 w-4 h-4 rounded-full bg-white shadow-lg cursor-pointer animate-pulse border-2 border-primary" />
              </div>
              <div className="w-full lg:w-1/2 space-y-8">
                <div className="space-y-4">
                  <span className="text-primary text-[10px] lg:text-[11px] font-bold tracking-[0.4em] uppercase">Style Guide</span>
                  <h2 className="text-5xl font-serif text-primary italic">Shop the Look</h2>
                </div>
                <p className="text-lg text-zinc-600 leading-relaxed font-light">
                  Effortlessly transition from day to night with our curated sets.
                  Each piece is designed to complement the other, creating a cohesive and stunning ensemble that captures the essence of Tatva.
                </p>
                <div className="flex flex-wrap gap-4">
                  {["Minimalist", "Bohemian", "Classic", "Glamour"].map((tag) => (
                    <span key={tag} className="px-4 py-2 bg-white border border-border text-[10px] font-bold tracking-widest uppercase">{tag}</span>
                  ))}
                </div>
                <a href="/category/bracelets" className="bg-primary hover:bg-primary/90 text-white px-12 py-4 tracking-widest uppercase font-bold text-xs transition-colors shadow-lg inline-block">
                  Explore Styles
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Pocket Friendly Section */}
        <section className="py-16 container mx-auto px-4">
          <div className="flex flex-col items-center mb-10 space-y-2">
            <span className="bg-primary text-white px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded-full">Steal Deals</span>
            <h2 className="text-3xl font-serif text-primary italic">Under ₹999</h2>
          </div>
          {budgetProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {budgetProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No products available.
            </div>
          )}
          <div className="mt-10 text-center">
            <a href="/category/earrings" className="border-b-2 border-primary text-primary font-bold text-xs uppercase tracking-widest pb-1 hover:text-primary/80">View All Budget Buys</a>
          </div>
        </section>

        {/* Testimonials Marquee Section */}
        <TestimonialsMarquee />
      </main>

      <Footer />
    </div>
  );
}
