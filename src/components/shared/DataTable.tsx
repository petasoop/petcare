"use client"
import React, { useEffect, useMemo, useState } from 'react'

type Column<T> = {
  key: keyof T & string
  title: string
  sortable?: boolean
  render?: (row: T) => React.ReactNode
}

type Props<T extends Record<string, any>> = {
  columns: Column<T>[]
  data: T[]
  pageSize?: number
  searchPlaceholder?: string
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
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-sm font-semibold text-slate-900">Daftar Data</div>
          <div className="text-xs text-slate-500">{sorted.length} baris ditemukan</div>
        </div>
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={searchPlaceholder}
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-teal-400 sm:w-80"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 ${
                    column.sortable ? 'cursor-pointer select-none hover:text-teal-700' : ''
                  }`}
                  onClick={() => toggleSort(column)}
                >
                  <span className="inline-flex items-center gap-1">
                    {column.title}
                    {column.sortable && sortKey === column.key && <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {visibleRows.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-sm text-slate-500" colSpan={columns.length}>
                  Tidak ada data yang cocok.
                </td>
              </tr>
            ) : (
              visibleRows.map((row, index) => (
                <tr key={index} className="transition hover:bg-teal-50/60">
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 py-3 text-sm text-slate-700">
                      {column.render ? column.render(row) : normalizeValue(row[column.key])}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 text-sm text-slate-600">
        <span>
          Halaman {page} dari {totalPages}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={page === 1}
            className="rounded-lg border border-slate-200 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Sebelumnya
          </button>
          <button
            type="button"
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            disabled={page === totalPages}
            className="rounded-lg border border-slate-200 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Berikutnya
          </button>
        </div>
      </div>
    </div>
  )
}
