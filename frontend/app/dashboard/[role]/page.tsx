'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import DashboardLayout from '@/components/layout/DashboardLayout'
import AdminDashboard from '@/components/dashboards/AdminDashboard'
import HODDashboard from '@/components/dashboards/HODDashboard'
import TeacherDashboard from '@/components/dashboards/TeacherDashboard'
import StudentDashboard from '@/components/dashboards/StudentDashboard'

export default function RoleDashboard({ params }: { params: { role: string } }) {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/')
    } else if (user && user.role !== params.role) {
      router.push(`/dashboard/${user.role}`)
    }
  }, [isAuthenticated, user, params.role, router])

  if (!isAuthenticated || !user || user.role !== params.role) {
    return null
  }

  const renderDashboard = () => {
    switch (params.role) {
      case 'admin':
        return <AdminDashboard />
      case 'hod':
        return <HODDashboard />
      case 'teacher':
        return <TeacherDashboard />
      case 'student':
        return <StudentDashboard />
      default:
        return null
    }
  }

  return (
    <DashboardLayout role={params.role as any}>
      {renderDashboard()}
    </DashboardLayout>
  )
}

