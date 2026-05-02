import { getPayload } from 'payload';
import configPromise from '../../payload.config';

/**
 * Normalizes a Payload CMS product document into the flat format expected by the UI components.
 */
function normalizeProduct(doc) {
  return {
    id: doc.slug || doc.id.toString(), // Use slug (e.g. p001) as ID for URLs
    name: doc.name,
    category: typeof doc.category === 'object' ? doc.category?.name : doc.category,
    categoryId: typeof doc.category === 'object' ? doc.category?.id : doc.category,
    type: doc.type,
    price: Number(doc.price),
    originalPrice: Number(doc.originalPrice || doc.price),
    discount: doc.originalPrice && doc.originalPrice > doc.price 
      ? Math.round(((doc.originalPrice - doc.price) / doc.originalPrice) * 100) 
      : 0,
    purity: doc.purity,
    weight: doc.weight,
    description: doc.description || doc.shortDescription || '',
    images: doc.images?.length > 0 
      ? doc.images.map(img => img.image?.url).filter(Boolean) 
      : [],
    badge: doc.badge || null,
    inStock: doc.inStock,
    rating: Number(doc.rating) || 5.0,
    reviews: Number(doc.reviews) || 0,
    sizes: doc.sizes?.length > 0 ? doc.sizes.map(s => s.size) : null,
  };
}

export async function getAllProducts(limit = 100) {
  const payload = await getPayload({ config: configPromise });
  const result = await payload.find({
    collection: 'products',
    limit,
    depth: 1, // To fetch category name
  });
  return result.docs.map(normalizeProduct);
}

export async function getTrendingProducts(limit = 8) {
  const payload = await getPayload({ config: configPromise });
  const result = await payload.find({
    collection: 'products',
    where: {
      badge: { equals: 'Trending' }
    },
    limit,
    depth: 1,
  });
  
  // If we don't have enough trending, fallback to random
  let docs = result.docs;
  if (docs.length < limit) {
    const existingIds = docs.map(d => d.id);
    const extra = await payload.find({
      collection: 'products',
      where: {
        id: {
          not_in: existingIds
        }
      },
      limit: limit - docs.length,
      depth: 1,
    });
    docs = [...docs, ...extra.docs];
  }
  
  return docs.slice(0, limit).map(normalizeProduct);
}

export async function getFeaturedProducts(limit = 4) {
  const payload = await getPayload({ config: configPromise });
  const result = await payload.find({
    collection: 'products',
    where: {
      badge: { equals: 'Bestseller' }
    },
    limit,
    depth: 1,
  });
  return result.docs.map(normalizeProduct);
}

export async function getProductById(idOrSlug) {
  const payload = await getPayload({ config: configPromise });
  const result = await payload.find({
    collection: 'products',
    where: {
      slug: { equals: idOrSlug }
    },
    limit: 1,
    depth: 1,
  });
  
  if (result.docs.length > 0) {
    return normalizeProduct(result.docs[0]);
  }
  return null;
}

export async function getSimilarProducts(product, limit = 4) {
  if (!product) return [];
  const payload = await getPayload({ config: configPromise });
  const catId = product.categoryId;
  if (!catId || isNaN(Number(catId))) return [];

  const result = await payload.find({
    collection: 'products',
    where: {
      category: { equals: catId },
      slug: { not_equals: product.id }
    },
    limit,
    depth: 1,
  });
  return result.docs.map(normalizeProduct);
}

export async function getBanners() {
  const payload = await getPayload({ config: configPromise });
  const result = await payload.find({
    collection: 'banners',
    where: { isActive: { equals: true } },
    limit: 5,
    depth: 1,
  });
  
  return result.docs.map(doc => ({
    id: doc.id.toString(),
    title: doc.title,
    subtitle: doc.subtitle,
    description: doc.description,
    cta: doc.cta,
    badge: doc.badge,
    bgColor: doc.bgColor,
    accentColor: doc.accentColor,
    image: doc.image?.url || '/images/gold_collection.jpg',
    link: doc.link,
  }));
}

export async function getAllCategories() {
  const payload = await getPayload({ config: configPromise });
  const result = await payload.find({
    collection: 'categories',
    limit: 100,
    depth: 1,
  });
  
  return result.docs.map(doc => ({
    id: doc.id.toString(),
    name: doc.name,
    tagline: doc.tagline || '',
    description: doc.description || '',
    accent: doc.accentColor || '#c9962a',
    image: doc.image?.url || '/images/gold_collection.jpg',
    category: doc.name,
  }));
}
