'use client'

import { motion } from 'framer-motion'
import { GraduationCap, FileText, Calendar, Users } from 'lucide-react'

export default function TeacherDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Teacher Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your classes and students
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-2xl p-6"
        >
          <GraduationCap className="w-8 h-8 text-blue-500 mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400">Students</p>
          <p className="text-2xl font-bold">120</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-6"
        >
          <FileText className="w-8 h-8 text-green-500 mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400">Notes</p>
          <p className="text-2xl font-bold">45</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-6"
        >
          <Calendar className="w-8 h-8 text-purple-500 mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400">Events</p>
          <p className="text-2xl font-bold">6</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-6"
        >
          <Users className="w-8 h-8 text-orange-500 mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400">Attendance</p>
          <p className="text-2xl font-bold">95%</p>
        </motion.div>
      </div>
    </div>
  )
}

