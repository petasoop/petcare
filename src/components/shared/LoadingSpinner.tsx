"use client"
import React from 'react'

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-6">
      <div className="relative inline-flex h-12 w-12 items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-slate-200" />
        <div className="absolute inset-0 rounded-full border-[3px] border-teal-600 border-t-transparent animate-spin" />
      </div>
    </div>
  )
}
