"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { TaskList } from "@/components/task-list"
import { Dashboard } from "@/components/dashboard"
import { Notifications } from "@/components/notifications"
import { BlogList } from "@/components/blog-list"
import { BlogEditor } from "@/components/blog-editor"
import { NewTaskModal } from "@/components/new-task-modal"
import { TaskDetailModal } from "@/components/task-detail-modal"
import type { Task } from "@/types/task"
import type { Blog } from "@/types/blog"

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Finish monthly reporting",
    dueDate: "2022-03-03",
    priority: "High",
    stage: "In progress",
    team: "Marketing O2",
    assignee: { name: "John Doe", avatar: "/avatar1.png" },
    completed: false,
    description: "",
    tags: [],
    notifications: [],
  },
  {
    id: "2",
    title: "Contract signing",
    dueDate: "2022-03-03",
    priority: "Medium",
    stage: "In progress",
    team: "Operations",
    assignee: { name: "Jane Smith", avatar: "/avatar1.png" },
    completed: false,
    description: "",
    tags: [],
    notifications: [],
  },
  {
    id: "3",
    title: "Market overview keynote",
    dueDate: "2022-03-04",
    priority: "High",
    stage: "In progress",
    team: "Customer Care",
    assignee: { name: "Mike Johnson", avatar: "/avatar1.png" },
    completed: false,
    description: "",
    tags: [],
    notifications: [],
  },
  {
    id: "4",
    title: "Brand proposal",
    dueDate: "2022-03-05",
    priority: "High",
    stage: "Not started",
    team: "Marketing O2",
    assignee: { name: "Sarah Wilson", avatar: "/avatar1.png" },
    completed: false,
    description: "",
    tags: [],
    notifications: [],
  },
  {
    id: "5",
    title: "Social media review",
    dueDate: "2022-03-06",
    priority: "Medium",
    stage: "In progress",
    team: "Operations",
    assignee: { name: "Tom Brown", avatar: "/avatar1.png" },
    completed: false,
    description: "",
    tags: [],
    notifications: [],
  },
]

const initialBlogs: Blog[] = [
  {
    id: "1",
    title: "Getting Started with Task Management",
    content: "<p>Task management is essential for productivity...</p>",
    excerpt: "Learn the basics of effective task management and how to boost your productivity.",
    author: "John Doe",
    createdAt: "2022-03-01",
    updatedAt: "2022-03-01",
    status: "published",
    tags: ["productivity", "management"],
  },
  {
    id: "2",
    title: "Building Better Teams",
    content: "<p>Team collaboration is the key to success...</p>",
    excerpt: "Discover strategies for building and managing high-performing teams.",
    author: "Jane Smith",
    createdAt: "2022-02-28",
    updatedAt: "2022-02-28",
    status: "published",
    tags: ["teamwork", "leadership"],
  },
]

export default function Home() {
  const [currentView, setCurrentView] = useState<"dashboard" | "tasks" | "notifications" | "blogs">("dashboard")
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [blogs, setBlogs] = useState<Blog[]>(initialBlogs)
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null)
  const [isCreatingBlog, setIsCreatingBlog] = useState(false)

  const addTask = (newTask: Omit<Task, "id">) => {
    const task: Task = {
      ...newTask,
      id: Date.now().toString(),
    }
    setTasks((prev) => [...prev, task])
  }

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, ...updates } : task)))
  }

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId))
  }

  const addBlog = (newBlog: Omit<Blog, "id" | "createdAt" | "updatedAt">) => {
    const blog: Blog = {
      ...newBlog,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    }
    setBlogs((prev) => [blog, ...prev])
  }

  const updateBlog = (blogId: string, updates: Partial<Blog>) => {
    setBlogs((prev) =>
      prev.map((blog) =>
        blog.id === blogId ? { ...blog, ...updates, updatedAt: new Date().toISOString().split("T")[0] } : blog,
      ),
    )
  }

  const deleteBlog = (blogId: string) => {
    setBlogs((prev) => prev.filter((blog) => blog.id !== blogId))
  }

  const handleNewBlog = () => {
    setIsCreatingBlog(true)
    setEditingBlog(null)
  }

  const handleEditBlog = (blog: Blog) => {
    setEditingBlog(blog)
    setIsCreatingBlog(false)
  }

  const handleSaveBlog = (blogData: Omit<Blog, "id" | "createdAt" | "updatedAt">) => {
    if (editingBlog) {
      updateBlog(editingBlog.id, blogData)
    } else {
      addBlog(blogData)
    }
    setEditingBlog(null)
    setIsCreatingBlog(false)
  }

  const handleCancelBlogEdit = () => {
    setEditingBlog(null)
    setIsCreatingBlog(false)
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />

      <div className="flex-1 flex flex-col">
        <Header
          onNewTask={() => setIsNewTaskModalOpen(true)}
          onNewBlog={currentView === "blogs" ? handleNewBlog : undefined}
          currentView={currentView}
        />

        <main className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            {currentView === "dashboard" && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Dashboard tasks={tasks} onTaskClick={setSelectedTask} />
              </motion.div>
            )}

            {currentView === "tasks" && (
              <motion.div
                key="tasks"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <TaskList tasks={tasks} onTaskClick={setSelectedTask} onTaskUpdate={updateTask} />
              </motion.div>
            )}

            {currentView === "notifications" && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Notifications tasks={tasks} onTaskClick={setSelectedTask} />
              </motion.div>
            )}

            {currentView === "blogs" && !isCreatingBlog && !editingBlog && (
              <motion.div
                key="blogs"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <BlogList blogs={blogs} onEdit={handleEditBlog} onDelete={deleteBlog} />
              </motion.div>
            )}

            {currentView === "blogs" && (isCreatingBlog || editingBlog) && (
              <motion.div
                key="blog-editor"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <BlogEditor blog={editingBlog} onSave={handleSaveBlog} onCancel={handleCancelBlogEdit} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      <AnimatePresence>
        {isNewTaskModalOpen && <NewTaskModal onClose={() => setIsNewTaskModalOpen(false)} onSubmit={addTask} />}
      </AnimatePresence>

      <AnimatePresence>
        {selectedTask && (
          <TaskDetailModal
            task={selectedTask}
            onClose={() => setSelectedTask(null)}
            onUpdate={(updates) => updateTask(selectedTask.id, updates)}
            onDelete={() => {
              deleteTask(selectedTask.id)
              setSelectedTask(null)
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
