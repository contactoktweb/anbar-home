import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

// Este cliente usa el token de API para tener permisos de escritura.
// ¡NUNCA debe ser expuesto en el lado del cliente (Client Components)!
export const adminClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Las mutaciones no deben usar CDN
  token: process.env.SANITY_API_TOKEN,
})
