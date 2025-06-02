"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { X, Plus, Calendar, Bell, Flag, Tag, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { Task } from "@/types/task"

interface NewTaskModalProps {
  onClose: () => void
  onSubmit: (task: Omit<Task, "id">) => void
}

export function NewTaskModal({ onClose, onSubmit }: NewTaskModalProps) {
  const [title, setTitle] = useState("")
  const [dueDate, setDueDate] = useState("Today")
  const [priority, setPriority] = useState("")
  const [description, setDescription] = useState("")
  const [notification, setNotification] = useState("In 1 hour")

  const getDateString = (option: string) => {
    const today = new Date()
    switch (option) {
      case "Today":
        return today.toISOString().split("T")[0]
      case "Tomorrow":
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)
        return tomorrow.toISOString().split("T")[0]
      default:
        return today.toISOString().split("T")[0]
    }
  }

  const handleSubmit = () => {
    if (!title.trim()) return

    const newTask: Omit<Task, "id"> = {
      title: title.trim(),
      dueDate: getDateString(dueDate),
      priority: priority || "Medium",
      stage: "Not started",
      team: "General",
      assignee: { name: "Me", avatar: "/avatar1.png" },
      completed: false,
      description,
      tags: [],
      notifications: [notification],
    }

    onSubmit(newTask)
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-white rounded-xl p-6 w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-4 h-4 text-gray-600" />
            </div>
            <Input
              placeholder="Name of task"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg font-medium border-0 p-0 focus:ring-0"
              autoFocus
            />
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          {/* Day */}
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700 w-20">Day</span>
            <div className="flex gap-2">
              {["Today", "Tomorrow"].map((day) => (
                <Button
                  key={day}
                  variant={dueDate === day ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDueDate(day)}
                  className={dueDate === day ? "bg-gray-900 text-white" : ""}
                >
                  {day}
                </Button>
              ))}
              <Button variant="outline" size="sm">
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {/* Notification */}
          <div className="flex items-center gap-3">
            <Bell className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700 w-20">Notification</span>
            <div className="flex gap-2">
              <Button
                variant={notification === "In 1 hour" ? "default" : "outline"}
                size="sm"
                onClick={() => setNotification("In 1 hour")}
                className={notification === "In 1 hour" ? "bg-gray-900 text-white" : ""}
              >
                In 1 hour
              </Button>
              <Button variant="outline" size="sm">
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {/* Priority */}
          <div className="flex items-center gap-3">
            <Flag className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700 w-20">Priority</span>
            <div className="flex gap-2">
              {["High", "Medium", "Low"].map((p) => (
                <Button
                  key={p}
                  variant={priority === p ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPriority(p)}
                  className={priority === p ? "bg-gray-900 text-white" : ""}
                >
                  {p}
                </Button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="flex items-center gap-3">
            <Tag className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700 w-20">Tags</span>
            <Button variant="outline" size="sm">
              <Plus className="w-3 h-3 mr-1" />
              Add tags
            </Button>
          </div>

          {/* Assign */}
          <div className="flex items-center gap-3">
            <User className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700 w-20">Assign</span>
            <Button variant="outline" size="sm">
              <Plus className="w-3 h-3 mr-1" />
              Add assignee
            </Button>
          </div>
        </div>

        {/* Description */}
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
          <Textarea
            placeholder="Add a description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[100px] resize-none"
          />
        </div>

        {/* Create Button */}
        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleSubmit}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium px-6"
            disabled={!title.trim()}
          >
            Create task
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}
