import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';
import { sanityToMetaProduct } from '@/lib/product-meta-mapper';

export async function GET() {
  try {
    const query = `*[_type == "product" && !(_id in path('drafts.**'))] {
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
      "imageUrl": image.asset->url
    }`;

    const products = await client.fetch(query);
    const report = [];

    let totalProducts = products.length;
    let notReadyForCatalog = 0;
    let productsWithMissingFields = 0;
    let productsWithoutPublicImage = 0;
    let productsWithoutDescription = 0;
    let productsWithInvalidPrice = 0;
    let productsWithoutSlug = 0;
    let productsWithIdMismatch = 0; // Si no tiene SKU, usará _id, lo cual técnicamente no es un mismatch si se alinea con el Pixel, pero es mejor avisar si falta SKU.

    for (const product of products) {
      const missingFields: string[] = [];
      const priceIssues: string[] = [];
      const imageIssues: string[] = [];
      const urlIssues: string[] = [];
      const availabilityIssues: string[] = [];
      const metadataIssues: string[] = [];

      // Validar campos requeridos
      if (!product.name) missingFields.push('name');
      if (!product.sku) missingFields.push('sku');
      if (!product.description) {
        missingFields.push('description');
        productsWithoutDescription++;
      }
      if (!product.price) missingFields.push('price');
      if (!product.slug?.current) {
        missingFields.push('slug');
        productsWithoutSlug++;
        urlIssues.push('Falta slug en Sanity');
      }
      if (!product.currency) missingFields.push('currency');
      if (!product.availability) missingFields.push('availability');
      if (!product.condition) missingFields.push('condition');
      if (!product.brand) missingFields.push('brand');

      if (missingFields.length > 0) {
        productsWithMissingFields++;
      }

      // Validar precio
      if (typeof product.price !== 'number' || product.price <= 0) {
        priceIssues.push('Precio debe ser mayor a 0');
        productsWithInvalidPrice++;
      }

      // Validar imagen
      if (!product.imageUrl) {
        imageIssues.push('Falta imagen pública (mainImage)');
        productsWithoutPublicImage++;
      }

      // Validar URL (El link público se genera con el _id según nuestra arquitectura actual)
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://anbarhome.com';
      const link = `${siteUrl.replace(/\/$/, '')}/product/${product._id}`;
      if (!link.startsWith('http')) {
        urlIssues.push('URL generada es inválida o no absoluta');
      }

      // Validar id mismatch / SKU
      if (!product.sku) {
        metadataIssues.push('Advertencia: El producto no tiene SKU definido. Se usará el _id largo para Meta CAPI/Catálogo.');
        productsWithIdMismatch++;
      }

      // Catálogo Readiness
      const metaFormat = sanityToMetaProduct(product);
      let isCatalogReady = true;
      if (!metaFormat.id || !metaFormat.title || !metaFormat.price || !metaFormat.link || !metaFormat.image_link) {
        isCatalogReady = false;
        notReadyForCatalog++;
      }

      report.push({
        product: product.name || 'Sin Título',
        id: product._id,
        sku: product.sku || null,
        slug: product.slug?.current || null,
        isCatalogReady,
        missingFields,
        priceIssues,
        imageIssues,
        urlIssues,
        availabilityIssues,
        metadataIssues,
      });
    }

    const summary = {
      totalProducts,
      notReadyForCatalog,
      productsWithMissingFields,
      productsWithoutPublicImage,
      productsWithoutDescription,
      productsWithInvalidPrice,
      productsWithoutSlug,
      productsWithoutSKU: productsWithIdMismatch,
    };

    return NextResponse.json({
      success: true,
      summary,
      report
    });

  } catch (error: any) {
    console.error('Error in product audit:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
