import { notFound } from "next/navigation";
import { getCategories, getProducts } from "@/lib/medusa";
import ProductCard from "@/components/ProductCard";

interface CategoryPageProps {
  params: Promise<{
    handle: string;
  }>;
}

export async function generateStaticParams() {
  try {
    const { product_categories } = await getCategories();
    return product_categories.map((category) => ({
      handle: category.handle,
    }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { handle } = await params;
  const { product_categories } = await getCategories();
  const category = product_categories.find((cat) => cat.handle === handle);
  
  if (!category) {
    return {
      title: "Category Not Found | TATVA",
    };
  }
  
  return {
    title: `${category.name} | TATVA Jewelry`,
    description: category.description || `Shop ${category.name} at TATVA - Exquisite Indian Jewelry`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { handle } = await params;
  
  // Fetch category and products
  const { product_categories } = await getCategories();
  const category = product_categories.find((cat) => cat.handle === handle);
  
  if (!category) {
    return notFound();
  }
  
  const { products } = await getProducts({ 
    category_id: category.id,
    limit: 100 
  });
  
  // Category display names and descriptions
  const categoryInfo: Record<string, { title: string; subtitle: string }> = {
    bracelets: {
      title: "Bracelets",
      subtitle: "Elegant bracelets for every occasion",
    },
    necklaces: {
      title: "Necklaces",
      subtitle: "Stunning necklaces and pendants",
    },
    earrings: {
      title: "Earrings",
      subtitle: "Beautiful earrings from studs to danglers",
    },
    rings: {
      title: "Rings",
      subtitle: "Exquisite rings for every style",
    },
    "wedding-collection": {
      title: "Wedding Collection",
      subtitle: "Bridal sets and wedding jewelry",
    },
    "best-sellers": {
      title: "Best Sellers",
      subtitle: "Our most popular pieces",
    },
    "new-arrivals": {
      title: "New Arrivals",
      subtitle: "Latest additions to our collection",
    },
    gifts: {
      title: "Gifts",
      subtitle: "Perfect gifts for your loved ones",
    },
  };
  
  const info = categoryInfo[handle] || { title: category.name, subtitle: category.description || "" };
  
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
              <a href="/search" className="p-2 hover:bg-muted rounded-full transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </a>
              <a href="/cart" className="p-2 hover:bg-muted rounded-full transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Category Header */}
      <div className="bg-muted/30 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-primary italic mb-4">{info.title}</h1>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto">{info.subtitle}</p>
        </div>
      </div>

      {/* Products Grid */}
      <section className="py-16 container mx-auto px-4">
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h2 className="text-xl font-medium mb-2">No products found</h2>
            <p className="text-muted-foreground text-sm mb-6">We&apos;re currently adding products to this category.</p>
            <a href="/" className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white text-xs font-bold uppercase tracking-widest hover:bg-primary/90 transition-colors">
              Continue Shopping
            </a>
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
