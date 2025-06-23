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
    const isDashboardPath = pathname === '/dashboard' || 
      pathname?.startsWith('/dashboard/content-studio') ||
      pathname?.startsWith('/dashboard/channel-integrations') ||
      pathname?.startsWith('/dashboard/content-library') ||
      pathname?.startsWith('/dashboard/smart-scheduler') ||
      pathname?.startsWith('/dashboard/insight-hub') ||
      pathname?.startsWith('/dashboard/profile');
    
    const isProtectedRoute = isDashboardPath;
    
    if (isProtectedRoute) {
      if (!loading && !user) {
        router.push('/')
        return
      } else if (!loading && user) {
        setAuthorized(true)
      }
    } else {
      setAuthorized(true)
    }
  }, [user, loading, router, pathname])

  if (loading) {
    return <CircleProgress />
  }

  if (pathname?.startsWith('/dashboard') && !authorized) {
    return <CircleProgress />
  }

  return <>{children}</>
}