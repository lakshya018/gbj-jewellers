// Server component — enables generateMetadata for per-product SEO
import { notFound } from 'next/navigation';
import { getProductById, getSimilarProducts } from '@/lib/payloadAPI';
import ProductDetailClient from './ProductDetailClient';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) {
    return {
      title: 'Product Not Found | GBJ Jewellers',
    };
  }

  const title = `${product.name} | GBJ Jewellers`;
  const description = `Buy ${product.name} — ${product.purity} ${product.category} jewellery at GBJ Jewellers. ${product.weight}. BIS Hallmarked. Free insured shipping. ₹${product.price.toLocaleString('en-IN')}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: product.images?.[0]
        ? [{ url: product.images[0], alt: product.name }]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    keywords: `${product.name}, ${product.category} jewellery, ${product.purity} gold, ${product.type}, buy jewellery online India, GBJ Jewellers`,
  };
}

export default async function ProductDetailPage({ params }) {
  const { id } = await params;
  const product = await getProductById(id);
  
  if (!product) return notFound();

  const similarProducts = await getSimilarProducts(product);

  return <ProductDetailClient initialProduct={product} similarProducts={similarProducts} />;
}
