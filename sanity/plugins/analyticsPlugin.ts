import { definePlugin } from 'sanity'
import { AnalyticsDashboard } from '../components/AnalyticsDashboard'
import { ChartUpwardIcon } from '@sanity/icons'

export const analyticsPlugin = definePlugin({
  name: 'analytics-dashboard-tool',
  tools: (prev) => [
    ...prev,
    {
      name: 'analytics',
      title: 'Analytics',
      icon: ChartUpwardIcon,
      component: AnalyticsDashboard,
    },
  ],
})
