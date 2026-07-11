require('dotenv').config({ path: '.env.local' });
const { createClient } = require('next-sanity');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD') // separate accents from letters
    .replace(/[\u0300-\u036f]/g, '') // remove all previously split accents
    .replace(/\s+/g, '-') // replace spaces with -
    .replace(/[^\w\-]+/g, '') // remove all non-word chars
    .replace(/\-\-+/g, '-') // replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

async function migrateSlugs() {
  console.log('Fetching products without slugs...');
  const query = `*[_type == "product" && !(_id in path('drafts.**')) && !defined(slug.current)] {
    _id,
    name,
    sku
  }`;
  
  const products = await client.fetch(query);
  console.log(`Found ${products.length} products to migrate.`);
  
  if (products.length === 0) return;

  const slugsInUse = new Set();
  const transaction = client.transaction();
  
  let count = 0;
  for (const product of products) {
    if (!product.name) continue;
    
    let baseSlug = slugify(product.name);
    let finalSlug = baseSlug;
    let counter = 1;
    
    while (slugsInUse.has(finalSlug)) {
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    slugsInUse.add(finalSlug);
    
    transaction.patch(product._id, (p) => p.set({
      slug: {
        _type: 'slug',
        current: finalSlug
      }
    }));
    
    count++;
  }
  
  if (count > 0) {
    console.log(`Committing transaction to update ${count} products...`);
    await transaction.commit();
    console.log('Migration successful!');
  } else {
    console.log('No valid products to update.');
  }
}

migrateSlugs().catch(console.error);
