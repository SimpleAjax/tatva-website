import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductByHandle, getProducts, formatPrice, getVariantPrice, Product } from "@/lib/medusa";
import ProductDetailClient from "./ProductDetailClient";

interface ProductPageProps {
  params: Promise<{
    handle: string;
  }>;
}

export async function generateStaticParams() {
  try {
    const { products } = await getProducts({ limit: 100 });
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
    const { product } = await getProductByHandle(handle);
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
  
  let product: Product;
  try {
    const result = await getProductByHandle(handle);
    product = result.product;
  } catch {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}
