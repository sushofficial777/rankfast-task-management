"use client"

import { motion } from "framer-motion"
import { X, User, Calendar, Folder, Flag, Paperclip, Link, Archive, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Task } from "@/types/task"

interface TaskDetailModalProps {
  task: Task
  onClose: () => void
  onUpdate: (updates: Partial<Task>) => void
  onDelete: () => void
}

export function TaskDetailModal({ task, onClose, onUpdate, onDelete }: TaskDetailModalProps) {
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-white h-full w-96 p-6 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">{task.title}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-6">
          {/* Assignee */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-600">
              <User className="w-4 h-4" />
              <span className="text-sm font-medium">Assignee</span>
            </div>
            <div className="flex items-center gap-2">
              <Avatar className="w-6 h-6">
                <AvatarImage src={task.assignee.avatar || "/placeholder.svg"} alt={task.assignee.name} />
                <AvatarFallback>
                  {task.assignee.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">Me</span>
            </div>
          </div>

          {/* Deadline */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-medium">Deadline</span>
            </div>
            <Badge variant="outline" className="bg-gray-900 text-white border-gray-900">
              {task.dueDate}
            </Badge>
          </div>

          {/* Projects */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-600">
              <Folder className="w-4 h-4" />
              <span className="text-sm font-medium">Projects</span>
            </div>
            <span className="text-sm font-medium">Secret project</span>
          </div>

          {/* Priority */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-600">
              <Flag className="w-4 h-4" />
              <span className="text-sm font-medium">Priority</span>
            </div>
            <Badge variant="outline" className={getPriorityColor(task.priority)}>
              {task.priority}
            </Badge>
          </div>
        </div>

        {/* Attachments */}
        <div className="mt-8">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Attachments</h3>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 text-gray-600">
              <Paperclip className="w-4 h-4" />
              <span className="text-sm">No attachments</span>
            </div>
            <Button variant="ghost" size="sm" className="text-gray-600">
              <Paperclip className="w-4 h-4 mr-1" />
              Attach
            </Button>
          </div>
        </div>

        {/* Links */}
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Links</h3>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 text-gray-600">
              <Link className="w-4 h-4" />
              <span className="text-sm">No links</span>
            </div>
            <Button variant="ghost" size="sm" className="text-gray-600">
              <Link className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex gap-3">
          <Button variant="outline" className="flex-1">
            <Archive className="w-4 h-4 mr-2" />
            Archive task
          </Button>
          <Button variant="outline" className="flex-1 text-red-600 border-red-200 hover:bg-red-50" onClick={onDelete}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete task
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}
