import React from 'react'

type PageHeaderProps = {
  title: string
  subtitle?: string
  action?: React.ReactNode
}

export default function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">{title}</h1>
        {subtitle ? <p className="mt-2 text-sm text-slate-500 max-w-2xl">{subtitle}</p> : null}
      </div>
      {action ? <div className="flex items-center justify-end">{action}</div> : null}
    </div>
  )
}
