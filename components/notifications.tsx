"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { MoreHorizontal, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Loader from "@/components/spinner"
import type { Task } from "@/types/task";
import { toast } from "sonner"
import { getAllNotificationMethod, markNotificationAsReadMethod } from "@/api/apiService"


interface NotificationsProps {
  tasks: Task[]
  onTaskClick: (task: Task) => void
}

export const NOTIFICATION_TYPES = {
  TASK_REMINDER: "remind_task_notification",
  TASK_CREATED: "task_created",
  TASK_STARTED: "task_started",
  TASK_COMPLETED: "task_completed",
};

export const NOTIFICATION_TITLES = {
  [NOTIFICATION_TYPES.TASK_REMINDER]: "⏰ Task Reminder",
  [NOTIFICATION_TYPES.TASK_CREATED]: "🆕 Task Assigned",
  [NOTIFICATION_TYPES.TASK_STARTED]: "🆕 Task Started",
  [NOTIFICATION_TYPES.TASK_COMPLETED]: "🆕 Task Completed",
};

export function Notifications({ tasks, onTaskClick }: NotificationsProps) {

  const [notifications, setNotifications] = useState<any>([]);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const fetchNotification = async () => {
    setLoading(true)
    try {
      const response = await getAllNotificationMethod()
      setNotifications(response.data.data)

    } catch (error) {
      toast.error("Failed to fetch tasks")
    } finally {
      setLoading(false);
    }
  }

  const markAsRead = async (id: string) => {
    try {
      await markNotificationAsReadMethod(id)
     
    } catch (error) {
      toast.error("Failed to mark as read")
    }
  }

  useEffect(() => {
    fetchNotification();
  }, []);

  if (loading) {
    return <div className="flex h-[50vh] items-center justify-center ">
      <Loader size={24} color="text-gray-600" />
    </div>
  }

  return (
    <div className="p-6 h-full overflow-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Latest notifications</h2>

        </div>

        <div className="space-y-4">
          {notifications.map((notification: any, index: number) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`flex items-start gap-4 p-4 rounded-lg border-l-4 ${!notification.read && !readIds.has(notification._id) ? "border-l-yellow-400 bg-yellow-50" : "border-l-transparent bg-white"
                } hover:bg-gray-50 transition-colors cursor-pointer`}
              onClick={() => {
                if (!notification.read) {
                  markAsRead(notification._id);
                  if (!readIds.has(notification._id)) {
                    setReadIds(prev => new Set(prev).add(notification._id));
                  }

                }
              }}
            >
              <div
                className={`w-4 h-4 rounded-full border-2 mt-1 ${notification.type === "task_completed" ? "bg-yellow-400 border-yellow-400" : "border-gray-300"
                  }`}
              />

              <div className="flex-1 min-w-0">
                <h3
                  className={` lg:text-sm text-[14px] font-medium ${notification.type === "task_completed" ? "line-through text-gray-500" : "text-gray-900"
                    }`}
                >
                  {NOTIFICATION_TITLES[notification.type] || "🔔 Notification" } :: {notification?.taskId?.title}
                </h3>
                <p className="lg:text-sm text-[11px] text-gray-600 mt-1">{notification.message}</p>
              </div>

              <Avatar className="w-8 h-8">
                <AvatarImage src={notification.userId.profileImageUrl || "/placeholder.svg"} alt="User" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
