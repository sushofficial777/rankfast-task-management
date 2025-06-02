"use client"

import { motion } from "framer-motion"
import type { Task } from "@/types/task"
import { TaskItem } from "@/components/task-item"

interface TaskListProps {
  tasks: Task[]
  onTaskClick: (task: Task) => void
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void
}

export function TaskList({ tasks, onTaskClick, onTaskUpdate }: TaskListProps) {
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

  const todayTasks = tasks.filter((task) => getDisplayDate(task.dueDate) === "Today")
  const tomorrowTasks = tasks.filter((task) => getDisplayDate(task.dueDate) === "Tomorrow")
  const thisWeekTasks = tasks.filter((task) => getDisplayDate(task.dueDate) === "This week")

  const TaskSection = ({ title, tasks: sectionTasks }: { title: string; tasks: Task[] }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-8"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        <div className="flex items-center gap-8 text-sm font-medium text-gray-500">
          <span>DUE DATE</span>
          <span>STAGE</span>
          <span>PRIORITY</span>
          <span>TEAM</span>
          <span>ASSIGNEE</span>
        </div>
      </div>

      <div className="space-y-2">
        {sectionTasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <TaskItem
              task={task}
              onClick={() => onTaskClick(task)}
              onUpdate={(updates) => onTaskUpdate(task.id, updates)}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  )

  return (
    <div className="p-6 overflow-auto h-full">
      <TaskSection title="Today" tasks={todayTasks} />
      <TaskSection title="Tomorrow" tasks={tomorrowTasks} />
      <TaskSection title="This week" tasks={thisWeekTasks} />
    </div>
  )
}
