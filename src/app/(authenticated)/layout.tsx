
"use client"

import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import Header from "@/components/Headers"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { authService } from "@/backend/services/auth.service"

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    // Check if user is authenticated
    if (typeof window !== 'undefined') {
      // Check auth only on client-side
      if (!authService.isAuthenticated()) {
        router.push('/');
      } else {
        setIsLoading(false);
      }
    }
  }, [router]);
  
  // Show loading state while checking auth
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }
  
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="py-[30px] px-[30px] w-full">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        {children}
      </main>
    </SidebarProvider>
  )
}