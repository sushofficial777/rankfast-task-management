"use client"

import { motion } from "framer-motion"
import type { Task } from "@/types/task"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

interface TaskItemProps {
  task: Task
  onClick: () => void
  onUpdate: (updates: Partial<Task>) => void
}

export function TaskItem({ task, onClick, onUpdate }: TaskItemProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "In progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Not started":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "Completed":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <motion.div
      whileHover={{ scale: 1.01, backgroundColor: "#f9fafb" }}
      className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 cursor-pointer transition-colors"
      onClick={onClick}
    >
      <Checkbox
        checked={task.completed}
        onCheckedChange={(checked) => onUpdate({ completed: !!checked })}
        onClick={(e) => e.stopPropagation()}
      />

      <div className="flex-1 flex items-center justify-between">
        <div className="flex-1">
          <span className={`font-medium ${task.completed ? "line-through text-gray-500" : "text-gray-900"}`}>
            {task.title}
          </span>
        </div>

        <div className="flex items-center gap-8 text-sm">
          <span className="w-20 text-center text-orange-600 font-medium">{task.dueDate}</span>

          <div className="w-24 flex justify-center">
            <Badge variant="outline" className={getStageColor(task.stage)}>
              {task.stage}
            </Badge>
          </div>

          <div className="w-20 flex justify-center">
            <Badge variant="outline" className={getPriorityColor(task.priority)}>
              {task.priority}
            </Badge>
          </div>

          <span className="w-32 text-center text-gray-600">{task.team}</span>

          <div className="w-16 flex justify-center">
            <Avatar className="w-8 h-8">
              <AvatarImage src={task.assignee.avatar || "/placeholder.svg"} alt={task.assignee.name} />
              <AvatarFallback>
                {task.assignee.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
