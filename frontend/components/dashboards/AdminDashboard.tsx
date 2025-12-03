'use client'

import { motion } from 'framer-motion'
import { Users, Bell, Calendar, FileText, TrendingUp, Shield } from 'lucide-react'

export default function AdminDashboard() {
  const stats = [
    { label: 'Total Users', value: '1,234', icon: Users, color: 'from-blue-500 to-cyan-500' },
    { label: 'Announcements', value: '89', icon: Bell, color: 'from-purple-500 to-pink-500' },
    { label: 'Events', value: '45', icon: Calendar, color: 'from-green-500 to-emerald-500' },
    { label: 'Notes', value: '567', icon: FileText, color: 'from-orange-500 to-red-500' },
    { label: 'Analytics', value: '+12%', icon: TrendingUp, color: 'from-indigo-500 to-purple-500' },
    { label: 'Security', value: 'Active', icon: Shield, color: 'from-teal-500 to-blue-500' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage and monitor the entire platform
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-2xl p-6 hover:shadow-xl transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass rounded-2xl p-6"
      >
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="flex-1">
              <p className="font-medium">New user registered</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">2 minutes ago</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

