"use client"

import { motion,AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, MoreHorizontal, Play, Pause, Plus } from "lucide-react"
import { Button } from "@/components/ui/button";
import type { Task } from "@/types/task"


interface DashboardProps {
  tasks: Task[]
  onTaskClick: (task: Task) => void
}

export function Dashboard({ tasks, onTaskClick }: DashboardProps) {
  const currentDate = new Date() // Use current date instead of hardcoded date
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
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    return tasks.filter((task) => {
      const taskDateStr = new Date(task.dueDate).toISOString().split("T")[0]; // format as YYYY-MM-DD
      console.log("Comparing", taskDateStr, dateStr);
      return taskDateStr === dateStr;
    });
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []
  
    for (let i = 0; i < firstDay; i++) {
      const prevDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), -firstDay + i + 1)
      days.push(
        <div
          key={`prev-${i}`}
          className="p-2 text-gray-300 text-sm min-h-[80px] border border-transparent"
        >
          <div className="text-center">{prevDate.getDate()}</div>
        </div>
      )
    }
  
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString()
      const dayTasks = getTasksForDate(day)
  
      days.push(
        <motion.div
          key={day}
          className={`group flex items-center justify-center relative p-2  min-h-[50px] cursor-pointer transition bg-white ${
            ``
          }`}
        >
          {/* Day Number */}
          <div className={`text-center ${isToday ? " w-8 h-8 flex items-center justify-center rounded-full bg-black shadow-sm text-white font-semibold" : " w-8 h-8 flex items-center justify-center rounded-full bg-black/5 shadow-sm text-black font-light "}  text-sm font-medium text-gray-700`}>{day}</div>
  
          {/* Task Count Badge */}
          {dayTasks.length > 0 && (
            <div className="absolute bottom-2 right-4 bg-yellow-500 text-gray-700 text-[10px]  w-4 h-4 flex items-center justify-center  rounded-full">
              {dayTasks.length}
            </div>
          )}
  
          {/* Animated Task List on Hover */}
          <AnimatePresence>
            {dayTasks.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.3 }}
                className="absolute left-1/2 top-10 z-10 mt-1 w-[240px] -translate-x-1/2 bg-white border border-gray-300 rounded-lg shadow-lg p-2 space-y-1 hidden group-hover:block"
              >
                {dayTasks.map((task) => (
                  <motion.div
                    key={task._id}
                    className={`text-xs px-2 py-1 rounded cursor-pointer whitespace-nowrap truncate ${
                      task.priority === "High"
                        ? "bg-red-100 text-red-800"
                        : task.priority === "Medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation()
                      onTaskClick(task)
                    }}
                    whileHover={{ scale: 1.03 }}
                    title={task.title}
                  >
                    {task.title}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )
    }
  
    return days
  }
  



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
    <div className="lg:p-6 p-2  grid lg:grid-cols-2 gap-5 ">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-white rounded-xl lg:p-6 p-2 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
         
        </div>

        <div className="grid grid-cols-7 gap-1">
          {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day) => (
            <div key={day} className="p-1 text-sm font-medium text-gray-500 text-center">
              {day}
            </div>
          ))}
          {renderCalendar()}
        </div>
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
              key={task._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
              onClick={() => onTaskClick(task)}
            >
              <div
                className={`w-4 h-4 rounded-full border-2 ${task.completed ? "bg-yellow-400 border-yellow-400" : "border-gray-300"
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
    </div>
  )
}
