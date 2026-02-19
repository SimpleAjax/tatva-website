import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import CategoryCircles from "@/components/CategoryCircles";
import ReelCard from "@/components/ReelCard";
import ProductCard from "@/components/ProductCard";
import InfoBar from "@/components/InfoBar";
import Collections from "@/components/Collections";
import Reviews from "@/components/Reviews";
import Footer from "@/components/Footer";

// Mock Data for Sections
const bestSellersReels = [
  {
    productName: "Golden Aura Bracelet",
    price: "₹1,299",
    originalPrice: "₹1,899",
    discount: "30%",
    likes: "2.4K",
    views: "15.2K",
    shares: "450",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-jewelry-in-a-box-41589-large.mp4"
  },
  {
    productName: "Elegance Pearl Necklace",
    price: "₹2,499",
    originalPrice: "₹3,499",
    discount: "28%",
    likes: "1.8K",
    views: "12.1K",
    shares: "230",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-necklaces-and-rings-set-41595-large.mp4"
  },
  {
    productName: "Celestial Star Earrings",
    price: "₹999",
    originalPrice: "₹1,299",
    discount: "23%",
    likes: "3.2K",
    views: "22.5K",
    shares: "890",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-woman-wearing-shiny-earrings-and-necklaces-41593-large.mp4"
  },
  {
    productName: "Infinity Love Ring",
    price: "₹1,599",
    originalPrice: "₹2,199",
    discount: "27%",
    likes: "1.5K",
    views: "10.8K",
    shares: "120",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-person-showing-a-jewelry-ring-41604-large.mp4"
  },
];

const newArrivals = [
  { name: "Diamond Dew Drop", price: "₹3,499", originalPrice: "₹4,999", discount: "30%", isNew: true },
  { name: "Rose Gold Bangle", price: "₹2,199", originalPrice: "₹2,799", discount: "21%", isNew: true },
  { name: "Emerald Studs", price: "₹1,499", originalPrice: "₹1,999", discount: "25%", isNew: true },
  { name: "Sapphire Pendant", price: "₹4,299", originalPrice: "₹5,500", discount: "22%", isNew: true },
];

const weddingEdit = [
  { name: "Bridal Kundan Set", price: "₹15,499", originalPrice: "₹24,999", discount: "38%" },
  { name: "Temple Jewelry Choker", price: "₹8,999", originalPrice: "₹12,499", discount: "28%" },
  { name: "Polki Maang Tikka", price: "₹2,499", originalPrice: "₹3,299", discount: "24%" },
  { name: "Antique Gold Jhumkas", price: "₹4,199", originalPrice: "₹5,499", discount: "23%" },
];

const budgetBuys = [
  { name: "Minimalist Ring", price: "₹499", originalPrice: "₹999", discount: "50%" },
  { name: "Silver Nose Pin", price: "₹299", originalPrice: "₹599", discount: "50%" },
  { name: "Boho Anklet", price: "₹699", originalPrice: "₹1,199", discount: "41%" },
  { name: "Tiny Heart Studs", price: "₹399", originalPrice: "₹799", discount: "50%" },
];

const giftSets = [
  { name: "Love Bundle", price: "₹2,499", originalPrice: "₹3,999", discount: "37%" },
  { name: "Bestie Set", price: "₹1,999", originalPrice: "₹2,999", discount: "33%" },
  { name: "Self-Care Box", price: "₹3,499", originalPrice: "₹4,999", discount: "30%" },
  { name: "Office Chic", price: "₹1,599", originalPrice: "₹2,299", discount: "30%" },
  { name: "Travel Essentials", price: "₹2,199", originalPrice: "₹3,199", discount: "31%" },
];

export default function Home() {
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
            <button className="text-xs font-bold uppercase tracking-widest border-b border-primary text-primary pb-1 hover:opacity-80">View All</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {newArrivals.map((product, i) => (
              <ProductCard key={i} {...product} />
            ))}
          </div>
        </section>

        {/* Best Sellers (Instagram Reels Style) Section */}
        <section className="py-16 lg:py-24 bg-zinc-50 overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-primary text-[10px] lg:text-[11px] font-bold tracking-[0.4em] uppercase">Trending Now</span>
              <h2 className="text-4xl font-serif text-primary italic mt-2">Best Sellers</h2>
              <div className="w-24 h-0.5 bg-primary/20 mx-auto mt-4" />
            </div>

            {/* Reels Grid / Carousel */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-7xl mx-auto">
              {bestSellersReels.map((reel, i) => (
                <ReelCard key={i} {...reel} />
              ))}
            </div>

            <div className="mt-16 text-center">
              <button className="bg-primary hover:bg-primary/90 text-white transition-all px-12 py-4 tracking-widest uppercase font-bold text-xs shadow-lg rounded-full">
                Explore More Reels
              </button>
            </div>
          </div>
        </section>

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
                  <button className="bg-primary text-white px-8 py-3 text-xs font-bold uppercase tracking-widest shadow-md hover:bg-primary/90">
                    Shop Bridal
                  </button>
                </div>
              </div>
              {/* Products Grid */}
              <div className="w-full lg:w-2/3 grid grid-cols-2 gap-6">
                {weddingEdit.map((product, i) => (
                  <ProductCard key={i} {...product} />
                ))}
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
          <div className="flex overflow-x-auto space-x-6 pb-8 no-scrollbar -mx-4 px-4 snap-x">
            {giftSets.map((product, i) => (
              <div key={i} className="min-w-[200px] md:min-w-[250px] snap-start">
                <ProductCard {...product} />
              </div>
            ))}
          </div>
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
                <button className="bg-primary hover:bg-primary/90 text-white px-12 py-4 tracking-widest uppercase font-bold text-xs transition-colors shadow-lg">
                  Explore Styles
                </button>
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {budgetBuys.map((product, i) => (
              <ProductCard key={i} {...product} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <button className="border-b-2 border-primary text-primary font-bold text-xs uppercase tracking-widest pb-1 hover:text-primary/80">View All Budget Buys</button>
          </div>
        </section>

        {/* Reviews Section */}
        <Reviews />
      </main>

      <Footer />
    </div>
  );
}
