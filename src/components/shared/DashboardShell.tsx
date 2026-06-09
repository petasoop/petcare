"use client"
import React, { useState } from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

export default function DashboardShell({ children, role }: { children: React.ReactNode; role: string }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar role={role} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-1 flex-col">
        <Navbar title="Dashboard" onOpenSidebar={() => setSidebarOpen(true)} />
        <main className="container mx-auto px-4 py-6 sm:px-6">{children}</main>
      </div>
    </div>
  )
}
