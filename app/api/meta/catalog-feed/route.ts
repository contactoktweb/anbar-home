import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';
import { sanityToMetaProduct } from '@/lib/product-meta-mapper';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const query = `*[_type == "product"] {
      _id,
      name,
      sku,
      slug,
      description,
      price,
      currency,
      availability,
      condition,
      brand,
      stock,
      categories[]->{title},
      "imageUrl": image.asset->url
    }`;

    const products = await client.fetch(query);

    const csvRows = [];
    // Cabeceras estándar de Meta Catalog
    csvRows.push('id,title,description,availability,condition,price,link,image_link,brand,inventory,origin_country,importer_name,importer_address,manufacturer_info,product_type');

    const seenIds = new Set<string>();

    for (const product of products) {
      const metaProd = sanityToMetaProduct(product);
      
      // Deduplicar ID si el SKU está repetido en diferentes productos de Sanity
      let finalId = metaProd.id;
      if (seenIds.has(finalId)) {
        finalId = `${finalId}-${product._id}`;
      }
      seenIds.add(finalId);
      
      // Asegurarse de que no haya comas problemáticas envolviendo los strings con comillas dobles
      csvRows.push(
        `${finalId},"${metaProd.title}","${metaProd.description}",${metaProd.availability},${metaProd.condition},${metaProd.price},${metaProd.link},${metaProd.image_link},"${metaProd.brand}",${metaProd.inventory},${metaProd.origin_country},"Anbar Home","Colombia","Anbar Home","${metaProd.product_type}"`
      );
    }

    const csvContent = csvRows.join('\n');

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="catalog-feed.csv"',
      },
    });
  } catch (error) {
    console.error('Error generando feed del catálogo:', error);
    return new NextResponse('Error generating catalog feed', { status: 500 });
  }
}
