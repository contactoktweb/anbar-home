import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';
import { sanityToMetaProduct } from '@/lib/product-meta-mapper';

export const revalidate = 3600; // Cache de 1 hora

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
      "imageUrl": image.asset->url
    }`;

    const products = await client.fetch(query);

    const csvRows = [];
    // Cabeceras estándar de Meta Catalog
    csvRows.push('id,title,description,availability,condition,price,link,image_link,brand');

    for (const product of products) {
      const metaProd = sanityToMetaProduct(product);
      
      // Asegurarse de que no haya comas problemáticas envolviendo los strings con comillas dobles
      csvRows.push(
        `${metaProd.id},"${metaProd.title}","${metaProd.description}",${metaProd.availability},${metaProd.condition},${metaProd.price},${metaProd.link},${metaProd.image_link},"${metaProd.brand}"`
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
