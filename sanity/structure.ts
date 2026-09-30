import type {StructureResolver} from 'sanity/structure'
import {AnalyticsDashboard} from './components/AnalyticsDashboard'
import {ChartUpwardIcon, TagIcon, PackageIcon, DocumentTextIcon, UserIcon} from '@sanity/icons'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Contenido')
    .items([
      S.listItem()
        .title('Analytics & Métricas')
        .id('analyticsDashboard')
        .icon(ChartUpwardIcon)
        .child(
          S.component(AnalyticsDashboard)
            .title('Panel de Analytics')
        ),
      S.divider(),
      S.listItem()
        .title('Configuración Global')
        .id('globalSettings')
        .child(
          S.document()
            .schemaType('globalSettings')
            .documentId('globalSettings')
        ),
      S.listItem()
        .title('Página de Inicio')
        .id('homePage')
        .child(
          S.document()
            .schemaType('homePage')
            .documentId('homePage')
        ),
      S.divider(),
      S.listItem()
        .title('Categorías de la Tienda')
        .id('category')
        .icon(TagIcon)
        .child(
          S.documentTypeList('category')
            .title('Todas las Categorías')
        ),
      S.listItem()
        .title('Productos')
        .id('product')
        .icon(PackageIcon)
        .child(
          S.documentTypeList('product')
            .title('Todos los Productos')
        ),
      S.divider(),
      S.listItem()
        .title('Blog / Artículos')
        .id('post')
        .icon(DocumentTextIcon)
        .child(
          S.documentTypeList('post')
            .title('Todos los Artículos')
        ),
      S.listItem()
        .title('Autores')
        .id('author')
        .icon(UserIcon)
        .child(
          S.documentTypeList('author')
            .title('Autores')
        ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (listItem) => !['globalSettings', 'homePage', 'category', 'product', 'post', 'author', 'blockContent'].includes(listItem.getId() as string)
      ),
    ])


