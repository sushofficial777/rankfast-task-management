"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Plus, Mail, User,Menu , FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AvatarImage } from "@/components/ui/avatar"
import { useSession } from "next-auth/react"
import { Avatar } from "@radix-ui/react-avatar"
import { getUnreadNotificationMethod } from "@/apis/apiService";
import { toast } from "sonner"

interface HeaderProps {
  onNewTask: () => void
  onNewBlog?: () => void
  currentView: string
  onViewChange: (view: "dashboard" | "tasks" | "notifications" | "blogs") => void
  closeSidebar?: () => void
}

export function Header({ onNewTask,closeSidebar, onNewBlog,onViewChange, currentView }: HeaderProps) {
  const { data: session } = useSession()

  const wrapperRef: any = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotification = async () => {
    setLoading(true)
    try {
      const response = await getUnreadNotificationMethod()
      setNotifications(response.data.data)

    } catch (error) {
      toast.error("Failed to fetch tasks")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotification(); 
  
    const interval = setInterval(() => {
      fetchNotification();
    }, 40000); 
  
    return () => clearInterval(interval); 
  }, []);

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header ref={wrapperRef} className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
       
        <div className="flex-1  max-w-md">
         <div className=" w-10 lg:hidden md:hidden  h-10 rounded-full bg-yellow-400 text-blue-50 font-bold text-xl flex items-center justify-center  "> <span> U </span> </div>
        </div>

        {/* Actions */}
        <div className="flex relative  items-center gap-3">
          {currentView === "blogs" && onNewBlog ? (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={onNewBlog}
                className="bg-yellow-400 lg:h-10 h-8 hover:bg-yellow-500 text-black font-medium px-2 !py-0 rounded-lg flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                New blog
              </Button>
            </motion.div>
          ) : (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={onNewTask}
                className="bg-yellow-400 lg:h-10 h-8 hover:bg-yellow-500 text-black font-medium px-2 !py-0 rounded-lg flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                New task
              </Button>
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 text-gray-600 relative hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Mail className="w-5 h-5" />
            {
              notifications.length > 0 && (
                <div className=" absolute top-0 right-0 w-4 h-4 bg-yellow-400 rounded-full text-[10px] flex items-center justify-center ">{notifications.length}</div>
              )
            }
          </motion.button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full cursor-pointer right-0 mt-2 w-[350px] max-h-[400px] overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-lg z-50 p-4 space-y-3"
              >
                {notifications.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center">No notifications</p>
                ) : (
                  notifications.map((n: any) => (
                    <div
                      onClick={() => {
                        setIsOpen(false)
                        onViewChange("notifications")
                      }}
                      key={n._id}
                      className="p-3 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition-all flex gap-3"
                    >
                      <img
                        src={n.userId.profileImageUrl}
                        alt={n.userId.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-700">{n.userId.name}</p>
                        <p className="text-xs text-gray-600">{n.message}</p>
                        <p className="text-[10px] text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center"
          >
            <Avatar>
              <AvatarImage src={session?.user.image || "/placeholder.svg"} alt={"profile image"} />
            </Avatar>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-8 h-8 lg:hidden md:hidden   rounded-full flex items-center justify-center"
          >
           <Menu className="w-4 h-4" onClick={closeSidebar} />
          </motion.button>
        </div>
      </div>
    </header>
  )
}
