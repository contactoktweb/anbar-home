import type {StructureResolver} from 'sanity/structure'
import {AnalyticsDashboard} from './components/AnalyticsDashboard'
import {ChartUpwardIcon} from '@sanity/icons'

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
      ...S.documentTypeListItems().filter(
        (listItem) => !['globalSettings', 'homePage'].includes(listItem.getId() as string)
      ),
    ])

