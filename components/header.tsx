"use client"

import { motion } from "framer-motion"
import { Search, Plus, Mail, User, FileText } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  onNewTask: () => void
  onNewBlog?: () => void
  currentView: string
}

export function Header({ onNewTask, onNewBlog, currentView }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search"
              className="pl-10 bg-gray-50 border-0 focus:bg-white focus:ring-2 focus:ring-yellow-400"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {currentView === "blogs" && onNewBlog ? (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={onNewBlog}
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                New blog
              </Button>
            </motion.div>
          ) : (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={onNewTask}
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                New task
              </Button>
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Mail className="w-5 h-5" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center"
          >
            <User className="w-4 h-4 text-black" />
          </motion.button>
        </div>
      </div>
    </header>
  )
}
