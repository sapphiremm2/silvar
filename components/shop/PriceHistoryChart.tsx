'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import { formatSapphires } from '@/lib/utils/sapphires'

interface PricePoint {
  sale_date: string
  price_sapphires: number
}

interface Props {
  data: PricePoint[]
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="glass border border-[rgba(0,242,255,0.2)] rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="text-[#64748b] mb-0.5">{label}</p>
      <p className="text-[#00f2ff] font-bold">💎 {formatSapphires(payload[0].value)}</p>
    </div>
  )
}

export function PriceHistoryChart({ data }: Props) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-[#64748b] text-sm">
        <span>No price history yet</span>
      </div>
    )
  }

  const chartData = data.map((p) => ({
    date: formatDate(p.sale_date),
    price: p.price_sapphires,
  }))

  return (
    <ResponsiveContainer width="100%" height={160}>
      <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#00f2ff" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#00f2ff" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,242,255,0.06)" />
        <XAxis
          dataKey="date"
          tick={{ fill: '#64748b', fontSize: 10 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#64748b', fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `💎${(v / 1000).toFixed(1)}k`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="price"
          stroke="#00f2ff"
          strokeWidth={2}
          fill="url(#priceGrad)"
          dot={false}
          activeDot={{ r: 4, fill: '#00f2ff', stroke: '#020617', strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
