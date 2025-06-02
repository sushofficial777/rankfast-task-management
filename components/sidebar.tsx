"use client"

import { motion } from "framer-motion"
import { LayoutDashboard, CheckSquare, Bell, Settings, LogOut, FileText } from "lucide-react"

interface SidebarProps {
  currentView: "dashboard" | "tasks" | "notifications" | "blogs"
  onViewChange: (view: "dashboard" | "tasks" | "notifications" | "blogs") => void
}

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "tasks", label: "My tasks", icon: CheckSquare },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "blogs", label: "Blogs", icon: FileText },
  ]

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
            <span className="text-black font-bold text-sm">AZ</span>
          </div>
          <span className="text-xl font-semibold text-gray-900">Organizo</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <motion.button
                onClick={() => onViewChange(item.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors relative ${
                  currentView === item.id
                    ? "text-gray-900 bg-gray-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {currentView === item.id && (
                  <motion.div
                    className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400 rounded-r"
                    layoutId="activeIndicator"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </motion.button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom Menu */}
      <div className="p-4 border-t border-gray-200">
        <ul className="space-y-2">
          <li>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors">
              <Settings className="w-5 h-5" />
              <span className="font-medium">Settings</span>
            </button>
          </li>
          <li>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors">
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Log out</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  )
}
