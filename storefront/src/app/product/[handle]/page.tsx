import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductByHandle, getProducts, formatPrice, getVariantPrice, Product } from "@/lib/medusa";
import { getDefaultRegionId } from "@/lib/regions";
import ProductDetailClient from "./ProductDetailClient";

interface ProductPageProps {
  params: Promise<{
    handle: string;
  }>;
}

export async function generateStaticParams() {
  try {
    const regionId = await getDefaultRegionId();
    const { products } = await getProducts({ limit: 100, region_id: regionId });
    return products.map((product) => ({
      handle: product.handle,
    }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { handle } = await params;
  try {
    const regionId = await getDefaultRegionId();
    const { products } = await getProducts({ handle, region_id: regionId });
    const product = products[0];
    if (!product) throw new Error("Product not found");
    return {
      title: `${product.title} | TATVA`,
      description: product.description || `Shop ${product.title} at TATVA`,
    };
  } catch {
    return {
      title: "Product Not Found | TATVA",
    };
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { handle } = await params;
  
  // Get region for pricing
  const regionId = await getDefaultRegionId();
  
  let product: Product;
  try {
    const { products } = await getProducts({ handle, region_id: regionId });
    if (!products[0]) {
      notFound();
    }
    product = products[0];
  } catch {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}
