import { type SchemaTypeDefinition } from 'sanity'
import { globalSettings } from './globalSettings'
import { homePage } from './homePage'
import { product } from './product'
import { categoryType } from './categoryType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [globalSettings, homePage, categoryType, product],
}
