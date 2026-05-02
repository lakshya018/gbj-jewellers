import { getPayload } from 'payload';
import configPromise from './payload.config.js';
import { products, categories } from './src/data/products.js';

async function seed() {
  console.log('Initializing Payload...');
  const payload = await getPayload({ config: configPromise });

  console.log('Seeding categories...');
  const categoryMap = {};
  for (const catName of categories) {
    const existing = await payload.find({
      collection: 'categories',
      where: { name: { equals: catName } },
    });

    if (existing.docs.length > 0) {
      categoryMap[catName] = existing.docs[0].id;
    } else {
      const created = await payload.create({
        collection: 'categories',
        data: {
          name: catName,
        },
      });
      categoryMap[catName] = created.id;
    }
  }

  console.log('Seeding products...');
  for (const p of products) {
    const existing = await payload.find({
      collection: 'products',
      where: { name: { equals: p.name } },
    });

    if (existing.docs.length === 0) {
      await payload.create({
        collection: 'products',
        data: {
          name: p.name,
          description: p.description,
          price: p.price,
          originalPrice: p.originalPrice || 0,
          category: categoryMap[p.category],
          type: p.type,
          purity: p.purity,
          weight: p.weight,
          badge: p.badge,
          inStock: p.inStock,
          rating: p.rating,
          reviews: p.reviews,
        },
      });
      console.log(`Created product: ${p.name}`);
    } else {
      console.log(`Product already exists: ${p.name}`);
    }
  }

  console.log('Seeding complete!');
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
