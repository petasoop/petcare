"use client"
import React, { useEffect, useMemo, useState } from 'react'
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronsLeft, ChevronsRight, Inbox, Search } from 'lucide-react'

type Column<T> = {
  key: keyof T & string
  title: string
  sortable?: boolean
  render?: (row: T) => React.ReactNode
}

type EmptyAction = {
  label: string
  onClick: () => void
}

type Props<T extends Record<string, any>> = {
  columns: Column<T>[]
  data: T[]
  pageSize?: number
  searchPlaceholder?: string
  loading?: boolean
  emptyState?: React.ReactNode
  emptyAction?: EmptyAction
}

function normalizeValue(value: unknown) {
  if (value === null || value === undefined) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (value instanceof Date) return value.toISOString()
  return JSON.stringify(value)
}

export default function DataTable<T extends Record<string, any>>({
  columns,
  data,
  pageSize = 10,
  searchPlaceholder = 'Cari data...',
  loading = false,
  emptyState,
  emptyAction,
}: Props<T>) {
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return data

    return data.filter((row) =>
      columns.some((column) => normalizeValue(row[column.key]).toLowerCase().includes(term))
    )
  }, [columns, data, search])

  const sorted = useMemo(() => {
    if (!sortKey) return filtered

    const direction = sortDirection === 'asc' ? 1 : -1
    return [...filtered].sort((left, right) => {
      const a = normalizeValue(left[sortKey])
      const b = normalizeValue(right[sortKey])
      const aNumber = Number(a)
      const bNumber = Number(b)
      if (!Number.isNaN(aNumber) && !Number.isNaN(bNumber)) return (aNumber - bNumber) * direction
      return a.localeCompare(b, 'id', { numeric: true, sensitivity: 'base' }) * direction
    })
  }, [filtered, sortDirection, sortKey])

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const visibleRows = sorted.slice((page - 1) * pageSize, page * pageSize)

  useEffect(() => {
    setPage(1)
  }, [search, sortKey, sortDirection, data])

  const toggleSort = (column: Column<T>) => {
    if (!column.sortable) return
    if (sortKey === column.key) {
      setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'))
      return
    }
    setSortKey(column.key)
    setSortDirection('asc')
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_1px_20px_rgba(15,23,42,0.05)]">
      <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-900">Daftar Data</div>
          <div className="mt-1 text-sm text-slate-500">{loading ? 'Memuat data...' : `${sorted.length} baris ditemukan`}</div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label htmlFor="datatable-search" className="sr-only">Cari</label>
          <div className="relative w-full sm:w-80">
            <input
              id="datatable-search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={searchPlaceholder}
              disabled={loading}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-sm text-slate-800 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100 disabled:cursor-not-allowed disabled:opacity-60"
            />
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
              <Search size={16} />
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`whitespace-nowrap px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-600 ${
                    column.sortable ? 'cursor-pointer select-none hover:text-teal-700' : ''
                  }`}
                  onClick={() => toggleSort(column)}
                >
                  <div className="inline-flex items-center gap-2">
                    {column.title}
                    {column.sortable && (
                      <span className="text-slate-400">
                        {sortKey === column.key ? (sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />) : <ArrowUpDown size={14} />}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {loading ? (
              Array.from({ length: pageSize }).map((_, index) => (
                <tr key={index} className="animate-pulse">
                  {columns.map((column) => (
                    <td key={column.key} className="px-5 py-5 text-sm text-slate-700">
                      <div className="h-4 w-full rounded-full bg-slate-200" />
                    </td>
                  ))}
                </tr>
              ))
            ) : visibleRows.length === 0 ? (
              <tr>
                <td className="px-5 py-16 text-center text-sm text-slate-500" colSpan={columns.length}>
                  <div className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                    <Inbox size={32} className="text-teal-600" />
                    {emptyState ? emptyState : <div className="text-sm font-semibold text-slate-900">Belum ada data untuk ditampilkan.</div>}
                    <p className="text-sm text-slate-500">Coba kata kunci lain, segarkan data, atau tambahkan item baru untuk melihat tampilan di sini.</p>
                    {emptyAction ? (
                      <button
                        type="button"
                        onClick={emptyAction.onClick}
                        className="mt-3 inline-flex items-center gap-2 rounded-2xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-700"
                      >
                        {emptyAction.label}
                      </button>
                    ) : null}
                  </div>
                </td>
              </tr>
            ) : (
              visibleRows.map((row, index) => (
                <tr key={index} className="transition hover:bg-teal-50/50">
                  {columns.map((column) => (
                    <td key={column.key} className="px-5 py-4 text-sm text-slate-700">
                      {column.render ? column.render(row) : normalizeValue(row[column.key])}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
        <span>
          Halaman <strong className="text-slate-900">{page}</strong> dari <strong className="text-slate-900">{totalPages}</strong>
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={page === 1}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-teal-300 hover:text-teal-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronsLeft size={16} /> Sebelumnya
          </button>
          <button
            type="button"
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            disabled={page === totalPages}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-teal-300 hover:text-teal-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Berikutnya <ChevronsRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
