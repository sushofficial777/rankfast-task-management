"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { Task } from "@/types/task"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import moment from "moment";
import EditTaskModel from "./edit-task-model"

import { TASK_STAGE_LABELS } from "@/lib/data/constents"
import { SquarePen } from "lucide-react"
interface TaskItemProps {
  task: Task
  onClick: () => void
  onUpdate: (updates: Partial<Task>) => void
}

export function TaskItem({ task, onClick, onUpdate }: TaskItemProps) {

  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false)


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
    <>
      <motion.div
        whileHover={{ scale: 1.02, y: -4 }}
        className={` relative ${task.stage === "2" && ' !bg-[#f5fff7] '}  group  h-full  overflow-hidden transition-all duration-200  p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-gray-300`}
        
      >
        {
          task.stage !== "2" && (
            <button onClick={() => setIsNewTaskModalOpen(true) } className=" absolute hover:scale-125 duration-300 bottom-6 flex items-center justify-center right-6 w-8 z-2 h-8 rounded-full bg-slate-300/70 ">
              <SquarePen className=" w-4 " />
            </button>
          )
        }

        {task.stage === "1" && (
          <motion.div
            className="absolute top-0 left-0 w-full h-full  z-0 overflow-hidden pointer-events-none"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          >
            <div className="w-full h-full bg-gradient-to-r from-transparent via-green-300/80 to-transparent blur-sm opacity-30" />
          </motion.div>
        )}
        <div className="flex flex-col  h-full gap-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">

              <h3
              onClick={onClick}
                className={`text-lg cursor-pointer font-semibold ${task.completed ? "line-through text-gray-400" : "text-gray-900"}`}
              >
                {task.title}
              </h3>
            </div>
            <Avatar className="w-8 h-8 ring-2 ring-white">
              <AvatarImage src={task.assignee.id.profileImageUrl || "/placeholder.svg"} alt={task.assignee.name} />
              <AvatarFallback>
                {task.assignee.name.split(" ").map((n) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Content */}
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="space-y-1">
              <p className="text-xs text-gray-500 font-medium">Due Date</p>
              <p className="text-sm font-semibold text-orange-600">
                {moment(task.dueDate).format("MMM D, YYYY")}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-gray-500 font-medium">Team</p>
              <p className="text-sm font-medium text-gray-700">{task.team}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-gray-500 font-medium">Stage</p>
              <Badge variant="outline" className={`${getStageColor(task.stage)} text-xs`}>
                {TASK_STAGE_LABELS[task.stage]}
              </Badge>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-gray-500 font-medium">Priority</p>
              <Badge variant="outline" className={`${getPriorityColor(task.priority)} text-xs`}>
                {task.priority}
              </Badge>
            </div>
          </div>
        </div>
      </motion.div>
      <AnimatePresence>
        {isNewTaskModalOpen && <EditTaskModel task={task} onClose={() => setIsNewTaskModalOpen(false)} onSubmit={() => setIsNewTaskModalOpen(false)} />}
      </AnimatePresence>

    </>
  )
}
