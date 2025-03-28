"use client"

import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import Header from "@/components/Headers"
import { useState } from "react"

export default function Layout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen,setSidebarOpen]=useState(false)
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="py-[30px] px-[30px] w-full">
        <Header  sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        {children}
      </main>
    </SidebarProvider>
  )
}
