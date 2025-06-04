"use client"

import { motion } from "framer-motion"
import type { Task } from "@/types/task"
import { TaskItem } from "@/components/task-item"
import { useEffect, useState } from "react"
import Loader from "@/components/spinner"
import { SquareMenu } from "lucide-react"

export function TaskList({ tasks, loading, onTaskClick, onTaskUpdate }: { tasks: Task[], loading: boolean; onTaskClick: (task: Task) => void, onTaskUpdate: (taskId: string, updates: Partial<Task>) => void }) {
  const [hasAnimated, setHasAnimated] = useState(false);
  
  useEffect(() => {
    setHasAnimated(true);
  }, []);

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

  const todayTasks = tasks.filter(task => getDisplayDate(task.dueDate) === "Today");
  const tomorrowTasks = tasks.filter(task => getDisplayDate(task.dueDate) === "Tomorrow");
  const thisWeekTasks = tasks.filter(task => getDisplayDate(task.dueDate) === "This week");

  const TaskSection = ({ title, tasks: sectionTasks }: { title: string; tasks: Task[] }) => (
    <motion.div
      initial={!hasAnimated ? { opacity: 0, y: 20 } : false}
      animate={!hasAnimated ? { opacity: 1, y: 0 } : false}
      transition={!hasAnimated ? { duration: 0.3 } : {}}
      className="mb-12"
    >
      <h2 className="text-xl font-bold text-gray-900 mb-6">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sectionTasks.map((task, index) => (
          <motion.div
            key={task._id}
            initial={!hasAnimated ? { opacity: 0, y: 20 } : false}
            animate={!hasAnimated ? { opacity: 1, y: 0 } : false}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <TaskItem
              task={task}
              onClick={() => onTaskClick(task)}
              onUpdate={(updates) => onTaskUpdate(task._id, updates)}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  )

  if (loading) {
    return <div className="p-8 w-full h-[50vh] flex items-center justify-center text-center text-gray-500"><Loader/></div>
  }

  if (tasks.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <SquareMenu className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Tasks yet</h3>
            <p className="text-gray-500 mb-4">Get started by creating your first Task.</p>
          </motion.div>
    )
  }

  return (
    <div className="p-8 overflow-auto h-full bg-gray-50">
      <TaskSection title="Today" tasks={todayTasks} />
      <TaskSection title="Tomorrow" tasks={tomorrowTasks} />
      <TaskSection title="This week" tasks={thisWeekTasks} />
    </div>
  )
}
