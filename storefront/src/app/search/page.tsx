"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { getProducts, getRegions, Product } from "@/lib/medusa";
import ProductCard from "@/components/ProductCard";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (query) {
      setLoading(true);
      setSearched(true);
      
      // Fetch region first for pricing, then search
      getRegions()
        .then(({ regions }) => {
          const indiaRegion = regions.find(r => 
            r.currency_code === 'inr' || 
            r.name.toLowerCase().includes('india')
          );
          const regionId = indiaRegion?.id || regions[0]?.id;
          
          return getProducts({ q: query, limit: 50, region_id: regionId });
        })
        .then(({ products }) => {
          setProducts(products);
        })
        .catch((error) => {
          console.error("Search failed:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [query]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="text-2xl font-serif italic text-primary">TATVA</a>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="/category/bracelets" className="text-xs font-medium tracking-widest uppercase hover:text-primary transition-colors">Bracelets</a>
              <a href="/category/necklaces" className="text-xs font-medium tracking-widest uppercase hover:text-primary transition-colors">Necklaces</a>
              <a href="/category/earrings" className="text-xs font-medium tracking-widest uppercase hover:text-primary transition-colors">Earrings</a>
              <a href="/category/rings" className="text-xs font-medium tracking-widest uppercase hover:text-primary transition-colors">Rings</a>
              <a href="/category/wedding-collection" className="text-xs font-medium tracking-widest uppercase hover:text-primary transition-colors">Wedding</a>
            </nav>
            <div className="flex items-center space-x-4">
              <a href="/cart" className="p-2 hover:bg-muted rounded-full transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Search Header */}
      <div className="bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-serif text-primary italic mb-6">Search</h1>
          <form action="/search" method="GET" className="max-w-2xl">
            <div className="relative">
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="Search for jewelry..."
                className="w-full px-6 py-4 pr-14 bg-white border border-border text-sm focus:outline-none focus:border-primary transition-colors"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-muted rounded-full transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Search Results */}
      <section className="py-12 container mx-auto px-4">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : searched ? (
          <>
            <div className="mb-8">
              <p className="text-sm text-muted-foreground">
                {products.length} {products.length === 1 ? "result" : "results"} for &ldquo;{query}&rdquo;
              </p>
            </div>
            
            {products.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-24">
                <div className="w-16 h-16 mx-auto mb-6 text-muted-foreground">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-medium mb-2">No results found</h2>
                <p className="text-muted-foreground text-sm mb-6">
                  We couldn&apos;t find any products matching &ldquo;{query}&rdquo;
                </p>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">Try:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>Checking your spelling</li>
                    <li>Using more general keywords</li>
                    <li>Browsing our categories</li>
                  </ul>
                </div>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <a href="/category/bracelets" className="px-4 py-2 border border-border text-xs uppercase tracking-widest hover:bg-muted transition-colors">
                    Bracelets
                  </a>
                  <a href="/category/necklaces" className="px-4 py-2 border border-border text-xs uppercase tracking-widest hover:bg-muted transition-colors">
                    Necklaces
                  </a>
                  <a href="/category/earrings" className="px-4 py-2 border border-border text-xs uppercase tracking-widest hover:bg-muted transition-colors">
                    Earrings
                  </a>
                  <a href="/category/rings" className="px-4 py-2 border border-border text-xs uppercase tracking-widest hover:bg-muted transition-colors">
                    Rings
                  </a>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-24">
            <div className="w-16 h-16 mx-auto mb-6 text-muted-foreground">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-medium mb-2">Search TATVA</h2>
            <p className="text-muted-foreground text-sm mb-8">Find the perfect jewelry piece</p>
            
            <div className="flex flex-wrap justify-center gap-3">
              <span className="text-sm text-muted-foreground mr-2">Popular:</span>
              <a href="/search?q=bracelet" className="text-sm text-primary hover:underline">Bracelet</a>
              <a href="/search?q=necklace" className="text-sm text-primary hover:underline">Necklace</a>
              <a href="/search?q=earrings" className="text-sm text-primary hover:underline">Earrings</a>
              <a href="/search?q=gold" className="text-sm text-primary hover:underline">Gold</a>
              <a href="/search?q=pearl" className="text-sm text-primary hover:underline">Pearl</a>
            </div>
          </div>
        )}
      </section>

      {/* Footer Simple */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <a href="/" className="text-xl font-serif italic text-primary">TATVA</a>
            <p className="text-xs text-muted-foreground">© 2025 TATVA. All rights reserved.</p>
            <div className="flex items-center space-x-4">
              <a href="/" className="text-xs text-muted-foreground hover:text-primary transition-colors">Home</a>
              <a href="/category/new-arrivals" className="text-xs text-muted-foreground hover:text-primary transition-colors">New Arrivals</a>
              <a href="/category/best-sellers" className="text-xs text-muted-foreground hover:text-primary transition-colors">Best Sellers</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
