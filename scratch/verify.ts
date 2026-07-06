import fs from 'fs'
import { parse } from 'csv-parse/sync'
import { createClient } from '@sanity/client'
import { apiVersion, dataset, projectId } from '../sanity/env'

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
})

async function run() {
  const content = fs.readFileSync('public/products.csv', 'utf-8')
  const records = parse(content, { columns: true, skip_empty_lines: true, relax_column_count: true })

  const csvCategories = new Set<string>()
  const csvProducts = new Map<string, string>()

  for (const record of records) {
    const rawCategory = record['Categorías']
    if (rawCategory) {
      const cats = rawCategory.split(',').map((c: string) => c.trim())
      const mainCat = cats[0].split('>')[0].trim()
      csvCategories.add(mainCat)
      csvProducts.set(record['Nombre'].trim(), mainCat)
    }
  }

  const sanityCategories = await client.fetch(`*[_type == "category"]{ title }`)
  const sanityCategoryTitles = new Set(sanityCategories.map((c: any) => c.title))

  const sanityProducts = await client.fetch(`*[_type == "product"]{ name, "category": category->title }`)
  
  console.log("=== CATEGORY VERIFICATION ===")
  const missingCategories = [...csvCategories].filter(c => !sanityCategoryTitles.has(c))
  if (missingCategories.length > 0) {
    console.log("❌ Missing categories in Sanity:", missingCategories)
  } else {
    console.log("✅ All CSV categories exist in Sanity")
  }

  let productsMissingCategory = 0
  let productsWithMismatchedCategory = 0
  
  for (const p of sanityProducts) {
    const csvCat = csvProducts.get(p.name)
    if (!p.category) {
      productsMissingCategory++
    } else if (csvCat && p.category !== csvCat) {
      productsWithMismatchedCategory++
    }
  }

  console.log(`\n=== PRODUCT-CATEGORY LINKING VERIFICATION ===`)
  console.log(`Total Products in Sanity: ${sanityProducts.length}`)
  console.log(`Products without any category linked: ${productsMissingCategory}`)
  console.log(`Products with mismatched category (vs CSV): ${productsWithMismatchedCategory}`)
  
  if (productsMissingCategory === 0 && productsWithMismatchedCategory === 0) {
    console.log("✅ All products are correctly linked to their respective categories.")
  } else {
    console.log("⚠️ Some products have missing or mismatched categories.")
  }
}

run().catch(console.error)
