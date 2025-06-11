// frontend/components/auth/ProtectedRoute.tsx
"use client"

import { useAuthContext } from "@/lib/AuthContext"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { CircleProgress } from "@/app/dashboard/helper"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuthContext()
  const router = useRouter()
  const pathname = usePathname()
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    // Define valid dashboard paths
    const isDashboardPath = pathname === '/dashboard' || 
      pathname?.startsWith('/dashboard/content-studio') ||
      pathname?.startsWith('/dashboard/channel-integrations') ||
      pathname?.startsWith('/dashboard/content-library') ||
      pathname?.startsWith('/dashboard/smart-scheduler') ||
      pathname?.startsWith('/dashboard/insight-hub') ||
      pathname?.startsWith('/dashboard/profile');
    
    // Check if the route should be protected
    const isProtectedRoute = isDashboardPath;
    
    // Only check authentication for protected routes
    if (isProtectedRoute) {
      // If no longer loading and user is not authenticated
      if (!loading && !user) {
        // Redirect to home page
        router.push('/')
      } else if (!loading && user) {
        // User is authenticated, allow access
        setAuthorized(true)
      }
    } else {
      // Non-protected route, always allow access
      setAuthorized(true)
    }
  }, [user, loading, router, pathname])

  // Show loading indicator while checking authentication
  if (loading || (pathname.startsWith('/dashboard') && !authorized)) {
    return <CircleProgress />
  }

  // If authorized, render children
  return <>{children}</>
}