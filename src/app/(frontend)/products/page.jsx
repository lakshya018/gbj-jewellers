import { getAllProducts } from '@/lib/payloadAPI';
import ProductsClient from './ProductsClient';

export const metadata = {
  title: 'All Collections | GBJ Jewellers',
  description: 'Explore our complete catalogue of premium gold, diamond, and bridal jewellery.',
};

export default async function ProductsPage() {
  const products = await getAllProducts();
  
  // Extract unique filters from the live database
  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
  const types = [...new Set(products.map(p => p.type).filter(Boolean))];
  const purities = [...new Set(products.map(p => p.purity).filter(Boolean))];

  return (
    <ProductsClient 
      products={products} 
      categories={categories} 
      types={types} 
      purities={purities} 
    />
  );
}
