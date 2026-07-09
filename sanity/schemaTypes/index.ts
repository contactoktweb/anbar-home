import { type SchemaTypeDefinition } from 'sanity'
import { globalSettings } from './globalSettings'
import { homePage } from './homePage'
import { product } from './product'
import { categoryType } from './categoryType'
import { legalPage } from './legalPage'
import { reviewType } from './reviewType'
import { faqType } from './faqType'
import { order } from './order'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [globalSettings, homePage, categoryType, product, legalPage, reviewType, faqType, order],
}
