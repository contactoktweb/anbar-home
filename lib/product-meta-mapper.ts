/**
 * Utilidad central para convertir un producto de Sanity al formato exacto
 * requerido por Meta Catalogs y Meta Conversions API.
 * Single Source of Truth para el ID del producto y sus atributos principales.
 */

export interface SanityProductPartial {
  _id: string;
  name?: string;
  sku?: string;
  slug?: { current: string };
  description?: string;
  price?: number;
  currency?: string;
  condition?: string;
  availability?: string;
  brand?: string;
  imageUrl?: string;
}

export interface MetaProductFormat {
  id: string;
  title: string;
  description: string;
  availability: string;
  condition: string;
  price: string;
  link: string;
  image_link: string;
  brand: string;
}

/**
 * Corrige textos que están completamente en mayúsculas (rechazados por Meta)
 */
function formatMetaText(str: string, isTitle: boolean = false): string {
  if (!str) return '';
  const upperCount = (str.match(/[A-ZÁÉÍÓÚÑ]/g) || []).length;
  const letterCount = (str.match(/[a-zA-ZáéíóúñÁÉÍÓÚÑ]/g) || []).length;
  
  // Si más del 40% del texto son mayúsculas, lo formateamos
  if (letterCount > 0 && (upperCount / letterCount) > 0.4) {
    if (isTitle) {
      // Title Case: "Reno Felpa Mediano"
      return str.toLowerCase().split(/\s+/).map(word => {
        if (!word) return word;
        return word.charAt(0).toUpperCase() + word.slice(1);
      }).join(' ');
    } else {
      // Sentence Case para descripciones
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }
  }
  return str;
}

export function sanityToMetaProduct(product: SanityProductPartial): MetaProductFormat {
  // El ID del catálogo DEBE ser idéntico al content_ids que se manda en el pixel.
  // Prioridad 1: SKU. Prioridad 2: ID de Sanity.
  const id = product.sku || product._id;
  
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://anbarhome.com').replace(/\/$/, '');
  
  // Limpieza de strings y corrección de MAYÚSCULAS
  const rawTitle = (product.name || '').replace(/"/g, '""');
  const title = formatMetaText(rawTitle, true);
  
  const rawDescription = (product.description || product.name || '').replace(/"/g, '""').replace(/\n/g, ' ').substring(0, 5000);
  const description = formatMetaText(rawDescription, false);
  
  // Valores seguros por defecto
  const availability = product.availability || 'in stock';
  const condition = product.condition || 'new';
  const price = `${product.price || 0} ${product.currency || 'COP'}`;
  
  // Link
  // Usamos _id para la ruta si la plataforma usa app/product/[id].
  // Si en el futuro cambian a slug, aquí se modificará a product.slug?.current.
  const link = `${siteUrl}/product/${product._id}`;
  
  const imageLink = product.imageUrl || '';
  const brand = product.brand || 'Anbar Home';

  return {
    id,
    title,
    description,
    availability,
    condition,
    price,
    link,
    image_link: imageLink,
    brand
  };
}

/**
 * Utilidad para devolver el ID exacto que se debe usar en los eventos del Frontend
 */
export function getMetaContentId(product: SanityProductPartial): string {
  return product.sku || product._id;
}
