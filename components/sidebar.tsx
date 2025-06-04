"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  CheckSquare,
  Bell,
  Settings,
  LogOut,
  FileText,
} from "lucide-react";
import { signOut } from "next-auth/react";

interface SidebarProps {
  currentView: "dashboard" | "tasks" | "notifications" | "blogs";
  onViewChange: (view: "dashboard" | "tasks" | "notifications" | "blogs") => void;
  setIsSidebarOpen: (isOpen: boolean) => void;
  sidebarOpen: boolean;
}

export function Sidebar({ currentView,setIsSidebarOpen,sidebarOpen, onViewChange }: SidebarProps) {


  const sidebarRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (sidebarOpen && sidebarRef.current && !(sidebarRef.current as any).contains(e.target)) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen]);

  return (
    <>
   
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-80 bg-white border-r border-gray-200 flex-col">
        <SidebarContent currentView={currentView} onViewChange={onViewChange} />
      </div>

      {/* Mobile Drawer Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 w-4/5 max-w-[300px] h-full z-50 bg-white border-r border-gray-200 shadow-lg flex flex-col"
            ref={sidebarRef}
          >
            <SidebarContent
              currentView={currentView}
              onViewChange={(view) => {
                onViewChange(view);
                setIsSidebarOpen(false);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </>
  );
}

function SidebarContent({
  currentView,
  onViewChange,
}: {
  currentView: string;
  onViewChange: (view: any) => void;
}) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "tasks", label: "My tasks", icon: CheckSquare },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "blogs", label: "Blogs", icon: FileText },
  ];

  return (
    <>

      {/* Logo */}
      <div className="p-6 py-4 border-b border-gray-200 hidden lg:block">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
            <span className="text-white font-bold  text-sm">TM</span>
          </div>
          <span className="text-xl font-semibold text-gray-900">Task.M</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <motion.button
                onClick={() => onViewChange(item.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors relative ${
                  currentView === item.id
                    ? "text-gray-900 bg-gray-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {currentView === item.id && (
                  <motion.div
                    className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400 rounded-r"
                    layoutId="activeIndicator"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </motion.button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom Menu */}
      <div className="p-4 border-t border-gray-200">
        <ul className="space-y-2">
          
          <li>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Log out</span>
            </button>
          </li>
        </ul>
      </div>
    </>
  );
}
