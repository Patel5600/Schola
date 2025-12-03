'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import LoginPage from '@/components/auth/LoginPage'

export default function Home() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (isAuthenticated && user) {
      const dashboardPath = `/dashboard/${user.role}`
      router.push(dashboardPath)
    }
  }, [isAuthenticated, user, router])

  if (isAuthenticated) {
    return null
  }

  return <LoginPage />
}

