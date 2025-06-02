"use client"

import { motion } from "framer-motion"
import { MoreHorizontal, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Task } from "@/types/task"

interface NotificationsProps {
  tasks: Task[]
  onTaskClick: (task: Task) => void
}

export function Notifications({ tasks, onTaskClick }: NotificationsProps) {
  const notifications = [
    {
      id: "1",
      type: "task_added",
      title: "Company research",
      message: "John Deere added a new task.",
      avatar: "/avatar1.png",
      time: "2 hours ago",
      isNew: true,
    },
    {
      id: "2",
      type: "task_completed",
      title: "Company research",
      message: "John Deere marked the task complete.",
      avatar: "/avatar1.png",
      time: "4 hours ago",
      isNew: false,
    },
    {
      id: "3",
      type: "task_completed",
      title: "Market ideation",
      message: "John Deere marked the task complete.",
      avatar: "/avatar1.png",
      time: "6 hours ago",
      isNew: false,
    },
    {
      id: "4",
      type: "task_hold",
      title: "Illustrations invoicing",
      message: "John Deere marked the task on hold.",
      avatar: "/avatar1.png",
      time: "1 day ago",
      isNew: false,
    },
    {
      id: "5",
      type: "task_completed",
      title: "Yearly wrap-up",
      message: "John Deere marked the task complete.",
      avatar: "/avatar1.png",
      time: "2 days ago",
      isNew: false,
    },
  ]

  return (
    <div className="p-6 h-full overflow-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Latest notifications</h2>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          {notifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`flex items-start gap-4 p-4 rounded-lg border-l-4 ${
                notification.isNew ? "border-l-yellow-400 bg-yellow-50" : "border-l-transparent bg-white"
              } hover:bg-gray-50 transition-colors cursor-pointer`}
              onClick={() => {
                const task = tasks.find((t) => t.title.toLowerCase().includes(notification.title.toLowerCase()))
                if (task) onTaskClick(task)
              }}
            >
              <div
                className={`w-4 h-4 rounded-full border-2 mt-1 ${
                  notification.type === "task_completed" ? "bg-yellow-400 border-yellow-400" : "border-gray-300"
                }`}
              />

              <div className="flex-1 min-w-0">
                <h3
                  className={`font-medium ${
                    notification.type === "task_completed" ? "line-through text-gray-500" : "text-gray-900"
                  }`}
                >
                  {notification.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
              </div>

              <Avatar className="w-8 h-8">
                <AvatarImage src={notification.avatar || "/placeholder.svg"} alt="User" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="mt-8 text-center"
        >
          <Button variant="ghost" className="text-gray-600">
            <Plus className="w-4 h-4 mr-2" />
            Load more notifications
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}
