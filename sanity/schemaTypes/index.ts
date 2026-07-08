import { type SchemaTypeDefinition } from 'sanity'
import { globalSettings } from './globalSettings'
import { homePage } from './homePage'
import { product } from './product'
import { categoryType } from './categoryType'
import { legalPage } from './legalPage'
import { reviewType } from './reviewType'
import { faqType } from './faqType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [globalSettings, homePage, categoryType, product, legalPage, reviewType, faqType],
}
