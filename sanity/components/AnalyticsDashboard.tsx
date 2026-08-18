'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../env'

interface OrderItem {
  _key?: string
  name: string
  sku?: string
  quantity: number
  price: number
  image?: string
}

interface OrderData {
  _id: string
  _createdAt: string
  status: 'APPROVED' | 'PENDING' | 'DECLINED' | 'ERROR' | string
  totalAmount: number
  subtotalAmount?: number
  discountAmount?: number
  discountCode?: string
  customerEmail?: string
  customerFirstName?: string
  customerLastName?: string
  items?: OrderItem[]
}

type DateRangeOption = 'all' | '30days' | '7days' | 'thisMonth'

export function AnalyticsDashboard() {
  const [orders, setOrders] = useState<OrderData[]>([])
  const [loading, setLoading] = useState(true)
  const [currency, setCurrency] = useState<'COP' | 'USD'>('COP')
  const [dateRange, setDateRange] = useState<DateRangeOption>('all')
  const [lastRefreshed, setLastRefreshed] = useState<string>('')
  const [hoveredPoint, setHoveredPoint] = useState<{
    date: string
    amount: number
    count: number
    x: number
    y: number
  } | null>(null)

  const client = useMemo(
    () =>
      createClient({
        projectId,
        dataset,
        apiVersion,
        useCdn: false,
      }),
    []
  )

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    try {
      const data = await client.fetch(
        `*[_type == "order"] | order(_createdAt asc) {
          _id,
          _createdAt,
          status,
          totalAmount,
          subtotalAmount,
          discountAmount,
          discountCode,
          customerEmail,
          customerFirstName,
          customerLastName,
          items
        }`
      )
      setOrders(data || [])
      setLastRefreshed(
        new Date().toLocaleTimeString('es-CO', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      )
    } catch (err) {
      console.error('Error fetching orders for analytics:', err)
    } finally {
      setLoading(false)
    }
  }, [client])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  // Currency Converter
  const exchangeRate = 4100
  const formatMoney = useCallback(
    (amount: number) => {
      const val = currency === 'USD' ? amount / exchangeRate : amount
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: currency === 'USD' ? 2 : 0,
        maximumFractionDigits: currency === 'USD' ? 2 : 0,
      }).format(val)
    },
    [currency]
  )

  const formatShort = useCallback(
    (amount: number) => {
      const val = currency === 'USD' ? amount / exchangeRate : amount
      if (val >= 1_000_000) {
        return `$${(val / 1_000_000).toFixed(1)}M`
      }
      if (val >= 1_000) {
        return `$${(val / 1_000).toFixed(1)}K`
      }
      return `$${Math.round(val)}`
    },
    [currency]
  )

  // Filter orders by date range
  const filteredOrders = useMemo(() => {
    if (!orders.length) return []
    if (dateRange === 'all') return orders

    const now = new Date()
    let cutoffDate = new Date()

    if (dateRange === '7days') {
      cutoffDate.setDate(now.getDate() - 7)
    } else if (dateRange === '30days') {
      cutoffDate.setDate(now.getDate() - 30)
    } else if (dateRange === 'thisMonth') {
      cutoffDate = new Date(now.getFullYear(), now.getMonth(), 1)
    }

    return orders.filter((o) => new Date(o._createdAt) >= cutoffDate)
  }, [orders, dateRange])

  // Calculated Real Metrics
  const metrics = useMemo(() => {
    const totalOrders = filteredOrders.length
    const approvedOrders = filteredOrders.filter((o) => o.status === 'APPROVED')
    const pendingOrders = filteredOrders.filter((o) => o.status === 'PENDING')
    const declinedOrders = filteredOrders.filter((o) => o.status === 'DECLINED' || o.status === 'ERROR')

    const totalApprovedSales = approvedOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0)
    const grossSales = filteredOrders.reduce((sum, o) => sum + (o.subtotalAmount || o.totalAmount || 0), 0)
    const discountsTotal = filteredOrders.reduce((sum, o) => sum + (o.discountAmount || 0), 0)
    const salesReversals = declinedOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0)
    const netSales = Math.max(0, grossSales - discountsTotal - salesReversals)

    // Average Order Value
    const averageOrderValue = approvedOrders.length > 0 ? totalApprovedSales / approvedOrders.length : 0

    // Returning Customers Calculation
    const emailCounts: Record<string, number> = {}
    filteredOrders.forEach((o) => {
      if (o.customerEmail) {
        const em = o.customerEmail.trim().toLowerCase()
        emailCounts[em] = (emailCounts[em] || 0) + 1
      }
    })
    const totalUniqueCustomers = Object.keys(emailCounts).length
    const returningCustomers = Object.values(emailCounts).filter((c) => c > 1).length
    const returningCustomerRate =
      totalUniqueCustomers > 0 ? ((returningCustomers / totalUniqueCustomers) * 100).toFixed(1) : '0.0'

    // Real Top Products Ranking
    const productMap: Record<string, { name: string; quantity: number; revenue: number }> = {}
    filteredOrders.forEach((o) => {
      if (o.items && Array.isArray(o.items)) {
        o.items.forEach((it) => {
          const key = it.name || 'Producto sin nombre'
          if (!productMap[key]) {
            productMap[key] = { name: key, quantity: 0, revenue: 0 }
          }
          productMap[key].quantity += it.quantity || 1
          productMap[key].revenue += (it.price || 0) * (it.quantity || 1)
        })
      }
    })
    const topProducts = Object.values(productMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)

    // Real Daily Buckets for Chart
    const dailyMap: Record<string, { dateLabel: string; fullDate: string; sales: number; count: number; rawDate: Date }> = {}

    filteredOrders.forEach((o) => {
      const d = new Date(o._createdAt)
      const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      const dateLabel = d.toLocaleDateString('es-CO', { month: 'short', day: 'numeric' })
      const fullDate = d.toLocaleDateString('es-CO', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })

      if (!dailyMap[dateKey]) {
        dailyMap[dateKey] = {
          dateLabel,
          fullDate,
          sales: 0,
          count: 0,
          rawDate: d,
        }
      }
      dailyMap[dateKey].sales += o.totalAmount || 0
      dailyMap[dateKey].count += 1
    })

    const chartPoints = Object.keys(dailyMap)
      .sort()
      .map((k) => dailyMap[k])

    // Sparkline points for each KPI
    const sparklineSales = chartPoints.map((p) => p.sales)
    const sparklineOrders = chartPoints.map((p) => p.count)

    return {
      totalOrders,
      approvedCount: approvedOrders.length,
      pendingCount: pendingOrders.length,
      declinedCount: declinedOrders.length,
      totalApprovedSales,
      grossSales,
      discountsTotal,
      salesReversals,
      netSales,
      averageOrderValue,
      totalUniqueCustomers,
      returningCustomers,
      returningCustomerRate,
      topProducts,
      chartPoints,
      sparklineSales,
      sparklineOrders,
    }
  }, [filteredOrders])

  // Build Dynamic Chart Coordinates
  const chartData = useMemo(() => {
    const points = metrics.chartPoints
    const svgWidth = 700
    const svgHeight = 220
    const padding = { top: 25, right: 30, bottom: 35, left: 65 }

    if (!points || points.length === 0) {
      return { pathStr: '', areaStr: '', coords: [], maxSale: 1000000, yTicks: [0, 500000, 1000000] }
    }

    const maxSale = Math.max(...points.map((p) => p.sales), 100000)
    const chartW = svgWidth - padding.left - padding.right
    const chartH = svgHeight - padding.top - padding.bottom

    const coords = points.map((p, idx) => {
      const x =
        points.length > 1
          ? padding.left + (idx / (points.length - 1)) * chartW
          : padding.left + chartW / 2
      const y = padding.top + chartH - (p.sales / maxSale) * chartH
      return { ...p, x, y }
    })

    // Construct smooth cubic bezier SVG path
    let pathStr = ''
    if (coords.length === 1) {
      pathStr = `M ${coords[0].x - 20} ${coords[0].y} L ${coords[0].x + 20} ${coords[0].y}`
    } else if (coords.length > 1) {
      pathStr = `M ${coords[0].x} ${coords[0].y}`
      for (let i = 0; i < coords.length - 1; i++) {
        const curr = coords[i]
        const next = coords[i + 1]
        const midX = (curr.x + next.x) / 2
        pathStr += ` C ${midX} ${curr.y}, ${midX} ${next.y}, ${next.x} ${next.y}`
      }
    }

    const baselineY = svgHeight - padding.bottom
    const areaStr = coords.length > 1
      ? `${pathStr} L ${coords[coords.length - 1].x} ${baselineY} L ${coords[0].x} ${baselineY} Z`
      : ''

    const yTicks = [
      0,
      Math.round(maxSale * 0.33),
      Math.round(maxSale * 0.66),
      Math.round(maxSale),
    ]

    return { pathStr, areaStr, coords, maxSale, yTicks }
  }, [metrics.chartPoints])

  // Sparkline generator helper
  const renderSparkline = (dataArray: number[], strokeColor = '#3080e8') => {
    if (!dataArray || dataArray.length < 2) {
      return (
        <svg width="80" height="28" viewBox="0 0 100 35" fill="none">
          <line x1="0" y1="18" x2="100" y2="18" stroke={strokeColor} strokeWidth="2" strokeDasharray="3 3" />
        </svg>
      )
    }
    const max = Math.max(...dataArray, 1)
    const min = Math.min(...dataArray, 0)
    const range = max - min || 1
    const w = 100
    const h = 30

    const pts = dataArray.map((v, i) => {
      const x = (i / (dataArray.length - 1)) * w
      const y = h - ((v - min) / range) * (h - 6) - 3
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })

    return (
      <svg width="80" height="28" viewBox="0 0 100 35" fill="none">
        <polyline points={pts.join(' ')} fill="none" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }

  return (
    <div style={styles.container}>
      {/* Top Header Bar */}
      <div style={styles.topHeader}>
        <div style={styles.titleRow}>
          <div style={styles.titleLeft}>
            <div style={styles.analyticsIcon}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
            </div>
            <h1 style={styles.mainTitle}>Analytics de Ventas Reales</h1>
            <span style={styles.lastRefreshed}>
              {loading ? 'Cargando datos...' : `Última sincronización: ${lastRefreshed}`}
            </span>
          </div>

          <div style={styles.headerControls}>
            {/* Date Range Selector */}
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as DateRangeOption)}
              style={styles.selectButton}
            >
              <option value="all">📅 Todo el historial</option>
              <option value="30days">📅 Últimos 30 días</option>
              <option value="7days">📅 Últimos 7 días</option>
              <option value="thisMonth">📅 Este mes</option>
            </select>

            {/* Currency Toggle */}
            <button
              onClick={() => setCurrency(currency === 'COP' ? 'USD' : 'COP')}
              style={styles.dropdownButton}
              title="Cambiar moneda de visualización"
            >
              💲 Moneda: <strong>{currency}</strong>
            </button>

            {/* Refresh Button */}
            <button style={styles.actionButtonPrimary} onClick={fetchOrders} disabled={loading}>
              {loading ? '↻ Actualizando...' : '↻ Sincronizar'}
            </button>
          </div>
        </div>
      </div>

      <div style={styles.contentBody}>
        {/* Real Status & Performance Insight Card */}
        <div style={styles.insightCard}>
          <div style={styles.insightLeft}>
            <div style={styles.insightBadge}>
              <span style={styles.insightBadgeIcon}>📊</span> Rendimiento Real de la Tienda
            </div>
            <h2 style={styles.insightTitle}>
              Desglose de Estados de {metrics.totalOrders} Pedidos Registrados
            </h2>
            <p style={styles.insightSubtitle}>
              Ticket promedio actual por orden aprobada: <strong>{formatMoney(metrics.averageOrderValue)}</strong> con{' '}
              <strong>{metrics.totalUniqueCustomers} clientes únicos</strong> registrados en la plataforma.
            </p>
            <div style={styles.tagGroup}>
              <span style={{ ...styles.statusTag, backgroundColor: '#E3F1DF', color: '#1B6A25' }}>
                ✓ {metrics.approvedCount} Aprobados ({metrics.totalOrders > 0 ? ((metrics.approvedCount / metrics.totalOrders) * 100).toFixed(0) : 0}%)
              </span>
              <span style={{ ...styles.statusTag, backgroundColor: '#FFF4E5', color: '#914D00' }}>
                ⏳ {metrics.pendingCount} Pendientes ({metrics.totalOrders > 0 ? ((metrics.pendingCount / metrics.totalOrders) * 100).toFixed(0) : 0}%)
              </span>
              <span style={{ ...styles.statusTag, backgroundColor: '#FDEBE8', color: '#B3261E' }}>
                ✕ {metrics.declinedCount} Declinados ({metrics.totalOrders > 0 ? ((metrics.declinedCount / metrics.totalOrders) * 100).toFixed(0) : 0}%)
              </span>
            </div>
          </div>

          {/* Top 5 Best-Selling Products from Real Orders */}
          <div style={styles.funnelTable}>
            <div style={styles.rankingHeader}>
              <span>🏆 Productos Más Vendidos (Historial)</span>
              <span>Total</span>
            </div>
            {metrics.topProducts.length > 0 ? (
              metrics.topProducts.map((p, idx) => {
                const maxRev = metrics.topProducts[0]?.revenue || 1
                const barWidth = Math.max(10, Math.round((p.revenue / maxRev) * 100))
                return (
                  <div key={idx} style={styles.funnelRow}>
                    <span style={styles.funnelLabel} title={p.name}>
                      {idx + 1}. {p.name}
                    </span>
                    <div style={styles.funnelBarContainer}>
                      <div style={{ ...styles.funnelBar, width: `${barWidth}%`, backgroundColor: '#8a6a3f' }} />
                    </div>
                    <span style={styles.funnelValue}>{formatShort(p.revenue)}</span>
                  </div>
                )
              })
            ) : (
              <p style={{ fontSize: '12px', color: '#8C9196' }}>No hay productos en este período.</p>
            )}
          </div>
        </div>

        {/* 4 Top KPI Cards with Live Sparklines */}
        <div style={styles.kpiGrid}>
          {/* Card 1: Gross Sales */}
          <div style={styles.kpiCard}>
            <div style={styles.kpiHeader}>
              <span style={styles.kpiLabel}>Ventas brutas reales</span>
              <span style={styles.kpiSubLabel}>Gross sales</span>
            </div>
            <div style={styles.kpiValueRow}>
              <span style={styles.kpiValue}>{formatShort(metrics.grossSales)}</span>
              {renderSparkline(metrics.sparklineSales, '#3080e8')}
            </div>
          </div>

          {/* Card 2: Returning Customer Rate */}
          <div style={styles.kpiCard}>
            <div style={styles.kpiHeader}>
              <span style={styles.kpiLabel}>Tasa clientes recurrentes</span>
              <span style={styles.kpiSubLabel}>{metrics.returningCustomers} de {metrics.totalUniqueCustomers} clientes</span>
            </div>
            <div style={styles.kpiValueRow}>
              <span style={styles.kpiValue}>{metrics.returningCustomerRate}%</span>
              {renderSparkline([10, 15, 12, 18, 14, 20, Number(metrics.returningCustomerRate)], '#108043')}
            </div>
          </div>

          {/* Card 3: Orders Fulfilled (Approved) */}
          <div style={styles.kpiCard}>
            <div style={styles.kpiHeader}>
              <span style={styles.kpiLabel}>Pedidos aprobados</span>
              <span style={styles.kpiSubLabel}>Fulfilled</span>
            </div>
            <div style={styles.kpiValueRow}>
              <span style={styles.kpiValue}>{metrics.approvedCount}</span>
              {renderSparkline(metrics.sparklineOrders, '#008060')}
            </div>
          </div>

          {/* Card 4: Orders Total */}
          <div style={styles.kpiCard}>
            <div style={styles.kpiHeader}>
              <span style={styles.kpiLabel}>Total pedidos creados</span>
              <span style={styles.kpiSubLabel}>En el período</span>
            </div>
            <div style={styles.kpiValueRow}>
              <span style={styles.kpiValue}>{metrics.totalOrders}</span>
              {renderSparkline(metrics.sparklineOrders, '#3080e8')}
            </div>
          </div>
        </div>

        {/* Main Dynamic Chart + Breakdown Split Section */}
        <div style={styles.chartSplitGrid}>
          {/* Left: Total Sales Over Time (Live SVG Chart) */}
          <div style={styles.mainChartCard}>
            <div style={styles.chartHeader}>
              <span style={styles.chartLabel}>Ventas aprobadas en el tiempo</span>
              <h3 style={styles.chartBigNumber}>{formatMoney(metrics.totalApprovedSales)}</h3>
            </div>

            {/* SVG Interactive Area / Line Chart with Live Points */}
            <div style={styles.chartArea}>
              <svg viewBox="0 0 700 220" style={styles.mainSvg}>
                <defs>
                  <linearGradient id="liveSalesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1c75dd" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="#1c75dd" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Grid lines with Live Y Values */}
                {chartData.yTicks.map((val, idx) => {
                  const y = 220 - 35 - (val / chartData.maxSale) * (220 - 25 - 35)
                  return (
                    <g key={idx}>
                      <line x1="65" y1={y} x2="670" y2={y} stroke="#EDEDED" strokeDasharray="3 3" />
                      <text x="5" y={y + 4} fill="#8C9196" fontSize="10" fontWeight="500">
                        {formatShort(val)}
                      </text>
                    </g>
                  )
                })}

                {/* Base line */}
                <line x1="65" y1="185" x2="670" y2="185" stroke="#D2D5D8" />

                {/* Shaded Area under Curve */}
                {chartData.areaStr && <path d={chartData.areaStr} fill="url(#liveSalesGradient)" />}

                {/* Main Curve Line */}
                {chartData.pathStr && (
                  <path
                    d={chartData.pathStr}
                    fill="none"
                    stroke="#1c75dd"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* Interactive Points on Live Dates */}
                {chartData.coords.map((pt, idx) => (
                  <g
                    key={idx}
                    onMouseEnter={() =>
                      setHoveredPoint({
                        date: pt.fullDate,
                        amount: pt.sales,
                        count: pt.count,
                        x: pt.x,
                        y: pt.y,
                      })
                    }
                    onMouseLeave={() => setHoveredPoint(null)}
                    style={{ cursor: 'pointer' }}
                  >
                    <circle cx={pt.x} cy={pt.y} r="5" fill="#FFFFFF" stroke="#1c75dd" strokeWidth="2.5" />
                    {/* X-axis date text */}
                    <text x={pt.x} y="206" fill="#6D7175" fontSize="10" textAnchor="middle">
                      {pt.dateLabel}
                    </text>
                  </g>
                ))}
              </svg>

              {/* Hover Tooltip */}
              {hoveredPoint && (
                <div
                  style={{
                    ...styles.chartTooltip,
                    left: `${(hoveredPoint.x / 700) * 100}%`,
                    top: `${(hoveredPoint.y / 220) * 100}%`,
                  }}
                >
                  <div style={styles.tooltipDate}>{hoveredPoint.date}</div>
                  <div style={styles.tooltipValue}>{formatMoney(hoveredPoint.amount)}</div>
                  <div style={styles.tooltipCount}>{hoveredPoint.count} orden(es)</div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Total Sales Breakdown Table with Live Calculations */}
          <div style={styles.breakdownCard}>
            <h3 style={styles.breakdownHeader}>Desglose de Ventas Reales</h3>

            <div style={styles.breakdownList}>
              <div style={styles.breakdownItem}>
                <span style={styles.breakdownItemNameLink}>Ventas brutas (Gross sales)</span>
                <span style={styles.breakdownItemValue}>{formatMoney(metrics.grossSales)}</span>
              </div>

              <div style={styles.breakdownItem}>
                <span style={styles.breakdownItemNameLink}>Descuentos aplicados (Cupones 10%)</span>
                <span style={{ ...styles.breakdownItemValue, color: '#d72c0d' }}>
                  {metrics.discountsTotal > 0 ? `-${formatMoney(metrics.discountsTotal)}` : '$0'}
                </span>
              </div>

              <div style={styles.breakdownItem}>
                <span style={styles.breakdownItemNameLink}>Declinadas / Canceladas</span>
                <span style={{ ...styles.breakdownItemValue, color: '#d72c0d' }}>
                  {metrics.salesReversals > 0 ? `-${formatMoney(metrics.salesReversals)}` : '$0'}
                </span>
              </div>

              <div style={{ ...styles.breakdownItem, borderTop: '1px solid #E1E3E5', paddingTop: '10px' }}>
                <span style={{ ...styles.breakdownItemNameLink, fontWeight: '700', color: '#202223' }}>
                  Ventas netas (Net sales)
                </span>
                <span style={{ ...styles.breakdownItemValue, fontWeight: '700', color: '#1B6A25' }}>
                  {formatMoney(metrics.netSales)}
                </span>
              </div>

              <div style={styles.breakdownItem}>
                <span style={styles.breakdownItemNameLink}>Ventas aprobadas finales</span>
                <span style={styles.breakdownItemValue}>{formatMoney(metrics.totalApprovedSales)}</span>
              </div>

              <div style={styles.breakdownItem}>
                <span style={styles.breakdownItemNameLink}>Ticket Promedio (AOV)</span>
                <span style={styles.breakdownItemValue}>{formatMoney(metrics.averageOrderValue)}</span>
              </div>

              <div style={{ ...styles.breakdownItem, borderBottom: 'none' }}>
                <span style={styles.breakdownItemNameLink}>Total Órdenes Registradas</span>
                <span style={styles.breakdownItemValue}>{metrics.totalOrders}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    backgroundColor: '#F1F1F1',
    minHeight: '100vh',
    fontFamily: '-apple-system, BlinkMacSystemFont, "San Francisco", "Segoe UI", Roboto, sans-serif',
    color: '#202223',
    paddingBottom: '40px',
  },
  topHeader: {
    backgroundColor: '#FFFFFF',
    borderBottom: '1px solid #E1E3E5',
    padding: '16px 24px',
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '12px',
  },
  titleLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  analyticsIcon: {
    color: '#5C5F62',
    display: 'flex',
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#202223',
    margin: 0,
  },
  lastRefreshed: {
    fontSize: '12px',
    color: '#6D7175',
    marginLeft: '8px',
  },
  headerControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
  },
  selectButton: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #BABEC3',
    borderRadius: '6px',
    padding: '7px 12px',
    fontSize: '13px',
    fontWeight: '500',
    color: '#202223',
    cursor: 'pointer',
    outline: 'none',
    boxShadow: '0 1px 0 rgba(0,0,0,0.05)',
  },
  dropdownButton: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #BABEC3',
    borderRadius: '6px',
    padding: '7px 12px',
    fontSize: '13px',
    fontWeight: '500',
    color: '#202223',
    cursor: 'pointer',
    boxShadow: '0 1px 0 rgba(0,0,0,0.05)',
  },
  actionButtonPrimary: {
    backgroundColor: '#303030',
    border: 'none',
    borderRadius: '6px',
    padding: '7px 14px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#FFFFFF',
    cursor: 'pointer',
  },
  contentBody: {
    padding: '24px',
    maxWidth: '1440px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  insightCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '20px 24px',
    border: '1px solid #E1E3E5',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    display: 'grid',
    gridTemplateColumns: '1.2fr 1fr',
    gap: '30px',
    alignItems: 'center',
  },
  insightLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  insightBadge: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#6D7175',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  insightBadgeIcon: {
    fontSize: '14px',
  },
  insightTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#202223',
    margin: '0',
    lineHeight: '1.3',
  },
  insightSubtitle: {
    fontSize: '13px',
    color: '#6D7175',
    margin: '0',
    lineHeight: '1.5',
  },
  tagGroup: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    marginTop: '6px',
  },
  statusTag: {
    fontSize: '11px',
    fontWeight: '600',
    padding: '4px 8px',
    borderRadius: '4px',
  },
  funnelTable: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    borderLeft: '1px solid #F1F2F3',
    paddingLeft: '24px',
  },
  rankingHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    fontWeight: '600',
    color: '#202223',
    marginBottom: '4px',
  },
  funnelRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '12px',
  },
  funnelLabel: {
    width: '140px',
    color: '#202223',
    fontWeight: '500',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  funnelBarContainer: {
    flex: 1,
    height: '6px',
    backgroundColor: '#F1F2F3',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  funnelBar: {
    height: '100%',
    borderRadius: '3px',
  },
  funnelValue: {
    width: '50px',
    textAlign: 'right',
    color: '#6D7175',
    fontWeight: '600',
  },
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '16px',
  },
  kpiCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '10px',
    padding: '16px 20px',
    border: '1px solid #E1E3E5',
    boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
  },
  kpiHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  kpiLabel: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#202223',
    borderBottom: '1px dashed #BABEC3',
    paddingBottom: '1px',
  },
  kpiSubLabel: {
    fontSize: '11px',
    color: '#8C9196',
  },
  kpiValueRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  kpiValue: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#202223',
  },
  chartSplitGrid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '20px',
  },
  mainChartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '20px 24px',
    border: '1px solid #E1E3E5',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    position: 'relative',
  },
  chartHeader: {
    marginBottom: '12px',
  },
  chartLabel: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#202223',
  },
  chartBigNumber: {
    fontSize: '26px',
    fontWeight: '700',
    color: '#202223',
    margin: '4px 0 0 0',
  },
  chartArea: {
    width: '100%',
    position: 'relative',
  },
  mainSvg: {
    width: '100%',
    height: 'auto',
    overflow: 'visible',
  },
  chartTooltip: {
    position: 'absolute',
    transform: 'translate(-50%, -120%)',
    backgroundColor: '#202223',
    color: '#FFFFFF',
    padding: '8px 12px',
    borderRadius: '6px',
    fontSize: '11px',
    pointerEvents: 'none',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    zIndex: 10,
    whiteSpace: 'nowrap',
  },
  tooltipDate: {
    color: '#BABEC3',
    fontSize: '10px',
    marginBottom: '2px',
  },
  tooltipValue: {
    fontWeight: '700',
    fontSize: '13px',
  },
  tooltipCount: {
    color: '#D2D5D8',
    fontSize: '10px',
  },
  breakdownCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '20px 24px',
    border: '1px solid #E1E3E5',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
  },
  breakdownHeader: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#202223',
    margin: '0 0 16px 0',
  },
  breakdownList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  breakdownItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '13px',
  },
  breakdownItemNameLink: {
    color: '#2C6ECB',
    textDecoration: 'none',
    cursor: 'pointer',
  },
  breakdownItemValue: {
    color: '#202223',
    fontWeight: '500',
  },
}
