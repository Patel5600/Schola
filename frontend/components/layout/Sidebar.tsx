'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Bell,
  FileText,
  Calendar,
  Users,
  Settings,
  GraduationCap,
  BookOpen,
  Award,
  MessageSquare,
  Menu,
  X,
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

interface SidebarProps {
  role: 'admin' | 'hod' | 'teacher' | 'student'
}

const menuItems = {
  admin: [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard/admin' },
    { name: 'Users', icon: Users, path: '/dashboard/admin/users' },
    { name: 'Announcements', icon: Bell, path: '/dashboard/admin/announcements' },
    { name: 'Analytics', icon: Award, path: '/dashboard/admin/analytics' },
    { name: 'Audit Logs', icon: FileText, path: '/dashboard/admin/audit' },
    { name: 'Settings', icon: Settings, path: '/dashboard/admin/settings' },
  ],
  hod: [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard/hod' },
    { name: 'Announcements', icon: Bell, path: '/dashboard/hod/announcements' },
    { name: 'Schedules', icon: Calendar, path: '/dashboard/hod/schedules' },
    { name: 'Faculty', icon: Users, path: '/dashboard/hod/faculty' },
    { name: 'Resources', icon: BookOpen, path: '/dashboard/hod/resources' },
  ],
  teacher: [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard/teacher' },
    { name: 'Announcements', icon: Bell, path: '/dashboard/teacher/announcements' },
    { name: 'Notes', icon: FileText, path: '/dashboard/teacher/notes' },
    { name: 'Events', icon: Calendar, path: '/dashboard/teacher/events' },
    { name: 'Attendance', icon: Users, path: '/dashboard/teacher/attendance' },
    { name: 'Students', icon: GraduationCap, path: '/dashboard/teacher/students' },
  ],
  student: [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard/student' },
    { name: 'Announcements', icon: Bell, path: '/dashboard/student/announcements' },
    { name: 'Notes', icon: FileText, path: '/dashboard/student/notes' },
    { name: 'Events', icon: Calendar, path: '/dashboard/student/events' },
    { name: 'Skills', icon: Award, path: '/dashboard/student/skills' },
    { name: 'Discussions', icon: MessageSquare, path: '/dashboard/student/discussions' },
    { name: 'Portfolio', icon: GraduationCap, path: '/dashboard/student/portfolio' },
  ],
}

export default function Sidebar({ role }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { user } = useAuthStore()

  const items = menuItems[role]

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 glass rounded-lg"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: isOpen ? 0 : -280,
        }}
        className="fixed inset-y-0 left-0 z-40 w-64 glass border-r border-white/20 dark:border-slate-700/50 lg:translate-x-0"
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-white/20 dark:border-slate-700/50">
            <h1 className="text-2xl font-bold gradient-text">Schola</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {user?.firstName} {user?.lastName}
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {items.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.path
              
              return (
                <Link key={item.path} href={item.path}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </motion.div>
                </Link>
              )
            })}
          </nav>
        </div>
      </motion.aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}

