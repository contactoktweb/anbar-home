import { client } from './sanity/lib/client'

async function main() {
  const categories = await client.fetch(`*[_type == "category"]{ title, slug }`)
  console.log(JSON.stringify(categories, null, 2))
}
main()
