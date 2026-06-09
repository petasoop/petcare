import React from 'react'

type Trend = {
  direction: 'up' | 'down'
  percent: number
  label?: string
}

type StatsCardProps = {
  icon: React.ReactNode
  label: string
  value: string | number
  trend?: Trend
}

export default function StatsCard({ icon, label, value, trend }: StatsCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">{icon}</div>
          <div>
            <div className="text-sm font-medium text-slate-500">{label}</div>
            <div className="mt-1 text-2xl font-semibold text-slate-900">{value}</div>
          </div>
        </div>
        {trend ? (
          <div className={`rounded-full px-3 py-1 text-xs font-semibold ${trend.direction === 'up' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
            {trend.direction === 'up' ? '↑' : '↓'} {trend.percent}% {trend.label || ''}
          </div>
        ) : null}
      </div>
    </div>
  )
}
