import { type SchemaTypeDefinition } from 'sanity'
import { globalSettings } from './globalSettings'
import { homePage } from './homePage'
import { product } from './product'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [globalSettings, homePage, product],
}
