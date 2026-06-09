"use client"
import React from 'react'
import { Toaster, toast as sonnerToast } from 'sonner'

export function toast(message: string) {
  sonnerToast(message)
}

export default function ToastContainer() {
  return <Toaster position="top-right" richColors closeButton />
}
