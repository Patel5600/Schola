'use client'

import { motion } from 'framer-motion'
import { Users, CheckCircle, Calendar, FileCheck } from 'lucide-react'

export default function HODDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">HOD Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your department efficiently
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-2xl p-6"
        >
          <Users className="w-8 h-8 text-blue-500 mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400">Faculty</p>
          <p className="text-2xl font-bold">24</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-6"
        >
          <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400">Approvals</p>
          <p className="text-2xl font-bold">12</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-6"
        >
          <Calendar className="w-8 h-8 text-purple-500 mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400">Events</p>
          <p className="text-2xl font-bold">8</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-6"
        >
          <FileCheck className="w-8 h-8 text-orange-500 mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400">Resources</p>
          <p className="text-2xl font-bold">156</p>
        </motion.div>
      </div>
    </div>
  )
}

