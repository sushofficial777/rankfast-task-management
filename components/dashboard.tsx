"use client"

import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, MoreHorizontal, Play, Pause, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Task } from "@/types/task"

interface DashboardProps {
  tasks: Task[]
  onTaskClick: (task: Task) => void
}

export function Dashboard({ tasks, onTaskClick }: DashboardProps) {
  const currentDate = new Date(2022, 2, 1) // March 2022 to match the design
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const getTasksForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return tasks.filter((task) => task.dueDate === dateStr)
  }

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []

    // Previous month's trailing days
    for (let i = 0; i < firstDay; i++) {
      const prevDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), -firstDay + i + 1)
      days.push(
        <div key={`prev-${i}`} className="p-1 text-gray-300 text-sm min-h-[40px]">
          <div className="text-center">{prevDate.getDate()}</div>
        </div>,
      )
    }

    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = day === 3 // Highlighting day 3 as shown in the image
      const dayTasks = getTasksForDate(day)

      days.push(
        <div
          key={day}
          className={`p-1 text-sm cursor-pointer hover:bg-gray-100 rounded min-h-[40px] ${
            isToday ? "bg-yellow-400 text-black font-semibold" : "text-gray-700"
          }`}
        >
          <div className="text-center mb-1">{day}</div>
          <div className="space-y-1">
            {dayTasks.slice(0, 2).map((task) => (
              <motion.div
                key={task.id}
                className={`text-xs p-1 rounded cursor-pointer ${
                  task.priority === "High"
                    ? "bg-red-100 text-red-800"
                    : task.priority === "Medium"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                } ${isToday ? "bg-opacity-80" : ""}`}
                onClick={(e) => {
                  e.stopPropagation()
                  onTaskClick(task)
                }}
                whileHover={{ scale: 1.05 }}
                title={task.title}
              >
                {task.title.length > 12 ? `${task.title.substring(0, 12)}...` : task.title}
              </motion.div>
            ))}
            {dayTasks.length > 2 && (
              <div className="text-xs text-gray-500 text-center">+{dayTasks.length - 2} more</div>
            )}
          </div>
        </div>,
      )
    }

    return days
  }

  const categories = [
    { name: "Work", icon: "💼", members: ["/avatar1.png", "/avatar1.png"] },
    { name: "Family", icon: "👨‍👩‍👧‍👦", members: ["/avatar1.png", "/avatar1.png", "/avatar1.png"] },
    { name: "Freelance work 01", icon: "💻", members: ["/avatar1.png", "/avatar1.png"] },
    { name: "Conference planning", icon: "📅", members: ["/avatar1.png"] },
  ]

  const trackingItems = [
    { name: "Create wireframe", time: "1h 25m 30s", status: "active" },
    { name: "Slack logo design", time: "30m 18s", status: "paused" },
    { name: "Dashboard design", time: "1h 48m 22s", status: "paused" },
    { name: "Create wireframe", time: "17m 1s", status: "paused" },
    { name: "Mood tracker", time: "15h 5m 58s", status: "paused" },
  ]

  const getDisplayDate = (dateStr: string) => {
    const today = new Date()
    const taskDate = new Date(dateStr)
    const diffTime = taskDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Tomorrow"
    if (diffDays > 1 && diffDays <= 7) return "This week"
    return dateStr
  }

  return (
    <div className="p-6 grid grid-cols-2 gap-6 h-full overflow-auto">
      {/* Calendar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl p-6 border border-gray-200"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day) => (
            <div key={day} className="p-2 text-xs font-medium text-gray-500 text-center">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>
      </motion.div>

      {/* My Tasks */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-white rounded-xl p-6 border border-gray-200"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">My tasks ({String(tasks.length).padStart(2, "0")})</h3>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-3">
          {tasks.slice(0, 5).map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
              onClick={() => onTaskClick(task)}
            >
              <div
                className={`w-4 h-4 rounded-full border-2 ${
                  task.completed ? "bg-yellow-400 border-yellow-400" : "border-gray-300"
                }`}
              />
              <span className={`flex-1 text-sm ${task.completed ? "line-through text-gray-500" : "text-gray-900"}`}>
                {task.title}
              </span>
              <span className="text-xs text-orange-600 font-medium">{getDisplayDate(task.dueDate)}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* My Categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="bg-white rounded-xl p-6 border border-gray-200"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">My categories</h3>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center gap-3"
            >
              <span className="text-lg">{category.icon}</span>
              <span className="flex-1 text-sm font-medium">{category.name}</span>
              <div className="flex -space-x-1">
                {category.members.map((avatar, i) => (
                  <Avatar key={i} className="w-6 h-6 border-2 border-white">
                    <AvatarImage src={avatar || "/placeholder.svg"} />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                ))}
              </div>
            </motion.div>
          ))}

          <Button variant="ghost" className="w-full justify-start text-gray-600">
            <Plus className="w-4 h-4 mr-2" />
            Add more
          </Button>
        </div>
      </motion.div>

      {/* My Tracking */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="bg-white rounded-xl p-6 border border-gray-200"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">My tracking</h3>
          <Button variant="ghost" size="icon">
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-3">
          {trackingItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center gap-3"
            >
              <div className="w-2 h-2 bg-yellow-400 rounded-full" />
              <span className="flex-1 text-sm">{item.name}</span>
              <span className="text-xs text-gray-600">{item.time}</span>
              <Button variant="ghost" size="icon" className="w-6 h-6">
                {item.status === "active" ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              </Button>
              <Button variant="ghost" size="icon" className="w-6 h-6">
                <MoreHorizontal className="w-3 h-3" />
              </Button>
            </motion.div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <Button variant="ghost" className="w-full justify-start text-gray-600">
            <Plus className="w-4 h-4 mr-2" />
            Add widget
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
