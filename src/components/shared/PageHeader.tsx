import React from 'react'

type PageHeaderProps = {
  title: string
  subtitle?: string
  action?: React.ReactNode
}

export default function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <section className="mb-8 rounded-[2rem] border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-900/5">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-teal-700">Dashboard</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{title}</h1>
          {subtitle ? <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">{subtitle}</p> : null}
        </div>
        {action ? <div className="flex items-center justify-end">{action}</div> : null}
      </div>
    </section>
  )
}
