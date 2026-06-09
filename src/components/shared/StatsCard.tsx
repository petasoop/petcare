import React from 'react'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'

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
    <div className="group overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_70px_rgba(15,23,42,0.12)]">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-teal-50 text-teal-700 shadow-sm transition duration-300 group-hover:bg-teal-100">
            {icon}
          </div>
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">{label}</div>
            <div className="mt-2 text-3xl font-semibold text-slate-900">{value}</div>
          </div>
        </div>
        {trend ? (
          <div className={`inline-flex items-center gap-2 rounded-3xl px-3 py-2 text-xs font-semibold ${
            trend.direction === 'up' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
          }`}>
            {trend.direction === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
            <span>{trend.percent}%</span>
            {trend.label ? <span className="text-slate-500">{trend.label}</span> : null}
          </div>
        ) : null}
      </div>
    </div>
  )
}
